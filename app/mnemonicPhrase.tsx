import {useRouter} from 'expo-router';
import React, {useEffect} from 'react';
import * as Clipboard from 'expo-clipboard';
import {View, ScrollView} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {SafeAreaView} from 'react-native-safe-area-context';

import {text} from '@/src/text';
import {theme} from '@/src/constants';
import {components} from '@/src/components';
import {useAppSelector} from '@/src/store';

export default function mnemonicPhrase() {
  const router = useRouter();
  const {mnemonicPhrase} = useAppSelector((state) => state.walletReducer);

  const {access} = useAppSelector((state) => state.walletReducer);
  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(mnemonicPhrase || '');
    showMessage({
      message: 'Success',
      description: 'Mnemonic Phrase copied to clipboard',
      type: 'success',
      icon: 'success',
    });
  };

  const renderHeader = () => {
    return (
      <components.Header
        title='Mnemonic Phrase'
        showGoBack={true}
      />
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{padding: 20, paddingTop: 10, paddingBottom: 20}}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          {mnemonicPhrase?.split(' ').map((word, index) => {
            return (
              <View
                key={index}
                style={{
                  backgroundColor: '#1B2028',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 8,
                }}
              >
                <text.T14
                  style={{color: theme.colors.textColor, fontWeight: 500}}
                >
                  {word}
                </text.T14>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderButton = () => {
    return (
      <View style={{padding: 20}}>
        <components.Button
          label='Copy'
          onPress={copyToClipboard}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.eigengrau}}>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
    </SafeAreaView>
  );
}
