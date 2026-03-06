// src/utils/security.ts
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const PRIVATE_KEY_ALIAS = 'secure_wallet_private_key';

export const SecurityHelper = {
  // 1. Check if the phone actually supports FaceID/Fingerprint
  checkHardwareSupport: async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  },

  // 2. Lock the Private Key in the vault
  savePrivateKey: async (privateKey: string) => {
    // This requires the user to unlock the phone to read the data
    await SecureStore.setItemAsync(PRIVATE_KEY_ALIAS, privateKey, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },

  // 3. Ask for Biometrics, then open the vault
  getPrivateKeyWithAuth: async (promptMessage = 'Authenticate to authorize transaction') => {
    // Trigger FaceID / Fingerprint / PIN prompt
    const authResult = await LocalAuthentication.authenticateAsync({
      promptMessage: promptMessage,
      fallbackLabel: 'Use Passcode',
      disableDeviceFallback: false, // Allows them to use their phone PIN if FaceID fails
    });

    if (authResult.success) {
      // If Face/PIN matches, fetch the key from the Secure Store
      const privateKey = await SecureStore.getItemAsync(PRIVATE_KEY_ALIAS);
      return privateKey;
    } else {
      throw new Error('Authentication failed or cancelled.');
    }
  },

  // 4. Wipe the vault on Logout
  deletePrivateKey: async () => {
    await SecureStore.deleteItemAsync(PRIVATE_KEY_ALIAS);
  }
};