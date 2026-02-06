import {useRouter} from 'expo-router';
import {useLocalSearchParams} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {View, ScrollView, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {text} from '@/src/text';
import {theme} from '@/src/constants';
import {components} from '@/src/components';
import {useAppSelector} from '@/src/store';

export default function EnterAddress() {
  const router = useRouter();
  const {id} = useLocalSearchParams(); // 'id' will be 'nit' or 'tron'
  const [recipient, setRecipient] = useState<string>('');

  const {access} = useAppSelector((state) => state.walletReducer);
  
  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const renderHeader = () => (
    <components.Header showGoBack={true} title='Enter address' />
  );

  const renderContent = () => (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
      }}
    >
      <text.T16 style={{marginBottom: 10}}>Recipient address</text.T16>
      <View
        style={{
          backgroundColor: theme.colors.secondaryColor,
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        <TextInput
          value={recipient}
          keyboardType='default'
          placeholder={`Enter 0x... address`}
          onChangeText={(text) => setRecipient(text.trim())} // Auto-trim spaces
          placeholderTextColor={theme.colors.textColor}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 12,
            color: theme.colors.white,
            ...theme.fonts.SourceSans3_600SemiBold,
          }}
        />
      </View>
      <components.Reminder>
        Please double check the recipient address. sending to the wrong network (e.g. Bitcoin) will result in lost funds.
      </components.Reminder>
    </ScrollView>
  );

  const renderButton = () => (
    <View style={{padding: 20}}>
      <components.Button
        label='Confirm'
        onPress={() => {
          // --- UPDATED VALIDATION LOGIC ---
          const isEvm = /^0x[a-fA-F0-9]{40}$/i.test(recipient);
          const isTron = recipient.startsWith('T') && recipient.length === 34;

          if (!recipient) {
             showMessage({message: "Address is required", type: 'danger', icon: 'danger'});
             return;
          }

          // If it's not a valid EVM address AND not a valid Tron address, show error
          if (!isEvm && !isTron) {
            showMessage({
              message: "Invalid Wallet Address. Must start with '0x' (Arbitrum) or 'T' (Tron).",
              type: 'danger',
              icon: 'danger',
            });
            return;
          }
          
          router.push({
            pathname: '/enterAmount',
            params: {id: id, recipient: recipient},
          });
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
    </SafeAreaView>
  );
}