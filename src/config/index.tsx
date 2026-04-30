// src/config.ts

const MAIN_URL = 'https://coinsafe-tron-server.vercel.app/';

export const BASE_URL = 'https://f007-197-232-18-159.ngrok-free.app';

export const CREATE_WALLET = `${BASE_URL}/api/wallet/create/`;
export const RESTORE_WALLET = `${BASE_URL}/api/wallet/restore/`;
export const REGISTER = `${BASE_URL}/api/auth/register/`;
export const LOGIN = `${BASE_URL}/api/auth/login/`;
export const REFRESH_TOKEN = `${BASE_URL}/api/auth/token/refresh/`;
export const INITIATE_PAYMENT = `${BASE_URL}/api/payments/pay/`;
export const GET_HISTORY = `${BASE_URL}/api/payments/history/`;
export const PAYMENT_STATUS = (orderId: number) => `${BASE_URL}/api/payments/status/${orderId}/`;

export const URLS = {
    MAIN_URL,
    GET_PRICES: `${MAIN_URL}prices`,
    GET_BALANCES: `${MAIN_URL}balances`,
    GET_TRX_DATA: `${MAIN_URL}trx-data`,
    TRANSFER_TRX: `${MAIN_URL}transfer/trx`,
    TRANSFER_TRC20: `${MAIN_URL}transfer/trc20-token`,
    TRANSFER_NIT: `${BASE_URL}/api/wallet/transfer/`,
    WITHDRAW_NIT: `${BASE_URL}/api/wallet/withdraw/`,
    CREATE_WALLET,
    RESTORE_WALLET,
    REGISTER,
    LOGIN,
    REFRESH_TOKEN,
    INITIATE_PAYMENT,
    TRANSACTION_HISTORY: GET_HISTORY,
    PAYMENT_STATUS,
    GET_BALANCE: (address: string) => `${BASE_URL}/api/wallet/balance/${address}/`,
};