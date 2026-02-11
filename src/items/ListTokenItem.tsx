import React from 'react';
import { View, Switch, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

import { text } from '@/src/text';
import { theme } from '@/src/constants';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { trc20TokensActions } from '@/src/store/trc20TokensSlice';

import type { TokenType } from '@/src/types';

// --- THEME CONSTANTS ---
const COLORS = {
  primary: '#00D09C',
  background: '#0F1115',
  surface: '#1E293B',
  border: '#334155',
  textSecondary: '#94A3B8',
};

export const ListTokenItem = React.memo(({ token }: { token: TokenType }) => {
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((state) => state.trc20TokensReducer);

  const isEnabled = list.some((item) => (item.id || item.name) === token.id);

  const toggleSwitch = () => {
    // Tactile feedback based on OS
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isEnabled) {
      dispatch(trc20TokensActions.removeToken(token.id));
    } else {
      dispatch(trc20TokensActions.addToken(token));
      dispatch(trc20TokensActions.resetPricesUpdateInterval());
      dispatch(trc20TokensActions.resetBalancesUpdateInterval());
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.container,
        isEnabled && styles.containerActive
      ]}
      onPress={toggleSwitch}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Image
            source={{ uri: token.logo }}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        <View style={styles.textWrapper}>
          <text.T16 style={styles.symbol}>
            {token.symbol.toUpperCase()}
          </text.T16>
          <text.T14 style={styles.name} numberOfLines={1}>
            {token.name}
          </text.T14>
        </View>
      </View>

      <Switch
        trackColor={{ false: '#334155', true: 'rgba(0, 208, 156, 0.4)' }}
        thumbColor={isEnabled ? COLORS.primary : '#94A3B8'}
        ios_backgroundColor="#1E293B"
        onValueChange={toggleSwitch}
        value={isEnabled}
        // Slightly smaller switch for a cleaner look
        style={Platform.OS === 'ios' ? { transform: [{ scale: 0.8 }] } : {}}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  containerActive: {
    borderColor: 'rgba(0, 208, 156, 0.2)',
    backgroundColor: 'rgba(0, 208, 156, 0.03)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  textWrapper: {
    justifyContent: 'center',
  },
  symbol: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  name: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});