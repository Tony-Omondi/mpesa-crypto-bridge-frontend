
import axios from 'axios';
import { URLS } from '@/src/config';
import { store } from '@/src/store'; // Make sure this points to your Redux store
import { walletActions } from '@/src/store/walletSlice';

// Create a custom Axios instance
const apiClient = axios.create();

// -------------------------------------------------------------------
// 1. REQUEST INTERCEPTOR: Automatically attach the Access Token
// -------------------------------------------------------------------
apiClient.interceptors.request.use(
    (config) => {
        // Grab the current state from Redux
        const state = store.getState();
        const accessToken = state.walletReducer.authToken; 

        // If we have a token, attach it to the Authorization header
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// -------------------------------------------------------------------
// 2. RESPONSE INTERCEPTOR: Detect 401s and auto-refresh the token
// -------------------------------------------------------------------
apiClient.interceptors.response.use(
    (response) => response, // If the request is successful, let it pass
    async (error) => {
        const originalRequest = error.config;

        // If Django says 401 (Unauthorized) AND we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark as retried to prevent infinite loops

            try {
                const state = store.getState();
                const refreshToken = state.walletReducer.refreshToken;

                if (!refreshToken) {
                    console.log("No refresh token found. User needs to log in.");
                    return Promise.reject(error);
                }

                console.log("🔄 Access token expired. Refreshing silently...");

                // Call Django's refresh endpoint
                const refreshResponse = await axios.post(URLS.REFRESH_TOKEN, {
                    refresh: refreshToken
                });

                const newAccessToken = refreshResponse.data.access;

                // Save the brand new access token back to Redux
                store.dispatch(walletActions.setAuthToken(newAccessToken));

                // Update the failed original request with the new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                console.log("✅ Token refreshed successfully! Retrying original request...");
                
                // Retry the original request using our smart client
                return apiClient(originalRequest);

            } catch (refreshError) {
                // If the refresh token ITSELF is expired (e.g., it's been 7 days)
                console.error("❌ Refresh token expired. Logging user out.");
                
                // Wipe the tokens so the app knows to kick them to the login screen
                store.dispatch(walletActions.setAuthToken('')); 
                store.dispatch(walletActions.setRefreshToken(''));
                
                return Promise.reject(refreshError);
            }
        }

        // If it's a 500 server error, 400 bad request, etc., just pass it along
        return Promise.reject(error);
    }
);

export default apiClient;