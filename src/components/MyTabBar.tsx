import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115', // Matches your OLED dark theme
  primary: '#00D09C',    // Your Brand Neo-Mint
  inactive: '#94A3B8',   // Slate gray for inactive icons
  surface: '#1E293B',    // Slightly lighter for depth
};

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { buildHref } = useLinkBuilder();

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // Use the icons defined in your (tabs)/_layout.tsx
        const icon = options.tabBarIcon
          ? options.tabBarIcon({
              focused: isFocused,
              color: isFocused ? COLORS.primary : COLORS.inactive,
              size: 24,
            })
          : null;

        const onPress = () => {
          // Add a light haptic tick on every tab switch
          if (!isFocused) {
            Haptics.selectionAsync();
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            {/* Active Top Bar Indicator */}
            {isFocused && <View style={styles.activeIndicator} />}
            
            <View style={[
              styles.iconWrapper,
              isFocused && styles.activeIconWrapper
            ]}>
              {icon}
            </View>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    // Modern rounded top corners
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // Subtle border to separate from screen content
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    // Elevation for Android / Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10, // Handle iOS notch
    height: Platform.OS === 'ios' ? 90 : 70,
    position: 'absolute', // Makes the tab bar "float" over content
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 3,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    // Subtle glow under the indicator
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  iconWrapper: {
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrapper: {
    // Optional: make active icon slightly larger or add more padding
  }
});

export default TabBar;