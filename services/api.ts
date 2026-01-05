
import axios from 'axios';

// Creating a central axios instance
const api = axios.create({
  baseURL: '/api', // Backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login/signup page
      const currentPath = window.location.hash;
      const isOnAuthPage = currentPath.includes('/login') || currentPath.includes('/signup');
      
      if (!isOnAuthPage) {
        const token = localStorage.getItem('token');
        
        // Don't clear token if it's a mock token (starts with 'mock-jwt-token-')
        // This prevents clearing mock tokens when backend is unavailable
        const isMockToken = token && token.startsWith('mock-jwt-token-');
        
        // Only clear and redirect if:
        // 1. Token doesn't exist, OR
        // 2. It's a real token (not mock) and we got 401, OR
        // 3. Error message explicitly mentions token/auth issues
        if (!token || (!isMockToken && (error.response?.data?.message?.includes('token') || error.response?.data?.message?.includes('authorized')))) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Use a small delay to avoid redirect loops
          setTimeout(() => {
            window.location.hash = '#/login';
          }, 100);
        }
        // If it's a mock token, just let it fail silently - don't redirect
      }
    }
    return Promise.reject(error);
  }
);

export default api;
