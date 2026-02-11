import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useAppSelector, useAppDispatch } from '@/src/store';
import { trc20TokensActions } from '@/src/store/trc20TokensSlice';

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  activeBorder: '#00D09C',
  warning: '#F59E0B',
};

const NETWORKS = [
  {
    id: 'arbitrum-one',
    name: 'Arbitrum One',
    type: 'MAINNET',
    description: 'The main Arbitrum network. Use this for real transactions with real value.',
    color: '#00D09C',
  },
  {
    id: 'arbitrum-sepolia',
    name: 'Arbitrum Sepolia',
    type: 'TESTNET',
    description: 'A test environment. Tokens here have no real value. Used for development.',
    color: '#F59E0B',
  },
];

export default function NetworkSettings() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Redux state
  const { network } = useAppSelector((state) => state.trc20TokensReducer);
  const { access } = useAppSelector((state) => state.walletReducer);

  // Local state for selection before confirming
  // Default to sepolia if network is 'nile' (old tron data) or empty
  const [selectedNetwork, setSelectedNetwork] = useState(
    network === 'nile' || network === 'arbitrum-sepolia' ? 'arbitrum-sepolia' : 'arbitrum-one'
  );

  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const handleSelect = (netId: string) => {
    Haptics.selectionAsync();
    setSelectedNetwork(netId);
  };

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(trc20TokensActions.setNetwork(selectedNetwork));
    router.replace('/(tabs)/home');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Network Settings</Text>
      <View style={{ width: 40 }} /> 
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={styles.sectionTitle}>Select Network</Text>

        {NETWORKS.map((item) => {
          const isActive = selectedNetwork === item.id;
          
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.networkCard,
                isActive && styles.activeCard
              ]}
              onPress={() => handleSelect(item.id)}
              activeOpacity={0.9}
            >
              {/* Header Row: Name & Badge */}
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                    <Ionicons 
                        name="cube-outline" 
                        size={20} 
                        color={isActive ? COLORS.primary : COLORS.textSecondary} 
                    />
                    <Text style={[styles.networkName, isActive && { color: COLORS.primary }]}>
                        {item.name}
                    </Text>
                </View>
                
                {/* Badge */}
                <View style={[styles.badge, { backgroundColor: `${item.color}20` }]}>
                    <Text style={[styles.badgeText, { color: item.color }]}>
                        {item.type}
                    </Text>
                </View>
              </View>

              {/* Description */}
              <Text style={styles.description}>
                {item.description}
              </Text>

              {/* Radio Button Indicator */}
              <View style={styles.radioContainer}>
                <View style={[
                    styles.radioOuter, 
                    isActive && { borderColor: COLORS.primary }
                ]}>
                    {isActive && <View style={styles.radioInner} />}
                </View>
              </View>

            </TouchableOpacity>
          );
        })}

        {/* Info Note */}
        <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>
                Changing networks will update your balance display and transaction history.
            </Text>
        </View>

      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Switch Network</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },

  content: {
    padding: 24,
    paddingBottom: 100,
  },

  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Network Card
  networkCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  activeCard: {
    borderColor: COLORS.activeBorder,
    backgroundColor: 'rgba(0, 208, 156, 0.05)', // Very subtle green tint
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  networkName: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    paddingRight: 30, // Make space for radio
    opacity: 0.8,
  },

  // Radio Button
  radioContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: COLORS.background,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#00332a',
    fontSize: 16,
    fontWeight: '700',
  },
});