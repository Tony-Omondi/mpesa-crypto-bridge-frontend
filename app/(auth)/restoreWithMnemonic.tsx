import React, {useState, useEffect} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useRouter} from 'expo-router';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

import {useAppSelector} from '@/src/store';
import {validation} from '@/src/validation';

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

export default function RestoreWithMnemonic() {
  const router = useRouter();
  const {access} = useAppSelector((state) => state.walletReducer);

  useEffect(() => {
    if (access) {
      router.replace('/(tabs)/home');
    }
  }, [access]);

  const [mnemonic, setMnemonic] = useState('');

  const handleRestore = () => {
    const message = validation.mnemonic(mnemonic);

    if (message) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showMessage({
        message: 'Invalid Phrase',
        description: message,
        type: 'danger',
        backgroundColor: COLORS.error,
      });
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace({pathname: '/(loading)/restoreWallet', params: {mnemonic}});
  };

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      setMnemonic(text);
      Haptics.selectionAsync();
      showMessage({
        message: 'Phrase Pasted',
        type: 'info',
        backgroundColor: COLORS.surface,
      });
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
      <Text style={styles.headerTitle}>Import Wallet</Text>
      <View style={{ width: 40 }} /> 
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      {renderHeader()}

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        {/* Instruction Card */}
        <View style={styles.infoCard}>
          <Ionicons name="key-outline" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Type your 12-word recovery phrase in the correct order, separated by spaces.
          </Text>
        </View>

        {/* Input Box */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            multiline={true}
            value={mnemonic}
            autoCorrect={false}
            autoCapitalize='none'
            keyboardType='default'
            placeholderTextColor="#4B5563"
            placeholder='e.g. witch collapse practice feed shame...'
            onChangeText={setMnemonic}
            blurOnSubmit={true}
          />
          
          <TouchableOpacity 
            style={styles.pasteBtn} 
            onPress={handlePaste}
            activeOpacity={0.7}
          >
            <Ionicons name="clipboard-outline" size={16} color={COLORS.primary} />
            <Text style={styles.pasteBtnText}>PASTE FROM CLIPBOARD</Text>
          </TouchableOpacity>
        </View>

        {/* Security Warning */}
        <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.securityNoteText}>
                Your phrase is processed locally and never leaves this device.
            </Text>
        </View>

      </KeyboardAwareScrollView>

      {/* Footer Action */}
      <View style={styles.footer}>
        <TouchableOpacity 
            style={[styles.restoreBtn, !mnemonic && styles.disabledBtn]}
            onPress={handleRestore}
            disabled={!mnemonic}
        >
          <Text style={styles.restoreBtnText}>Restore Wallet</Text>
          <Ionicons name="sync-outline" size={20} color="#00332a" />
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.2)',
  },
  infoText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  inputWrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    minHeight: 200,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    padding: 16,
    textAlignVertical: 'top',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  pasteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  pasteBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
    opacity: 0.6,
  },
  securityNoteText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  restoreBtn: {
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
  disabledBtn: {
    backgroundColor: COLORS.surface,
    opacity: 0.5,
  },
  restoreBtnText: {
    color: '#00332a',
    fontSize: 18,
    fontWeight: '700',
  },
});