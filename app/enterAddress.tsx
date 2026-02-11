import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard'; // standard expo package
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
  inputBg: '#161B22',
  error: '#EF4444',
  warning: '#F59E0B',
};

export default function EnterAddress() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const { access } = useAppSelector((state) => state.walletReducer);
  
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState('');

  // Protect route
  useEffect(() => {
    if (!access) router.replace('/(auth)/welcome');
  }, [access]);

  const handlePaste = async () => {
    Haptics.selectionAsync();
    const text = await Clipboard.getStringAsync();
    if (text) {
      setRecipient(text.trim());
      validateAddress(text.trim());
    }
  };

  const validateAddress = (text: string) => {
    // Basic formatting check, not full checksum
    const isEvm = /^0x[a-fA-F0-9]{40}$/i.test(text);
    const isTron = text.startsWith('T') && text.length === 34;

    if (text.length > 0 && !isEvm && !isTron) {
      setError('Invalid wallet address format');
    } else {
      setError('');
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!recipient) {
       setError('Address is required');
       return;
    }

    const isEvm = /^0x[a-fA-F0-9]{40}$/i.test(recipient);
    const isTron = recipient.startsWith('T') && recipient.length === 34;

    if (!isEvm && !isTron) {
      showMessage({
        message: "Invalid Address",
        description: "Must be a valid EVM (0x...) or Tron (T...) address.",
        type: 'danger',
        backgroundColor: COLORS.error,
      });
      return;
    }

    router.push({
      pathname: '/enterAmount',
      params: { id: id, recipient: recipient },
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
      <Text style={styles.headerTitle}>Enter Address</Text>
      <View style={{ width: 40 }} /> 
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderHeader()}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          
          <Text style={styles.label}>Recipient Address</Text>
          
          <View style={[
            styles.inputContainer, 
            error ? { borderColor: COLORS.error } : {}
          ]}>
            <TextInput
              style={styles.input}
              value={recipient}
              placeholder="0x... or T..."
              placeholderTextColor="#4B5563"
              onChangeText={(text) => {
                setRecipient(text);
                setError('');
              }}
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor={COLORS.primary}
            />
            
            <View style={styles.inputActions}>
              {recipient.length > 0 ? (
                <TouchableOpacity onPress={() => setRecipient('')}>
                   <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handlePaste} style={styles.pasteButton}>
                   <Text style={styles.pasteText}>PASTE</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.scanButton}>
                 <Ionicons name="scan-outline" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Warning Card */}
          <View style={styles.warningCard}>
            <Ionicons name="warning-outline" size={24} color={COLORS.warning} />
            <Text style={styles.warningText}>
              Ensure the network matches. Sending to the wrong network (e.g., Bitcoin to Ethereum) will result in permanent loss of funds.
            </Text>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.buttonText}>Confirm</Text>
            <Ionicons name="arrow-forward" size={20} color="#00332a" />
          </TouchableOpacity>
        </View>
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
  },

  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 60,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pasteButton: {
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pasteText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  scanButton: {
    padding: 4,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
  },

  warningCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)', // Tinted Orange
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  warningText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  nextButton: {
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