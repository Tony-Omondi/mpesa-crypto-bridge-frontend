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
  Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import { showMessage } from 'react-native-flash-message';
import * as LocalAuthentication from 'expo-local-authentication';
import { CameraView, useCameraPermissions } from 'expo-camera'; 

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
  const { id, maxBalance } = useLocalSearchParams(); 
  const { access } = useAppSelector((state: any) => state.walletReducer);
  
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState('');

  // --- CAMERA STATES ---
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

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
    const isEvm = /^0x[a-fA-F0-9]{40}$/i.test(text);
    const isTron = text.startsWith('T') && text.length === 34;

    if (text.length > 0 && !isEvm && !isTron) {
      setError('Invalid wallet address format');
    } else {
      setError('');
    }
  };

  // --- SCANNER LOGIC ---
  const handleOpenScanner = async () => {
    Haptics.selectionAsync();
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        showMessage({ message: "Camera permission denied", type: "warning" });
        return;
      }
    }
    setIsScanning(true);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsScanning(false); 
    
    // Clean prefix if it's a URI like "ethereum:0x..."
    let cleanedAddress = data.trim();
    if (cleanedAddress.includes(':')) {
        cleanedAddress = cleanedAddress.split(':')[1];
    }
    
    setRecipient(cleanedAddress);
    validateAddress(cleanedAddress);
  };

  const handleNext = async () => {
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

    try {
      // 🛑 BIOMETRIC / PIN CHECK (Fixed Fallback Logic)
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify identity to proceed',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      if (!authResult.success) {
        return; // Stop if they cancel or fail
      }

      router.push({
        pathname: '/enterAmount',
        params: { id, recipient, maxBalance },
      });

    } catch (err) {
      console.warn("Authentication Error", err);
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
                <TouchableOpacity onPress={() => {
                    Haptics.selectionAsync();
                    setRecipient('');
                    setError('');
                }}>
                   <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handlePaste} style={styles.pasteButton}>
                   <Text style={styles.pasteText}>PASTE</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.scanButton} onPress={handleOpenScanner}>
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
            <Text style={styles.buttonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#00332a" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* FULL SCREEN SCANNER MODAL */}
      <Modal visible={isScanning} animationType="slide" transparent={true}>
        <View style={styles.scannerContainer}>
          <CameraView 
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={handleBarcodeScanned}
          />
          
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerHeader}>
              <TouchableOpacity onPress={() => setIsScanning(false)} style={styles.closeScannerButton}>
                <Ionicons name="close" size={28} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.scannerTitle}>Scan QR Code</Text>
              <View style={{width: 40}}/>
            </View>

            <View style={styles.scannerTarget}>
              <View style={[styles.corner, styles.topLeftCorner]} />
              <View style={[styles.corner, styles.topRightCorner]} />
              <View style={[styles.corner, styles.bottomLeftCorner]} />
              <View style={[styles.corner, styles.bottomRightCorner]} />
            </View>
            
            <Text style={styles.scannerInstruction}>Point camera at a wallet QR code</Text>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  
  content: { padding: 24 },
  label: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: 12, marginLeft: 4 },
  
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, height: 60, paddingHorizontal: 16 },
  input: { flex: 1, color: COLORS.textPrimary, fontSize: 16, fontWeight: '500', height: '100%' },
  inputActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pasteButton: { backgroundColor: 'rgba(0, 208, 156, 0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  pasteText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  scanButton: { padding: 4 },
  
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 8, marginLeft: 4 },
  
  warningCard: { flexDirection: 'row', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 16, padding: 16, marginTop: 24, gap: 12, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.2)' },
  warningText: { flex: 1, color: COLORS.textSecondary, fontSize: 13, lineHeight: 20 },
  
  footer: { padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  nextButton: { backgroundColor: COLORS.primary, height: 56, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  buttonText: { color: '#00332a', fontSize: 16, fontWeight: '700' },

  // SCANNER STYLES
  scannerContainer: { flex: 1, backgroundColor: '#000' },
  scannerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 60 },
  scannerHeader: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingHorizontal: 24, alignItems: 'center' },
  closeScannerButton: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  scannerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  scannerTarget: { width: 250, height: 250, backgroundColor: 'transparent', position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: COLORS.primary },
  topLeftCorner: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 },
  topRightCorner: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 },
  bottomLeftCorner: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 },
  bottomRightCorner: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 },
  scannerInstruction: { color: '#FFF', fontSize: 16, fontWeight: '500', marginBottom: 40 },
});