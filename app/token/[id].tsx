import React from 'react';
import {useRouter} from 'expo-router';
import {View, ScrollView} from 'react-native';
import {showMessage} from 'react-native-flash-message';

import {text} from '@/src/text';
import {items} from '@/src/items';
import {hooks} from '@/src/hooks';
import {useAppDispatch} from '@/src/store';
import {components} from '@/src/components';
import {useLocalSearchParams} from 'expo-router';
import {getTokenById} from '@/src/utils/getTokenById';
import {SafeAreaView} from 'react-native-safe-area-context';
import {trc20TokensActions} from '@/src/store/trc20TokensSlice';
import {calculateTotalUSD} from '@/src/utils/calculateTotalUSD';

export default function Token() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {id} = useLocalSearchParams();
  const token = getTokenById(String(id));
  if (!token) {
    return;
  }

  const {isLoading, transactions} = hooks.useGetTransactions(String(id));

  const renderHeader = () => {
    return (
      <components.Header
        title={`${token?.name} (${token?.symbol})`}
        showGoBack={true}
      />
    );
  };

  const renderTokenInfo = () => {
    return (
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <text.T16>Total balance</text.T16>
        <text.T32>${calculateTotalUSD(token)}</text.T32>
        <text.T16 style={{marginBottom: 14}}>
          {token?.balance} {token?.symbol.toUpperCase()}
        </text.T16>
        <View style={{gap: 10, flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <components.Button
              label='Send'
              onPress={() => {
                router.push({
                  pathname: '/enterAddress',
                  params: {id: token?.id},
                });
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <components.Button
              label='Receive'
              onPress={() => {
                router.push({
                  pathname: '/receive',
                  params: {id: token?.id},
                });
              }}
              colorScheme='secondary'
            />
          </View>
        </View>
      </View>
    );
  };

  const renderTransactions = () => {
    if (isLoading) return <components.Loader />;
    if (!transactions || transactions.length === 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <text.T16 style={{textAlign: 'center'}}>
            You don't have any transactions yet.
          </text.T16>
        </View>
      );
    }
    return (
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 10,
          width: '100%',
        }}
      >
        {transactions?.map((transaction, index) => {
          return (
            <items.TransactionItem
              transaction={transaction}
              key={transaction.txID}
            />
          );
        })}
      </ScrollView>
    );
  };

  const renderContent = () => {
    return (
      <>
        {renderTokenInfo()}
        {renderTransactions()}
      </>
    );
  };

  const renderButton = () => {
    if (token?.id === 'tron') return null;
    return (
      <View style={{padding: 20}}>
        <components.Button
          label='Remove Token from the list'
          onPress={() => {
            dispatch(trc20TokensActions.removeToken(String(id)));
            router.back();
            showMessage({
              message: 'Success',
              description: 'Token removed from the list',
              type: 'success',
              icon: 'success',
            });
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {renderHeader()}
      {renderContent()}
      {renderButton()}
    </SafeAreaView>
  );
}
