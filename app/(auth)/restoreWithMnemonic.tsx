import {useRouter} from 'expo-router';
import {TextInput, View, StyleSheet, StatusBar} from 'react-native';
import React, {useState, useEffect} from 'react';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';

import {theme} from '@/src/constants';
import {useAppSelector} from '@/src/store';
import {validation} from '@/src/validation';
import {components} from '@/src/components';

export default function RestoreWithMnemonic() {
  const router = useRouter();
  const {access} = useAppSelector((state) => state.walletReducer);

  useEffect(() => {
    if (access) {
      router.replace('/(tabs)/home');
    }
  }, [access]);

  const [mnemonic, setMnemonic] = useState('');

  const handleRestore = () => {
    const message = validation.mnemonic(mnemonic);

    if (message) {
      showMessage({
        message: message,
        type: 'danger',
        backgroundColor: theme.colors.error,
      });
      return;
    }

    router.replace({pathname: '/(loading)/restoreWallet', params: {mnemonic}});
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <components.Reminder containerStyle={{marginBottom: 20}}>
          Enter your 12-word Secret Phrase to regain access to your CoinSafe wallet.
        </components.Reminder>

        <TextInput
          style={styles.input}
          multiline={true}
          value={mnemonic}
          autoCorrect={false}
          autoCapitalize='none'
          keyboardType='default'
          returnKeyType='done'
          blurOnSubmit={true}
          onChangeText={setMnemonic}
          placeholderTextColor={theme.colors.textSecondary} // Silver color for placeholder
          placeholder='e.g. witch collapse practice feed shame...'
        />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <components.Header
        title='Restore Wallet'
        showGoBack={true}
      />

      {renderContent()}

      <View style={styles.footer}>
        <components.Button
          label='Restore Wallet'
          onPress={handleRestore}
          colorScheme='primary'
          // Ensure Button is Round and Text is Dark (Contrast)
          containerStyle={{ borderRadius: 50, height: 56 }} 
          textStyle={{ color: theme.colors.eigengrau, fontWeight: '700' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background, // Deep Space #0B0E11
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: theme.sizes.padding,
  },
  input: {
    height: 140,
    backgroundColor: theme.colors.card, // Gunmetal #1B2028
    padding: 16,
    borderRadius: theme.sizes.radius,
    color: theme.colors.white, // FIXED: Input text is now WHITE
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  footer: {
    padding: theme.sizes.padding,
    paddingBottom: 20,
  },
});