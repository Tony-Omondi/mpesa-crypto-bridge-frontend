import {persistReducer} from 'redux-persist';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WalletState = {
  access: boolean;
  privateKey: string | null;
  walletAddress: string | null;
  mnemonicPhrase: string | null;
  token: string | null; // CRITICAL: Added this to store your Django Auth Token
};

const initialState: WalletState = {
  access: false,
  privateKey: null,
  walletAddress: null,
  mnemonicPhrase: null,
  token: null, // Initialize as null
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    // UPDATED: Save the token during registration or login
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
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
      state.token = null; // Clear token on logout
      state.access = false;
    },
  },
});

const persistConfig = {
  key: 'wallet',
  storage: AsyncStorage,
};

export const {
  setAuthToken, // Export the new action
  resetWallet,
  setPrivateKey,
  setWalletAddress,
  setMnemonicPhrase,
} = walletSlice.actions;

export const walletReducer = persistReducer(persistConfig, walletSlice.reducer);
export const walletActions = walletSlice.actions;