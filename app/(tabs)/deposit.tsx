import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

import { theme } from '@/src/constants';
import { components } from '@/src/components';
import { useAppSelector } from '@/src/store';
import { URLS, BASE_URL } from '@/src/config';

export default function Deposit() {
  const router = useRouter();
  const { walletAddress, token } = useAppSelector((state) => state.walletReducer);

  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimatedNit, setEstimatedNit] = useState('0.00');

  // 1 KES = 1 NIT
  useEffect(() => {
    const val = parseFloat(amount);
    setEstimatedNit(!isNaN(val) ? val.toFixed(2) : '0.00');
  }, [amount]);

  // Normalize phone to 2547XXXXXXXX
  const formatPhoneNumber = (input: string) => {
    let cleaned = input.replace(/\D/g, '');
    if (cleaned.startsWith('0')) return '254' + cleaned.substring(1);
    if (cleaned.length === 9) return '254' + cleaned;
    return cleaned;
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) < 5) {
      Alert.alert("Error", "Minimum deposit is 5 KES.");
      return;
    }
    if (!phone) {
      Alert.alert("Error", "Enter your M-Pesa phone number.");
      return;
    }

    const normalizedPhone = formatPhoneNumber(phone);
    setLoading(true);

    try {
      // POST to Django: /api/payments/pay/
      const response = await axios.post(
        `${BASE_URL}/api/payments/pay/`,
        {
          amount_kes: amount,
          phone_number: normalizedPhone,
          wallet_address: walletAddress,
        },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === "STK_SENT") {
        showMessage({
          message: "STK Push Sent",
          description: "Check your phone for the M-Pesa PIN prompt.",
          type: "success",
          duration: 5000,
        });
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      console.error("Payment Error:", error.response?.data || error.message);
      Alert.alert("Payment Failed", error.response?.data?.error || "Could not reach server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <components.Header title="Deposit $NIT" showGoBack={true} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Buy **$NIT** Stablecoins instantly via M-Pesa STK Push. 
            The tokens will be minted to your wallet automatically after payment.
          </Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Amount (KES)</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>KES</Text>
            <TextInput
              style={styles.textInput}
              placeholder="500"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          <Text style={styles.hint}>You receive: {estimatedNit} $NIT</Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>M-Pesa Phone Number</Text>
          <TextInput
            style={[styles.textInput, styles.standaloneInput]}
            placeholder="07XXXXXXXX"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleDeposit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Pay with M-Pesa</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Secured by Safaricom Daraja API</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 24 },
  infoBox: { backgroundColor: '#1A1D23', padding: 16, borderRadius: 16, marginBottom: 30, borderLeftWidth: 4, borderLeftColor: theme.colors.primary },
  infoText: { color: '#CCC', fontSize: 14, lineHeight: 20 },
  inputSection: { marginBottom: 25 },
  label: { color: '#FFF', fontSize: 14, fontWeight: '700', marginBottom: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1D23', borderRadius: 14, borderWidth: 1, borderColor: '#333' },
  inputPrefix: { color: theme.colors.primary, paddingLeft: 16, fontWeight: 'bold' },
  textInput: { flex: 1, color: '#FFF', padding: 16, fontSize: 16 },
  standaloneInput: { backgroundColor: '#1A1D23', borderRadius: 14, borderWidth: 1, borderColor: '#333' },
  hint: { color: theme.colors.primary, fontSize: 12, marginTop: 8, fontWeight: '600' },
  button: { backgroundColor: theme.colors.primary, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { color: '#666', fontSize: 12 }
});