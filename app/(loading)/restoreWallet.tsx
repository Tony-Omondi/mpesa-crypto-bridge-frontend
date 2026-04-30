
import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Animated,
  Easing
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';
import { ethers } from 'ethers';

import { URLS, BASE_URL } from '@/src/config';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { walletActions } from '@/src/store/walletSlice';
import { savePrivateKey, saveMnemonic } from '@/src/utils/secureStorage';

const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
};

export default function RestoreWallet() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mnemonic } = useLocalSearchParams<{ mnemonic: string }>();
  const { access } = useAppSelector((state) => state.walletReducer);

  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Validating mnemonic...",
    "Deriving private keys...",
    "Authenticating with server...",
    "Restoring assets..."
  ];

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (access) {
      router.replace('/(tabs)/home');
      return;
    }

    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ])
    ).start();

    if (mnemonic) {
      handleRestore();
    } else {
      router.replace('/(auth)/welcome');
    }
  }, [mnemonic]);

  const handleRestore = async () => {
    try {
      // ── Step 1: Derive wallet from mnemonic ──────────────────────
      setCurrentStep(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // plain axios — no auth token needed here
      const response = await axios.post(URLS.RESTORE_WALLET, { mnemonic });
      const data = response.data;

      if (!data.address || !data.privateKey) {
        throw new Error("Could not derive wallet from mnemonic.");
      }

      // ── Step 2: Save sensitive data to SecureStore ────────────────
      setCurrentStep(1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await savePrivateKey(data.privateKey);
      await saveMnemonic(data.mnemonic.phrase);

      // ── Step 3: Web3 Login — prove ownership via signature ────────
      setCurrentStep(2);
      console.log("🔐 Starting Web3 login for:", data.address);

      // 3a. Request nonce from Django
      const nonceResponse = await axios.get(
        `${BASE_URL}/api/auth/request-nonce/?address=${data.address}`
      );
      const { message } = nonceResponse.data;
      console.log("📝 Nonce received:", message);

      // 3b. Sign message locally — private key never leaves device
      const ethWallet = new ethers.Wallet(data.privateKey);
      const signature = await ethWallet.signMessage(message);
      console.log("✅ Message signed locally");

      // 3c. Send signature → receive JWT
      const authResponse = await axios.post(
        `${BASE_URL}/api/auth/verify-signature/`,
        { address: data.address, signature }
      );

      // ── Step 4: Save JWT + address to Redux ───────────────────────
      setCurrentStep(3);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      dispatch(walletActions.setAuthToken(authResponse.data.access));
      dispatch(walletActions.setRefreshToken(authResponse.data.refresh));
      dispatch(walletActions.setWalletAddress(data.address));

      showMessage({
        message: 'Wallet Restored!',
        description: 'Welcome back to your secure vault.',
        type: 'success',
        backgroundColor: COLORS.primary,
      });

      router.replace('/(tabs)/home');

    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error("❌ Restore Error:", error.response?.data || error.message);

      const errMsg = error.response?.data?.error || error.message;

      if (errMsg?.includes('No account found')) {
        showMessage({
          message: 'Wallet Not Registered',
          description: 'This wallet has no account here. Please create a new one.',
          type: 'warning',
          backgroundColor: '#F59E0B',
          duration: 5000,
        });
      } else {
        showMessage({
          message: 'Restore Failed',
          description: errMsg || 'Check your mnemonic phrase and try again.',
          type: 'danger',
          backgroundColor: '#EF4444',
        });
      }

      router.replace('/(auth)/welcome');
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <View style={styles.animationWrapper}>
          <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
          <Animated.View style={[styles.rotatingRing, { transform: [{ rotate: spin }] }]} />
          <View style={styles.centerIcon}>
            <Ionicons name="cloud-download-outline" size={40} color={COLORS.primary} />
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.title}>Recovering Account</Text>
          <Text style={styles.subtitle}>{steps[currentStep]}</Text>
        </View>

        <View style={styles.progressTrack}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSegment,
                currentStep >= i
                  ? { backgroundColor: COLORS.primary }
                  : { backgroundColor: COLORS.border }
              ]}
            />
          ))}
        </View>

        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 40 }} />
      </View>

      <View style={styles.footer}>
        <Ionicons name="finger-print-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.footerText}>Cryptographic Verification Active</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  animationWrapper: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  pulseCircle: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, opacity: 0.1 },
  rotatingRing: { position: 'absolute', width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed', opacity: 0.3 },
  centerIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statusContainer: { alignItems: 'center', gap: 10 },
  title: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: COLORS.textSecondary, fontSize: 15, textAlign: 'center', height: 20 },
  progressTrack: { flexDirection: 'row', width: 160, height: 4, gap: 6, marginTop: 30 },
  progressSegment: { flex: 1, height: '100%', borderRadius: 2 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingBottom: 40 },
  footerText: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '700', opacity: 0.4, textTransform: 'uppercase', letterSpacing: 1.2 },
});
