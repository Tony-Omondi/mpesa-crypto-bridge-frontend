import {useRouter} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {showMessage} from 'react-native-flash-message';
import {View, ScrollView, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {text} from '@/src/text';
import {theme} from '@/src/constants';
import {useAppSelector} from '@/src/store';
import {validation} from '@/src/validation';
import {components} from '@/src/components';
import {useLocalSearchParams} from 'expo-router';
import {getTokenById} from '@/src/utils/getTokenById';

export default function EnterAmount() {
  const router = useRouter();
  const {id, recipient} = useLocalSearchParams();
  const token = getTokenById(String(id));

  const [amount, setAmount] = useState<string>('');
  const {access} = useAppSelector((state) => state.walletReducer);

  useEffect(() => {
    if (!access) router.replace('/(auth)/welcome');
  }, [access]);

  const renderHeader = () => (
    <components.Header showGoBack={true} title='Enter amount' />
  );

  const renderContent = () => (
    <ScrollView contentContainerStyle={{flexGrow: 1, padding: 20}}>
      <text.T16 style={{marginBottom: 10}}>Amount</text.T16>
      <View style={{
          backgroundColor: theme.colors.secondaryColor,
          borderRadius: 8,
          marginBottom: 10,
        }}>
        <TextInput
          value={amount}
          keyboardType='numeric' // Changed to numeric
          placeholder={`Enter Amount`}
          onChangeText={setAmount}
          placeholderTextColor={theme.colors.textColor}
          style={{
            padding: 15,
            color: theme.colors.white,
            ...theme.fonts.SourceSans3_600SemiBold,
          }}
        />
      </View>
      <components.Reminder>
        Transactions are irreversible. Ensure you have enough ETH for gas!
      </components.Reminder>
    </ScrollView>
  );

  const renderButton = () => (
    <View style={{padding: 20}}>
      <components.Button
        label='Confirm'
        onPress={() => {
          if (validation.amount(amount)) {
            showMessage({
              message: validation.amount(amount),
              type: 'danger',
              icon: 'danger',
            });
            return;
          }

          // --- BYPASS BALANCE CHECK FOR NIT ---
          // Since NIT balance is fetched locally on Home, we skip the Redux check here.
          // The Blockchain will reject it if funds are insufficient anyway.
          
          router.push({
            pathname: '/confirmTransaction',
            params: {id, amount, recipient},
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