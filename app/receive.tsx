import {useRouter} from 'expo-router';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import {ScrollView, View, StyleSheet} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {showMessage} from 'react-native-flash-message';
import {SafeAreaView} from 'react-native-safe-area-context';

import {text} from '@/src/text';
import {theme} from '@/src/constants';
import {RootState} from '@/src/store';
import {useAppSelector} from '@/src/store';
import {components} from '@/src/components';
import {getTokenById} from '@/src/utils/getTokenById';

export default function Receive() {
  const router = useRouter();
  const {id} = useLocalSearchParams();
  const token = getTokenById(String(id));

  // Access Wallet Address from Global Store
  const {walletAddress, access} = useAppSelector((state) => state.walletReducer);

  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(walletAddress || '');
    showMessage({
      message: 'Address Copied!',
      type: 'success',
      icon: 'success',
    });
  };

  const renderHeader = () => (
    <components.Header title='Receive' showGoBack={true} />
  );

  const renderQRCode = () => (
    <View style={styles.qrContainer}>
      <QRCode
        logoSize={40}
        color={theme.colors.white}
        value={walletAddress || '0x'}
        size={theme.sizes.deviceWidth * 0.5}
        backgroundColor={theme.colors.transparent}
      />
      <View style={styles.addressBox}>
        <text.T14 style={styles.addressText}>
          {walletAddress}
        </text.T14>
      </View>
    </View>
  );

  const renderRemind = () => (
    <View style={styles.reminderContainer}>
      <components.Reminder>
        This is your Arbitrum Sepolia address. Only send $NIT or ETH to this address.
      </components.Reminder>
    </View>
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
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderQRCode()}
        {renderRemind()}
      </ScrollView>
      {renderButton()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  buttonContainer: { padding: 20 },
  reminderContainer: { marginTop: 30, paddingHorizontal: 10 },
  qrContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20
  },
  addressBox: {
    backgroundColor: '#eee',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  addressText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
});