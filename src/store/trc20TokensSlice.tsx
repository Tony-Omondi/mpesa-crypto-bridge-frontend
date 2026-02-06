import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';

import {NILE_TESTNET_TOKENS, TRC20_TOKENS, TRX_DATA} from '@/src/tokens';
import type {ExtendedTokenType, TokenType} from '@/src/types';
import {filteredTokens} from '@/src/utils/filteredTokens';

type InitialStateType = {
  network: string;
  list: TokenType[];
  trxData: ExtendedTokenType;
  pricesUpdateInterval: number;
  trxDataUpdateInterval: number;
  nileTestnetTokens: TokenType[];
  balancesUpdateInterval: number;
};

const initialState: InitialStateType = {
  network: 'mainnet',
  trxData: TRX_DATA,
  list: filteredTokens(TRC20_TOKENS),
  pricesUpdateInterval: 0,
  trxDataUpdateInterval: 0,
  balancesUpdateInterval: 0,
  nileTestnetTokens: NILE_TESTNET_TOKENS,
};

const trc20TokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    addToken: (state, action: PayloadAction<TokenType>) => {
      const token = action.payload;
      const tokenExists = state.list.some((item) => item.id === token.id);
      if (!tokenExists) {
        state.list.push(token);
      }
    },
    removeToken: (state, action: PayloadAction<string>) => {
      const tokenId = action.payload;
      state.list = state.list.filter(
        (token) => token.id !== tokenId && token.name !== tokenId,
      );
    },
    updateTokenPrices: (
      state,
      action: PayloadAction<Record<string, {usd: number}>>,
    ) => {
      const prices = action.payload;

      if (state.network === 'nile') {
        state.nileTestnetTokens = state.nileTestnetTokens.map((token) => ({
          ...token,
          price: prices[token.id]?.usd ?? token.price,
        }));
      } else if (state.network === 'mainnet') {
        state.list = state.list.map((token) => ({
          ...token,
          price: prices[token.id]?.usd ?? token.price,
        }));
      }
    },
    updateTokenBalances: (
      state,
      action: PayloadAction<Array<{address: string; balance: number}>>,
    ) => {
      const tokens = action.payload;

      if (state.network === 'nile') {
        state.nileTestnetTokens = state.nileTestnetTokens.map((token) => {
          const found = tokens.find((b) => b.address === token.contract);
          return {
            ...token,
            balance: found ? found.balance : token.balance,
          };
        });
      } else if (state.network === 'mainnet') {
        state.list = state.list.map((token) => {
          const found = tokens.find((b) => b.address === token.contract);
          return {
            ...token,
            balance: found ? found.balance : token.balance,
          };
        });
      }
    },
    updatePriceForTRX: (state, action: PayloadAction<number>) => {
      state.trxData.price = action.payload;
    },
    updateTotalUSDForTRX: (state, action: PayloadAction<number>) => {
      state.trxData.totalUSD = action.payload;
    },
    updateBalanceForTRX: (state, action: PayloadAction<number>) => {
      state.trxData.balance = action.payload;
    },
    setNetwork: (state, action: PayloadAction<string>) => {
      state.trxData = TRX_DATA;
      state.network = action.payload;
      state.pricesUpdateInterval = 0;
      state.trxDataUpdateInterval = 0;
      state.balancesUpdateInterval = 0;
    },
    setPricesUpdateInterval: (state, action: PayloadAction<number>) => {
      state.pricesUpdateInterval = action.payload;
    },
    resetPricesUpdateInterval: (state) => {
      state.pricesUpdateInterval = 0;
    },
    setBalancesUpdateInterval: (state, action: PayloadAction<number>) => {
      state.balancesUpdateInterval = action.payload;
    },
    resetBalancesUpdateInterval: (state) => {
      state.balancesUpdateInterval = 0;
    },
    setTrxDataUpdateInterval: (state, action: PayloadAction<number>) => {
      state.trxDataUpdateInterval = action.payload;
    },
    resetTrxDataUpdateInterval: (state) => {
      state.trxDataUpdateInterval = 0;
    },
    resetAllIntervals: (state) => {
      state.pricesUpdateInterval = 0;
      state.trxDataUpdateInterval = 0;
      state.balancesUpdateInterval = 0;
    },
    resetAll: () => initialState,
  },
});

const persistConfig = {
  key: 'trc20Tokens',
  storage: AsyncStorage,
};

export const trc20TokensReducer = persistReducer(
  persistConfig,
  trc20TokensSlice.reducer,
);

export const trc20TokensActions = trc20TokensSlice.actions;
