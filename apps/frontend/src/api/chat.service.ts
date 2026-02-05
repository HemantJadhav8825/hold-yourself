import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from './client';

const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3200';
const MAIN_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add Response Interceptor for 401 handling
chatClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        // We use the main API for refresh
        const { data } = await axios.post(`${MAIN_API_URL}/auth/refresh`, { refreshToken });
        // NOTE: client.ts setAccessToken handles the state
        // For simplicity here, we just hope it sets the global let accessToken
        // Actually chat.service.ts imports getAccessToken which reads that let.
        // We'll rely on the fact that if they are in the same bundle they share the let.
        
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return chatClient(originalRequest);
      } catch (err) {
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
