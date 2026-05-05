import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { showMessage } from 'react-native-flash-message';
import apiClient from '@/src/utils/apiClient';

import { URLS } from '@/src/config';
import { useAppSelector } from '@/src/store';

const COLORS = {
  background: '#0F1115',
  primary: '#3B82F6', // Blue theme to distinguish from self-deposit
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  error: '#EF4444',
  inputBg: '#161B22',
};

export default function RequestPayment() {
  const router = useRouter();
  const { walletAddress } = useAppSelector((state: any) => state.walletReducer);

  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic calculations for the UI
  const parsedAmount = parseFloat(amount) || 0;
  const fee = (parsedAmount * 0.005).toFixed(2);
  const receiveAmount = (parsedAmount - parseFloat(fee)).toFixed(2);

  const formatPhoneNumber = (input: string) => {
    let cleaned = input.replace(/\D/g, '');
    if (cleaned.startsWith('0')) return '254' + cleaned.substring(1);
    if (cleaned.length === 9) return '254' + cleaned;
    return cleaned;
  };

  const handleRequest = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (parsedAmount < 5) {
      Alert.alert("Invalid Amount", "Minimum request is 5 KES.");
      return;
    }
    if (!phone) {
      Alert.alert("Missing Phone", "Enter the M-Pesa number of the person paying.");
      return;
    }

    const normalizedPhone = formatPhoneNumber(phone);
    setLoading(true);

    try {
      const response = await apiClient.post(URLS.REQUEST_PAYMENT, {
        amount_kes: amount,
        phone_number: normalizedPhone,
      });

      if (response.data.status === "STK_SENT") {
        showMessage({
          message: "Request Sent! 📱",
          description: `Prompt sent to ${normalizedPhone}.`,
          type: "success",
          backgroundColor: COLORS.primary,
          duration: 3000,
        });

        // ✅ Navigate to waiting screen to poll for completion
        router.replace({
          pathname: '/paymentWaiting',
          params: {
            order_id: String(response.data.order_id),
            amount: amount,
          }
        });
      }
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error("Payment Error:", error.response?.data || error.message);
      Alert.alert("Request Failed", error.response?.data?.error || "Could not reach server.");
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Request Payment</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          <View style={styles.infoCard}>
            <View style={styles.infoIconBg}>
              <Ionicons name="receipt-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Get Paid Instantly</Text>
              <Text style={styles.infoDesc}>
                Send an STK push to <Text style={{ fontWeight: '700', color: '#fff' }}>anyone</Text>. 
                When they pay, <Text style={{ fontWeight: '700', color: '#fff' }}>$NIT</Text> is minted directly to your wallet.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Payer's M-Pesa Number</Text>
            <View style={styles.phoneContainer}>
              <Ionicons name="call-outline" size={20} color={COLORS.textSecondary} style={{ marginLeft: 16 }} />
              <TextInput
                style={styles.phoneInput}
                placeholder="07XX XXX XXX"
                placeholderTextColor="#4B5563"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                selectionColor={COLORS.primary}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Amount to Request</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencyPrefix}>KES</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor="#4B5563"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                selectionColor={COLORS.primary}
              />
            </View>
          </View>

          {/* Breakdown Section */}
          <View style={styles.breakdownBox}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Requested Amount</Text>
              <Text style={styles.breakdownValue}>{parsedAmount.toFixed(2)} KES</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Network Fee (0.5%)</Text>
              <Text style={[styles.breakdownValue, { color: COLORS.error }]}>- {fee} KES</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownTotalLabel}>You will receive</Text>
              <Text style={styles.breakdownTotalValue}>{receiveAmount} NIT</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.payButton, loading && { opacity: 0.7 }]}
            onPress={handleRequest}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.payButtonText}>Send Request</Text>
                <Ionicons name="paper-plane" size={20} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  content: { padding: 24, paddingBottom: 100 },
  infoCard: { flexDirection: 'row', backgroundColor: 'rgba(59, 130, 246, 0.08)', padding: 16, borderRadius: 20, marginBottom: 32, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)', alignItems: 'center', gap: 16 },
  infoIconBg: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(59, 130, 246, 0.15)', justifyContent: 'center', alignItems: 'center' },
  infoTitle: { color: COLORS.primary, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  infoDesc: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 18 },
  section: { marginBottom: 24 },
  label: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: 10, marginLeft: 4 },
  amountContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 20, height: 70 },
  currencyPrefix: { color: COLORS.textSecondary, fontSize: 18, fontWeight: '700', marginRight: 12 },
  amountInput: { flex: 1, color: COLORS.textPrimary, fontSize: 28, fontWeight: '700', height: '100%' },
  phoneContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, height: 56 },
  phoneInput: { flex: 1, color: COLORS.textPrimary, fontSize: 16, paddingHorizontal: 16, height: '100%', fontWeight: '500' },
  breakdownBox: { backgroundColor: COLORS.surface, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 32, gap: 12 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breakdownLabel: { color: COLORS.textSecondary, fontSize: 14 },
  breakdownValue: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  breakdownTotalLabel: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  breakdownTotalValue: { color: COLORS.primary, fontSize: 18, fontWeight: '800' },
  payButton: { backgroundColor: COLORS.primary, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  payButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});