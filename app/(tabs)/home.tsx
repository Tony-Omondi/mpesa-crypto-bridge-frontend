import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import axios from 'axios';

// Keep your existing imports
import { theme } from '@/src/constants';
import { URLS } from '@/src/config';
import { useAppSelector } from '@/src/store';

const { width } = Dimensions.get('window');

// Local constants for premium UI feel if not in your theme
const COLORS = {
  background: '#0F1115', // Deep dark background
  cardBg: theme.colors.primary || '#00D09C', // Your primary or a mint green
  cardText: '#00332a', // Dark text for contrast on bright card
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export default function Home() {
  const router = useRouter();
  const { walletAddress } = useAppSelector((state) => state.walletReducer);

  const [balance, setBalance] = useState('0.00');
  const [ethBalance, setEthBalance] = useState('0.0000');
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // --- LOGIC ---

  useFocusEffect(
    useCallback(() => {
      if (walletAddress) {
        fetchData();
      }
    }, [walletAddress])
  );

  const fetchData = async () => {
    try {
      console.log("🔄 Fetching Home Data for:", walletAddress);

      // 1. Get Balances
      const balUrl = URLS.GET_BALANCE(walletAddress);
      const balResponse = await axios.get(balUrl);

      if (balResponse.data && balResponse.data.status === "Success") {
        setBalance(balResponse.data.balance_nit.toFixed(2));
        setEthBalance(balResponse.data.balance_eth.toFixed(4));
      }

      // 2. Get History
      const histResponse = await axios.get(URLS.TRANSACTION_HISTORY, {
        params: { wallet_address: walletAddress }
      });
      setHistory(histResponse.data);

    } catch (error) {
      console.error("❌ Dashboard Sync Error:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleActionPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(route);
  };

  // --- RENDER COMPONENTS ---

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.greeting}>Overview</Text>
        <TouchableOpacity 
          style={styles.addressPill} 
          onPress={() => {
            Haptics.selectionAsync();
            // Add clipboard logic here if you want
          }}
        >
          <Ionicons name="wallet-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.walletAddr}>
            {walletAddress
              ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
              : 'Connecting...'}
          </Text>
          <Ionicons name="copy-outline" size={12} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.profileButton}>
        <Image
          source={require('../../assets/icons/03.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );

  const renderBalanceCard = () => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        {/* Decorative Background Circles */}
        <View style={[styles.decorCircle, { top: -50, right: -50 }]} />
        <View style={[styles.decorCircle, { bottom: -80, left: -20, opacity: 0.1 }]} />

        <View style={styles.cardHeader}>
          <View style={styles.networkTag}>
            <View style={styles.liveDot} />
            <Text style={styles.networkText}>Arbitrum Sepolia</Text>
          </View>
          <Ionicons name="wifi" size={18} color="rgba(0,0,0,0.4)" />
        </View>

        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.balanceText}>{balance}</Text>
            <Text style={styles.currencySuffix}>NIT</Text>
          </View>
          <Text style={styles.fiatText}>≈ KES {balance}</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.gasBadge}>
            <Ionicons name="speedometer-outline" size={14} color={COLORS.cardText} />
            <Text style={styles.gasText}>{ethBalance} ETH Gas</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionsContainer}>
      <ActionButton 
        icon="arrow-down" 
        label="Deposit" 
        color={COLORS.success} 
        onPress={() => handleActionPress('/(tabs)/deposit')} 
      />
      <ActionButton 
        icon="paper-plane" 
        label="Send" 
        color={theme.colors.secondary || '#6366F1'} 
        onPress={() => handleActionPress('/(tabs)/send')} 
      />
      <ActionButton 
        icon="cash-outline" 
        label="Withdraw" 
        color={COLORS.error} 
        onPress={() => handleActionPress('/(tabs)/withdraw')} 
      />
    </View>
  );

  const ActionButton = ({ icon, label, color, onPress }: any) => (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.actionIconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const renderHistory = () => (
    <View style={styles.historySection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconBg}>
            <Ionicons name="document-text-outline" size={32} color={COLORS.textSecondary} />
          </View>
          <Text style={styles.emptyText}>No transactions yet</Text>
          <Text style={styles.emptySubText}>Your recent activity will appear here</Text>
        </View>
      ) : (
        history.map((item: any, index: number) => {
            const isCompleted = item.status === 'COMPLETED';
            return (
              <View key={index} style={styles.historyItem}>
                <View style={[styles.historyIcon, { backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)' }]}>
                  <Ionicons 
                    name={isCompleted ? "arrow-down-outline" : "time-outline"} 
                    size={20} 
                    color={isCompleted ? COLORS.success : COLORS.warning} 
                  />
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyTitle}>M-Pesa Deposit</Text>
                  <Text style={styles.historyDate}>
                    {new Date(item.created_at).toLocaleDateString()} • {item.status}
                  </Text>
                </View>
                <Text style={[
                  styles.historyAmount, 
                  { color: isCompleted ? COLORS.success : COLORS.textSecondary }
                ]}>
                  +{item.amount_kes || item.amount} NIT
                </Text>
              </View>
            );
        })
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {renderHeader()}

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor={COLORS.cardBg} 
                progressBackgroundColor={COLORS.surface}
            />
        }
      >
        {renderBalanceCard()}
        {renderActions()}
        {renderHistory()}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerLeft: {
    gap: 4,
  },
  greeting: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  walletAddr: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  profileButton: {
    padding: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  // Card
  cardContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 28,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
    height: 200,
    justifyContent: 'space-between',
    shadowColor: COLORS.cardBg,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  decorCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  networkTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
    opacity: 0.6,
  },
  networkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    opacity: 0.7,
  },
  balanceSection: {
    marginTop: 10,
  },
  balanceLabel: {
    color: COLORS.cardText,
    opacity: 0.7,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.cardText,
    opacity: 0.8,
  },
  balanceText: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.cardText,
    letterSpacing: -1.5,
  },
  currencySuffix: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cardText,
    opacity: 0.8,
  },
  fiatText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.cardText,
    opacity: 0.6,
  },
  cardFooter: {
    flexDirection: 'row',
  },
  gasBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  gasText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.cardText,
    opacity: 0.9,
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },

  // History
  historySection: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    color: COLORS.cardBg,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  historyIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyDate: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  historyAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
});