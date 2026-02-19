import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as SplashScreen from 'expo-splash-screen';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';

import { store, persistor } from '@/src/store';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 1. Add state to track when the Lottie animation completes
  const [animationFinished, setAnimationFinished] = useState(false);
  
  const [loaded, error] = useFonts({
    'SourceSans3-Regular': require('../assets/fonts/SourceSans3-Regular.ttf'),
    'SourceSans3-Medium': require('../assets/fonts/SourceSans3-Medium.ttf'),
    'SourceSans3-SemiBold': require('../assets/fonts/SourceSans3-SemiBold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // 2. Show the Lottie View if fonts are loading OR the animation is still playing
  if (!loaded || !animationFinished) {
    return (
      <View style={styles.splashContainer}>
        <LottieView
          source={require('../assets/animations/biti.json')}
          autoPlay
          loop={false}
          onAnimationFinish={() => {
            // Signal that the animation is done
            setAnimationFinished(true);
          }}
          onLayout={async () => {
            // 3. Hide the static native splash screen as soon as Lottie is ready to render
            await SplashScreen.hideAsync();
          }}
          style={styles.lottie}
        />
      </View>
    );
  }

  // 4. Once fonts are loaded AND the animation is done, render the actual app
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        {/* PersistGate ensures your wallet keys are restored before the UI renders */}
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              // Swapping eigengrau for the new premium deep dark background
              contentStyle: { flex: 1, backgroundColor: '#0F1115' },
              animation: 'fade_from_bottom', // Smoother transition for fintech feel
            }}
          >
            {/* Auth Group */}
            <Stack.Screen name="(auth)/onboarding" />
            <Stack.Screen name="(auth)/welcome" />
            <Stack.Screen name="(auth)/restoreWithMnemonic" />
            <Stack.Screen name="(auth)/editProfile" />
            
            {/* Main App */}
            <Stack.Screen name="(tabs)" />
            
            {/* Action Screens */}
            <Stack.Screen name="logOut" />
            <Stack.Screen name="(loading)/createWallet" />
            
            {/* Add these if they are separate from tabs */}
            <Stack.Screen name="enterAddress" options={{ presentation: 'card' }} />
            <Stack.Screen name="enterAmount" options={{ presentation: 'card' }} />
            <Stack.Screen name="confirmTransaction" options={{ presentation: 'card' }} />
          </Stack>
        </PersistGate>
      </Provider>
      <FlashMessage 
        position="top" 
        statusBarHeight={StatusBar.currentHeight} 
        floating={true} 
      />
    </SafeAreaProvider>
  );
}

// 5. Add styles for the splash screen container
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#111111', // Matches your app.json splash background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 250, 
    height: 250,
  },
});