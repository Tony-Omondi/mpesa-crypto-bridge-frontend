export type TokenType = {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  contract: string;
  logo: string;
  price: number;
  balance: number;
};

export type ExtendedTokenType = TokenType & {
  totalUSD: number;
};
