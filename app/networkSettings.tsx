import React, {useEffect, useState} from 'react';
import {useRouter} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';

import {svg} from '@/src/svg';
import {theme} from '@/src/constants';
import {components} from '@/src/components';
import {useAppSelector, useAppDispatch} from '@/src/store';
import {trc20TokensActions} from '@/src/store/trc20TokensSlice';

export default function NetworkSettings() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {network} = useAppSelector((state) => state.trc20TokensReducer);
  const [selectedNetwork, setSelectedNetwork] = useState(network);

  const NETWORKS = [
    {
      id: 1,
      name: 'TRON Mainnet',
      network: 'mainnet',
      description:
        'Tron Mainnet is the production environment which is recommended to use for normal users.',
    },
    {
      id: 2,
      name: 'Nile Testnet',
      network: 'nile',
      description:
        'Tron Nile Testnet is mainly used for product development and testing and is not recommended to general users.',
    },
  ];

  const {access} = useAppSelector((state) => state.walletReducer);
  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const handleConfirm = () => {
    dispatch(trc20TokensActions.setNetwork(selectedNetwork));
    router.replace('/(tabs)/home');
  };

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Network Settings'
      />
    );
  };

  const renderContent = () => {
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{padding: 20}}>
          {NETWORKS.map((network, index, array) => {
            const isLastItem = index === array.length - 1;
            return (
              <TouchableOpacity
                key={network.id}
                style={{
                  marginBottom: isLastItem ? 0 : 20,
                  borderBottomWidth: isLastItem ? 0 : 1,
                  borderBottomColor: `${theme.colors.white}20`,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setSelectedNetwork(network.network as 'mainnet' | 'nile');
                }}
              >
                <View>
                  <Text style={{color: theme.colors.white, marginBottom: 10}}>
                    {network.name}
                  </Text>
                  <Text
                    style={{
                      maxWidth: '90%',
                      lineHeight: 20,
                      fontSize: 14,
                      color: `${theme.colors.white}80`,
                      paddingBottom: isLastItem ? 0 : 10,
                    }}
                  >
                    {network.description}
                  </Text>
                </View>
                <View>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: `${theme.colors.white}90`,
                    }}
                  >
                    {selectedNetwork === network.network && <svg.CheckSvg />}
                  </View>
                </View>
              </TouchableOpacity>
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
          label='confirm'
          onPress={() => handleConfirm()}
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
