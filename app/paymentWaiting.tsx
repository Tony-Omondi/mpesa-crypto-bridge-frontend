import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import apiClient from '@/src/utils/apiClient';
import { URLS } from '@/src/config';

const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
};

type PaymentState = 'waiting' | 'success' | 'failed' | 'timeout';

export default function PaymentWaiting() {
  const router = useRouter();
  const { order_id, amount } = useLocalSearchParams<{ order_id: string; amount: string }>();

  const [state, setState] = useState<PaymentState>('waiting');
  const [statusMsg, setStatusMsg] = useState('Waiting for payment confirmation...');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MAX_WAIT = 120; // 2 minutes timeout

  useEffect(() => {
    // Start pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Start polling every 4 seconds
    startPolling();

    // Timeout after 2 minutes
    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setState('timeout');
      setStatusMsg('Payment timed out. If you paid, tokens will arrive shortly.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }, MAX_WAIT * 1000);

    return () => {
      stopPolling();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Elapsed counter
  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const startPolling = () => {
    intervalRef.current = setInterval(pollStatus, 4000);
  };

  const stopPolling = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const pollStatus = async () => {
    try {
      const res = await apiClient.get(URLS.PAYMENT_STATUS(Number(order_id)));
      const { status, tx_hash } = res.data;

      console.log(`📊 Order ${order_id} status: ${status}`);

      if (status === 'PENDING') {
        setStatusMsg('Waiting for M-Pesa confirmation...');
      } else if (status === 'PAID') {
        setStatusMsg('Payment confirmed! Minting your tokens...');
      } else if (status === 'COMPLETED') {
        stopPolling();
        setTxHash(tx_hash);
        setState('success');
        setStatusMsg(`${amount} NIT tokens added to your wallet!`);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Auto-redirect after 3 seconds
        setTimeout(() => router.replace('/(tabs)/home'), 3000);
      } else if (status === 'FAILED') {
        stopPolling();
        setState('failed');
        setStatusMsg('Payment was cancelled or failed.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (status === 'PAID_BUT_FAILED') {
        stopPolling();
        setState('failed');
        setStatusMsg('Payment received but token minting failed. Our team has been notified and will resolve this.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      console.error('❌ Poll error:', error);
    }
  };

  const renderWaiting = () => (
    <View style={styles.centerContent}>
      <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
      <View style={styles.iconCircle}>
        <Ionicons name="phone-portrait-outline" size={48} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>Check Your Phone</Text>
      <Text style={styles.subtitle}>{statusMsg}</Text>
      <View style={styles.amountBadge}>
        <Text style={styles.amountText}>KES {amount}</Text>
      </View>
      <Text style={styles.timerText}>
        {elapsed < MAX_WAIT
          ? `Waiting... ${MAX_WAIT - elapsed}s remaining`
          : 'Timed out'}
      </Text>
      <View style={styles.stepsContainer}>
        {[
          { icon: 'phone-portrait-outline', label: 'Enter M-Pesa PIN' },
          { icon: 'checkmark-circle-outline', label: 'Payment confirmed' },
          { icon: 'cube-outline', label: 'Tokens minted to wallet' },
        ].map((step, i) => (
          <View key={i} style={styles.step}>
            <Ionicons name={step.icon as any} size={16} color={COLORS.textSecondary} />
            <Text style={styles.stepText}>{step.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.centerContent}>
      <View style={[styles.iconCircle, { backgroundColor: `${COLORS.success}20`, borderColor: COLORS.success }]}>
        <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
      </View>
      <Text style={[styles.title, { color: COLORS.success }]}>Payment Successful!</Text>
      <Text style={styles.subtitle}>{statusMsg}</Text>
      {txHash && (
        <View style={styles.hashBadge}>
          <Ionicons name="link-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.hashText}>{txHash.substring(0, 20)}...</Text>
        </View>
      )}
      <Text style={styles.redirectText}>Redirecting to home...</Text>
    </View>
  );

  const renderFailed = () => (
    <View style={styles.centerContent}>
      <View style={[styles.iconCircle, { backgroundColor: `${COLORS.error}20`, borderColor: COLORS.error }]}>
        <Ionicons name="close-circle" size={64} color={COLORS.error} />
      </View>
      <Text style={[styles.title, { color: COLORS.error }]}>
        {state === 'timeout' ? 'Payment Timed Out' : 'Payment Failed'}
      </Text>
      <Text style={styles.subtitle}>{statusMsg}</Text>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.replace('/(tabs)/home')}
      >
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Status</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {state === 'waiting' && renderWaiting()}
        {state === 'success' && renderSuccess()}
        {(state === 'failed' || state === 'timeout') && renderFailed()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  centerContent: { alignItems: 'center', gap: 16 },
  pulseRing: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: `${COLORS.primary}10`, borderWidth: 1, borderColor: `${COLORS.primary}30` },
  iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: `${COLORS.primary}15`, borderWidth: 2, borderColor: `${COLORS.primary}40`, justifyContent: 'center', alignItems: 'center' },
  title: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: 8 },
  subtitle: { color: COLORS.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22, paddingHorizontal: 16 },
  amountBadge: { backgroundColor: COLORS.surface, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  amountText: { color: COLORS.primary, fontSize: 22, fontWeight: '800' },
  timerText: { color: COLORS.textSecondary, fontSize: 13, opacity: 0.6 },
  stepsContainer: { gap: 12, marginTop: 8, width: '100%', paddingHorizontal: 16 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.surface, padding: 12, borderRadius: 12 },
  stepText: { color: COLORS.textSecondary, fontSize: 14 },
  hashBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  hashText: { color: COLORS.textSecondary, fontSize: 13, fontFamily: 'monospace' },
  redirectText: { color: COLORS.textSecondary, fontSize: 13, opacity: 0.6 },
  homeButton: { backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 20, marginTop: 8 },
  homeButtonText: { color: '#00332a', fontSize: 16, fontWeight: '700' },
});