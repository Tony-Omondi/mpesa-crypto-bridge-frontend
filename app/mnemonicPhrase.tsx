import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Platform,
  Modal
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { showMessage } from 'react-native-flash-message';
import * as LocalAuthentication from 'expo-local-authentication';
import { BlurView } from 'expo-blur';
import LottieView from 'lottie-react-native';

import { useAppSelector } from '@/src/store';
import { getMnemonic } from '@/src/utils/secureStorage'; // ← NEW

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  warning: '#00D09C',
  error: '#EF4444',
};

export default function MnemonicPhrase() {
  const router = useRouter();
  const { access } = useAppSelector((state: any) => state.walletReducer);

  // ✅ Mnemonic is no longer in Redux — we load it from SecureStore on demand
  const [mnemonicPhrase, setMnemonicPhrase] = useState<string | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const handleUnlockPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to reveal recovery phrase',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      if (authResult.success) {
        setShowWarningModal(true);
      } else {
        showMessage({ 
          message: "Authentication Failed", 
          description: "You must unlock your device to view sensitive data.", 
          type: "danger" 
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const handleConfirmReveal = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowWarningModal(false);

    // ✅ Only load from SecureStore when user explicitly confirms
    const phrase = await getMnemonic();
    if (phrase) {
      setMnemonicPhrase(phrase);
      setWords(phrase.split(' '));
      setIsRevealed(true);
    } else {
      showMessage({ message: "Could not load phrase", type: "danger" });
    }
  };

  const copyToClipboard = async () => {
    if (!isRevealed || !mnemonicPhrase) return;
    Haptics.selectionAsync();
    await Clipboard.setStringAsync(mnemonicPhrase);
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
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Recovery Phrase</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  const renderWarningModal = () => (
    <Modal visible={showWarningModal} transparent animationType="fade">
      <BlurView intensity={60} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalIconContainer}>
            <LottieView
              source={require('@/assets/animations/eyes.json')}
              autoPlay
              loop
              style={{ width: 80, height: 80 }}
            />
          </View>
          <Text style={styles.modalTitle}>Check Your Surroundings!</Text>
          <Text style={styles.modalText}>
            Make sure no one is looking at your screen. Anyone who sees these words can steal your entire wallet.
          </Text>
          <TouchableOpacity style={styles.modalButton} onPress={handleConfirmReveal} activeOpacity={0.8}>
            <Text style={styles.modalButtonText}>I'm Safe, Reveal Phrase</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.warningCard}>
          <View style={styles.warningIconBox}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.warningTitle}>Do not share this!</Text>
            <Text style={styles.warningText}>
              Anyone with these words can steal your funds. Write them down and store them somewhere safe.
            </Text>
          </View>
        </View>

        {!isRevealed ? (
          <View style={styles.lockedContainer}>
            <Ionicons name="lock-closed" size={48} color={COLORS.textSecondary} style={{ marginBottom: 16 }} />
            <Text style={styles.lockedTitle}>Phrase Hidden</Text>
            <Text style={styles.lockedText}>Tap the button below to authenticate and view your secret recovery phrase.</Text>
            <TouchableOpacity style={styles.unlockButton} onPress={handleUnlockPress}>
              <Ionicons name="finger-print" size={20} color={COLORS.background} />
              <Text style={styles.unlockButtonText}>Tap to Reveal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.gridContainer}>
              {words.map((word, index) => (
                <View key={index} style={styles.wordPill}>
                  <Text style={styles.wordIndex}>{index + 1}</Text>
                  <Text style={styles.wordText}>{word}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.footerNote}>
              Tap "Copy" below to save this to your clipboard temporarily.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.copyButton, !isRevealed && { opacity: 0.5 }]}
          onPress={copyToClipboard}
          disabled={!isRevealed}
        >
          <Ionicons name="copy-outline" size={20} color={!isRevealed ? COLORS.textSecondary : "#00332a"} />
          <Text style={[styles.buttonText, !isRevealed && { color: COLORS.textSecondary }]}>Copy Phrase</Text>
        </TouchableOpacity>
      </View>

      {renderWarningModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  content: { padding: 24, paddingBottom: 100 },
  warningCard: { flexDirection: 'row', backgroundColor: 'rgba(0, 208, 156, 0.08)', borderRadius: 16, padding: 16, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(0, 208, 156, 0.2)', alignItems: 'flex-start', gap: 12 },
  warningIconBox: { marginTop: 2 },
  warningTitle: { color: COLORS.primary, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  warningText: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 18 },
  lockedContainer: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, marginTop: 10 },
  lockedTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  lockedText: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  unlockButton: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, gap: 8 },
  unlockButtonText: { color: COLORS.background, fontSize: 16, fontWeight: '700' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  wordPill: { width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  wordIndex: { color: COLORS.textSecondary, fontSize: 12, marginRight: 10, opacity: 0.5, width: 20 },
  wordText: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600', letterSpacing: 0.5 },
  footerNote: { textAlign: 'center', color: COLORS.textSecondary, fontSize: 12, marginTop: 30, opacity: 0.5 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, backgroundColor: COLORS.background },
  copyButton: { backgroundColor: COLORS.primary, height: 56, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  buttonText: { color: '#00332a', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalCard: { width: '85%', backgroundColor: COLORS.surface, borderRadius: 32, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: COLORS.warning },
  modalIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: COLORS.warning, fontSize: 20, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  modalText: { color: COLORS.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  modalButton: { backgroundColor: COLORS.warning, width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  modalButtonText: { color: '#000', fontSize: 16, fontWeight: '700' },
});