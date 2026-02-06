import axios from 'axios';
import {useRouter} from 'expo-router';
import React, {useEffect} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {ScrollView, ActivityIndicator, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {URLS} from '@/src/config';
import {theme} from '@/src/constants';
import {useAppSelector} from '@/src/store';
import {getTokenById} from '@/src/utils/getTokenById';

export default function Transfer() {
  const router = useRouter();

  const {id, recipient, amount} = useLocalSearchParams();
  const token = getTokenById(String(id));

  const {walletAddress, privateKey} = useAppSelector(
    (state) => state.walletReducer,
  );
  
  // We use this generic reducer for network status, or you can remove if not used for NIT
  const {network} = useAppSelector((state) => state.trc20TokensReducer);

  useEffect(() => {
    // If it's TRON, use the old flow. If it's NIT (or anything else), use Django.
    if (token?.id === 'tron') {
      transferTrx();
    } else {
      transferNit();
    }
  }, []);

  const transferTrx = async () => {
    // ... existing Tron logic ...
  };

  const transferNit = async () => {
    try {
      console.log("🚀 Sending NIT via Django...");
      
      // CALL YOUR DJANGO ENDPOINT
      const response = await axios.post(
        URLS.TRANSFER_NIT,
        {
          // Django Serializer expects these exact keys:
          to_address: recipient,  // Fixed: toAddress -> to_address
          amount: amount,
          privateKey: privateKey, // Serializer maps this to Python variable
        },
        {timeout: 15000},
      );

      console.log("✅ Transfer Response:", response.data);

      if (response.data.result === true) {
        router.push({
          pathname: '/success',
          params: {id, recipient, amount},
        });
      } else {
        throw new Error(response.data.error || "Transfer failed");
      }

    } catch (error: any) {
      const errMsg = error.response?.data?.error || error.message;
      console.log('❌ ERROR TRANSFERRING NIT:', errMsg);
      
      // Pass the error message to the failed screen if you want, or just log it
      router.push({
        pathname: '/failed',
        params: {id, recipient, amount},
      });
    }
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator
          size='large'
          color={theme.colors.primary} 
        />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.eigengrau}}>
      {renderContent()}
    </SafeAreaView>
  );
}