import { persistReducer } from 'redux-persist';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// PrivateKey and MnemonicPhrase are NO LONGER stored here.
// They live in expo-secure-store (encrypted) via secureStorage.ts
type WalletState = {
  access: boolean;
  walletAddress: string | null;
  authToken: string | null;
  refreshToken: string | null;
};

const initialState: WalletState = {
  access: false,
  walletAddress: null,
  authToken: null,
  refreshToken: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.walletAddress = action.payload;
      state.access = !!action.payload;
    },
    resetWallet: (state) => {
      state.walletAddress = null;
      state.authToken = null;
      state.refreshToken = null;
      state.access = false;
      // Note: Also call clearSecureStorage() from secureStorage.ts on logout!
    },
  },
});

const persistConfig = {
  key: 'wallet',
  storage: AsyncStorage,
};

export const {
  setAuthToken,
  setRefreshToken,
  setWalletAddress,
  resetWallet,
} = walletSlice.actions;

export const walletReducer = persistReducer(persistConfig, walletSlice.reducer);
export const walletActions = walletSlice.actions;