import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  AppState, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';

import { useAppSelector } from '@/src/store';

const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
};

// ⏱️ Set the timeout here (in milliseconds). 
// 30000 = 30 seconds. (Change to 5000 for quick testing!)
const LOCK_TIMEOUT = 30000; 

export default function GlobalAppLock({ children }: { children: React.ReactNode }) {
  const appState = useRef(AppState.currentState);
  const backgroundTime = useRef<number | null>(null);
  
  const [isLocked, setIsLocked] = useState(false);
  const [blurScreen, setBlurScreen] = useState(false);

  // We only want to lock the app if they actually have a wallet / are logged in
  const { access } = useAppSelector((state: any) => state.walletReducer);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (!access) return; // Don't lock if user is on the welcome/login screen

      // 1. APP GOES TO BACKGROUND OR APP SWITCHER
      if (
        appState.current.match(/active/) && 
        (nextAppState === 'inactive' || nextAppState === 'background')
      ) {
         setBlurScreen(true); // Turn on Privacy Blur immediately
         
         if (nextAppState === 'background') {
             backgroundTime.current = Date.now(); // Start the stopwatch
         }
      }

      // 2. APP RETURNS TO FOREGROUND
      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === 'active'
      ) {
         setBlurScreen(false); // Remove Privacy Blur
         
         if (backgroundTime.current) {
             const timeAway = Date.now() - backgroundTime.current;
             
             // If they were gone longer than the timeout, LOCK THE APP
             if (timeAway > LOCK_TIMEOUT) {
                 setIsLocked(true);
             }
         }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [access]);

  // When locked state triggers, automatically slide up FaceID/PIN
  useEffect(() => {
      if (isLocked) {
          handleUnlock();
      }
  }, [isLocked]);

  const handleUnlock = async () => {
      try {
         const result = await LocalAuthentication.authenticateAsync({
             promptMessage: 'Unlock CoinSafe',
             fallbackLabel: 'Use Passcode',
             disableDeviceFallback: false,
         });

         if (result.success) {
             setIsLocked(false);
             backgroundTime.current = null; // Reset stopwatch
         }
      } catch (e) {
          console.log("Unlock failed or cancelled:", e);
      }
  };

  return (
     <View style={{ flex: 1 }}>
        {/* Render the actual App */}
        {children}

        {/* --- 🛡️ PRIVACY BLUR (App Switcher) --- */}
        {blurScreen && !isLocked && (
            <View style={styles.absoluteFill}>
                <BlurView intensity={100} tint="dark" style={styles.absoluteFill} />
                <View style={styles.blurContent}>
                    <Ionicons name="shield-checkmark" size={60} color={COLORS.primary} />
                </View>
            </View>
        )}

        {/* --- 🔒 FULL SCREEN LOCK OVERLAY --- */}
        {isLocked && (
            <View style={styles.lockedContainer}>
                <Ionicons name="lock-closed" size={80} color={COLORS.primary} style={{ marginBottom: 24 }} />
                <Text style={styles.lockedTitle}>Welcome Back</Text>
                <Text style={styles.lockedText}>CoinSafe was locked for your security.</Text>
                
                <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
                    <Ionicons name="finger-print" size={24} color="#00332a" />
                    <Text style={styles.unlockButtonText}>Unlock App</Text>
                </TouchableOpacity>
            </View>
        )}
     </View>
  )
}

const styles = StyleSheet.create({
  absoluteFill: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 999,
  },
  blurContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(15, 17, 21, 0.4)'
  },
  lockedContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: COLORS.background,
      zIndex: 1000,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
  },
  lockedTitle: {
      color: COLORS.textPrimary,
      fontSize: 28,
      fontWeight: '800',
      marginBottom: 8,
  },
  lockedText: {
      color: COLORS.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 40,
  },
  unlockButton: {
      backgroundColor: COLORS.primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 20,
      gap: 12,
  },
  unlockButtonText: {
      color: '#00332a',
      fontSize: 18,
      fontWeight: '700',
  }
});