import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as SplashScreen from 'expo-splash-screen';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { store, persistor } from '@/src/store';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'SourceSans3-Regular': require('../assets/fonts/SourceSans3-Regular.ttf'),
    'SourceSans3-Medium': require('../assets/fonts/SourceSans3-Medium.ttf'),
    'SourceSans3-SemiBold': require('../assets/fonts/SourceSans3-SemiBold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

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