import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { text } from '@/src/text';

// --- THEME CONSTANTS ---
const COLORS = {
  warning: '#F59E0B', // Amber/Orange for warnings
  background: '#1E293B', // Dark surface
  border: 'rgba(245, 158, 11, 0.2)', // Subtle amber border
};

type Props = {
  containerStyle?: ViewStyle;
  children?: React.ReactNode;
  type?: 'warning' | 'info'; // Added types for flexibility
};

export const Reminder: React.FC<Props> = ({ containerStyle, children, type = 'warning' }) => {
  const isWarning = type === 'warning';

  return (
    <View
      style={[
        styles.container,
        !isWarning && styles.infoContainer,
        containerStyle,
      ]}
    >
      <View style={styles.iconWrapper}>
        <Ionicons 
          name={isWarning ? "alert-circle" : "information-circle"} 
          size={18} 
          color={isWarning ? COLORS.warning : '#94A3B8'} 
        />
      </View>
      
      <View style={styles.textWrapper}>
        <text.T14
          style={[
            styles.reminderText,
            !isWarning && { color: '#94A3B8' }
          ]}
        >
          {children}
        </text.T14>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.08)', // Tinted Amber
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContainer: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  iconWrapper: {
    marginTop: 2, // Slight alignment adjustment for the icon
  },
  textWrapper: {
    flex: 1,
  },
  reminderText: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.warning,
    fontWeight: '500',
  },
});