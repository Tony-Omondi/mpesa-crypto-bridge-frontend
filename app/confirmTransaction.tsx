import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Platform 
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useAppSelector } from '@/src/store';
import { getTokenById } from '@/src/utils/getTokenById';

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  line: 'rgba(255,255,255,0.1)',
};

export default function ConfirmTransaction() {
  const router = useRouter();
  const { id, recipient, amount } = useLocalSearchParams();
  const token = getTokenById(String(id));
  const { walletAddress, access } = useAppSelector((state) => state.walletReducer);

  // Formatting helpers
  const formatAddress = (addr: string) => {
    if (!addr) return '...';
    if (addr.length < 10) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const estimatedGas = "0.0004 ETH"; // Mock gas fee for realism

  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push({
      pathname: '/(loading)/transfer',
      params: { id, recipient, amount },
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Review Transaction</Text>
      <View style={{ width: 40 }} /> 
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* RECEIPT CARD */}
        <View style={styles.receiptCard}>
            
            {/* Header: Amount & Token */}
            <View style={styles.amountSection}>
                <View style={styles.iconCircle}>
                    {token?.logo ? (
                         <Image source={{ uri: token.logo }} style={styles.tokenImage} />
                    ) : (
                         <Ionicons name="cube" size={24} color={COLORS.primary} />
                    )}
                </View>
                <Text style={styles.sendingLabel}>Sending</Text>
                <Text style={styles.amountText}>
                    {amount} <Text style={styles.symbolText}>{token?.symbol}</Text>
                </Text>
            </View>

            {/* Dotted Divider */}
            <View style={styles.divider} />

            {/* Details */}
            <View style={styles.detailsSection}>
                
                {/* FROM */}
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>From</Text>
                    <View style={styles.addressPill}>
                         <Ionicons name="wallet-outline" size={14} color={COLORS.textSecondary} />
                         <Text style={styles.addressText}>{formatAddress(walletAddress)}</Text>
                    </View>
                </View>

                {/* TO */}
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>To</Text>
                    <View style={styles.addressPill}>
                         <Ionicons name="arrow-forward-circle-outline" size={14} color={COLORS.textSecondary} />
                         <Text style={styles.addressText}>{formatAddress(String(recipient))}</Text>
                    </View>
                </View>

                {/* NETWORK FEE */}
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Network Fee</Text>
                    <Text style={styles.feeText}>{estimatedGas}</Text>
                </View>

            </View>

            {/* Total Divider */}
            <View style={styles.divider} />

            {/* Total */}
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.totalAmount}>{amount} {token?.symbol}</Text>
                    <Text style={styles.totalFee}>+ {estimatedGas} fee</Text>
                </View>
            </View>

        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.primary} />
            <Text style={styles.securityText}>Transaction is secure and irreversible.</Text>
        </View>

      </ScrollView>

      {/* CONFIRM BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Ionicons name="finger-print" size={24} color="#00332a" style={{marginRight: 8}} />
            <Text style={styles.buttonText}>Confirm & Send</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },

  content: {
    padding: 24,
    paddingBottom: 100,
  },

  // Receipt Card
  receiptCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  amountSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tokenImage: {
    width: 32,
    height: 32,
  },
  sendingLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amountText: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '700',
  },
  symbolText: {
    fontSize: 20,
    color: COLORS.primary,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.line,
    marginVertical: 16,
    borderStyle: 'dashed', // Note: borderStyle only works with borderWidth on View in some RN versions, simply using low opacity line here is safer
  },

  detailsSection: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  addressText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  feeText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  totalAmount: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  totalFee: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  // Security Note
  securityNote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
    opacity: 0.8,
  },
  securityText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  // Footer Button
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: COLORS.background, // Opaque bg to cover scroll content
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: '#00332a',
    fontSize: 16,
    fontWeight: '700',
  },
});