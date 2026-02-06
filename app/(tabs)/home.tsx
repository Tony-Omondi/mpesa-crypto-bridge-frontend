import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Image} from 'expo-image';
import {useFocusEffect, useRouter} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';

import {theme} from '@/src/constants';
import {URLS} from '@/src/config';
import {useAppSelector} from '@/src/store';

export default function Home() {
  const router = useRouter();
  const {walletAddress} = useAppSelector((state) => state.walletReducer);

  const [balance, setBalance] = useState('0.00'); 
  const [ethBalance, setEthBalance] = useState('0.0000'); 
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Focus Effect ensures data refreshes every time you navigate back to Home
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

      // A. Get Balances (NIT & ETH) from Django
      // This hits your new 'web3_utils.py' logic
      const balUrl = URLS.GET_BALANCE(walletAddress);
      const balResponse = await axios.get(balUrl);
      
      console.log("💰 Balance Data:", balResponse.data);

      if (balResponse.data && balResponse.data.status === "Success") {
        setBalance(balResponse.data.balance_nit.toFixed(2));
        setEthBalance(balResponse.data.balance_eth.toFixed(4));
      }

      // B. Get History (M-Pesa Deposits)
      // Note: You can expand this later to include Blockchain Transfers too
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

  // --- UI RENDER FUNCTIONS ---

  const renderHeader = () => (
    <View style={styles.header}>
        <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.walletAddr}>
                {walletAddress 
                    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` 
                    : 'Connecting...'}
            </Text>
        </View>
        <Image 
            source={require('../../assets/icons/03.png')} 
            style={{width: 40, height: 40}} 
        />
    </View>
  );

  const renderBalanceCard = () => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardLabel}>Total Balance (Arbitrum)</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Sepolia</Text>
          </View>
        </View>
        
        <View style={styles.balanceRow}>
            <Text style={styles.currencySymbol}>$NIT</Text>
            <Text style={styles.balanceText}>{balance}</Text>
        </View>
        
        <Text style={styles.fiatValue}>≈ KES {balance}</Text>

        <View style={styles.divider} />

        <View style={styles.gasRow}>
            <Text style={styles.gasLabel}>Gas Fees: {ethBalance} ETH</Text>
        </View>
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionsRow}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => router.push('/(tabs)/deposit')}
      >
        <View style={[styles.iconCircle, {backgroundColor: `${theme.colors.primary}20`}]}>
            <Text style={{fontSize: 24}}>⬇️</Text>
        </View>
        <Text style={styles.actionText}>Deposit</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => router.push('/(tabs)/send')}
      >
        <View style={[styles.iconCircle, {backgroundColor: `${theme.colors.white}10`}]}>
            <Text style={{fontSize: 24}}>↗️</Text>
        </View>
        <Text style={styles.actionText}>Send</Text>
      </TouchableOpacity>
      
      {/* THIS IS THE LINKED WITHDRAW BUTTON */}
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => router.push('/(tabs)/withdraw')}
      >
        <View style={[styles.iconCircle, {backgroundColor: `${theme.colors.error}20`}]}>
            <Text style={{fontSize: 24}}>🏦</Text>
        </View>
        <Text style={styles.actionText}>Withdraw</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.historyContainer}>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      
      {history.length === 0 ? (
        <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet.</Text>
        </View>
      ) : (
        history.map((item: any, index: number) => (
            <View key={index} style={styles.historyItem}>
                <View style={styles.historyIcon}>
                    <Text>💰</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.historyTitle}>M-Pesa Deposit</Text>
                    <Text style={styles.historySub}>
                      {new Date(item.created_at).toLocaleDateString()} • {item.status}
                    </Text>
                </View>
                <Text style={[
                  styles.historyAmount, 
                  { color: item.status === 'COMPLETED' ? theme.colors.primary : '#888' }
                ]}>
                  +{item.amount_kes || item.amount} NIT
                </Text>
            </View>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      {renderHeader()}

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor={theme.colors.primary} 
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: 24, paddingTop: 10, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: theme.colors.textSecondary, fontSize: 14 },
  walletAddr: { color: theme.colors.white, fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },
  scrollContent: { paddingBottom: 100 },
  cardContainer: { paddingHorizontal: 24, marginBottom: 30 },
  card: { backgroundColor: theme.colors.primary, borderRadius: 24, padding: 24, shadowColor: theme.colors.primary, shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardLabel: { color: theme.colors.eigengrau, opacity: 0.7, fontWeight: '700', fontSize: 14 },
  badge: { backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: theme.colors.eigengrau, fontSize: 10, fontWeight: 'bold' },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  currencySymbol: { color: theme.colors.eigengrau, fontSize: 20, fontWeight: '700' },
  balanceText: { color: theme.colors.eigengrau, fontSize: 42, fontWeight: '800', letterSpacing: -1 },
  fiatValue: { color: theme.colors.eigengrau, opacity: 0.6, fontSize: 15, marginTop: -4, marginBottom: 16, fontWeight: '500' },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginBottom: 12 },
  gasRow: { flexDirection: 'row' },
  gasLabel: { color: theme.colors.eigengrau, opacity: 0.7, fontSize: 12, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 30 },
  actionButton: { alignItems: 'center', gap: 8 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  actionText: { color: theme.colors.textSecondary, fontSize: 14, fontWeight: '500' },
  historyContainer: { paddingHorizontal: 24 },
  sectionTitle: { color: theme.colors.white, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { color: theme.colors.textSecondary, fontSize: 16, marginBottom: 4 },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1D23', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  historyIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,208,156,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  historyTitle: { color: theme.colors.white, fontWeight: '600', fontSize: 16 },
  historySub: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 },
  historyAmount: { fontWeight: '700', fontSize: 16 },
});