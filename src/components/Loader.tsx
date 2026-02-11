import React from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';

// --- THEME CONSTANTS ---
const COLORS = {
  primary: '#00D09C', // Your Brand Mint
  background: '#0F1115',
  overlay: 'rgba(15, 17, 21, 0.7)', // Semi-transparent for modal loaders
};

type Props = {
  color?: string;
  size?: 'small' | 'large';
  isFullPage?: boolean; // If true, takes up whole screen
  isOverlay?: boolean;  // If true, adds dark transparent bg
  containerStyle?: ViewStyle;
};

export const Loader: React.FC<Props> = ({
  color = COLORS.primary,
  size = 'large',
  isFullPage = true,
  isOverlay = false,
  containerStyle,
}) => {
  return (
    <View
      style={[
        isFullPage && styles.fullPage,
        isOverlay && styles.overlay,
        containerStyle,
      ]}
    >
      <View style={styles.indicatorWrapper}>
        <ActivityIndicator
          size={size}
          color={color}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorWrapper: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Subtle glassmorphism effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
});