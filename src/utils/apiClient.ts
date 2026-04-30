// src/utils/apiClient.ts
import axios from 'axios';
import { store } from '@/src/store';
import { walletActions } from '@/src/store/walletSlice';
import { URLS } from '@/src/config';

const apiClient = axios.create();

// -------------------------------------------------------------------
// REQUEST INTERCEPTOR: Attach Bearer token from Redux store
// -------------------------------------------------------------------
apiClient.interceptors.request.use(
    (config) => {
        // Always read fresh from store — handles rehydration timing
        const state = store.getState();

        // redux-persist wraps state — handle both rehydrated and raw state
        const walletState = (state as any)?.walletReducer;
        const accessToken = walletState?.authToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// -------------------------------------------------------------------
// RESPONSE INTERCEPTOR: Auto-refresh on 401
// -------------------------------------------------------------------
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const state = store.getState();
                const walletState = (state as any)?.walletReducer;
                const refreshToken = walletState?.refreshToken;

                if (!refreshToken) {
                    console.log("❌ No refresh token — user must log in.");
                    return Promise.reject(error);
                }

                console.log("🔄 Access token expired. Refreshing...");

                const refreshResponse = await axios.post(URLS.REFRESH_TOKEN, {
                    refresh: refreshToken
                });

                const newAccessToken = refreshResponse.data.access;
                store.dispatch(walletActions.setAuthToken(newAccessToken));
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                console.log("✅ Token refreshed! Retrying...");
                return apiClient(originalRequest);

            } catch (refreshError) {
                console.error("❌ Refresh failed. Logging out.");
                store.dispatch(walletActions.setAuthToken(''));
                store.dispatch(walletActions.setRefreshToken(''));
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;