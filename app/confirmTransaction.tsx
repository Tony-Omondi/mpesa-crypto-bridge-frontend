import React, {useEffect} from 'react';
import {Image} from 'expo-image';
import {useRouter} from 'expo-router';
import {useLocalSearchParams} from 'expo-router';
import {View, Text, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {theme} from '@/src/constants';
import {useAppSelector} from '@/src/store';
import {components} from '@/src/components';
import {getTokenById} from '@/src/utils/getTokenById';

export default function ConfirmTransaction() {
  const router = useRouter();
  // Grab params passed from EnterAmount screen
  const {id, recipient, amount} = useLocalSearchParams();
  const token = getTokenById(String(id));

  const {walletAddress, access} = useAppSelector((state) => state.walletReducer);

  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const renderHeader = () => (
    <components.Header showGoBack={true} title='Confirm Transaction' />
  );

  const renderContent = () => (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
      }}
    >
      {/* Token Logo */}
      <Image
        source={{uri: token?.logo || ''}}
        style={{
          height: 60,
          width: 60,
          marginBottom: 14,
          alignSelf: 'center',
        }}
      />
      
      <Text style={{color: theme.colors.white, textAlign: 'center', fontWeight: '600', marginBottom: 10}}>
        Sending
      </Text>
      
      {/* Amount Display */}
      <Text style={{color: theme.colors.white, textAlign: 'center', fontWeight: '600', marginBottom: 14, fontSize: 24}}>
        {amount} {token?.symbol ? token.symbol.toUpperCase() : 'NIT'}
      </Text>
      
      <View style={{height: 1, backgroundColor: `${theme.colors.white}20`, marginBottom: 14}} />
      
      {/* From Section */}
      <Text style={{color: theme.colors.white, textAlign: 'center', marginBottom: 10, opacity: 0.7}}>
        From
      </Text>
      <Text style={{color: theme.colors.white, textAlign: 'center', fontWeight: '600', marginBottom: 14, fontFamily: 'monospace'}}>
        {walletAddress}
      </Text>
      
      <View style={{height: 1, backgroundColor: `${theme.colors.white}20`, marginBottom: 14}} />
      
      {/* To Section */}
      <Text style={{color: theme.colors.white, textAlign: 'center', marginBottom: 10, opacity: 0.7}}>
        To
      </Text>
      <Text style={{color: theme.colors.white, textAlign: 'center', fontWeight: '600', marginBottom: 14, fontFamily: 'monospace'}}>
        {recipient}
      </Text>
      
      <View style={{height: 1, backgroundColor: `${theme.colors.white}20`, marginBottom: 14}} />
    </ScrollView>
  );

  const renderButton = () => (
    <View style={{padding: 20}}>
      <components.Button
        label='Confirm & Send'
        onPress={() => {
          // Navigate to the Loading screen which executes the Logic
          router.push({
            pathname: '/(loading)/transfer',
            params: {id, recipient, amount},
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