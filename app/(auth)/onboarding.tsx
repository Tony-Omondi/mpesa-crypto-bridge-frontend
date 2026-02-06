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
} from 'react-native';
import {Image} from 'expo-image';
import {SafeAreaView} from 'react-native-safe-area-context';

import {text} from '@/src/text';
import {theme} from '@/src/constants';
import {useAppSelector} from '@/src/store';
import {components} from '@/src/components';

// --- UPDATED CONTENT FOR M-PESA & STABLECOIN CONTEXT ---
const onboardingData = [
  {
    id: 1,
    image: require('../../assets/images/01.png'), // Ensure this image represents "Mobile Money" or "Phone"
    titleLine1: 'Instant Crypto via',
    titleLine2: 'M-Pesa!',
    description1: 'Buy NiTokens ($NIT) directly using your',
    description2: 'M-Pesa balance. No credit cards needed.',
  },
  {
    id: 2,
    image: require('../../assets/images/02.png'), // Ensure this represents "Stability" or "Shield"
    titleLine1: '1 KES = 1 NIT',
    titleLine2: 'Stable & Secure',
    description1: 'Your digital shilling. Pegged 1:1 to KES.',
    description2: 'Protect your savings from volatility.',
  },
  {
    id: 3,
    image: require('../../assets/images/03.png'), // Ensure this represents "Global" or "Speed"
    titleLine1: 'Send Money,',
    titleLine2: 'Not Fees',
    description1: 'Transfer value instantly to anyone.',
    description2: 'Cash out to M-Pesa anytime, anywhere.',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const {access} = useAppSelector((state) => state.walletReducer);

  // Auto-redirect if user is already logged in
  useEffect(() => {
    if (access) {
      router.replace('/(tabs)/home');
    }
  }, [access]);

  const handleScroll = useCallback((event: any) => {
    const slideWidth = Dimensions.get('window').width;
    const currentIndex = Math.round(
      event.nativeEvent.contentOffset.x / slideWidth,
    );
    setCurrentSlideIndex(currentIndex);
  }, []);

  const renderStatusBar = (): React.JSX.Element => {
    return (
      <StatusBar
        barStyle='light-content'
        backgroundColor={theme.colors.eigengrau}
      />
    );
  };

  const renderCarousel = (): React.JSX.Element => {
    return (
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Smooths out the scroll event
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      >
        {onboardingData.map((item) => {
          return (
            <View
              key={item.id}
              style={styles.carouselItem}
            >
              <View style={styles.imageContainer}>
                  <Image
                    source={item.image}
                    contentFit="contain" // Ensures image doesn't get cut off
                    style={styles.carouselImage}
                  />
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const renderDescription = (): React.JSX.Element => {
    return (
      <View style={styles.descriptionContainer}>
        <View style={styles.textWrapper}>
            <text.H1 style={styles.h1}>
            {onboardingData[currentSlideIndex].titleLine1}
            </text.H1>
            <text.H1 style={styles.h1Bottom}>
            {onboardingData[currentSlideIndex].titleLine2}
            </text.H1>
            <text.T16 style={styles.t16}>
            {onboardingData[currentSlideIndex].description1}
            </text.T16>
            <text.T16 style={styles.t16}>
            {onboardingData[currentSlideIndex].description2}
            </text.T16>
        </View>
      </View>
    );
  };

  const renderDots = (): React.JSX.Element => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => {
          return (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlideIndex
                  ? styles.dotActive
                  : styles.dotInactive,
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderButton = (): React.JSX.Element => {
    return (
      <View style={styles.buttonContainer}>
        <components.Button
          label='Get Started'
          containerStyle={styles.mainButton} 
          colorScheme='primary'
          onPress={() => {
            // Navigate to your Auth Welcome screen
            router.push('/(auth)/welcome');
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaProvider}>
      {renderStatusBar()}
      
      {/* Upper Section: Image Carousel */}
      <View style={{flex: 2}}> 
        {renderCarousel()}
      </View>

      {/* Lower Section: Text, Dots, Button */}
      <View style={styles.bottomSection}>
        {renderDescription()}
        {renderDots()}
        {renderButton()}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaProvider: {
    flex: 1,
    backgroundColor: theme.colors.eigengrau,
  },
  // --- CAROUSEL STYLES ---
  carousel: {
    flex: 1,
  },
  carouselItem: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '80%', // Takes up most of the top section
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: Dimensions.get('window').width * 0.8,
    height: '100%', 
  },

  // --- BOTTOM SECTION STYLES ---
  bottomSection: {
    flex: 1.2, // Slightly larger to fit text and buttons comfortably
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  descriptionContainer: {
    paddingHorizontal: 24,
  },
  textWrapper: {
    // Optional: Center text if you prefer that look
    // alignItems: 'center', 
  },
  h1: {
    color: theme.colors.white,
    fontSize: 32, // Make headline punchy
    fontWeight: '700',
  },
  h1Bottom: {
    color: '#00D09C', // Use a 'Crypto Green' or your primary brand color here
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  t16: {
    color: '#B4B4C6',
    fontSize: 16,
    lineHeight: 24,
  },
  
  // --- DOTS ---
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    marginTop: 30,
    marginBottom: 30,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 30, // Elongated active dot
    backgroundColor: '#00D09C', // Match h1Bottom color
  },
  dotInactive: {
    width: 6, // Circle inactive dot
    backgroundColor: `${theme.colors.white}30`,
  },

  // --- BUTTON ---
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    marginTop: 'auto', // Pushes button to bottom of safe area
  },
  mainButton: {
    width: '100%', // Full width button looks better for onboarding
    height: 56,
    borderRadius: 16,
  },
});