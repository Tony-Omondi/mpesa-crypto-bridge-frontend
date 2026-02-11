import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Platform 
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
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
  error: '#EF4444',
};

export default function MnemonicPhrase() {
  const router = useRouter();
  const { mnemonicPhrase, access } = useAppSelector((state) => state.walletReducer);
  const words = mnemonicPhrase ? mnemonicPhrase.split(' ') : [];

  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const copyToClipboard = async () => {
    Haptics.selectionAsync();
    await Clipboard.setStringAsync(mnemonicPhrase || '');
    showMessage({
      message: 'Copied',
      description: 'Recovery phrase copied to clipboard',
      type: 'success',
      backgroundColor: COLORS.primary,
      icon: 'success',
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Recovery Phrase</Text>
      <View style={{ width: 40 }} /> 
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Security Warning Card */}
        <View style={styles.warningCard}>
            <View style={styles.warningIconBox}>
                <Ionicons name="eye-off-outline" size={24} color={COLORS.warning} />
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.warningTitle}>Do not share this!</Text>
                <Text style={styles.warningText}>
                    Anyone with these words can steal your funds. Write them down and store them somewhere safe.
                </Text>
            </View>
        </View>

        {/* The Grid */}
        <View style={styles.gridContainer}>
            {words.map((word, index) => (
                <View key={index} style={styles.wordPill}>
                    <Text style={styles.wordIndex}>{index + 1}</Text>
                    <Text style={styles.wordText}>{word}</Text>
                </View>
            ))}
        </View>
        
        {/* Copy Note */}
        <Text style={styles.footerNote}>
            Tap "Copy" below to save this to your clipboard temporarily.
        </Text>

      </ScrollView>

      {/* Footer Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Ionicons name="copy-outline" size={20} color="#00332a" />
            <Text style={styles.buttonText}>Copy Phrase</Text>
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

  // Warning Card
  warningCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)', // Tinted Orange
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'flex-start',
    gap: 12,
  },
  warningIconBox: {
    marginTop: 2,
  },
  warningTitle: {
    color: COLORS.warning,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  warningText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  wordPill: {
    width: '48%', // Creates 2 columns
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  wordIndex: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginRight: 10,
    opacity: 0.5,
    width: 20, // Fixed width for alignment
  },
  wordText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  footerNote: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 30,
    opacity: 0.5,
  },

  // Footer Button
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: COLORS.background, 
  },
  copyButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
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