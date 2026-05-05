import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Platform, Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { showMessage } from 'react-native-flash-message';

const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

export default function TransactionReceipt() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    type, amount, status, tx_hash,
    from_address, to_address, created_at, tokenSymbol
  } = params as Record<string, string>;

  const isDeposit = type === 'DEPOSIT';
  const isPending = status === 'PENDING' || status === 'PAID_BUT_FAILED';
  const isSuccess = status === 'COMPLETED';
  const isFailed = status === 'FAILED' || status === 'PAID_BUT_FAILED';

  const statusColor = isSuccess ? COLORS.success : isPending ? COLORS.warning : COLORS.error;
  const symbol = tokenSymbol || 'NIT';

  const handleCopy = async (value: string, label: string) => {
    Haptics.selectionAsync();
    await Clipboard.setStringAsync(value);
    showMessage({ message: `${label} Copied!`, type: 'success', backgroundColor: COLORS.primary, duration: 2000 });
  };

  const handleViewOnArbiscan = () => {
    if (!tx_hash) {
      Alert.alert('No Transaction Hash', 'This transaction has no blockchain hash yet.');
      return;
    }
    Haptics.selectionAsync();
    const url = `https://sepolia.arbiscan.io/tx/${tx_hash}`;
    Linking.openURL(url);
  };

  const formatAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr || 'N/A';
    return `${addr.substring(0, 10)}...${addr.substring(addr.length - 8)}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' });
    } catch { return dateStr; }
  };

  const getStatusIcon = () => {
    if (isSuccess) return 'checkmark-circle';
    if (isPending) return 'time';
    return 'close-circle';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Receipt</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: `${statusColor}15`, borderColor: `${statusColor}40` }]}>
          <Ionicons name={getStatusIcon() as any} size={48} color={statusColor} />
          <Text style={[styles.statusTitle, { color: statusColor }]}>
            {isSuccess ? 'Completed' : isPending ? 'Pending' : 'Failed'}
          </Text>
          <Text style={styles.statusAmount}>
            {isDeposit ? '+' : ''}{amount} {symbol}
          </Text>
          {isDeposit && <Text style={styles.statusSub}>≈ KES {amount}</Text>}
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transaction Details</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Type</Text>
            <Text style={styles.rowValue}>
              {isDeposit ? '📱 M-Pesa Deposit' : `🔗 ${symbol} Transfer`}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Status</Text>
            <View style={[styles.statusPill, { backgroundColor: `${statusColor}20` }]}>
              <Text style={[styles.statusPillText, { color: statusColor }]}>{status}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Date</Text>
            <Text style={styles.rowValue}>{formatDate(created_at)}</Text>
          </View>

          {from_address && from_address !== 'undefined' && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>From</Text>
                <TouchableOpacity
                  style={styles.addressPill}
                  onPress={() => handleCopy(from_address, 'From address')}
                >
                  <Text style={styles.addressText}>{formatAddress(from_address)}</Text>
                  <Ionicons name="copy-outline" size={12} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            </>
          )}

          {to_address && to_address !== 'undefined' && to_address !== 'MPESA_WITHDRAWAL' && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>To</Text>
                <TouchableOpacity
                  style={styles.addressPill}
                  onPress={() => handleCopy(to_address, 'To address')}
                >
                  <Text style={styles.addressText}>{formatAddress(to_address)}</Text>
                  <Ionicons name="copy-outline" size={12} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            </>
          )}

          {to_address === 'MPESA_WITHDRAWAL' && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>To</Text>
                <Text style={styles.rowValue}>📱 M-Pesa Withdrawal</Text>
              </View>
            </>
          )}

          {tx_hash && tx_hash !== '' && tx_hash !== 'undefined' && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Tx Hash</Text>
                <TouchableOpacity
                  style={styles.addressPill}
                  onPress={() => handleCopy(tx_hash, 'Transaction hash')}
                >
                  <Text style={styles.addressText}>{formatAddress(tx_hash)}</Text>
                  <Ionicons name="copy-outline" size={12} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* View on Arbiscan */}
        {tx_hash && tx_hash !== '' && tx_hash !== 'undefined' && (
          <TouchableOpacity style={styles.arbiscanButton} onPress={handleViewOnArbiscan} activeOpacity={0.8}>
            <Ionicons name="open-outline" size={18} color={COLORS.primary} />
            <Text style={styles.arbiscanText}>View on Arbiscan</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {/* Pending info */}
        {isPending && (
          <View style={styles.pendingNote}>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.warning} />
            <Text style={styles.pendingNoteText}>
              {status === 'PAID_BUT_FAILED'
                ? 'Your M-Pesa payment was received but token minting failed. Our team will resolve this shortly.'
                : 'This transaction is being processed. It may take a few minutes to complete.'}
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  content: { padding: 24, paddingBottom: 60, gap: 16 },
  statusBanner: { borderRadius: 24, padding: 24, alignItems: 'center', gap: 8, borderWidth: 1 },
  statusTitle: { fontSize: 20, fontWeight: '800' },
  statusAmount: { fontSize: 32, fontWeight: '800', color: COLORS.textPrimary },
  statusSub: { fontSize: 14, color: COLORS.textSecondary },
  card: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.border, gap: 4 },
  cardTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  rowLabel: { color: COLORS.textSecondary, fontSize: 14 },
  rowValue: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusPillText: { fontSize: 12, fontWeight: '700' },
  addressPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.background, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  addressText: { color: COLORS.textSecondary, fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  arbiscanButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: `${COLORS.primary}15`, borderRadius: 16, paddingVertical: 14, borderWidth: 1, borderColor: `${COLORS.primary}30` },
  arbiscanText: { color: COLORS.primary, fontSize: 15, fontWeight: '700' },
  pendingNote: { flexDirection: 'row', gap: 10, backgroundColor: `${COLORS.warning}10`, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: `${COLORS.warning}30`, alignItems: 'flex-start' },
  pendingNoteText: { flex: 1, color: COLORS.textSecondary, fontSize: 13, lineHeight: 20 },
});
