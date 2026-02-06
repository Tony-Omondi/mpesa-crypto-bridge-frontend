import {ViewToken} from 'react-native/types';

import type {TokenType} from './TokenType';
import type {TransactionType} from './TransactionType';
import type {MarketTokenType} from './MarketTokenType';
import type {ExtendedTokenType} from './TokenType';

export type ViewableItemsChanged = {
  viewableItems: Array<ViewToken>;
  changed: Array<ViewToken>;
};

export type OnboardingTypes = {
  id: number;
  image: any;
  description: string;
  title: string;
};

export type {TokenType, TransactionType, MarketTokenType, ExtendedTokenType};
