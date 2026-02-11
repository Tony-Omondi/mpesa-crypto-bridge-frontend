import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  TextInput,
  StatusBar,
  Dimensions 
} from 'react-native';
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
  inputBg: '#161B22',
};

export default function SendScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data - You can connect this to your Redux store later to get real balances
    const tokens = [
        { id: 'nit', name: 'NiToken', symbol: 'NIT', balance: '500.00', icon: 'cube' },
        // Added ETH just to show how the list looks with multiple items
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', balance: '0.042', icon: 'logo-electron' }, 
    ];

    const handleAssetPress = (tokenId: string) => {
        Haptics.selectionAsync();
        router.push({
            pathname: '/enterAddress', // Make sure this file exists in your app folder
            params: { id: tokenId }
        });
    };

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

                <ScrollView showsVerticalScrollIndicator={false}>
                    {tokens.map((token: any) => (
                        <TouchableOpacity
                            key={token.id}
                            style={styles.tokenItem}
                            activeOpacity={0.7}
                            onPress={() => handleAssetPress(token.id)}
                        >
                            {/* Icon */}
                            <View style={styles.iconCircle}>
                                <Ionicons name={token.icon} size={24} color={COLORS.primary} />
                            </View>

                            {/* Token Details */}
                            <View style={styles.tokenInfo}>
                                <Text style={styles.symbol}>{token.symbol}</Text>
                                <Text style={styles.name}>{token.name}</Text>
                            </View>

                            {/* Balance & Arrow */}
                            <View style={styles.rightSection}>
                                <Text style={styles.balanceText}>{token.balance}</Text>
                                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background },
    
    // Header Matches Deposit Screen
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

    // Search Bar
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

    // List Item
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
        backgroundColor: 'rgba(0, 208, 156, 0.1)', // Tinted primary
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