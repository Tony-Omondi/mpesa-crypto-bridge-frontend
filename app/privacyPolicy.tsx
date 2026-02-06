import React, {useEffect} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {text} from '@/src/text';
import {utils} from '@/src/utils';
import {useRouter} from 'expo-router';
import {theme} from '@/src/constants';
import {components} from '@/src/components';
import {useAppSelector} from '@/src/store';

const data = [
  {
    id: 1,
    title: '1. Terms',
    description:
      'This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from coinsafe.com (the “Site”).',
  },
  {
    id: 2,
    title: '2. Use Licence',
    description:
      'This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from coinsafe.com (the “Site”).',
  },
];

export default function PrivacyPolicy() {
  const router = useRouter();

  const {access} = useAppSelector((state) => state.walletReducer);
  useEffect(() => {
    if (!access) {
      router.replace('/(auth)/welcome');
    }
  }, [access]);

  const renderHeader = () => {
    return (
      <components.Header
        title='Privacy Policy'
        showGoBack={true}
      />
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
        style={{flex: 1}}
      >
        <Text
          style={{
            fontSize: utils.fontSize(28),
            lineHeight: utils.lineHeight(28, 1.2),
            color: theme.colors.textColor,
            marginBottom: 20,
            ...theme.fonts.SourceSans3_600SemiBold,
          }}
        >
          Privacy policy
        </Text>
        {data.map((item, index, array) => {
          const isLast = index === array.length - 1;

          return (
            <View
              key={index}
              style={{marginBottom: isLast ? 0 : 30}}
            >
              <text.T18 style={{color: theme.colors.textColor}}>
                {item.title}
              </text.T18>
              <text.T16>{item.description}</text.T16>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
}
