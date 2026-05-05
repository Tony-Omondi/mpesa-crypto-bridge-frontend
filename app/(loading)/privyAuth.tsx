/**
 * /(loading)/privyAuth.tsx
 *
 * This screen fires immediately after Privy login succeeds on Welcome.tsx.
 * It's the bridge between Privy (frontend identity) and Django (backend JWT).
 *
 * Flow:
 *   1. Get Privy access token (proves user is authenticated with Privy)
 *   2. Get the embedded wallet address Privy created for this user
 *   3. POST both to our Django /api/auth/privy/ endpoint
 *   4. Django verifies with Privy's API, issues our own JWT
 *   5. Store JWT in Redux + SecureStore
 *   6. If first login → go to SetPin screen
 *      If returning user → go to Home
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePrivy, useEmbeddedWallet } from '@privy-io/expo';
import { useAppDispatch } from '@/src/store';
import { setTokens, setWalletAddress } from '@/src/store/walletSlice';
import { saveToSecureStorage } from '@/src/utils/secureStorage';

// ✅ Pull from your central config — when your ngrok URL changes or you go
// to production, you only ever update ONE file: config.ts
import { URLS } from '@/src/config';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  error: '#EF4444',
};

type Step =
  | 'Verifying your identity...'
  | 'Setting up your wallet...'
  | 'Securing your account...'
  | 'Almost done...';

const STEPS: Step[] = [
  'Verifying your identity...',
  'Setting up your wallet...',
  'Securing your account...',
  'Almost done...',
];

export default function PrivyAuthLoading() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { getAccessToken, user } = usePrivy();
  const embeddedWallet = useEmbeddedWallet();

  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, 1200);

    authenticate();

    return () => clearInterval(interval);
  }, []);

  const authenticate = async () => {
    try {
      // ── Step 1: Get Privy access token ──────────────────────────────────
      const privyToken = await getAccessToken();
      if (!privyToken) {
        throw new Error('Could not get Privy token. Please try again.');
      }

      // ── Step 2: Get embedded wallet address ─────────────────────────────
      const walletAddress = embeddedWallet?.address ?? '';

      // Pull phone from Privy's linked accounts if available
      const linkedPhone = user?.linked_accounts?.find(
        (a: any) => a.type === 'phone'
      );
      const phoneNumber = linkedPhone?.number ?? '';

      // ── Step 3: Call our Django backend ─────────────────────────────────
      // ✅ URLS.PRIVY_AUTH = `${BASE_URL}/api/auth/privy/`
      // No hardcoded URLs — lives in config.ts
      const response = await fetch(URLS.PRIVY_AUTH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privy_token: privyToken,
          wallet_address: walletAddress,
          phone_number: phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Authentication failed. Please try again.');
      }

      // ── Step 4: Persist JWT + wallet address ────────────────────────────
      dispatch(setTokens({
        access: data.access,
        refresh: data.refresh,
      }));
      dispatch(setWalletAddress(data.wallet_address));

      await saveToSecureStorage('accessToken', data.access);
      await saveToSecureStorage('refreshToken', data.refresh);

      // ── Step 5: Route based on whether this is a new user ────────────────
      if (data.is_new_user || !data.has_transaction_pin) {
        // First time — must set transaction PIN before using the app
        router.replace('/(auth)/setPin');
      } else {
        // Returning user — go straight home
        router.replace('/(tabs)/home');
      }

    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    }
  };

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorBox}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Login Failed</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Text
            style={styles.retryText}
            onPress={() => router.replace('/(auth)/welcome')}
          >
            Go back and try again
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Loading state ────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <View style={styles.spinnerRing} />
        </View>

        <Text style={styles.stepText}>{STEPS[stepIndex]}</Text>
        <Text style={styles.subText}>Setting up your secure wallet</Text>

        <View style={styles.dotsRow}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i <= stepIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 40,
  },
  spinnerContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  spinnerRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  stepText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
  },
  dotInactive: {
    backgroundColor: COLORS.surface,
  },
  errorBox: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 48,
  },
  errorTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  errorText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
});