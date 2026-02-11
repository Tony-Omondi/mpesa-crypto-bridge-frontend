import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Share,
  StatusBar,
  Dimensions
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { showMessage } from 'react-native-flash-message';

import { useAppSelector } from '@/src/store';

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  warning: '#F59E0B',
};

const { width } = Dimensions.get('window');

export default function MyAddress() {
  const router = useRouter();
  const { walletAddress, access } = useAppSelector((state) => state.walletReducer);

  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const copyToClipboard = async () => {
    Haptics.selectionAsync();
    await Clipboard.setStringAsync(walletAddress || '');
    showMessage({
      message: 'Copied',
      description: 'Address copied to clipboard',
      type: 'success',
      backgroundColor: COLORS.primary,
      icon: 'success',
    });
  };

  const shareAddress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: walletAddress || '',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Receive Assets</Text>
      <View style={{ width: 40 }} /> 
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Network Warning Pill */}
        <View style={styles.networkPill}>
            <View style={styles.dot} />
            <Text style={styles.networkText}>Arbitrum Sepolia Network</Text>
        </View>

        <Text style={styles.instructionText}>
            Scan this code to deposit funds
        </Text>

        {/* QR Code Card */}
        <View style={styles.qrCard}>
            <View style={styles.qrContainer}>
                <QRCode
                    value={walletAddress || '0x'}
                    size={width * 0.6}
                    color="black"
                    backgroundColor="white"
                />
            </View>
        </View>

        {/* Address Container */}
        <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Your Address</Text>
            <View style={styles.addressBox}>
                <Text style={styles.addressText}>{walletAddress}</Text>
            </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
                <View style={styles.iconCircle}>
                    <Ionicons name="copy-outline" size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.actionText}>Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={shareAddress}>
                <View style={styles.iconCircle}>
                    <Ionicons name="share-social-outline" size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
        </View>

        {/* Warning Footer */}
        <View style={styles.warningBox}>
            <Ionicons name="alert-circle-outline" size={20} color={COLORS.warning} />
            <Text style={styles.warningText}>
                Send only supported assets to this address. Sending other tokens may result in permanent loss.
            </Text>
        </View>

      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // Network Pill
  networkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.2)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  networkText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  instructionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 24,
  },

  // QR Card
  qrCard: {
    padding: 20,
    backgroundColor: '#FFF', // White bg for best QR contrast
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 30,
  },
  qrContainer: {
    overflow: 'hidden',
  },

  // Address Box
  addressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  addressLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addressBox: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
  },
  addressText: {
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'monospace', // Monospace for addresses
    lineHeight: 20,
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 40,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Warning Footer
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  warningText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});