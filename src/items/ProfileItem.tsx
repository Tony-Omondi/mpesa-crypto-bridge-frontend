import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { text } from '@/src/text';

// --- THEME CONSTANTS ---
const COLORS = {
  primary: '#00D09C',
  background: '#0F1115',
  surface: '#1E293B',
  border: '#334155',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
};

type Props = {
  item: {
    id: number;
    title: string;
    iconName: keyof typeof Ionicons.hasIcon | string; // Supporting standard Ionicon names
    route: string;
    iconColor?: string;
  };
  isLast?: boolean;
};

export const ProfileItem: React.FC<Props> = ({ item, isLast }) => {
  const router = useRouter();

  const handlePress = () => {
    // Selection haptic for a "mechanical" menu feel
    Haptics.selectionAsync();
    router.push(item.route as any);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.container,
        { marginBottom: isLast ? 0 : 12 }
      ]}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconWrapper}>
          <Ionicons 
            name={item.iconName as any} 
            size={20} 
            color={item.iconColor || COLORS.primary} 
          />
        </View>
        <text.T16 style={styles.title}>{item.title}</text.T16>
      </View>

      <Ionicons 
        name="chevron-forward" 
        size={18} 
        color={COLORS.textSecondary} 
        style={styles.arrow}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  title: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  arrow: {
    opacity: 0.5,
  },
});