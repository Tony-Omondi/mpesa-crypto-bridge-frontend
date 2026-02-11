import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

import { theme } from '@/src/constants';
import { useAppSelector } from '@/src/store';
import { BASE_URL } from '@/src/config';

// --- THEME CONSTANTS (Match Home Screen) ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',    // Mint Green
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  error: '#EF4444',
  inputBg: '#161B22',
};

export default function Deposit() {
  const router = useRouter();
  const { walletAddress, token } = useAppSelector((state) => state.walletReducer);

  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimatedNit, setEstimatedNit] = useState('0.00');

  // 1 KES = 1 NIT Calculation
  useEffect(() => {
    const val = parseFloat(amount);
    setEstimatedNit(!isNaN(val) ? val.toFixed(2) : '0.00');
  }, [amount]);

  const formatPhoneNumber = (input: string) => {
    let cleaned = input.replace(/\D/g, '');
    if (cleaned.startsWith('0')) return '254' + cleaned.substring(1);
    if (cleaned.length === 9) return '254' + cleaned;
    return cleaned;
  };

  const handleDeposit = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (!amount || parseFloat(amount) < 5) {
      Alert.alert("Invalid Amount", "Minimum deposit is 5 KES.");
      return;
    }
    if (!phone) {
      Alert.alert("Missing Phone", "Enter your M-Pesa phone number.");
      return;
    }

    const normalizedPhone = formatPhoneNumber(phone);
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/payments/pay/`,
        {
          amount_kes: amount,
          phone_number: normalizedPhone,
          wallet_address: walletAddress,
        },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === "STK_SENT") {
        showMessage({
          message: "STK Push Sent",
          description: "Check your phone to enter your PIN.",
          type: "success",
          backgroundColor: COLORS.primary, 
          duration: 5000,
        });
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error("Payment Error:", error.response?.data || error.message);
      Alert.alert("Payment Failed", error.response?.data?.error || "Could not reach server.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER HELPERS ---

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Deposit Funds</Text>
      <View style={{ width: 40 }} /> 
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconBg}>
              <Ionicons name="phone-portrait-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>M-Pesa Express</Text>
              <Text style={styles.infoDesc}>
                Buy <Text style={{fontWeight: '700', color: '#fff'}}>$NIT</Text> instantly. 
                Tokens are minted to your wallet immediately after payment.
              </Text>
            </View>
          </View>

          {/* Amount Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Amount to Deposit</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencyPrefix}>KES</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="500"
                placeholderTextColor="#4B5563"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                selectionColor={COLORS.primary}
              />
            </View>
            <View style={styles.conversionBadge}>
              <Ionicons name="swap-vertical" size={12} color={COLORS.primary} />
              <Text style={styles.conversionText}>You receive ≈ {estimatedNit} NIT</Text>
            </View>
          </View>

          {/* Phone Input */}
          <View style={styles.section}>
            <Text style={styles.label}>M-Pesa Phone Number</Text>
            <View style={styles.phoneContainer}>
              <Ionicons name="call-outline" size={20} color={COLORS.textSecondary} style={{marginLeft: 16}} />
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

          {/* Quick Amounts (Optional UX Delight) */}
          <View style={styles.quickAmountRow}>
            {['100', '500', '1000'].map((val) => (
              <TouchableOpacity 
                key={val} 
                style={styles.chip} 
                onPress={() => {
                  Haptics.selectionAsync();
                  setAmount(val);
                }}
              >
                <Text style={styles.chipText}>+{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            style={[styles.payButton, loading && { opacity: 0.7 }]} 
            onPress={handleDeposit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Text style={styles.payButtonText}>Pay with M-Pesa</Text>
                <Ionicons name="arrow-forward" size={20} color="#00332a" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.secureFooter}>
            <Ionicons name="lock-closed" size={12} color={COLORS.textSecondary} />
            <Text style={styles.secureText}>Secured by Safaricom Daraja API</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
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
  
  content: { padding: 24, paddingBottom: 100 },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 208, 156, 0.08)', // Tinted Primary
    padding: 16,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.2)',
    alignItems: 'center',
    gap: 16,
  },
  infoIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 208, 156, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitle: { color: COLORS.primary, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  infoDesc: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 18 },

  section: { marginBottom: 24 },
  label: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: 10, marginLeft: 4 },
  
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
    height: 70, // Taller input for amount
  },
  currencyPrefix: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 12,
  },
  amountInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 28, // Large text for money
    fontWeight: '700',
    height: '100%',
  },
  
  conversionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
    gap: 4,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  conversionText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },

  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 56,
  },
  phoneInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    paddingHorizontal: 16,
    height: '100%',
    fontWeight: '500',
  },

  quickAmountRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  chip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 13 },

  payButton: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  payButtonText: {
    color: '#00332a', // Dark text on green button
    fontSize: 18,
    fontWeight: '700',
  },

  secureFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
    opacity: 0.5,
  },
  secureText: { color: COLORS.textSecondary, fontSize: 12 },
});