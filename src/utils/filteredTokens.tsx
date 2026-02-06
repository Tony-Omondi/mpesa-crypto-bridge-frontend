import type {TokenType} from '@/src/types';

export const filteredTokens = (tokens: TokenType[]): TokenType[] => {
  return tokens
    .filter(
      (token) =>
        token.id === 'tether' || token.id === 'just' || token.id === 'usd-coin',
    )
    .sort((a, b) => {
      if (a.id === 'tether') return -1;
      if (b.id === 'tether') return 1;
      if (a.id === 'usd-coin') return -1;
      if (b.id === 'usd-coin') return 1;
      if (a.id === 'just') return 1;
      if (b.id === 'just') return -1;
      return 0;
    });
};
