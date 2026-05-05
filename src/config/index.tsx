// src/config.ts

const MAIN_URL = 'https://coinsafe-tron-server.vercel.app/';

export const BASE_URL = 'https://e706-197-232-120-16.ngrok-free.app';

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const REGISTER           = `${BASE_URL}/api/auth/register/`;
export const LOGIN              = `${BASE_URL}/api/auth/login/`;
export const REFRESH_TOKEN      = `${BASE_URL}/api/auth/token/refresh/`;
export const PRIVY_AUTH         = `${BASE_URL}/api/auth/privy/`;        // NEW: seedless login
export const SET_PIN            = `${BASE_URL}/api/auth/set-pin/`;      // NEW: set transaction PIN
export const VERIFY_PIN         = `${BASE_URL}/api/auth/verify-pin/`;   // NEW: verify before payment
export const GET_PROFILE        = `${BASE_URL}/api/auth/profile/`;      // NEW: get user profile
export const UPDATE_PROFILE     = `${BASE_URL}/api/auth/profile/update/`;

// ─── WALLET ───────────────────────────────────────────────────────────────────
export const CREATE_WALLET      = `${BASE_URL}/api/wallet/create/`;
export const RESTORE_WALLET     = `${BASE_URL}/api/wallet/restore/`;

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────
export const INITIATE_PAYMENT   = `${BASE_URL}/api/payments/pay/`;
export const REQUEST_PAYMENT    = `${BASE_URL}/api/payments/request/`;
export const GET_HISTORY        = `${BASE_URL}/api/payments/history/`;
export const PAYMENT_STATUS     = (orderId: number) =>
  `${BASE_URL}/api/payments/status/${orderId}/`;

// ─── MAIN URLS OBJECT ─────────────────────────────────────────────────────────
export const URLS = {
  // External Tron server
  MAIN_URL,
  GET_PRICES:         `${MAIN_URL}prices`,
  GET_BALANCES:       `${MAIN_URL}balances`,
  GET_TRX_DATA:       `${MAIN_URL}trx-data`,
  TRANSFER_TRX:       `${MAIN_URL}transfer/trx`,
  TRANSFER_TRC20:     `${MAIN_URL}transfer/trc20-token`,

  // Wallet
  CREATE_WALLET,
  RESTORE_WALLET,
  TRANSFER_NIT:       `${BASE_URL}/api/wallet/transfer/`,
  WITHDRAW_NIT:       `${BASE_URL}/api/wallet/withdraw/`,
  GET_BALANCE:        (address: string) => `${BASE_URL}/api/wallet/balance/${address}/`,

  // Auth — classic
  REGISTER,
  LOGIN,
  REFRESH_TOKEN,
  UPDATE_PROFILE,

  // Auth — Privy seedless (NEW)
  PRIVY_AUTH,       // POST { privy_token, wallet_address, phone_number }
  SET_PIN,          // POST { pin } — called once after first login
  VERIFY_PIN,       // POST { pin } — called before every outgoing payment
  GET_PROFILE,      // GET  — returns user info + is_seedless + has_transaction_pin

  // Payments
  INITIATE_PAYMENT,
  REQUEST_PAYMENT,
  TRANSACTION_HISTORY: GET_HISTORY,
  PAYMENT_STATUS,
};