import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken } from './client';
import { env } from '../config/env';

// Use validated environment variable (env.ts ensures this exists)
const CHAT_API_URL = env.NEXT_PUBLIC_CHAT_API_URL;
const MAIN_API_URL = env.NEXT_PUBLIC_API_URL;

// Log the resolved URL for debugging (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 [CHAT] Using Chat API URL:', CHAT_API_URL);
}

const chatClient: AxiosInstance = axios.create({
  baseURL: CHAT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Reuse the same token logic as the main client
chatClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    console.log('💬 [CHAT] Request:', config.method?.toUpperCase(), config.url, '| Token:', token ? '✅ Present' : '❌ Missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add Response Interceptor for 401 handling
chatClient.interceptors.response.use(
  (response) => {
    console.log('💬 [CHAT] Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('❌ [CHAT] Error:', {
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      message: error.message,
      code: error.code,
      isNetworkError: !error.response && error.message === 'Network Error'
    });
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('🔄 [CHAT] 401 Unauthorized - attempting token refresh...');
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        // We use the main API for refresh
        const { data } = await axios.post(`${MAIN_API_URL}/auth/refresh`, { refreshToken });
        
        // CRITICAL: Update the shared access token state
        setAccessToken(data.accessToken);
        console.log('✅ [CHAT] Token refresh successful, updated shared token');
        
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return chatClient(originalRequest);
      } catch (err) {
        console.error('❌ [CHAT] Token refresh failed:', err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export interface Participant {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
}

export interface Conversation {
  id: string;
  participants: (string | Participant)[];
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export const chatService = {
  async listConversations(): Promise<Conversation[]> {
    const response = await chatClient.get('/v1/conversations');
    return response.data;
  },

  async createConversation(recipientId: string): Promise<Conversation> {
    const response = await chatClient.post('/v1/conversations', { 
      recipientId 
    });
    return response.data;
  },

  async listMessages(conversationId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
    const response = await chatClient.get(`/v1/messages/${conversationId}`, {
      params: { limit, offset }
    });
    return response.data;
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const response = await chatClient.post('/v1/messages', {
      conversationId,
      content
    });
    return response.data;
  }
};

export default chatClient;
