// C:\Users\user\Desktop\mpesa-crypto-bridge-frontend\src\store\walletSlice.tsx

import {persistReducer} from 'redux-persist';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WalletState = {
  access: boolean;
  privateKey: string | null;
  walletAddress: string | null;
  mnemonicPhrase: string | null;
  authToken: string | null;    // CRITICAL: Renamed from token to match your UI screens
  refreshToken: string | null; // NEW: Added to store your 7-day Django Refresh Token
};

const initialState: WalletState = {
  access: false,
  privateKey: null,
  walletAddress: null,
  mnemonicPhrase: null,
  authToken: null,
  refreshToken: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    // Save the short-lived access token
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
    },
    // Save the long-lived refresh token
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    setPrivateKey: (state, action: PayloadAction<string>) => {
      state.privateKey = action.payload;
      state.access = !!(state.walletAddress && state.privateKey && state.mnemonicPhrase);
    },
    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.walletAddress = action.payload;
      state.access = !!(state.walletAddress && state.privateKey && state.mnemonicPhrase);
    },
    setMnemonicPhrase: (state, action: PayloadAction<string>) => {
      state.mnemonicPhrase = action.payload;
      state.access = !!(state.walletAddress && state.privateKey && state.mnemonicPhrase);
    },
    resetWallet: state => {
      state.privateKey = null;
      state.walletAddress = null;
      state.mnemonicPhrase = null;
      state.authToken = null;    // Clear access token on logout
      state.refreshToken = null; // Clear refresh token on logout
      state.access = false;
    },
  },
});

const persistConfig = {
  key: 'wallet',
  storage: AsyncStorage,
};

export const {
  setAuthToken, 
  setRefreshToken, // Export the new action
  resetWallet,
  setPrivateKey,
  setWalletAddress,
  setMnemonicPhrase,
} = walletSlice.actions;

export const walletReducer = persistReducer(persistConfig, walletSlice.reducer);
export const walletActions = walletSlice.actions;