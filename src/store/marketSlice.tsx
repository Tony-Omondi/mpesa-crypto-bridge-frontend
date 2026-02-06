import {persistReducer} from 'redux-persist';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {TokenType} from '@/src/types';

export type MarketState = {
  tokens: any[];
  marketData: any[];
  marketUpdateInterval: number;
};

const initialState: MarketState = {
  tokens: [],
  marketData: [],
  marketUpdateInterval: 0,
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    updateMarket: (state, action: PayloadAction<{tokens: TokenType[]}>) => {
      state.tokens = action.payload.tokens;
    },
    setMarketUpdateInterval: (state, action: PayloadAction<number>) => {
      state.marketUpdateInterval = action.payload;
    },
  },
});

const persistConfig = {
  key: 'tokens',
  storage: AsyncStorage,
};

export const {updateMarket, setMarketUpdateInterval} = marketSlice.actions;
export const marketReducer = persistReducer(persistConfig, marketSlice.reducer);
