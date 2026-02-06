import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // ADDED
import * as SplashScreen from 'expo-splash-screen';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store, persistor } from '@/src/store'; // ADDED persistor
import { theme } from '@/src/constants';

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
        {/* PersistGate delays rendering until the wallet keys are loaded from storage */}
        <PersistGate loading={null} persistor={persistor}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { flex: 1, backgroundColor: theme.colors.eigengrau },
            }}
          >
            <Stack.Screen name="(auth)/onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/welcome" options={{ headerShown: false }} />
            <Stack.Screen name="logOut" options={{ headerShown: false }} />
            <Stack.Screen name="(loading)/createWallet" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/restoreWithMnemonic" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/editProfile" options={{ headerShown: false }} />
          </Stack>
        </PersistGate>
      </Provider>
      <FlashMessage position="top" />
    </SafeAreaProvider>
  );
}