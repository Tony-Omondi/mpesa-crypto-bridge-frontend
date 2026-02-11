import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

// Constants matching your previous premium theme
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',    // Mint Green
  inactive: '#64748B',   // Slate Gray
  tabBarBg: 'rgba(30, 41, 59, 0.8)', // Semi-transparent dark slate
};

const { width } = Dimensions.get('window');

/**
 * Custom Floating Tab Bar Component
 */
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

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                // Haptic Feedback for premium feel
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(route.name);
              }
            };

            // Map route names to Ionicons
            let iconName: keyof typeof Ionicons.glyphMap = 'home';
            if (route.name === 'home') iconName = isFocused ? 'home' : 'home-outline';
            if (route.name === 'switchers') iconName = isFocused ? 'swap-horizontal' : 'swap-horizontal-outline';
            if (route.name === 'tokens') iconName = isFocused ? 'wallet' : 'wallet-outline';
            if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';

            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
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
          // Hide standard tab bar since we use a custom one
          tabBarStyle: { display: 'none' }, 
        }}
        // Ensure content isn't hidden behind the floating bar
        sceneContainerStyle={{ backgroundColor: COLORS.background }}
      >
        <Tabs.Screen
          name="home"
          options={{ title: 'Home' }}
        />
        <Tabs.Screen
          name="switchers"
          options={{ title: 'Swap' }}
        />
        <Tabs.Screen
          name="tokens"
          options={{ title: 'Assets' }}
        />
        <Tabs.Screen
          name="profile"
          options={{ title: 'Profile' }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container that positions the floating bar at the bottom
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  // The Glass Pill
  blurContainer: {
    width: width * 0.9,       // 90% of screen width
    borderRadius: 35,         // High rounded corners
    overflow: 'hidden',       // Clips the blur to the radius
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', // Subtle glass border
    backgroundColor: Platform.OS === 'android' ? COLORS.tabBarBg : 'transparent', // Android fallback
  },
  tabBarContent: {
    flexDirection: 'row',
    height: 70,               // Taller tappable area
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
  // Subtle glow/bg for active state (optional, keeps it clean)
  activeIconContainer: {
    // backgroundColor: 'rgba(0, 208, 156, 0.1)', // Optional: enable for a "button" look
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