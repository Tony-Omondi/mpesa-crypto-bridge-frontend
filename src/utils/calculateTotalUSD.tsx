import type {TokenType} from '@/src/types';

export const calculateTotalUSD = (token: TokenType) => {
  const price = Number(token?.price) || 0;
  const balance = Number(token?.balance) || 0;
  if (price === 0 || balance === 0) return 0;
  const total = price * balance;
  return total.toFixed(2);
};
