import React from 'react';
import {
  ActivityIndicator,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import {theme} from '@/src/constants';
import {text} from '@/src/text';

// --- THEME CONSTANTS ---
const COLORS = {
  primary: '#00D09C',
  background: '#0F1115',
  surface: '#1E293B',
  error: '#EF4444',
  textPrimary: '#FFFFFF',
  textDark: '#00332a',
  border: '#334155',
};

type Props = {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  
  // Style Props
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  
  // Variant
  colorScheme?: 'primary' | 'secondary' | 'error' | 'outline';
};

export const Button: React.FC<Props> = ({
  label,
  onPress,
  textStyle,
  loading = false,
  disabled = false,
  colorScheme = 'primary',
  containerStyle,
}) => {

  const handlePress = () => {
    if (loading || disabled) return;
    
    // Provide tactile feedback for every button in the app globally
    if (colorScheme === 'primary') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.selectionAsync();
    }
    
    onPress?.();
  };

  // Determine Background Colors
  const getBtnStyles = () => {
    switch (colorScheme) {
      case 'primary':
        return {
          backgroundColor: COLORS.primary,
          borderWidth: 0,
          // Primary Glow
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        };
      case 'error':
        return {
          backgroundColor: COLORS.error,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: COLORS.border,
        };
      case 'secondary':
      default:
        return {
          backgroundColor: COLORS.surface,
          borderWidth: 1,
          borderColor: COLORS.border,
        };
    }
  };

  // Determine Text Colors
  const getTextColor = () => {
    if (disabled) return COLORS.textSecondary;
    switch (colorScheme) {
      case 'primary':
        return COLORS.textDark;
      case 'outline':
        return COLORS.primary;
      default:
        return COLORS.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={loading || disabled}
      style={[
        styles.base,
        getBtnStyles(),
        (disabled || loading) && styles.disabled,
        containerStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={getTextColor()}
          size='small'
        />
      ) : (
        <text.T16
          style={[
            styles.label,
            { color: getTextColor() },
            textStyle,
          ]}
        >
          {label}
        </text.T16>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 58, // Taller, premium touch target
    borderRadius: 20, // Modern rounded aesthetic
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.5,
  },
});