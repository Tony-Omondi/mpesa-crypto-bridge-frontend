import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/src/constants';
import { components } from '@/src/components';

export default function SendScreen() {
    const router = useRouter();

    // This list can be dynamic later, but for now we hardcode NIT
    const tokens = [
        { id: 'nit', name: 'NiToken', symbol: 'NIT' },
        // You can add { id: 'eth', name: 'Ethereum', symbol: 'ETH' } later
    ];

    return (
        <SafeAreaView style={styles.container}>
            <components.Header title="Send" showGoBack={true} />
            
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Select Asset to Send</Text>

                {tokens.map((token) => (
                    <TouchableOpacity
                        key={token.id}
                        style={styles.tokenItem}
                        onPress={() => {
                            // This navigates to the "Enter Address" screen you already created
                            router.push({
                                pathname: '/enterAddress',
                                params: { id: token.id }
                            });
                        }}
                    >
                        <View style={styles.iconCircle}>
                            <Text style={{fontSize: 20}}>💰</Text>
                        </View>
                        <View>
                            <Text style={styles.symbol}>{token.symbol}</Text>
                            <Text style={styles.name}>{token.name}</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                             <Text style={{fontSize: 20, color: theme.colors.eigengrau}}>→</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: 20 },
    label: { color: theme.colors.textSecondary, marginBottom: 15, fontSize: 16, fontWeight: '600' },
    tokenItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary, 
        padding: 16,
        borderRadius: 16,
        marginBottom: 12
    },
    iconCircle: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
        marginRight: 15
    },
    symbol: { color: theme.colors.eigengrau, fontWeight: 'bold', fontSize: 18 },
    name: { color: theme.colors.eigengrau, opacity: 0.7, fontSize: 14 }
});