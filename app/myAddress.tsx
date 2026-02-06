import {Image} from 'expo-image';
import {useRouter} from 'expo-router';
import React, {useEffect} from 'react';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import {showMessage} from 'react-native-flash-message';
import {View, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {text} from '@/src/text';
import {theme} from '@/src/constants';
import {useAppSelector} from '@/src/store';
import {components} from '@/src/components';

export default function MyAddress() {
  const router = useRouter();

  const walletAddress = useAppSelector(
    (state) => state.walletReducer.walletAddress,
  );

  const {access} = useAppSelector((state) => state.walletReducer);
  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(walletAddress || '');
    showMessage({
      message: 'Success',
      description: 'Address copied to clipboard',
      type: 'success',
      icon: 'success',
    });
  };

  const renderHeader = () => (
    <components.Header
      showGoBack={true}
      title='My Address'
    />
  );

  const renderReminder = () => (
    <View style={styles.reminderContainer}>
      <components.Reminder>
        Only send TRON (TRX) to this address. Sending any other asset will
        result in a loss of funds.
      </components.Reminder>
    </View>
  );

  const renderContent = () => (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.tokenRow}>
        <View style={styles.tokenInfo}>
          <Image
            source={{
              uri: 'https://static.tronscan.org/production/logo/trx.png',
            }}
            style={styles.tokenLogo}
          />
          <text.T12>TRON</text.T12>
        </View>
        <View style={styles.tokenBadge}>
          <text.T12>TRX</text.T12>
        </View>
      </View>
      <QRCode
        logoSize={40}
        color={theme.colors.white}
        value={walletAddress || ''}
        size={theme.sizes.deviceWidth * 0.4}
        backgroundColor={theme.colors.transparent}
      />
      <View style={styles.addressBox}>
        <text.T12 numberOfLines={2}>{walletAddress}</text.T12>
      </View>
    </ScrollView>
  );

  const renderButton = () => (
    <View style={styles.buttonContainer}>
      <components.Button
        label='Copy Address'
        onPress={copyToClipboard}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      {renderReminder()}
      {renderContent()}
      {renderButton()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  reminderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 9,
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  tokenLogo: {
    width: 13,
    height: 13,
    borderRadius: 8,
  },
  tokenBadge: {
    backgroundColor: '#1B2028',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  addressBox: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginTop: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#1B2028',
    width: theme.sizes.deviceWidth * 0.4,
  },
  buttonContainer: {
    padding: 20,
  },
});
