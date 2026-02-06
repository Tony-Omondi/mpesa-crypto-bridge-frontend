import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import axios from 'axios';

import { theme } from '@/src/constants';
import { components } from '@/src/components';
import { useAppSelector } from '@/src/store';
import { URLS, BASE_URL } from '@/src/config';

export default function EditProfile() {
  const { mnemonicPhrase, privateKey, token } = useAppSelector((state) => state.walletReducer);
  
  const [inputMnemonic, setInputMnemonic] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  // HELPER: Normalize phone number to 254... format
  const formatPhoneNumber = (phone: string) => {
    // Remove all non-numeric characters (spaces, +, etc.)
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 07... or 01..., replace 0 with 254
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    }
    // If it's already 7... or 1... (9 digits), prepend 254
    if (cleaned.length === 9) {
      return '254' + cleaned;
    }
    // If it starts with 254, return as is
    return cleaned;
  };

  const handleVerifyIdentity = () => {
    if (!mnemonicPhrase) {
      Alert.alert("Error", "No stored wallet phrase found. Restart the app.");
      return;
    }

    const sanitizedInput = inputMnemonic.trim().toLowerCase().replace(/\s+/g, ' ');
    const sanitizedStored = mnemonicPhrase.trim().toLowerCase().replace(/\s+/g, ' ');

    if (sanitizedInput === sanitizedStored) {
      setIsUnlocked(true);
      Alert.alert("Verified", "Security check passed. Settings unlocked.");
    } else {
      Alert.alert("Failed", "The phrase entered does not match your wallet.");
    }
  };

  const handleUpdatePhone = async () => {
    if (!newPhone) {
        Alert.alert("Error", "Please enter a valid phone number.");
        return;
    }

    if (!token) {
        Alert.alert("Error", "Authentication token missing. Please restart the app.");
        return;
    }

    // APPLY NORMALIZATION
    const normalizedPhone = formatPhoneNumber(newPhone);
    console.log("Sending normalized phone:", normalizedPhone);
    
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
        Alert.alert("Success", `Mobile number updated to ${normalizedPhone}`);
      }
    } catch (error: any) {
      console.error("Profile Update Error:", error.response?.data || error.message);
      const errorMsg = error.response?.status === 401 
        ? "Session expired or invalid token. Please log in again." 
        : "Server update failed. Check your network connection.";
      Alert.alert("Error", errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <components.Header title="Security & Profile" showGoBack={true} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Unlock with Mnemonic (12 Words)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter words separated by spaces..."
            placeholderTextColor="#666"
            value={inputMnemonic}
            onChangeText={setInputMnemonic}
            multiline
            autoCapitalize="none"
          />
          {!isUnlocked && (
            <components.Button 
              label="Verify to Unlock" 
              onPress={handleVerifyIdentity} 
              containerStyle={{marginTop: 15}}
            />
          )}
        </View>

        {isUnlocked && (
          <View style={styles.secureArea}>
            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.label}>Your Private Key</Text>
              <View style={styles.keyBox}>
                <Text style={styles.keyText}>
                  {showPrivateKey ? privateKey : "••••••••••••••••••••••••••••••••••••••••••••••••"}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => setShowPrivateKey(!showPrivateKey)}>
                   <Text style={{color: theme.colors.primary, fontWeight: '700'}}>
                     {showPrivateKey ? "Hide Key" : "Show Key"}
                   </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  if (privateKey) {
                    Clipboard.setStringAsync(privateKey);
                    Alert.alert("Copied", "Private key copied to clipboard.");
                  }
                }}>
                   <Text style={{color: theme.colors.primary, fontWeight: '700'}}>Copy to Clipboard</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Update Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="07XX... or 254..."
                placeholderTextColor="#666"
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
              />
              <components.Button 
                label="Save New Number" 
                onPress={handleUpdatePhone} 
                colorScheme="primary"
                containerStyle={{marginTop: 15}}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.eigengrau },
  content: { padding: 20 },
  section: { marginBottom: 32 },
  label: { color: '#FFF', fontSize: 14, marginBottom: 10, fontWeight: '700', opacity: 0.9 },
  input: { 
    backgroundColor: '#1A1D23', 
    color: '#FFF', 
    padding: 16, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  secureArea: { marginTop: 10 },
  divider: { height: 1, backgroundColor: '#333', marginBottom: 32 },
  keyBox: { backgroundColor: '#000', padding: 16, borderRadius: 12, marginBottom: 12 },
  keyText: { color: theme.colors.error, fontSize: 11, fontFamily: 'monospace', textAlign: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5 }
});