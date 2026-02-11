import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useAppDispatch, useAppSelector } from '@/src/store';
import { walletActions } from '@/src/store/walletSlice';
import { trc20TokensActions } from '@/src/store/trc20TokensSlice';

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  error: '#EF4444',
};

export default function LogOut() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { access } = useAppSelector((state) => state.walletReducer);

  // Animation for the warning icon
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  useEffect(() => {
    // 1. Warning Haptics on mount
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    // 2. Pulse Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.8, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Execute Logout Logic
    dispatch(walletActions.resetWallet());
    dispatch(trc20TokensActions.resetAll());
    // Navigation is handled by the useEffect above when 'access' becomes null
  };

  const handleCancel = () => {
    Haptics.selectionAsync();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.content}>
        
        {/* Animated Icon Container */}
        <View style={styles.iconContainer}>
            <Animated.View style={[styles.glowRing, { transform: [{ scale: scaleAnim }] }]} />
            <View style={styles.iconCircle}>
                <Ionicons name="log-out" size={48} color={COLORS.error} style={{marginLeft: 4}} />
            </View>
        </View>

        <Text style={styles.title}>Log Out?</Text>
        
        <Text style={styles.subtitle}>
            Are you sure you want to remove your wallet from this device?
        </Text>

        {/* Warning Card */}
        <View style={styles.warningCard}>
            <Ionicons name="alert-circle" size={24} color={COLORS.error} />
            <Text style={styles.warningText}>
                You will need your <Text style={{fontWeight: '700', color: '#fff'}}>Recovery Phrase</Text> to log back in. If you lost it, your funds will be lost forever.
            </Text>
        </View>

      </View>

      {/* Buttons */}
      <View style={styles.footer}>
        
        {/* Cancel (Primary - Safe Option) */}
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        {/* Logout (Destructive) */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="power" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Yes, Log Out</Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: -40,
  },

  // Icon
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    width: 120,
    height: 120,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    zIndex: 2,
  },
  glowRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.error,
    opacity: 0.2,
    zIndex: 1,
  },

  // Text
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },

  // Warning Card
  warningCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },

  // Footer Buttons
  footer: {
    padding: 24,
    width: '100%',
    gap: 16,
  },
  
  cancelButton: {
    backgroundColor: COLORS.surface,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    borderRadius: 20,
    gap: 8,
    // No background, just red text/border usually, or full red background for emphasis.
    // Let's go subtle border to not encourage clicking it.
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '700',
  },
});