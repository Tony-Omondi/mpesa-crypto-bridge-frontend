import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Image} from 'expo-image';
import {useRouter} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import {theme} from '@/src/constants';
import {useAppSelector} from '@/src/store';

const {width, height} = Dimensions.get('window');

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
  border: '#334155',
};

export default function Welcome() {
  const router = useRouter();
  const {access} = useAppSelector((state) => state.walletReducer);

  useEffect(() => {
    if (access) {
      router.replace('/(tabs)/home');
    }
  }, [access]);

  const handlePress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Decorative Glow */}
      <View style={styles.glow} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/icons/03.png')} 
                    contentFit="contain"
                    style={styles.logo}
                />
            </View>
            
            {/* Text Section */}
            <View style={styles.textSection}>
                <Text style={styles.title}>
                    Welcome to <Text style={{color: COLORS.primary}}>CoinSafe</Text>
                </Text>
                
                <Text style={styles.subtitle}>
                    The safest way to manage your assets. Create a new wallet or restore an existing one to get started.
                </Text>
            </View>
        </View>

        {/* Action Section */}
        <View style={styles.footer}>
            <TouchableOpacity 
                style={styles.primaryBtn}
                activeOpacity={0.8}
                onPress={() => handlePress('/(loading)/createWallet')}
            >
                <Text style={styles.primaryBtnText}>Create New Wallet</Text>
                <Ionicons name="add-circle-outline" size={20} color="#00332a" />
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.secondaryBtn}
                activeOpacity={0.7}
                onPress={() => handlePress('/(auth)/restoreWithMnemonic')}
            >
                <Text style={styles.secondaryBtnText}>I already have a wallet</Text>
            </TouchableOpacity>
            
            <Text style={styles.legalText}>
                By continuing, you agree to our Terms and Privacy Policy.
            </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  glow: {
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: COLORS.primary,
    opacity: 0.05,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoContainer: {
    marginBottom: 40,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
  },
  textSection: {
    alignItems: 'center',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  footer: {
    width: '100%',
    gap: 16,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#00332a',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  secondaryBtnText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  legalText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 8,
  },
});