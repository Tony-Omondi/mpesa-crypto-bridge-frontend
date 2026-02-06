import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

import { theme } from '@/src/constants';
import { URLS } from '@/src/config';
import { useAppSelector } from '@/src/store';
import { components } from '@/src/components';

export default function WithdrawScreen() {
  const router = useRouter();
  
  // 1. Get User Data from Redux
  const { walletAddress, privateKey } = useAppSelector((state) => state.walletReducer);
  
  // 2. Local State
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    // --- Validation ---
    if (!amount || parseFloat(amount) <= 0) {
      showMessage({ message: "Please enter a valid amount", type: "danger" });
      return;
    }
    if (!phoneNumber) {
      showMessage({ message: "Please enter M-Pesa phone number", type: "danger" });
      return;
    }

    setLoading(true);

    try {
      console.log("💸 Initiating Withdrawal...");

      // --- API CALL ---
      const response = await axios.post(URLS.WITHDRAW_NIT, {
        amount: amount,
        phone_number: phoneNumber,
        privateKey: privateKey, // Required for burning tokens
      });

      console.log("✅ Withdraw Success:", response.data);

      // --- Success UI ---
      Alert.alert(
        "Withdrawal Successful!",
        `You have successfully withdrawn ${amount} KES to ${phoneNumber}.\n\nTx Hash:\n${response.data.tx_hash ? response.data.tx_hash.slice(0, 10) + '...' : 'N/A'}`,
        [
          { text: "OK", onPress: () => router.push('/(tabs)/home') }
        ]
      );
      setAmount('');

    } catch (error: any) {
      console.error("❌ Withdraw Error:", error.response?.data || error.message);
      
      const errorMsg = error.response?.data?.error || "Withdrawal failed. Check your connection.";
      
      Alert.alert("Withdrawal Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <components.Header title="Withdraw to M-Pesa" showGoBack={true} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* Info Card */}
            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>How it works</Text>
                <Text style={styles.infoText}>
                    1. Enter the amount of $NIT to withdraw.
                </Text>
                <Text style={styles.infoText}>
                    2. We burn the tokens from your wallet.
                </Text>
                <Text style={styles.infoText}>
                    3. You receive KES instantly on M-Pesa.
                </Text>
            </View>

            {/* Input Form */}
            <View style={styles.formContainer}>
                
                <Text style={styles.label}>Amount (KES)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 500"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <Text style={styles.label}>M-Pesa Phone Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="07XX XXX XXX"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />

                <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleWithdraw}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Confirm Withdrawal</Text>
                    )}
                </TouchableOpacity>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: 20 },
  infoCard: {
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.3)',
  },
  infoTitle: { color: theme.colors.primary, fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
  infoText: { color: theme.colors.textSecondary, marginBottom: 4, fontSize: 14 },
  formContainer: { gap: 15 },
  label: { color: theme.colors.white, fontWeight: '600', marginBottom: 5 },
  input: {
    backgroundColor: theme.colors.secondaryColor,
    color: theme.colors.white,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: theme.colors.eigengrau,
    fontWeight: 'bold',
    fontSize: 16
  }
});