import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';
import {Image} from 'expo-image';
import {useRouter} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';

import {text} from '@/src/text';
import {theme} from '@/src/constants';
import {useAppSelector} from '@/src/store';
import {components} from '@/src/components';

const {width, height} = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();
  const {access} = useAppSelector((state) => state.walletReducer);

  useEffect(() => {
    if (access) {
      router.replace('/(tabs)/home');
    }
  }, [access]);

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER SECTION --- */}
        <View style={styles.headerContainer}>
            <Image
                // Ensure this image is white or light colored, otherwise it might be hard to see too!
                source={require('../../assets/icons/03.png')} 
                contentFit="contain"
                style={styles.logo}
            />
            
            <text.H1 style={styles.title}>
                Welcome To <Text style={{color: theme.colors.primary}}>CoinSafe</Text>
            </text.H1>
            
            {/* FIXED: Text color is now explicitly White/Silver for readability */}
            <text.T16 style={styles.subtitle}>
                Create a new crypto wallet in just a few steps or regain access to
                your crypto wallet.
            </text.T16>
        </View>

        {/* --- BUTTONS ROW (Side by Side) --- */}
        <View style={styles.rowContainer}>
          
          {/* 1. New Wallet (Green, Rounded) */}
          <View style={styles.buttonWrapper}>
            <components.Button
                label="New Wallet"
                colorScheme="primary"
                onPress={() => router.push('/(loading)/createWallet')}
                containerStyle={styles.roundButton} 
                textStyle={{ color: theme.colors.eigengrau, fontWeight: '700' }}
            />
          </View>

          {/* 2. Restore Wallet (Dark, Rounded) */}
          <View style={styles.buttonWrapper}>
            <components.Button
                label="Restore"
                colorScheme="secondary"
                onPress={() => router.push('/(auth)/restoreWithMnemonic')}
                containerStyle={styles.roundButton}
                textStyle={{ color: theme.colors.white, fontWeight: '600' }}
            />
          </View>

        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaProvider}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaProvider: {
    flex: 1,
    backgroundColor: theme.colors.background, // Deep Space (#0B0E11)
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // --- HEADER STYLES ---
  headerContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: height * 0.05,
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    marginBottom: 14,
    color: theme.colors.white, // Ensure Title is White
    fontSize: 32,
  },
  subtitle: {
    textAlign: 'center',
    color: '#B4B4C6', // FIXED: Hardcoded light silver to guarantee visibility on black
    lineHeight: 24,
    maxWidth: '90%', 
  },

  // --- ROW LAYOUT FOR BUTTONS ---
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  buttonWrapper: {
    flex: 1, 
  },
  roundButton: {
    height: 50,
    borderRadius: 50, // Pill Shape
  },
});