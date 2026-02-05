import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';

/**
 * In-memory token storage for maximum security.
 * This is lost on page refresh, triggering a refresh flow.
 */
let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export const setAccessToken = (token: string | null) => {
  console.log('🔑 [AUTH] Setting access token:', token ? `${token.substring(0, 20)}...` : 'null');
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

const API_URL = env.NEXT_PUBLIC_API_URL;

const client: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('📤 [API] Request:', config.method?.toUpperCase(), config.url, '| Token:', accessToken ? '✅ Present' : '❌ Missing');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and Token Refresh
client.interceptors.response.use(
  (response) => {
    console.log('📥 [API] Response:', response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    console.error('❌ [API] Error:', error.response?.status, error.config?.url, error.message);
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 [AUTH] 401 Unauthorized - attempting token refresh...');
      if (isRefreshing) {
        // Queue the request until refresh is done
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(client(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the refresh endpoint
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken: newAccessToken } = response.data;
        console.log('✅ [AUTH] Token refresh successful');

        setAccessToken(newAccessToken);
        onRefreshed(newAccessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        console.error('❌ [AUTH] Token refresh failed:', refreshError);
        // Refresh failed: Logout user
        setAccessToken(null);
        localStorage.removeItem('refresh_token');
        // Optional: window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default client;
