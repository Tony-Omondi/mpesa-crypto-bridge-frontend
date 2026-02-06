import React from 'react';
import {useRouter} from 'expo-router';
import {View, SafeAreaView, ScrollView} from 'react-native';

import {svg} from '@/src/svg';
import {text} from '@/src/text';
import {theme} from '@/src/constants';
import {components} from '@/src/components';

export default function TransactionFailed() {
  const router = useRouter();

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
        <svg.FailedSvg />
        <text.T18
          style={{
            marginTop: 20,
            fontSize: 20,
            fontWeight: '600',
            color: theme.colors.white,
          }}
        >
          Transaction Failed
        </text.T18>
        <text.T18
          style={{
            marginBottom: 10,
            color: 'red',
            textAlign: 'center',
            fontWeight: '600',
          }}
        >
          Try again later.
        </text.T18>
      </ScrollView>
    );
  };

  const renderButton = () => {
    return (
      <View style={{padding: 20}}>
        <components.Button
          label='Go to Home'
          onPress={() => router.replace('/(tabs)/home')}
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
