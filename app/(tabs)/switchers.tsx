import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  TextInput,
  StatusBar 
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useAppSelector } from '@/src/store';

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  inputBg: '#161B22',
};

// Mock Data (Replacing TRC20_TOKENS with Arbitrum tokens for consistency)
const MOCK_TOKENS = [
  { id: '1', symbol: 'USDT', name: 'Tether USD', balance: '0.00', enabled: true },
  { id: '2', symbol: 'USDC', name: 'USD Coin', balance: '150.00', enabled: true },
  { id: '3', symbol: 'ARB', name: 'Arbitrum', balance: '240.50', enabled: true },
  { id: '4', symbol: 'WBTC', name: 'Wrapped BTC', balance: '0.00', enabled: false },
  { id: '5', symbol: 'LINK', name: 'Chainlink', balance: '0.00', enabled: false },
  { id: '6', symbol: 'UNI', name: 'Uniswap', balance: '12.00', enabled: true },
  { id: '7', symbol: 'DAI', name: 'Dai Stablecoin', balance: '0.00', enabled: false },
  { id: '8', symbol: 'AAVE', name: 'Aave', balance: '0.00', enabled: false },
];

export default function Switchers() {
  const router = useRouter();
  
  // Using 'network' from your existing store logic
  const { network } = useAppSelector((state) => state.trc20TokensReducer); 
  
  const [searchText, setSearchText] = useState('');
  const [tokens, setTokens] = useState(MOCK_TOKENS);

  // Filter tokens based on search
  const filteredTokens = tokens.filter(t => 
    t.name.toLowerCase().includes(searchText.toLowerCase()) || 
    t.symbol.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleToken = (id: string) => {
    Haptics.selectionAsync();
    setTokens(current => 
      current.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t)
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Manage Assets</Text>
      <View style={[
        styles.networkBadge, 
        { backgroundColor: network === 'nile' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0, 208, 156, 0.1)' }
      ]}>
        <View style={[
            styles.dot, 
            { backgroundColor: network === 'nile' ? '#F59E0B' : COLORS.primary }
        ]} />
        <Text style={[
            styles.networkText,
            { color: network === 'nile' ? '#F59E0B' : COLORS.primary }
        ]}>
            {network === 'nile' ? 'Sepolia Testnet' : 'Arbitrum One'}
        </Text>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={COLORS.textSecondary} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search assets..."
        placeholderTextColor={COLORS.textSecondary}
        value={searchText}
        onChangeText={setSearchText}
      />
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.tokenRow}>
      <View style={styles.leftSection}>
        <View style={styles.iconCircle}>
          {/* Using Ionicons as placeholder, swap for <Image> with URL if needed */}
          <Ionicons name="cube" size={20} color={COLORS.primary} />
        </View>
        <View>
          <Text style={styles.tokenSymbol}>{item.symbol}</Text>
          <Text style={styles.tokenName}>{item.name}</Text>
        </View>
      </View>
      
      <Switch
        trackColor={{ false: '#334155', true: 'rgba(0, 208, 156, 0.5)' }}
        thumbColor={item.enabled ? COLORS.primary : '#94A3B8'}
        onValueChange={() => toggleToken(item.id)}
        value={item.enabled}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
        <Ionicons name="construct-outline" size={48} color={COLORS.textSecondary} />
        <Text style={styles.emptyText}>
            Asset list is empty for this network.
        </Text>
        <Text style={styles.emptySub}>
            Try switching networks in Settings.
        </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {renderHeader()}
      
      <View style={styles.content}>
        {renderSearchBar()}

        {/* List Content */}
        {network === 'mainnet' || network === undefined ? ( // Assuming undefined/default is mainnet
             <FlatList
                data={filteredTokens}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
             />
        ) : (
             renderEmptyState()
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  networkText: {
    fontSize: 12,
    fontWeight: '700',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.textPrimary,
    fontSize: 15,
  },

  // List Item
  listContent: {
    paddingBottom: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 60, // Indent separator to align with text
  },
  
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tokenSymbol: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  tokenName: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    marginTop: 40,
  },
  emptyText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    marginTop: 16,
    fontWeight: '600',
  },
  emptySub: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
});