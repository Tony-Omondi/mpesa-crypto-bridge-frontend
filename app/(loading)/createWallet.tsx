import React, { useEffect, useState, useRef } from 'react';
import { 
  Text, 
  View, 
  ActivityIndicator, 
  StyleSheet, 
  StatusBar, 
  Animated, 
  Easing 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { showMessage } from 'react-native-flash-message';
import axios from 'axios';

import { URLS } from '@/src/config';
import { useAppDispatch } from '@/src/store';
import { walletActions } from '@/src/store/walletSlice';

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
};

export default function CreateWallet() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // UX State: Show what the app is currently doing
  const [loadingStep, setLoadingStep] = useState(0);
  const steps = [
    "Generating cryptographic keys...",
    "Securing mnemonic phrase...",
    "Finalizing your vault...",
    "Almost there..."
  ];

  // Animation Values
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start Pulsing Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    if (!URLS.REGISTER) {
      console.error("Critical Error: URLS.REGISTER is undefined.");
      return;
    }
    setupNewAccount();
  }, []);

  const setupNewAccount = async () => {
    try {
      // Step 1: Logic Start
      setLoadingStep(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const walletResponse = await axios.get(URLS.CREATE_WALLET);
      const { address, privateKey, mnemonic } = walletResponse.data;
      const finalPhrase = typeof mnemonic === 'object' ? mnemonic.phrase : mnemonic;

      // Step 2: Intermediate
      setLoadingStep(1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const randomSuffix = Math.floor(1000000 + Math.random() * 9000000); 
      const uniqueTestPhone = `2547${randomSuffix}`;

      // Step 3: Registration
      setLoadingStep(2);
      const authResponse = await axios.post(URLS.REGISTER, {
        phone_number: uniqueTestPhone,
        password: "secure_password_123", 
        wallet_address: address, 
      });

      if (authResponse.data.status === "Account Created") {
        setLoadingStep(3);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Save to Redux
        dispatch(walletActions.setAuthToken(authResponse.data.token)); 
        dispatch(walletActions.setWalletAddress(address));
        dispatch(walletActions.setMnemonicPhrase(finalPhrase)); 
        dispatch(walletActions.setPrivateKey(privateKey));

        // Redirect
        setTimeout(() => {
            router.replace({
              pathname: '/(auth)/backupWallet',
              params: { phrase: finalPhrase }
            });
        }, 1500);
      }
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const errorDetail = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      
      showMessage({
        message: 'Setup Failed',
        description: 'We encountered an error creating your vault.',
        type: 'danger',
        backgroundColor: '#EF4444',
      });
      setTimeout(() => router.replace('/(auth)/welcome'), 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        {/* Pulsing Shield Icon */}
        <Animated.View style={[styles.iconWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.glow} />
          <Ionicons name="shield-checkmark" size={80} color={COLORS.primary} />
        </Animated.View>

        {/* Dynamic Text Section */}
        <View style={styles.textSection}>
            <Text style={styles.title}>Creating Wallet</Text>
            <Text style={styles.subtitle}>{steps[loadingStep]}</Text>
        </View>

        {/* Progress Dots */}
        <View style={styles.progressRow}>
            {steps.map((_, i) => (
                <View 
                    key={i} 
                    style={[
                        styles.dot, 
                        loadingStep === i ? styles.activeDot : (loadingStep > i ? styles.completedDot : styles.inactiveDot)
                    ]} 
                />
            ))}
        </View>

        {/* Traditional Indicator as secondary */}
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 40 }} />
      </View>

      <View style={styles.footer}>
        <Ionicons name="lock-closed-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.footerText}>AES-256 Bit Encryption</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  glow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
  },

  textSection: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    height: 20, // Prevents layout jump when text changes
  },

  progressRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 30,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  inactiveDot: {
    width: 12,
    backgroundColor: COLORS.border,
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  completedDot: {
    width: 12,
    backgroundColor: COLORS.primary,
    opacity: 0.5,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 40,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});