import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',    // Mint Green
  inactive: '#64748B',   // Slate Gray
  tabBarBg: 'rgba(30, 41, 59, 0.8)', // Semi-transparent dark slate
};

const { width } = Dimensions.get('window');

// 🛑 THE FIX: We explicitly define ONLY the tabs we want to show on the bar.
const VISIBLE_TABS = ['home', 'switchers', 'history', 'profile'];

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom + 10 }]}>
      <BlurView 
        intensity={80} 
        tint="dark" 
        style={styles.blurContainer}
      >
        <View style={styles.tabBarContent}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            // 🛑 THE FIX: If the route is NOT in our allowed list, completely skip it!
            if (!VISIBLE_TABS.includes(route.name)) {
              return null;
            }

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(route.name);
              }
            };

            let iconName: keyof typeof Ionicons.glyphMap = 'home';
            if (route.name === 'home') iconName = isFocused ? 'home' : 'home-outline';
            if (route.name === 'switchers') iconName = isFocused ? 'swap-horizontal' : 'swap-horizontal-outline';
            if (route.name === 'history') iconName = isFocused ? 'receipt' : 'receipt-outline';
            if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';

            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.iconContainer, 
                  isFocused && styles.activeIconContainer
                ]}>
                  <Ionicons 
                    name={iconName} 
                    size={24} 
                    color={isFocused ? COLORS.primary : COLORS.inactive} 
                  />
                  {isFocused && <View style={styles.activeDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, 
        }}
        sceneContainerStyle={{ backgroundColor: COLORS.background }}
      >
        {/* Visible Tabs */}
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="switchers" options={{ title: 'Swap' }} />
        <Tabs.Screen name="history" options={{ title: 'History' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />

        {/* Hidden Tabs */}
        <Tabs.Screen name="deposit" options={{ href: null }} />
        <Tabs.Screen name="send" options={{ href: null }} />
        <Tabs.Screen name="withdraw" options={{ href: null }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  blurContainer: {
    width: width * 0.9,       
    borderRadius: 35,         
    overflow: 'hidden',       
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', 
    backgroundColor: Platform.OS === 'android' ? COLORS.tabBarBg : 'transparent',
  },
  tabBarContent: {
    flexDirection: 'row',
    height: 70,               
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  activeIconContainer: {
    borderRadius: 20,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  }
});