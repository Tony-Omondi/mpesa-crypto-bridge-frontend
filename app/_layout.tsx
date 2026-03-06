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

// Prevent the native splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// 🛑 THE TRICK: This variable lives outside the component lifecycle. 
// Once it flips to true, the splash screen can NEVER render again in this session.
let hasPlayedOnce = false;

export default function RootLayout() {
  // Initialize state using the global variable
  const [animationFinished, setAnimationFinished] = useState(hasPlayedOnce);
  
  const [loaded, error] = useFonts({
    'SourceSans3-Regular': require('../assets/fonts/SourceSans3-Regular.ttf'),
    'SourceSans3-Medium': require('../assets/fonts/SourceSans3-Medium.ttf'),
    'SourceSans3-SemiBold': require('../assets/fonts/SourceSans3-SemiBold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Show the Lottie View only if fonts are loading OR the animation hasn't finished its first run
  if (!loaded || !animationFinished) {
    return (
      <View style={styles.splashContainer}>
        <LottieView
          source={require('../assets/animations/miuntlynewsplash.json')}
          autoPlay={true}
          loop={false}
          resizeMode="cover" // Stretches the animation to fill the screen
          onAnimationFinish={() => {
            // Permanently lock out the splash screen for this app session
            hasPlayedOnce = true; 
            setAnimationFinished(true);
          }}
          onLayout={async () => {
            // Hide the static native splash screen as soon as Lottie is ready to render
            await SplashScreen.hideAsync();
          }}
          style={styles.lottie}
        />
      </View>
    );
  }

  // Once fonts are loaded AND the animation is done, render the actual app
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        {/* PersistGate ensures your wallet keys are restored before the UI renders */}
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { flex: 1, backgroundColor: '#0F1115' },
              animation: 'fade_from_bottom', 
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
            
            {/* Other Screens */}
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

// Styles
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#111111', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%', 
    height: '100%', 
  },
});