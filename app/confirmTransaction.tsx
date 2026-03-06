import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication'; 
import { BlurView } from 'expo-blur'; 
import axios from 'axios';
import LottieView from 'lottie-react-native'; 

import { URLS } from '@/src/config';
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
  error: '#EF4444',
};

export default function ConfirmTransaction() {
  const router = useRouter();
  const { id, recipient, amount } = useLocalSearchParams();
  const token = getTokenById(String(id));
  const tokenSymbol = token?.symbol || 'NIT'; 
  
  const { walletAddress, privateKey, access } = useAppSelector((state: any) => state.walletReducer);

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // --- NEW ERROR STATES ---
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatAddress = (addr: string) => {
    if (!addr) return '...';
    if (addr.length < 10) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const estimatedGas = "0.0004 ETH"; 

  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const handleConfirm = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: `Authenticate to send ${amount} ${tokenSymbol}`,
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      if (!authResult.success) {
        throw new Error("Authentication cancelled.");
      }

      setLoading(true);
      console.log(`🚀 Sending ${amount} ${tokenSymbol} to ${recipient}...`);

      const response = await axios.post(URLS.TRANSFER_NIT, {
        to_address: recipient,
        amount: amount,
        privateKey: privateKey, 
      });

      console.log("✅ Transfer Success:", response.data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowSuccessModal(true);

    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error("❌ Send Error:", error.response?.data || error.message);
      
      // Smart error extraction for better user feedback
      let extractedError = "Transaction failed. Please check your connection and try again.";
      const rawError = error.response?.data?.error || error.response?.data?.privateKey?.[0] || error.message;

      // Make blockchain errors readable
      if (rawError.toLowerCase().includes('insufficient funds')) {
          extractedError = `You do not have enough ${tokenSymbol} (or gas) to complete this transaction.`;
      } else if (rawError.toLowerCase().includes('authentication')) {
          extractedError = "Authentication was cancelled or failed.";
      } else if (rawError) {
          extractedError = rawError; // Fallback to whatever the backend sent
      }
        
      setErrorMessage(extractedError);
      setShowErrorModal(true); // Trigger the error modal instead of flash message

    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = (isSuccess: boolean) => {
    if (isSuccess) {
        setShowSuccessModal(false);
        router.push('/(tabs)/home'); 
    } else {
        setShowErrorModal(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
        disabled={loading}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Review Transaction</Text>
      <View style={{ width: 40 }} /> 
    </View>
  );

  const renderSuccessModal = () => (
    <Modal visible={showSuccessModal} transparent animationType="fade">
      <BlurView intensity={60} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalIconContainer}>
            <LottieView
              source={require('@/assets/animations/sent.json')}
              autoPlay
              loop={false} 
              style={{ width: 100, height: 100 }}
            />
          </View>
          <Text style={styles.modalTitle}>Tokens Sent!</Text>
          <Text style={styles.modalText}>
            You successfully sent {amount} {tokenSymbol} to {formatAddress(String(recipient))}.
          </Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => handleModalClose(true)} activeOpacity={0.8}>
            <Text style={styles.modalButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );

  // --- NEW ERROR MODAL COMPONENT ---
  const renderErrorModal = () => (
    <Modal visible={showErrorModal} transparent animationType="fade">
      <BlurView intensity={60} tint="dark" style={styles.modalOverlay}>
        <View style={[styles.modalCard, { borderColor: COLORS.error }]}>
          <View style={styles.modalIconContainer}>
            <LottieView
              source={require('@/assets/animations/failed.json')}
              autoPlay
              loop={false} 
              style={{ width: 100, height: 100 }}
            />
          </View>
          <Text style={[styles.modalTitle, { color: COLORS.error }]}>Transfer Failed</Text>
          <Text style={styles.modalText}>
            {errorMessage}
          </Text>
          <TouchableOpacity 
             style={[styles.modalButton, { backgroundColor: COLORS.error }]} 
             onPress={() => handleModalClose(false)} 
             activeOpacity={0.8}
          >
            <Text style={[styles.modalButtonText, { color: '#FFF' }]}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* RECEIPT CARD */}
        <View style={styles.receiptCard}>
            
            <View style={styles.amountSection}>
                <LottieView
                  source={require('@/assets/animations/sendinganimation.json')}
                  autoPlay
                  loop
                  style={{ width: 100, height: 100, marginBottom: -10 }}
                />

                <Text style={styles.sendingLabel}>Sending</Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.amountText}>{amount}</Text>
                    {token?.logo && <Image source={{ uri: token.logo }} style={styles.smallTokenImage} />}
                    <Text style={styles.symbolText}>{tokenSymbol}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsSection}>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>From</Text>
                    <View style={styles.addressPill}>
                         <Ionicons name="wallet-outline" size={14} color={COLORS.textSecondary} />
                         <Text style={styles.addressText}>{formatAddress(walletAddress)}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>To</Text>
                    <View style={styles.addressPill}>
                         <Ionicons name="arrow-forward-circle-outline" size={14} color={COLORS.textSecondary} />
                         <Text style={styles.addressText}>{formatAddress(String(recipient))}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Network Fee</Text>
                    <Text style={styles.feeText}>{estimatedGas}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.totalAmount}>{amount} {tokenSymbol}</Text>
                    <Text style={styles.totalFee}>+ {estimatedGas} fee</Text>
                </View>
            </View>

        </View>

        <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.primary} />
            <Text style={styles.securityText}>Transaction is secure and irreversible.</Text>
        </View>

      </ScrollView>

      {/* CONFIRM BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.confirmButton, loading && { opacity: 0.7 }]} 
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons name="finger-print" size={24} color="#00332a" style={{marginRight: 8}} />
              <Text style={styles.buttonText}>Authenticate & Send</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Render Modals */}
      {renderSuccessModal()}
      {renderErrorModal()}

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
  smallTokenImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  sendingLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
    zIndex: 10, 
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
    backgroundColor: COLORS.background, 
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

  // Modal Styles
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalCard: {
    width: '85%', backgroundColor: COLORS.surface, borderRadius: 32, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  modalIconContainer: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'transparent',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  modalTitle: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '800', marginBottom: 12 },
  modalText: { color: COLORS.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  modalButton: { backgroundColor: COLORS.primary, width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  modalButtonText: { color: '#00332a', fontSize: 16, fontWeight: '700' },
});