import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Platform 
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useAppSelector } from '@/src/store';

const { width } = Dimensions.get('window');

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  error: '#EF4444',
  warning: '#F59E0B',
};

export default function BackupWallet() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phrase: string }>();
  
  const reduxMnemonic = useAppSelector((state) => state.walletReducer.mnemonicPhrase);
  const mnemonic = params.phrase || reduxMnemonic; 

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (mnemonic) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await Clipboard.setStringAsync(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(tabs)/home');
  };

  const words = mnemonic ? mnemonic.split(' ') : [];

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Secure Your Vault</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      {renderHeader()}
      
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Security Alert Card */}
        <View style={styles.alertCard}>
          <Ionicons name="shield-half" size={24} color={COLORS.warning} />
          <View style={styles.alertTextContent}>
            <Text style={styles.alertTitle}>Crucial Security Step</Text>
            <Text style={styles.alertDescription}>
              Write these 12 words on paper. It is the <Text style={styles.boldError}>only way</Text> to recover your money if you lose your phone.
            </Text>
          </View>
        </View>

        {/* Mnemonic Grid */}
        <View style={styles.phraseContainer}>
          <View style={styles.grid}>
            {words.length > 0 ? (
                words.map((word, index) => (
                    <View key={index} style={styles.wordPill}>
                        <Text style={styles.wordIndex}>{index + 1}</Text>
                        <Text style={styles.wordText}>{word}</Text>
                    </View>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <ActivityIndicator color={COLORS.primary} />
                    <Text style={styles.emptyText}>Generating keys...</Text>
                </View>
            )}
          </View>
          
          <TouchableOpacity 
            onPress={handleCopy} 
            style={[styles.copyButton, copied && styles.copyButtonActive]}
          >
            <Ionicons 
                name={copied ? "checkmark-circle" : "copy-outline"} 
                size={18} 
                color={copied ? COLORS.primary : COLORS.textPrimary} 
            />
            <Text style={[styles.copyText, copied && { color: COLORS.primary }]}>
                {copied ? "Phrase Copied" : "Copy to Clipboard"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Final Warning */}
        <View style={styles.finalWarning}>
            <Ionicons name="eye-off-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.finalWarningText}>
                Never share your phrase. CoinSafe staff will never ask for your recovery words.
            </Text>
        </View>

      </ScrollView>

      {/* Footer Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>I've Written It Down</Text>
          <Ionicons name="arrow-forward" size={20} color="#00332a" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  content: { padding: 24, paddingBottom: 120 },

  // Alert Card
  alertCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    marginBottom: 32,
    gap: 16,
  },
  alertTextContent: { flex: 1 },
  alertTitle: { color: COLORS.warning, fontWeight: '700', fontSize: 16, marginBottom: 4 },
  alertDescription: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20 },
  boldError: { color: COLORS.error, fontWeight: '700' },

  // Phrase Grid
  phraseContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    gap: 10 
  },
  wordPill: {
    width: (width - 100) / 2, // Perfect 2-column fit
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  wordIndex: { 
    color: COLORS.textSecondary, 
    fontSize: 11, 
    fontWeight: '600', 
    marginRight: 8,
    opacity: 0.5,
    width: 18,
  },
  wordText: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700' },
  
  // Copy Button
  copyButton: { 
    marginTop: 20, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  copyButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0, 208, 156, 0.05)',
  },
  copyText: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 14 },

  emptyState: { width: '100%', padding: 40, alignItems: 'center', gap: 10 },
  emptyText: { color: COLORS.textSecondary, fontSize: 14 },

  finalWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    gap: 10,
    paddingHorizontal: 20,
  },
  finalWarningText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
  },

  // Footer
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: 24, 
    backgroundColor: COLORS.background, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  doneButton: {
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
  doneButtonText: {
    color: '#00332a',
    fontSize: 18,
    fontWeight: '700',
  },
});