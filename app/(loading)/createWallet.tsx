import axios from 'axios';
import {useRouter} from 'expo-router';
import React, {useEffect} from 'react';
import {Text, View, ActivityIndicator, StyleSheet, StatusBar} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {SafeAreaView} from 'react-native-safe-area-context';

import {URLS} from '@/src/config';
import {theme} from '@/src/constants';
import {useAppDispatch} from '@/src/store';
import {walletActions} from '@/src/store/walletSlice';

export default function CreateWallet() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!URLS.REGISTER) {
      console.error("Critical Error: URLS.REGISTER is undefined. Check config.ts");
      return;
    }
    setupNewAccount();
  }, []);

  const setupNewAccount = async () => {
    try {
      // 1. GENERATE BLOCKCHAIN KEYS
      console.log("Generating blockchain keys...");
      const walletResponse = await axios.get(URLS.CREATE_WALLET);
      
      const { address, privateKey, mnemonic } = walletResponse.data;
      const finalPhrase = typeof mnemonic === 'object' ? mnemonic.phrase : mnemonic;

      // 2. GENERATE A RANDOM UNIQUE PHONE NUMBER (FOR TESTING ONLY)
      // This prevents "400 Bad Request" unique constraint errors in Django
      const randomSuffix = Math.floor(1000000 + Math.random() * 9000000); 
      const uniqueTestPhone = `2547${randomSuffix}`;

      // 3. REGISTER USER IN DJANGO DB
      console.log(`Registering new user: ${uniqueTestPhone}`);
      const authResponse = await axios.post(URLS.REGISTER, {
        phone_number: uniqueTestPhone,
        password: "secure_password_123", 
        wallet_address: address, 
      });

      if (authResponse.data.status === "Account Created") {
        console.log("Success! Django user created.");
        
        // 4. SAVE EVERYTHING TO REDUX
        // Storing the token is CRITICAL to fix "401 Unauthorized" later
        dispatch(walletActions.setAuthToken(authResponse.data.token)); 
        dispatch(walletActions.setWalletAddress(address));
        dispatch(walletActions.setMnemonicPhrase(finalPhrase)); 
        dispatch(walletActions.setPrivateKey(privateKey));

        // 5. REDIRECT TO BACKUP SCREEN
        setTimeout(() => {
            router.replace({
              pathname: '/(auth)/backupWallet',
              params: { phrase: finalPhrase }
            });
        }, 1000);
      }
    } catch (error: any) {
      const errorDetail = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      console.error('Setup Error Detail:', errorDetail);
      
      showMessage({
        message: 'Account Setup Failed',
        description: `Error: ${errorDetail}`,
        type: 'danger',
        backgroundColor: theme.colors.error,
      });
      setTimeout(() => router.replace('/(auth)/welcome'), 4000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <View style={styles.content}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.text}>Building your secure vault...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  text: { color: theme.colors.textSecondary, fontSize: 16, fontWeight: '600' }
});