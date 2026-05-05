/**
 * /(auth)/setPin.tsx
 *
 * Shown ONCE after a user's first login via Privy.
 * They set a 4-digit transaction PIN here.
 *
 * This PIN is required before every outgoing payment — like M-Pesa.
 * Even if someone steals the JWT, they still can't send money without the PIN.
 *
 * After PIN is saved → go to Home.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { showMessage } from 'react-native-flash-message';

import { useAppSelector } from '@/src/store';

const { width } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  error: '#EF4444',
};

export default function SetPin() {
  const router = useRouter();
  const { access } = useAppSelector((state) => state.walletReducer);

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'set' | 'confirm'>('set');
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const handleDigit = (digit: string) => {
    Haptics.selectionAsync();
    if (step === 'set') {
      if (pin.length < 4) {
        const newPin = pin + digit;
        setPin(newPin);
        if (newPin.length === 4) {
          // Move to confirm step after short delay
          setTimeout(() => setStep('confirm'), 300);
        }
      }
    } else {
      if (confirmPin.length < 4) {
        const newConfirm = confirmPin + digit;
        setConfirmPin(newConfirm);
        if (newConfirm.length === 4) {
          setTimeout(() => handleSubmit(newConfirm), 300);
        }
      }
    }
  };

  const handleDelete = () => {
    Haptics.selectionAsync();
    if (step === 'set') {
      setPin((prev) => prev.slice(0, -1));
    } else {
      setConfirmPin((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = async (finalConfirm: string) => {
    if (pin !== finalConfirm) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showMessage({
        message: 'PINs do not match',
        description: 'Please try again.',
        type: 'danger',
        backgroundColor: COLORS.error,
      });
      setPin('');
      setConfirmPin('');
      setStep('set');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/set-pin/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Could not save PIN.');
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showMessage({
        message: 'PIN Set!',
        description: 'Your transaction PIN has been saved.',
        type: 'success',
        backgroundColor: COLORS.primary,
      });

      router.replace('/(tabs)/home');

    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showMessage({
        message: 'Error',
        description: err.message,
        type: 'danger',
        backgroundColor: COLORS.error,
      });
      setPin('');
      setConfirmPin('');
      setStep('set');
    } finally {
      setLoading(false);
    }
  };

  const currentPin = step === 'set' ? pin : confirmPin;

  const KEYS = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'del'],
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="lock-closed-outline" size={32} color={COLORS.primary} />
        </View>

        {/* Heading */}
        <Text style={styles.title}>
          {step === 'set' ? 'Create Transaction PIN' : 'Confirm PIN'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'set'
            ? 'This PIN protects every payment you make.\nKeep it secret — like your M-Pesa PIN.'
            : 'Enter your PIN again to confirm.'}
        </Text>

        {/* PIN dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.pinDot,
                i < currentPin.length ? styles.pinDotFilled : styles.pinDotEmpty,
              ]}
            />
          ))}
        </View>

        {/* Numpad */}
        <View style={styles.numpad}>
          {KEYS.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.numpadRow}>
              {row.map((key, keyIdx) => {
                if (key === '') return <View key={keyIdx} style={styles.numpadKey} />;

                if (key === 'del') {
                  return (
                    <TouchableOpacity
                      key={keyIdx}
                      style={styles.numpadKey}
                      onPress={handleDelete}
                      activeOpacity={0.6}
                    >
                      <Ionicons name="backspace-outline" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                  );
                }

                return (
                  <TouchableOpacity
                    key={keyIdx}
                    style={styles.numpadKey}
                    onPress={() => handleDigit(key)}
                    activeOpacity={0.6}
                    disabled={loading}
                  >
                    <Text style={styles.numpadKeyText}>{key}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Security note */}
        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.securityNoteText}>
            Your PIN is encrypted and never stored in plain text.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const KEY_SIZE = width * 0.22;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 8,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  pinDotFilled: {
    backgroundColor: COLORS.primary,
  },
  pinDotEmpty: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  numpad: {
    gap: 12,
    marginTop: 8,
  },
  numpadRow: {
    flexDirection: 'row',
    gap: 12,
  },
  numpadKey: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    borderRadius: KEY_SIZE / 2,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numpadKeyText: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.6,
    marginTop: 8,
  },
  securityNoteText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});