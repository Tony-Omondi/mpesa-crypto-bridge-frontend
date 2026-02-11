import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Linking, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppSelector } from '@/src/store';

const { width } = Dimensions.get('window');

type Props = {
  title?: string;
  showGoBack?: boolean;
  showCmcLogo?: boolean;
  showTotalValue?: boolean;
  networkHeader?: boolean;
};

export const Header: React.FC<Props> = ({ showGoBack, title, showCmcLogo, showTotalValue, networkHeader }) => {
  const router = useRouter();
  const { network, list, trxData } = useAppSelector((state) => state.trc20TokensReducer);

  const calculateTotalBalance = (): string => {
    const listTotalUSD = list.reduce((sum, token) => sum + (token.balance * (token.price || 0)), 0);
    const total = (trxData?.totalUSD || 0) + listTotalUSD;
    return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <View style={styles.container}>
      <View style={styles.slot}>
        {showGoBack && router.canGoBack() ? (
          <TouchableOpacity onPress={() => { Haptics.selectionAsync(); router.back(); }}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        ) : showTotalValue ? (
          <View>
            <Text style={styles.totalLabel}>Balance</Text>
            <Text style={styles.totalValue}>${calculateTotalBalance()}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.centerSlot}>
        {networkHeader ? (
          <Link href="/networkSettings" asChild>
            <TouchableOpacity style={styles.networkPill}>
              <View style={[styles.dot, { backgroundColor: network === 'nile' ? '#F59E0B' : '#00D09C' }]} />
              <Text style={styles.titleText}>{network === 'nile' ? 'Sepolia' : 'Arbitrum'}</Text>
              <Ionicons name="chevron-down" size={14} color="#94A3B8" />
            </TouchableOpacity>
          </Link>
        ) : (
          <Text style={styles.titleText}>{title}</Text>
        )}
      </View>

      <View style={[styles.slot, { alignItems: 'flex-end' }]}>
        {showCmcLogo && (
          <TouchableOpacity onPress={() => Linking.openURL('https://coinmarketcap.com/')}>
            <Image source={{ uri: 'https://george-fx.github.io/cryptologos/cmc-logo.png' }} style={styles.cmc} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#0F1115', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  slot: { flex: 1 },
  centerSlot: { flex: 2, alignItems: 'center' },
  networkPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6, borderWidth: 1, borderColor: '#334155' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  titleText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  totalLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  totalValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  cmc: { width: 20, height: 20, opacity: 0.8 },
});