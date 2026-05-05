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
import { PrivyProvider } from '@privy-io/expo';

import { store, persistor } from '@/src/store';

SplashScreen.preventAutoHideAsync();

let hasPlayedOnce = false;

export default function RootLayout() {
  const [animationFinished, setAnimationFinished] = useState(hasPlayedOnce);

  const [loaded, error] = useFonts({
    'SourceSans3-Regular': require('../assets/fonts/SourceSans3-Regular.ttf'),
    'SourceSans3-Medium': require('../assets/fonts/SourceSans3-Medium.ttf'),
    'SourceSans3-SemiBold': require('../assets/fonts/SourceSans3-SemiBold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded || !animationFinished) {
    return (
      <View style={styles.splashContainer}>
        <LottieView
          source={require('../assets/animations/miuntlynewsplash.json')}
          autoPlay={true}
          loop={false}
          resizeMode="cover"
          onAnimationFinish={() => {
            hasPlayedOnce = true;
            setAnimationFinished(true);
          }}
          onLayout={async () => {
            await SplashScreen.hideAsync();
          }}
          style={styles.lottie}
        />
      </View>
    );
  }

  return (
    // ── PrivyProvider wraps everything so usePrivy() works in any screen ──────
    // appId comes from .env as EXPO_PUBLIC_PRIVY_APP_ID
    // The secret key NEVER goes here — backend only
    <PrivyProvider
      appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID!}
      clientId={process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID!}
    >
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { flex: 1, backgroundColor: '#0F1115' },
                animation: 'fade_from_bottom',
              }}
            >
              {/* ── Auth Group ───────────────────────────────────────────── */}
              <Stack.Screen name="(auth)/onboarding" />
              <Stack.Screen name="(auth)/welcome" />
              <Stack.Screen name="(auth)/setPin" />          {/* NEW: PIN setup after first Privy login */}
              <Stack.Screen name="(auth)/restoreWithMnemonic" />
              <Stack.Screen name="(auth)/editProfile" />

              {/* ── Main App ─────────────────────────────────────────────── */}
              <Stack.Screen name="(tabs)" />

              {/* ── Loading Screens ──────────────────────────────────────── */}
              <Stack.Screen name="(loading)/createWallet" />
              <Stack.Screen name="(loading)/privyAuth" />    {/* NEW: Privy → Django JWT bridge */}

              {/* ── Action Screens ───────────────────────────────────────── */}
              <Stack.Screen name="logOut" />
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
    </PrivyProvider>
  );
}

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