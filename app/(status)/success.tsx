import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Easing,
  StatusBar,
  Linking 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useAppDispatch, useAppSelector } from '@/src/store';
import { trc20TokensActions } from '@/src/store/trc20TokensSlice';

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
};

export default function TransactionSuccess() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id, recipient, amount } = useLocalSearchParams();

  // --- ANIMATION VALUES ---
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- DATA SELECTORS ---
  const { list, trxData } = useAppSelector((state) => state.trc20TokensReducer);
  
  // Resolve Token Data
  let token = list.find((t) => t.id === id) || null;
  if (id === 'tron') {
    token = trxData;
  }
  const symbol = token?.symbol?.toUpperCase() || 'NIT';

  useEffect(() => {
    // 1. Trigger Haptics
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // 2. Reset Balances (Your logic)
    dispatch(trc20TokensActions.resetBalancesUpdateInterval());

    // 3. Play Animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

  }, []);

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.content}>
        
        {/* ANIMATED SUCCESS ICON */}
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.glowRing} />
          <Ionicons name="checkmark-circle" size={100} color={COLORS.primary} />
        </Animated.View>

        {/* TEXT DETAILS */}
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center', width: '100%' }}>
            
            <Text style={styles.title}>Transfer Successful!</Text>
            
            <Text style={styles.amountText}>
              - {amount} <Text style={styles.symbol}>{symbol}</Text>
            </Text>

            {/* RECIPIENT PILL */}
            <View style={styles.recipientContainer}>
                <Text style={styles.recipientLabel}>Sent to</Text>
                <View style={styles.addressPill}>
                    <Ionicons name="wallet-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.addressText}>
                        {typeof recipient === 'string' 
                            ? `${recipient.slice(0, 8)}...${recipient.slice(-6)}` 
                            : 'Unknown'}
                    </Text>
                </View>
            </View>

            {/* BLOCK EXPLORER LINK */}
            <TouchableOpacity 
                style={styles.explorerLink}
                onPress={() => Linking.openURL('https://arbiscan.io')} // Update to your explorer
            >
                <Text style={styles.explorerText}>View on Block Explorer</Text>
                <Ionicons name="open-outline" size={14} color={COLORS.primary} />
            </TouchableOpacity>

        </Animated.View>

      </View>

      {/* FOOTER BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.buttonText}>Done</Text>
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
    marginTop: -40, // Visual centering balance
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
    backgroundColor: COLORS.primary,
    opacity: 0.15, // Subtle glow behind checkmark
  },

  // Typography
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  amountText: {
    color: COLORS.textPrimary, // White looks cleaner than red for "Success"
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 32,
  },
  symbol: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '600',
  },

  // Recipient Pill
  recipientContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  recipientLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addressText: {
    color: COLORS.textPrimary,
    fontFamily: 'monospace', // Or Platform.OS === 'ios' ? 'Menlo' : 'monospace'
    fontWeight: '600',
  },

  // Explorer Link
  explorerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.8,
  },
  explorerText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Footer
  footer: {
    padding: 24,
    width: '100%',
  },
  doneButton: {
    backgroundColor: COLORS.surface, // Secondary style button for "Done"
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});