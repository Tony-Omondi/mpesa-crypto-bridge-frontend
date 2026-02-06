import React from 'react';
import {
  ActivityIndicator,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import {theme} from '@/src/constants';
import {text} from '@/src/text';

type Props = {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  
  // Style Props
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle; // Backward compatibility
  textStyle?: TextStyle;  // Forward compatibility (used in Onboarding)
  
  // Variant
  colorScheme?: 'primary' | 'secondary' | 'error';
  version?: 'light' | 'orange'; // Kept for legacy code compatibility
};

export const Button: React.FC<Props> = ({
  label,
  onPress,
  titleStyle,
  textStyle,
  loading = false,
  colorScheme = 'primary',
  containerStyle,
}) => {

  // 1. Determine Background Color based on Scheme
  const getBackgroundColor = () => {
    switch (colorScheme) {
      case 'primary':
        return theme.colors.primary; // Neo Mint (#00D09C)
      case 'error':
        return theme.colors.error;   // M-Pesa Rose (#FF3B5C)
      case 'secondary':
      default:
        return theme.colors.card;    // Gunmetal (#1B2028)
    }
  };

  // 2. Determine Text Color (Contrast)
  const getTextColor = () => {
    switch (colorScheme) {
      case 'primary':
        return theme.colors.eigengrau; // Dark text on Bright Green button
      default:
        return theme.colors.white;     // White text on Dark buttons
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={loading}
      style={{
        height: 56, // Modern, taller touch target
        backgroundColor: getBackgroundColor(),
        borderRadius: theme.sizes.radius,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        
        // Add "Authentic Glow" only for Primary buttons
        ...(colorScheme === 'primary' && {
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 4, // Android shadow
        }),
        
        ...containerStyle,
      }}
    >
      {loading ? (
        <ActivityIndicator
          color={getTextColor()}
          size='small'
        />
      ) : (
        <text.T16
          style={{
            color: getTextColor(),
            fontWeight: '700', // Bold for Calls to Action
            // Merge both style props to support all usages
            ...titleStyle,
            ...textStyle,
          }}
        >
          {label}
        </text.T16>
      )}
    </TouchableOpacity>
  );
};