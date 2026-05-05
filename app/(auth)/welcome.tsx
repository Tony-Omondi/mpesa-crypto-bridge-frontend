import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { usePrivy } from '@privy-io/expo';

import { useAppSelector } from '@/src/store';

const { width, height } = Dimensions.get('window');

const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
};

export default function Welcome() {
  const router = useRouter();
  const { access } = useAppSelector((state) => state.walletReducer);

  // ── Privy SDK ──────────────────────────────────────────────────────────────
  // `login` opens the Privy modal (Email / Google / Apple)
  // `ready` is false until Privy has initialised — we disable the button until then
  // `authenticated` is true if the user is already logged into Privy
  const { login, ready, authenticated } = usePrivy();

  // ── If user already has a valid JWT in Redux, skip straight to home ────────
  useEffect(() => {
    if (access) {
      router.replace('/(tabs)/home');
    }
  }, [access]);

  // ── If Privy session is still active (e.g. app reopen), go to loading ──────
  // The loading screen will verify with our backend and issue a fresh JWT
  useEffect(() => {
    if (ready && authenticated) {
      router.replace('/(loading)/privyAuth');
    }
  }, [ready, authenticated]);

  const handleGetStarted = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      // Opens the Privy sheet: Email / Google / Apple / SMS
      // On success, `authenticated` becomes true → useEffect above fires
      await login();
    } catch (e) {
      // User dismissed the sheet — do nothing
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Decorative Glow */}
      <View style={styles.glow} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          {/* Animation */}
          <View style={styles.logoContainer}>
            <LottieView
              source={require('../../assets/animations/welcome2.json')}
              autoPlay
              loop
              style={styles.logo}
            />
          </View>

          {/* Text */}
          <View style={styles.textSection}>
            <Text style={styles.title}>
              Welcome to <Text style={{ color: COLORS.primary }}>NiToken</Text>
            </Text>
            <Text style={styles.subtitle}>
              The safest way to send and receive money. No seed phrases. No crypto
              knowledge needed. Just sign in and go.
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.footer}>

          {/* ── PRIMARY: Get Started via Privy ─────────────────────────────── */}
          {/* This single button replaces the old "Create New Wallet" +         */}
          {/* "I already have a wallet" buttons. Privy handles both cases        */}
          {/* automatically — new users get a fresh wallet, returning users      */}
          {/* get their wallet restored. Mama mboga never sees a seed phrase.   */}
          <TouchableOpacity
            style={[styles.primaryBtn, !ready && styles.disabledBtn]}
            activeOpacity={0.8}
            onPress={handleGetStarted}
            disabled={!ready}
          >
            {!ready ? (
              <ActivityIndicator color="#00332a" />
            ) : (
              <>
                <Text style={styles.primaryBtnText}>Get Started</Text>
                <Ionicons name="arrow-forward-circle-outline" size={22} color="#00332a" />
              </>
            )}
          </TouchableOpacity>

          {/* Login methods hint */}
          <View style={styles.loginMethodsRow}>
            <Ionicons name="mail-outline" size={16} color={COLORS.textSecondary} />
            <Ionicons name="logo-google" size={16} color={COLORS.textSecondary} />
            <Ionicons name="logo-apple" size={16} color={COLORS.textSecondary} />
            <Text style={styles.loginMethodsText}>
              Continue with Email, Google, or Apple
            </Text>
          </View>

          <Text style={styles.legalText}>
            By continuing, you agree to our Terms and Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  glow: {
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: COLORS.primary,
    opacity: 0.05,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoContainer: {
    marginBottom: 40,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  },
  textSection: {
    alignItems: 'center',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  footer: {
    width: '100%',
    gap: 16,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  primaryBtnText: {
    color: '#00332a',
    fontSize: 18,
    fontWeight: '700',
  },
  loginMethodsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loginMethodsText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  legalText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 8,
  },
});