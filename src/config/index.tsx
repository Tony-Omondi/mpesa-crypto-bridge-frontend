// src/config.ts

// 1. Remote Tron Server (Keep as is)
const MAIN_URL = 'https://coinsafe-tron-server.vercel.app/';

// 2. Your Local Django Backend (Use ngrok or your IP)
// Ensure this matches your current Ngrok URL
export const BASE_URL = 'https://37f7-197-232-18-159.ngrok-free.app'; 

export const CREATE_WALLET = `${BASE_URL}/api/wallet/create/`;
export const RESTORE_WALLET = `${BASE_URL}/api/wallet/restore/`;
export const REGISTER = `${BASE_URL}/api/auth/register/`;
export const LOGIN = `${BASE_URL}/api/auth/login/`;
export const INITIATE_PAYMENT = `${BASE_URL}/api/payments/pay/`;
export const GET_HISTORY = `${BASE_URL}/api/payments/history/`;

export const URLS = {
    MAIN_URL,
    GET_PRICES: `${MAIN_URL}prices`,
    GET_BALANCES: `${MAIN_URL}balances`,
    GET_TRX_DATA: `${MAIN_URL}trx-data`,
    TRANSFER_TRX: `${MAIN_URL}transfer/trx`,
    
    // OLD TRC20 (Keep for Tron)
    TRANSFER_TRC20: `${MAIN_URL}transfer/trc20-token`,

    // NEW NIT TRANSFER & WITHDRAW
    TRANSFER_NIT: `${BASE_URL}/api/wallet/transfer/`,
    WITHDRAW_NIT: `${BASE_URL}/api/wallet/withdraw/`, // <--- ADDED THIS

    // Python/Django Config
    CREATE_WALLET,
    RESTORE_WALLET,
    REGISTER,
    LOGIN,
    INITIATE_PAYMENT,
    TRANSACTION_HISTORY: GET_HISTORY,
    GET_BALANCE: (address: string) => `${BASE_URL}/api/wallet/balance/${address}/`,
};