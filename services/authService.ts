
import api from './api';
import { AuthResponse, User } from '../types';

// Helper to simulate network delay for more realistic local experience
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(credentials: any): Promise<AuthResponse> {
    try {
      const response = await api.post<{ success: boolean; token: string; user: User }>('/auth/login', credentials);
      // Backend returns { success, token, user }
      if (response.data && response.data.token && response.data.user) {
        return {
          token: response.data.token,
          user: response.data.user
        };
      }
      throw new Error('Invalid response from server');
    } catch (error: any) {
      // If it's a 401, it means credentials are wrong - don't use mock
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }
      
      // Only use mock if backend is completely unavailable (network error, not 401)
      if (!error.response) {
        console.warn("Backend not available, using simulated login", error);
        await delay(800);
        
        const mockUser: User = {
          id: 'mock-123',
          name: 'Demo User',
          email: credentials.email || 'demo@example.com'
        };
        
        return {
          token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9),
          user: mockUser
        };
      }
      
      // For other errors, throw them
      throw error;
    }
  },

  async signup(data: any): Promise<AuthResponse> {
    try {
      const response = await api.post<{ success: boolean; token: string; user: User }>('/auth/signup', data);
      // Backend returns { success, token, user }
      return {
        token: response.data.token,
        user: response.data.user
      };
    } catch (error: any) {
      // Fallback for demo purposes if backend is missing or fails
      console.warn("Backend not found, using simulated signup", error);
      await delay(1000);
      
      const mockUser: User = {
        id: 'mock-' + Date.now(),
        name: data.name,
        email: data.email
      };
      
      return {
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9),
        user: mockUser
      };
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await api.get<{ success: boolean; user: User }>('/user/profile');
      // Backend returns { success, user }
      if (response.data && response.data.user) {
        return response.data.user;
      }
      throw new Error('Invalid response format');
    } catch (error: any) {
      // If API call fails, try to use saved user as fallback
      // This prevents redirect loops when backend is temporarily unavailable
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          // Only use cached user if we have a token (means user was logged in)
          const token = localStorage.getItem('token');
          if (token && user) {
            return user;
          }
        } catch (e) {
          // If parsing fails, continue to throw original error
        }
      }
      
      // Only throw if no saved user exists or token is missing
      // This allows the calling component to handle the error gracefully
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tasks'); // Clear local tasks on logout for demo reset
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  }
};
