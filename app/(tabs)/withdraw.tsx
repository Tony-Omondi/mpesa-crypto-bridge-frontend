import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

import { URLS } from '@/src/config';
import { useAppSelector } from '@/src/store';

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  inputBg: '#161B22',
  error: '#EF4444',
  warning: '#F59E0B',
};

export default function WithdrawScreen() {
  const router = useRouter();
  
  const { privateKey } = useAppSelector((state: any) => state.walletReducer);
  
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Normalize phone to 254...
  const formatPhoneNumber = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) return '254' + cleaned.substring(1);
    if (cleaned.length === 9) return '254' + cleaned;
    return cleaned;
  };

  const handleWithdraw = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!amount || parseFloat(amount) <= 0) {
      showMessage({ message: "Enter a valid amount", type: "warning" });
      return;
    }
    if (!phoneNumber) {
      showMessage({ message: "Enter M-Pesa phone number", type: "warning" });
      return;
    }

    setLoading(true);
    const normalizedPhone = formatPhoneNumber(phoneNumber);

    try {
      console.log("💸 Initiating Withdrawal...");

      const response = await axios.post(URLS.WITHDRAW_NIT, {
        amount: amount,
        phone_number: normalizedPhone,
        privateKey: privateKey,
      });

      console.log("✅ Withdraw Success:", response.data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Trigger the custom frosted glass modal instead of Alert
      setShowSuccessModal(true);

    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error("❌ Withdraw Error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || "Withdrawal failed. Check your connection.";
      showMessage({ message: "Failed", description: errorMsg, type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setAmount('');
    router.push('/(tabs)/home');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Withdraw Cash</Text>
      <View style={{ width: 40 }} /> 
    </View>
  );

  const renderSuccessModal = () => (
    <Modal visible={showSuccessModal} transparent animationType="fade">
      <BlurView intensity={60} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalIconContainer}>
            <Ionicons name="checkmark-circle" size={48} color={COLORS.primary} />
          </View>
          
          <Text style={styles.modalTitle}>Withdrawal Initiated!</Text>
          <Text style={styles.modalText}>
            Your funds are on the way to M-Pesa. Check the SMS for {formatPhoneNumber(phoneNumber)} shortly.
          </Text>

          <TouchableOpacity 
            style={styles.modalButton} 
            onPress={handleModalClose}
            activeOpacity={0.8}
          >
            <Text style={styles.modalButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

            {/* Info Card */}
            <View style={styles.infoCard}>
                <View style={styles.infoIconBg}>
                    <Ionicons name="flame" size={24} color={COLORS.warning} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.infoTitle}>Burn to Withdraw</Text>
                    <Text style={styles.infoDesc}>
                        <Text style={{fontWeight: '700', color: '#fff'}}>$NIT</Text> tokens are burned from your wallet, and you receive <Text style={{fontWeight: '700', color: '#fff'}}>KES</Text> instantly to M-Pesa.
                    </Text>
                </View>
            </View>

            {/* Amount Input */}
            <View style={styles.section}>
                <Text style={styles.label}>Amount to Withdraw</Text>
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
                <View style={styles.conversionBadge}>
                    <Text style={styles.conversionText}>1 NIT = 1 KES</Text>
                </View>
            </View>

            {/* Phone Input */}
            <View style={styles.section}>
                <Text style={styles.label}>M-Pesa Phone Number</Text>
                <View style={styles.phoneContainer}>
                    <Ionicons name="phone-portrait-outline" size={20} color={COLORS.textSecondary} style={{marginLeft: 16}} />
                    <TextInput
                        style={styles.phoneInput}
                        placeholder="07XX XXX XXX"
                        placeholderTextColor="#4B5563"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        selectionColor={COLORS.primary}
                    />
                </View>
            </View>

            {/* Quick Chips */}
            <View style={styles.quickRow}>
                {['500', '1000', '2000'].map((val) => (
                    <TouchableOpacity 
                        key={val} 
                        style={styles.chip} 
                        onPress={() => {
                            Haptics.selectionAsync();
                            setAmount(val);
                        }}
                    >
                        <Text style={styles.chipText}>{val}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Footer / Button */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.withdrawButton, loading && { opacity: 0.7 }]}
                    onPress={handleWithdraw}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                            <Ionicons name="cash-outline" size={20} color="#00332a" />
                            <Text style={styles.buttonText}>Confirm Withdraw</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.secureFooter}>
                    <Ionicons name="lock-closed" size={12} color={COLORS.textSecondary} />
                    <Text style={styles.secureText}>Processed via Safaricom Daraja</Text>
                </View>
            </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Mount the custom modal */}
      {renderSuccessModal()}
      
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

  content: { padding: 24, paddingBottom: 50 },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    gap: 16,
  },
  infoIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitle: { color: COLORS.warning, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  infoDesc: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 18 },

  section: { marginBottom: 24 },
  label: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: 10, marginLeft: 4 },

  // Big Amount Input
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 20,
    height: 70, 
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
    fontSize: 28,
    fontWeight: '700',
    height: '100%',
  },
  conversionBadge: {
    alignSelf: 'flex-end',
    marginTop: 8,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  conversionText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' },

  // Phone Input
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

  // Chips
  quickRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
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

  // Button
  withdrawButton: {
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
  buttonText: {
    color: '#00332a',
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
  
  footer: {
      marginTop: 20,
      paddingBottom: 20
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  modalCard: {
    width: '85%',
    backgroundColor: COLORS.surface,
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#00332a',
    fontSize: 16,
    fontWeight: '700',
  },
});