import {useRouter} from 'expo-router';
import React, {useEffect} from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';

import {svg} from '@/src/svg';
import {text} from '@/src/text';
import {theme} from '@/src/constants';
import {useAppDispatch} from '@/src/store';
import {useAppSelector} from '@/src/store';
import {components} from '@/src/components';
import {useLocalSearchParams} from 'expo-router';
import {trc20TokensActions} from '@/src/store/trc20TokensSlice';

export default function TransactionSuccess() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {id, recipient, amount} = useLocalSearchParams();
  const {list} = useAppSelector((state) => state.trc20TokensReducer);
  const {trxData} = useAppSelector((state) => state.trc20TokensReducer);
  let token = list.find((t) => t.id === id) || null;
  if (id === 'tron') {
    token = trxData;
  }

  useEffect(() => {
    dispatch(trc20TokensActions.resetBalancesUpdateInterval());
  }, []);

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg.SuccessSvg />
        <text.T18
          style={{
            marginTop: 20,
            fontSize: 20,
            fontWeight: '600',
            color: theme.colors.white,
          }}
        >
          Transaction successful
        </text.T18>
        <text.T14>
          to: {recipient.slice(0, 6)}...{recipient.slice(-6)}
        </text.T14>
        <text.T18
          style={{
            marginBottom: 10,
            color: 'red',
            textAlign: 'center',
            fontWeight: '600',
          }}
        >
          - {amount} {token?.symbol?.toUpperCase()}
        </text.T18>
      </ScrollView>
    );
  };

  const renderButton = () => {
    return (
      <View style={{padding: 20}}>
        <components.Button
          label='Done'
          onPress={() => {
            router.replace('/(tabs)/home');
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {renderContent()}
      {renderButton()}
    </SafeAreaView>
  );
}
