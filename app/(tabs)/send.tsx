import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  TextInput,
  StatusBar,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import axios from 'axios';

// Import your existing config and store
import { URLS } from '@/src/config';
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

export default function SendScreen() {
    const router = useRouter();
    const { walletAddress } = useAppSelector((state: any) => state.walletReducer);

    const [searchQuery, setSearchQuery] = useState('');
    const [nitBalance, setNitBalance] = useState('0.00');
    const [ethBalance, setEthBalance] = useState('0.0000');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // --- LOGIC ---
    
    const fetchBalances = async () => {
        try {
            const res = await axios.get(URLS.GET_BALANCE(walletAddress));
            if (res.data && res.data.status === "Success") {
                setNitBalance(res.data.balance_nit.toFixed(2));
                setEthBalance(res.data.balance_eth.toFixed(4));
            }
        } catch (error) {
            console.error("❌ SendScreen Balance Fetch Error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (walletAddress) {
                fetchBalances();
            }
        }, [walletAddress])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchBalances();
    };

    const handleAssetPress = (tokenId: string, balance: string) => {
        Haptics.selectionAsync();
        router.push({
            pathname: '/enterAddress',
            // Passing the balance along so the next screen knows the max amount available
            params: { id: tokenId, maxBalance: balance } 
        });
    };

    // Dynamic data array using the fetched balances
    const tokens = [
        { id: 'nit', name: 'NiToken', symbol: 'NIT', balance: nitBalance, icon: 'cube' },
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', balance: ethBalance, icon: 'logo-electron' }, 
    ];

    // Filter tokens based on search input
    const filteredTokens = tokens.filter(token => 
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- RENDER COMPONENTS ---

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity 
                onPress={() => router.back()} 
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Send Assets</Text>
            <View style={{ width: 40 }} /> 
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
            {renderHeader()}
            
            <View style={styles.contentContainer}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.textSecondary} />
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Search assets..."
                        placeholderTextColor={COLORS.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <Text style={styles.sectionLabel}>Your Assets</Text>

                {loading ? (
                    <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : (
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl 
                                refreshing={refreshing} 
                                onRefresh={onRefresh} 
                                tintColor={COLORS.primary} 
                            />
                        }
                    >
                        {filteredTokens.map((token: any) => (
                            <TouchableOpacity
                                key={token.id}
                                style={styles.tokenItem}
                                activeOpacity={0.7}
                                onPress={() => handleAssetPress(token.id, token.balance)}
                            >
                                <View style={styles.iconCircle}>
                                    <Ionicons name={token.icon as any} size={24} color={COLORS.primary} />
                                </View>

                                <View style={styles.tokenInfo}>
                                    <Text style={styles.symbol}>{token.symbol}</Text>
                                    <Text style={styles.name}>{token.name}</Text>
                                </View>

                                <View style={styles.rightSection}>
                                    <Text style={styles.balanceText}>{token.balance}</Text>
                                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                                </View>
                            </TouchableOpacity>
                        ))}

                        {filteredTokens.length === 0 && (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <Text style={{ color: COLORS.textSecondary }}>No assets found</Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}

// --- STYLES ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background },
    
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    headerTitle: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: '700',
    },

    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        paddingHorizontal: 16,
        height: 50,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 24,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: COLORS.textPrimary,
        fontSize: 15,
    },

    sectionLabel: { 
        color: COLORS.textSecondary, 
        marginBottom: 12, 
        fontSize: 14, 
        fontWeight: '600',
        marginLeft: 4
    },

    tokenItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface, 
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    iconCircle: {
        width: 44, 
        height: 44, 
        borderRadius: 22,
        backgroundColor: 'rgba(0, 208, 156, 0.1)', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginRight: 16
    },
    tokenInfo: {
        flex: 1,
    },
    symbol: { 
        color: COLORS.textPrimary, 
        fontWeight: '700', 
        fontSize: 16,
        marginBottom: 2
    },
    name: { 
        color: COLORS.textSecondary, 
        fontSize: 13 
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    balanceText: {
        color: COLORS.textPrimary,
        fontWeight: '600',
        fontSize: 15
    }
});