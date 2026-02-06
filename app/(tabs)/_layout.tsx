import React from 'react';
import {Tabs} from 'expo-router';
import {View} from 'react-native';

import {useSafeAreaInsets, SafeAreaView} from 'react-native-safe-area-context';

import {svg} from '@/src/svg';
import {theme} from '@/src/constants';
import MyTabBar from '@/src/components/MyTabBar';

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: theme.colors.eigengrau}}
      edges={['top', 'left', 'right']}
    >
      <Tabs
        tabBar={(props) => <MyTabBar {...props} />}
        initialRouteName='home'
        backBehavior='history'
        screenOptions={{lazy: false}}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({focused}) => {
              const color = focused
                ? theme.colors.vividTangerine
                : theme.colors.onyx;
              return <svg.HomeTabSvg color={color} />;
            },
          }}
        />
        <Tabs.Screen
          name='switchers'
          options={{
            title: 'Switchers',
            headerShown: false,
            tabBarIcon: ({focused}) => {
              const color = focused
                ? theme.colors.vividTangerine
                : theme.colors.onyx;
              return <svg.SwitcherTabSvg color={color} />;
            },
          }}
        />
        <Tabs.Screen
          name='tokens'
          options={{
            title: 'Tokens',
            headerShown: false,
            tabBarIcon: ({focused}) => {
              const color = focused
                ? theme.colors.vividTangerine
                : theme.colors.onyx;
              return <svg.TokensTabSvg color={color} />;
            },
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({focused}) => {
              const color = focused
                ? theme.colors.vividTangerine
                : theme.colors.onyx;
              return <svg.ProfileTabSvg color={color} />;
            },
          }}
        />
      </Tabs>
      <View
        style={{
          height: insets.bottom,
          backgroundColor: '#080F16',
        }}
      />
    </SafeAreaView>
  );
}
