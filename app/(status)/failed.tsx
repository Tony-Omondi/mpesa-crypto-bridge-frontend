import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  StatusBar 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  error: '#EF4444',      // Red
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
};

export default function TransactionFailed() {
  const router = useRouter();
  const { reason } = useLocalSearchParams(); // Optional: Pass a reason string

  // Animation Values
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Error Haptics
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // 2. Shake Animation Sequence
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRetry = () => {
    Haptics.selectionAsync();
    router.back(); // Go back to Confirm or Enter Amount
  };

  const handleHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.content}>
        
        {/* ANIMATED ERROR ICON */}
        <Animated.View style={[
            styles.iconContainer, 
            { transform: [{ translateX: shakeAnim }] }
        ]}>
            <View style={styles.glowRing} />
            <Ionicons name="alert-circle" size={100} color={COLORS.error} />
        </Animated.View>

        {/* TEXT CONTENT */}
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', width: '100%' }}>
            
            <Text style={styles.title}>Transaction Failed</Text>
            
            <Text style={styles.description}>
                Something went wrong with your transfer. No funds were deducted.
            </Text>

            {/* ERROR REASON CARD */}
            <View style={styles.errorCard}>
                <Ionicons name="bug-outline" size={16} color={COLORS.error} />
                <Text style={styles.errorText}>
                    {reason ? String(reason) : "Network timeout or insufficient gas."}
                </Text>
            </View>

        </Animated.View>

      </View>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        
        {/* Primary Action: Retry */}
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>

        {/* Secondary Action: Home */}
        <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
            <Text style={styles.homeText}>Back to Home</Text>
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
    marginBottom: 30,
  },
  glowRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.error,
    opacity: 0.15, // Red glow
  },

  // Typography
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
  },

  // Error Card
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // Tinted Red
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
  },

  // Footer
  footer: {
    padding: 24,
    width: '100%',
    gap: 12,
  },
  
  // Retry Button (Primary)
  retryButton: {
    backgroundColor: COLORS.error,
    height: 56,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Home Button (Secondary)
  homeButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    // Transparent background for secondary action
  },
  homeText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
});