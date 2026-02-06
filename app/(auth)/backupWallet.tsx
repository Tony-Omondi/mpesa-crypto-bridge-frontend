import React, {useState} from 'react';
import {View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter, useLocalSearchParams} from 'expo-router';

import {theme} from '@/src/constants';
import {components} from '@/src/components';
import {useAppSelector} from '@/src/store';

export default function BackupWallet() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phrase: string }>();
  
  // Use params from navigation first, fallback to Redux
  const reduxMnemonic = useAppSelector((state) => state.walletReducer.mnemonic);
  const mnemonic = params.phrase || reduxMnemonic; 

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (mnemonic) {
      await Clipboard.setStringAsync(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDone = () => router.replace('/(tabs)/home');

  const words = mnemonic ? mnemonic.split(' ') : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <components.Header title="Backup Wallet" showGoBack={false} />

        <View style={styles.headerText}>
          <Text style={styles.subtitle}>
            Write down these 12 words. If you lose your phone, this phrase is the <Text style={{color: theme.colors.error}}>only way</Text> to recover your money.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.grid}>
            {words.length === 12 ? (
                words.map((word, index) => (
                    <View key={index} style={styles.wordContainer}>
                        <Text style={styles.wordIndex}>{index + 1}</Text>
                        <Text style={styles.wordText}>{word}</Text>
                    </View>
                ))
            ) : (
                <Text style={{color: theme.colors.error, padding: 20, textAlign: 'center'}}>
                    Waiting for keys... If empty, please go back and try again.
                </Text>
            )}
          </View>
          
          <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
            <Text style={styles.copyText}>{copied ? "Copied! ✅" : "Copy to Clipboard"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Security Alert</Text>
          <Text style={styles.warningText}>
            Never share these words. CoinSafe support will NEVER ask for them.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <components.Button
          label="I Have Written It Down"
          colorScheme="primary"
          onPress={handleDone}
          containerStyle={{ borderRadius: 50, height: 56 }}
          textStyle={{ color: theme.colors.eigengrau, fontWeight: '700' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.sizes.padding, paddingBottom: 100 },
  headerText: { marginBottom: 24 },
  subtitle: { color: '#FFFFFF', fontSize: 16, lineHeight: 24 },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.sizes.radius,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 24,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  wordContainer: {
    width: '31%', 
    backgroundColor: '#2A303C', // Lighter for contrast
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  wordIndex: { position: 'absolute', top: 2, left: 6, color: '#9CA3AF', fontSize: 10 },
  wordText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginTop: 6 },
  copyButton: { marginTop: 20, alignItems: 'center', paddingVertical: 10, backgroundColor: 'rgba(0, 208, 156, 0.1)', borderRadius: 8 },
  copyText: { color: theme.colors.primary, fontWeight: '600', fontSize: 16 },
  warningBox: { backgroundColor: 'rgba(255, 59, 92, 0.15)', borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: theme.colors.error },
  warningTitle: { color: theme.colors.error, fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  warningText: { color: '#D1D5DB', fontSize: 14, lineHeight: 20 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: theme.sizes.padding, backgroundColor: theme.colors.background, paddingBottom: 20 },
}); 