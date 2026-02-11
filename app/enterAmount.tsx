import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { showMessage } from 'react-native-flash-message';

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
  error: '#EF4444',
  warning: '#F59E0B',
};

export default function EnterAmount() {
  const router = useRouter();
  const { id, recipient } = useLocalSearchParams();
  const token = getTokenById(String(id)); // e.g. { symbol: 'NIT' }
  const { access } = useAppSelector((state) => state.walletReducer);

  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!access) router.replace('/(auth)/welcome');
  }, [access]);

  const handlePressNumber = () => {
    Haptics.selectionAsync();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!amount || parseFloat(amount) <= 0) {
      showMessage({
        message: "Invalid Amount",
        description: "Please enter a value greater than 0.",
        type: 'danger',
        backgroundColor: COLORS.error,
      });
      return;
    }

    router.push({
      pathname: '/confirmTransaction',
      params: { id, amount, recipient },
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
      <Text style={styles.headerTitle}>Enter Amount</Text>
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
        <View style={styles.content}>
          
          {/* Main Input Section */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                    styles.amountInput, 
                    !amount && { color: COLORS.textSecondary } // Grey out if empty
                ]}
                value={amount}
                placeholder="0"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
                onChangeText={(val) => {
                    handlePressNumber();
                    setAmount(val);
                }}
                autoFocus={true}
                selectionColor={COLORS.primary}
              />
              <Text style={styles.currencyLabel}>{token?.symbol || 'NIT'}</Text>
            </View>
            
            {/* Fiat Equivalent (Mock) */}
            <Text style={styles.fiatText}>
                ≈ KES {amount ? (parseFloat(amount) * 1).toFixed(2) : '0.00'}
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
             <TouchableOpacity style={styles.maxButton} onPress={() => {
                 Haptics.selectionAsync();
                 // Logic to set max balance would go here
                 setAmount('500.00'); // Example
             }}>
                 <Text style={styles.maxText}>USE MAX</Text>
             </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View style={{flex: 1}} />

          {/* Warning / Info */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>
              Ensure you have enough ETH for gas fees. Transactions cannot be reversed.
            </Text>
          </View>

          {/* Footer Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.buttonText}>Review</Text>
                <Ionicons name="arrow-forward" size={20} color="#00332a" />
            </TouchableOpacity>
          </View>

        </View>
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

  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  inputWrapper: {
    marginTop: 60,
    alignItems: 'center',
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  amountInput: {
    fontSize: 56,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    minWidth: 60,
    maxWidth: '70%',
  },
  currencyLabel: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 18, // visually align baseline
  },
  fiatText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 8,
    opacity: 0.7,
  },

  quickActions: {
    marginTop: 20,
  },
  maxButton: {
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.3)',
  },
  maxText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 12,
    width: '100%',
  },
  infoText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },

  footer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 24,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#00332a',
    fontSize: 16,
    fontWeight: '700',
  },
});