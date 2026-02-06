import axios from 'axios';
import {useRouter} from 'expo-router';
import React, {useEffect} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {View, ActivityIndicator, Text, StyleSheet, StatusBar} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {SafeAreaView} from 'react-native-safe-area-context';

import {URLS} from '@/src/config';
import {theme} from '@/src/constants';
import {useAppDispatch, useAppSelector} from '@/src/store';
import {walletActions} from '@/src/store/walletSlice';

export default function RestoreWallet() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {mnemonic} = useLocalSearchParams<{mnemonic: string}>();

  const {access} = useAppSelector((state) => state.walletReducer);

  useEffect(() => {
    if (access) {
      router.replace('/(tabs)/home');
    }
  }, [access, router]);

  const restoreWallet = async () => {
    try {
      console.log("Restoring wallet...");
      const response = await axios.post(URLS.RESTORE_WALLET, {mnemonic});
      const data = response.data;

      if (data.address && data.privateKey) {
        dispatch(walletActions.setMnemonicPhrase(data.mnemonic.phrase));
        dispatch(walletActions.setWalletAddress(data.address));
        dispatch(walletActions.setPrivateKey(data.privateKey));

        showMessage({
            message: 'Wallet Restored Successfully!',
            type: 'success',
            backgroundColor: theme.colors.primary,
        });

        setTimeout(() => {
            router.replace('/(tabs)/home');
        }, 500);
      }
    } catch (error) {
      console.error("Restore Error:", error);
      router.replace('/(auth)/welcome');
      showMessage({
        message: 'Failed to restore wallet. Please check your phrase.',
        type: 'danger',
        backgroundColor: theme.colors.error,
      });
    }
  };

  useEffect(() => {
    if (mnemonic) {
        restoreWallet();
    } else {
        router.replace('/(auth)/welcome');
    }
  }, [mnemonic]);

  const renderContent = () => {
    return (
      <View style={styles.content}>
        <ActivityIndicator size='large' color={theme.colors.primary} />
        {/* FIXED: Text color is explicitly visible now */}
        <Text style={styles.text}>Restoring your wallet...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: theme.colors.background, // Deep Space
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  text: {
    color: theme.colors.textSecondary, // Silver text (visible on dark)
    fontSize: 16,
    fontWeight: '500',
  }
});