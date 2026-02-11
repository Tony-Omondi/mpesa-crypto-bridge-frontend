import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { showMessage } from 'react-native-flash-message';

import { useAppSelector } from '@/src/store';
import { BASE_URL } from '@/src/config';

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
  inputBg: '#161B22',
};

export default function EditProfile() {
  const router = useRouter();
  const { mnemonicPhrase, privateKey, token } = useAppSelector((state) => state.walletReducer);
  
  const [inputMnemonic, setInputMnemonic] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- LOGIC ---

  const handlePastePhrase = async () => {
    Haptics.selectionAsync();
    const text = await Clipboard.getStringAsync();
    if (text) setInputMnemonic(text);
  };

  const handleVerifyIdentity = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!mnemonicPhrase) {
      showMessage({ message: "No stored wallet phrase found.", type: "danger" });
      return;
    }

    const sanitizedInput = inputMnemonic.trim().toLowerCase().replace(/\s+/g, ' ');
    const sanitizedStored = mnemonicPhrase.trim().toLowerCase().replace(/\s+/g, ' ');

    if (sanitizedInput === sanitizedStored) {
      setIsUnlocked(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showMessage({ message: "Identity Verified", type: "success", backgroundColor: COLORS.primary });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showMessage({ message: "Incorrect Phrase", description: "Please try again.", type: "danger" });
    }
  };

  const formatPhoneNumber = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) return '254' + cleaned.substring(1);
    if (cleaned.length === 9) return '254' + cleaned;
    return cleaned;
  };

  const handleUpdatePhone = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!newPhone) {
        showMessage({ message: "Enter a valid phone number", type: "warning" });
        return;
    }

    setLoading(true);
    const normalizedPhone = formatPhoneNumber(newPhone);
    
    try {
      const response = await axios.patch(`${BASE_URL}/api/auth/profile/update/`, 
        { phone_number: normalizedPhone },
        { 
          headers: { 
            'Authorization': `Token ${token}`, 
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.status === "Profile Updated") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showMessage({ 
            message: "Success", 
            description: `Mobile updated to ${normalizedPhone}`, 
            type: "success", 
            backgroundColor: COLORS.primary 
        });
        setNewPhone('');
      }
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const errorMsg = error.response?.status === 401 
        ? "Session expired. Please log in again." 
        : "Update failed. Check your connection.";
      showMessage({ message: "Error", description: errorMsg, type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
      await Clipboard.setStringAsync(text);
      Haptics.selectionAsync();
      showMessage({ message: "Copied to clipboard", type: "info", backgroundColor: COLORS.surface });
  };

  // --- RENDER ---

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Security & Keys</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* 1. VERIFICATION SECTION */}
          {!isUnlocked ? (
            <View style={styles.lockContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="lock-closed" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.lockTitle}>Verify Identity</Text>
              <Text style={styles.lockSub}>
                Enter your 12-word mnemonic phrase to unlock private settings.
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  placeholder="Enter phrase..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={inputMnemonic}
                  onChangeText={setInputMnemonic}
                  multiline
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.pasteButton} onPress={handlePastePhrase}>
                    <Text style={styles.pasteText}>PASTE</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.unlockButton} onPress={handleVerifyIdentity}>
                <Text style={styles.buttonText}>Unlock Settings</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // 2. UNLOCKED CONTENT
            <View style={styles.unlockedContainer}>
              
              {/* PRIVATE KEY SECTION */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="key" size={18} color={COLORS.error} />
                    <Text style={styles.sectionTitle}>Private Key</Text>
                </View>
                
                <View style={styles.warningCard}>
                    <Text style={styles.warningText}>
                        NEVER share this key. Anyone with this key can steal your funds.
                    </Text>
                </View>

                <View style={styles.keyContainer}>
                    <Text style={styles.keyText}>
                        {showPrivateKey ? privateKey : "•••• •••• •••• •••• •••• ••••"}
                    </Text>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity 
                        style={styles.actionButton} 
                        onPress={() => setShowPrivateKey(!showPrivateKey)}
                    >
                        <Ionicons name={showPrivateKey ? "eye-off" : "eye"} size={20} color={COLORS.textPrimary} />
                        <Text style={styles.actionText}>{showPrivateKey ? "Hide" : "Reveal"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionButton} 
                        onPress={() => copyToClipboard(privateKey || "")}
                    >
                        <Ionicons name="copy" size={20} color={COLORS.textPrimary} />
                        <Text style={styles.actionText}>Copy</Text>
                    </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              {/* PHONE UPDATE SECTION */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="phone-portrait" size={18} color={COLORS.primary} />
                    <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Update Mobile Number</Text>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="07XX... or 254..."
                        placeholderTextColor={COLORS.textSecondary}
                        value={newPhone}
                        onChangeText={setNewPhone}
                        keyboardType="phone-pad"
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.saveButton, loading && { opacity: 0.7 }]} 
                    onPress={handleUpdatePhone}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Save Changes</Text>}
                </TouchableOpacity>
              </View>

            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },

  content: {
    padding: 24,
    paddingBottom: 50,
  },

  // LOCKED STATE
  lockContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  lockTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  lockSub: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  unlockButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  // INPUTS
  inputContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  input: {
    color: COLORS.textPrimary,
    padding: 16,
    fontSize: 16,
    width: '100%',
  },
  pasteButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pasteText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  // UNLOCKED STATE
  unlockedContainer: {
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '700',
  },
  
  warningCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  warningText: {
    color: '#FF8888',
    fontSize: 13,
    textAlign: 'center',
  },

  keyContainer: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  keyText: {
    color: COLORS.primary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    textAlign: 'center',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#00332a',
    fontSize: 16,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 30,
  },
});