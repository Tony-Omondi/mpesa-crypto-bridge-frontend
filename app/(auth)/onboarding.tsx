import React, {useCallback, useState, useEffect} from 'react';
import {useRouter} from 'expo-router';
import {
  View,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import {Image} from 'expo-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {Ionicons} from '@expo/vector-icons';

import {theme} from '@/src/constants';
import {useAppSelector} from '@/src/store';

const { width, height } = Dimensions.get('window');

// --- THEME CONSTANTS ---
const COLORS = {
  background: '#0F1115',
  primary: '#00D09C',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  surface: '#1E293B',
};

const onboardingData = [
  {
    id: 1,
    image: require('../../assets/images/01.png'),
    titleLine1: 'Instant Crypto via',
    titleLine2: 'M-Pesa!',
    description: 'Buy NiTokens ($NIT) directly using your M-Pesa balance. Safe, fast, and no credit cards required.',
  },
  {
    id: 2,
    image: require('../../assets/images/02.png'),
    titleLine1: '1 KES = 1 NIT',
    titleLine2: 'Stable & Secure',
    description: 'Your digital shilling. Pegged 1:1 to KES. Protect your savings from market volatility.',
  },
  {
    id: 3,
    image: require('../../assets/images/03.png'),
    titleLine1: 'Send Money,',
    titleLine2: 'Not Fees',
    description: 'Transfer value instantly to anyone on the network. Cash out to M-Pesa anytime, anywhere.',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const {access} = useAppSelector((state) => state.walletReducer);

  useEffect(() => {
    if (access) {
      router.replace('/(tabs)/home');
    }
  }, [access]);

  const handleScroll = useCallback((event: any) => {
    const currentIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (currentIndex !== currentSlideIndex) {
      setCurrentSlideIndex(currentIndex);
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
    }
  }, [currentSlideIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      
      {/* Skip Button */}
      <TouchableOpacity 
        style={styles.skipBtn} 
        onPress={() => router.push('/(auth)/welcome')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Image Carousel */}
      <View style={styles.carouselSection}>
        <ScrollView
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
        >
          {onboardingData.map((item) => (
            <View key={item.id} style={styles.slide}>
              <Image
                source={item.image}
                contentFit="contain"
                style={styles.image}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Text & Action Section */}
      <View style={styles.detailsSection}>
        
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlideIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title1}>
            {onboardingData[currentSlideIndex].titleLine1}
          </Text>
          <Text style={styles.title2}>
            {onboardingData[currentSlideIndex].titleLine2}
          </Text>
          <Text style={styles.description}>
            {onboardingData[currentSlideIndex].description}
          </Text>
        </View>

        {/* Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.getStartedBtn}
            activeOpacity={0.8}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.push('/(auth)/welcome');
            }}
          >
            <Text style={styles.btnText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#00332a" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  skipBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  skipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  carouselSection: {
    flex: 1.2,
    marginTop: 40,
  },
  slide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.85,
    height: '100%',
  },
  detailsSection: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 32,
    paddingTop: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  textContainer: {
    flex: 1,
  },
  title1: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  title2: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  footer: {
    paddingBottom: 40,
  },
  getStartedBtn: {
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
  btnText: {
    color: '#00332a',
    fontSize: 18,
    fontWeight: '700',
  },
});