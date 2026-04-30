import * as SecureStore from 'expo-secure-store';

const KEYS = {
  PRIVATE_KEY: 'wallet_private_key',
  MNEMONIC: 'wallet_mnemonic_phrase',
};

// ─── SAVE ────────────────────────────────────────────────────────
export const savePrivateKey = async (privateKey: string): Promise<void> => {
  await SecureStore.setItemAsync(KEYS.PRIVATE_KEY, privateKey);
};

export const saveMnemonic = async (mnemonic: string): Promise<void> => {
  await SecureStore.setItemAsync(KEYS.MNEMONIC, mnemonic);
};

// ─── GET ─────────────────────────────────────────────────────────
export const getPrivateKey = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(KEYS.PRIVATE_KEY);
};

export const getMnemonic = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(KEYS.MNEMONIC);
};

// ─── DELETE (on logout) ──────────────────────────────────────────
export const clearSecureStorage = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(KEYS.PRIVATE_KEY);
  await SecureStore.deleteItemAsync(KEYS.MNEMONIC);
};