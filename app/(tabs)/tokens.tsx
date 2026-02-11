import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  StatusBar,
  Linking 
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
  success: '#10B981',
  error: '#EF4444',
  inputBg: '#161B22',
};

// --- MOCK DATA (Arbitrum Ecosystem) ---
const ASSETS_DATA = [
  {
    id: 'nit',
    name: 'NiToken',
    symbol: 'NIT',
    price: '1.00',
    change: '+0.01%',
    logo: null, // Use default icon
    isNative: true, // Highlight this
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    price: '2,840.50',
    change: '+2.45%',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  {
    id: 'arb',
    name: 'Arbitrum',
    symbol: 'ARB',
    price: '1.85',
    change: '-1.20%',
    logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
  },
  {
    id: 'usdt',
    name: 'Tether USD',
    symbol: 'USDT',
    price: '1.00',
    change: '+0.00%',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    price: '1.00',
    change: '+0.01%',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  },
  {
    id: 'link',
    name: 'Chainlink',
    symbol: 'LINK',
    price: '18.40',
    change: '+5.12%',
    logo: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
  },
];

export default function Tokens() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredData = ASSETS_DATA.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCMC = () => {
    Haptics.selectionAsync();
    Linking.openURL('https://coinmarketcap.com/');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Market Assets</Text>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={COLORS.textSecondary} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search tokens..."
        placeholderTextColor={COLORS.textSecondary}
        value={search}
        onChangeText={setSearch}
      />
      {search.length > 0 && (
        <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: any }) => {
    const isPositive = item.change.startsWith('+');
    
    return (
      <TouchableOpacity 
        style={[styles.itemCard, item.isNative && styles.nativeCard]}
        activeOpacity={0.7}
        onPress={() => Haptics.selectionAsync()}
      >
        <View style={styles.leftSection}>
            <View style={styles.iconCircle}>
                {item.logo ? (
                    <Image source={{ uri: item.logo }} style={styles.tokenLogo} contentFit="contain" />
                ) : (
                    <Ionicons name="cube" size={24} color={COLORS.primary} />
                )}
            </View>
            <View>
                <Text style={styles.tokenSymbol}>{item.symbol}</Text>
                <Text style={styles.tokenName}>{item.name}</Text>
            </View>
        </View>

        <View style={styles.rightSection}>
            <Text style={styles.tokenPrice}>${item.price}</Text>
            <View style={[
                styles.changeBadge, 
                { backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }
            ]}>
                <Ionicons 
                    name={isPositive ? "caret-up" : "caret-down"} 
                    size={10} 
                    color={isPositive ? COLORS.success : COLORS.error} 
                />
                <Text style={[
                    styles.changeText, 
                    { color: isPositive ? COLORS.success : COLORS.error }
                ]}>
                    {item.change}
                </Text>
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {renderHeader()}
      
      <View style={styles.content}>
        {renderSearchBar()}

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <TouchableOpacity style={styles.footerButton} onPress={handleOpenCMC}>
                <Text style={styles.footerText}>View all on CoinMarketCap</Text>
                <Ionicons name="open-outline" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          }
        />
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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
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

  // List
  listContent: {
    paddingBottom: 100,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nativeCard: {
    borderColor: 'rgba(0, 208, 156, 0.3)',
    backgroundColor: 'rgba(0, 208, 156, 0.05)',
  },
  
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  tokenLogo: {
    width: 28,
    height: 28,
  },
  tokenSymbol: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  tokenName: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  rightSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  tokenPrice: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Footer
  footerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
    opacity: 0.8,
  },
  footerText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});