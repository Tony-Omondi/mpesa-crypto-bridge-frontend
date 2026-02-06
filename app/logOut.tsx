import React, {useEffect} from 'react';
import {useRouter} from 'expo-router';
import {ScrollView, View, StatusBar} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {svg} from '@/src/svg';
import {text} from '@/src/text';
import {theme} from '@/src/constants';
import {useAppDispatch} from '@/src/store';
import {useAppSelector} from '@/src/store';
import {components} from '@/src/components';
import {walletActions} from '@/src/store/walletSlice';
import {trc20TokensActions} from '@/src/store/trc20TokensSlice';

export const unstable_settings = {
  headerShown: false,
};

export default function LogOut() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {access} = useAppSelector((state) => state.walletReducer);
  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const renderStatusBar = () => {
    return (
      <StatusBar
        barStyle='light-content'
        backgroundColor={theme.colors.eigengrau}
        translucent={false}
      />
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}
      >
        <svg.UserSvg />
        <text.T28 style={{marginTop: 18, marginBottom: 14}}>
          Are you sure ?
        </text.T28>
        <text.T16 style={{marginBottom: 30}}>
          If you log out, you will need {'\n'}
          to enter your mnemonic phrase again.
        </text.T16>
        <View style={{flexDirection: 'row', marginBottom: 20, gap: 10}}>
          <components.Button
            label='Log Out'
            onPress={() => {
              dispatch(walletActions.resetWallet());
              dispatch(trc20TokensActions.resetAll());
            }}
            containerStyle={{flex: 1}}
          />
          <components.Button
            label='Go Back'
            colorScheme='secondary'
            onPress={() => {
              router.back();
            }}
            containerStyle={{flex: 1}}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.eigengrau}}>
      {renderStatusBar()}
      {renderContent()}
    </SafeAreaView>
  );
}
