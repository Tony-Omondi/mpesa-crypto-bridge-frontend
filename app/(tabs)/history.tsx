import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import axios from 'axios';

import { theme } from '@/src/constants';
import { URLS } from '@/src/config';
import { useAppSelector } from '@/src/store';

// Centralized colors
const COLORS = {
  background: '#0F1115',
  cardBg: theme.colors.primary || '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const FILTERS = ['All', 'Deposits', 'Sent', 'Received'];

export default function TransactionHistory() {
  const router = useRouter();
  const { walletAddress } = useAppSelector((state: any) => state.walletReducer);

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // --- LOGIC ---

  const fetchHistory = async () => {
    try {
      // 1. Fetch Internal History (Django Backend)
      const backendRes = await axios.get(URLS.TRANSACTION_HISTORY, {
        params: { wallet_address: walletAddress }
      });
      let combinedHistory = backendRes.data || [];

      // 2. Fetch External Blockchain History (Arbiscan Sepolia)
      if (walletAddress) {
        try {
          // URLs for Native ETH and ERC-20 Tokens
          const ethUrl = `https://api-sepolia.arbiscan.io/api?module=account&action=txlist&address=${walletAddress}&page=1&offset=50&sort=desc`;
          const tokenUrl = `https://api-sepolia.arbiscan.io/api?module=account&action=tokentx&address=${walletAddress}&page=1&offset=50&sort=desc`;

          const [ethRes, tokenRes] = await Promise.all([
            axios.get(ethUrl),
            axios.get(tokenUrl)
          ]);

          let externalTxs: any[] = [];

          // Parse Native ETH transfers
          if (ethRes.data && ethRes.data.status === "1") {
            const ethTransfers = ethRes.data.result
              .filter((tx: any) => tx.value !== "0") 
              .map((tx: any) => ({
                id: tx.hash,
                type: "TRANSFER",
                from_address: tx.from,
                to_address: tx.to,
                amount: (Number(tx.value) / 1e18).toFixed(4),
                status: "COMPLETED",
                created_at: new Date(Number(tx.timeStamp) * 1000).toISOString(),
                tx_hash: tx.hash,
                tokenSymbol: 'ETH'
              }));
            externalTxs = [...externalTxs, ...ethTransfers];
          }

          // Parse ERC-20 Token transfers (like NIT)
          if (tokenRes.data && tokenRes.data.status === "1") {
            const tokenTransfers = tokenRes.data.result.map((tx: any) => ({
              id: tx.hash,
              type: "TRANSFER",
              from_address: tx.from,
              to_address: tx.to,
              amount: (Number(tx.value) / Math.pow(10, Number(tx.tokenDecimal))).toFixed(2),
              status: "COMPLETED",
              created_at: new Date(Number(tx.timeStamp) * 1000).toISOString(),
              tx_hash: tx.hash,
              tokenSymbol: tx.tokenSymbol || 'NIT'
            }));
            externalTxs = [...externalTxs, ...tokenTransfers];
          }

          // Combine Backend + Blockchain
          const merged = [...combinedHistory, ...externalTxs];
          
          // Deduplicate based on transaction hash
          const uniqueTxs = Array.from(new Map(merged.map(item => [item.tx_hash || item.id, item])).values());

          // Sort everything by newest date first
          combinedHistory = uniqueTxs.sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

        } catch (externalErr) {
          console.warn("⚠️ Arbiscan Fetch Failed:", externalErr);
        }
      }

      setHistory(combinedHistory);

    } catch (error) {
      console.error("❌ History fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (walletAddress) {
        setLoading(true);
        fetchHistory();
      }
    }, [walletAddress])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const getTxUI = (item: any) => {
    const isDeposit = item.type === "DEPOSIT";
    const isSent = item.from_address?.toLowerCase() === walletAddress?.toLowerCase();
    const symbol = item.tokenSymbol || 'NIT';

    if (isDeposit) {
      return { category: 'Deposits', title: "M-Pesa Deposit", icon: "arrow-down-outline", color: COLORS.success, prefix: "+", symbol: 'NIT' };
    }
    if (isSent) {
      return { category: 'Sent', title: `Sent ${symbol}`, icon: "arrow-up-outline", color: COLORS.error, prefix: "-", symbol };
    }
    return { category: 'Received', title: `Received ${symbol}`, icon: "arrow-down-outline", color: COLORS.success, prefix: "+", symbol };
  };

  const filteredHistory = useMemo(() => {
    if (activeFilter === 'All') return history;
    return history.filter(item => getTxUI(item).category === activeFilter);
  }, [history, activeFilter]);

  // --- RENDER COMPONENTS ---

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.iconButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>History</Text>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="search-outline" size={22} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filterContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FILTERS}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => {
          const isActive = activeFilter === item;
          return (
            <TouchableOpacity
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveFilter(item);
              }}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  const renderItem = ({ item }: { item: any }) => {
    const ui = getTxUI(item);
    const isPending = item.status === 'PENDING' || item.status === 'PAID_BUT_FAILED';

    return (
      <View style={styles.historyItem}>
        <View style={[styles.historyIcon, { backgroundColor: `${ui.color}15` }]}>
          <Ionicons 
            name={isPending ? "time-outline" : ui.icon as any} 
            size={20} 
            color={isPending ? COLORS.warning : ui.color} 
          />
        </View>
        
        <View style={styles.historyContent}>
          <Text style={styles.historyTitle}>{ui.title}</Text>
          <Text style={styles.historyDate}>
            {new Date(item.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
          </Text>
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={[
            styles.historyAmount, 
            { color: ui.prefix === '+' ? COLORS.success : COLORS.textPrimary }
          ]}>
            {ui.prefix}{item.amount} {ui.symbol}
          </Text>
          <Text style={[
            styles.statusText, 
            { color: isPending ? COLORS.warning : COLORS.textSecondary }
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}
      {renderFilters()}
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.cardBg} />
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          keyExtractor={(item, index) => item.tx_hash ? `${item.type}-${item.tx_hash}` : index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="receipt-outline" size={32} color={COLORS.textSecondary} />
              </View>
              <Text style={styles.emptyText}>No {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} transactions</Text>
              <Text style={styles.emptySubText}>Your activity will appear here once you make a transaction.</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterContainer: { marginBottom: 16 },
  filterList: { paddingHorizontal: 20, gap: 12 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.cardBg, borderColor: COLORS.cardBg },
  filterText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  filterTextActive: { color: '#000000' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  historyContent: { flex: 1 },
  historyTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  historyDate: { color: COLORS.textSecondary, fontSize: 12 },
  amountContainer: { alignItems: 'flex-end' },
  historyAmount: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  statusText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyText: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '600' },
  emptySubText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});