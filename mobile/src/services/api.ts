// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your deployed backend URL or local for development
const API_URL ='http://172.20.7.181:5000/api';
// Development (use your computer's IP for physical device)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Types
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface CustomerRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  id_num: string;
}

interface RunnerRegisterData {
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  id_number: string;
  bio: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'runner' | 'admin';
  verification_status?: string;
  city?: string;
  profile_photo?: string;
  avatar_url?: string;
  rating?: number;
  total_trips?: number;
  total_earnings?: number;
  bio?: string;
  phone?: string;
  created_at?: string;
}

// Request interceptor - Add token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // Note: Navigation will be handled by your navigation system
      // You might want to emit an event or use a navigation ref
    }
    return Promise.reject(error);
  }
);

// ========== AUTH FUNCTIONS ==========
export const registerCustomer = async (userData: CustomerRegisterData) => {
  try {
    const response = await api.post('/auth/register/customer', userData);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const registerRunner = async (userData: RunnerRegisterData) => {
  try {
    const response = await api.post('/auth/register/runner', userData);
    
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    console.error('Runner registration error:', error);
    throw new Error(error.response?.data?.message || 'Runner registration failed');
  }
};

export const loginUser = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};

// ========== USER PROFILE FUNCTIONS ==========
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error getting user:', error);
  }
  return null;
};

export const getUserProfile = async (): Promise<{ data: User }> => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (profileData: Partial<User>): Promise<{ data: User }> => {
  const response = await api.put('/users/profile', profileData);
  // Update AsyncStorage with new data
  if (response.data.data) {
    await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

export const getUserStats = async (): Promise<{ data: any }> => {
  const response = await api.get('/users/stats');
  return response.data;
};

export const getUserReviews = async (): Promise<{ data: any[] }> => {
  const response = await api.get('/users/reviews');
  return response.data;
};

// ========== ORDER FUNCTIONS ==========
export const getAvailableOrders = async () => {
  const response = await api.get('/orders/available');
  return response.data;
};

export const getActiveOrders = async () => {
  const response = await api.get('/orders/active');
  return response.data;
};

export const getCompletedOrders = async () => {
  const response = await api.get('/orders/completed');
  return response.data;
};

export const acceptOrder = async (orderId: number) => {
  const response = await api.post(`/orders/${orderId}/accept`);
  return response.data;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const response = await api.patch(`/orders/${orderId}/status`, { status });
  return response.data;
};

export const getOrderById = async (orderId: number) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

// ========== EARNINGS FUNCTIONS ==========
export const getEarnings = async () => {
  const response = await api.get('/earnings');
  return response.data;
};

export const getEarningsHistory = async (period: string = 'month') => {
  const response = await api.get(`/earnings/history?period=${period}`);
  return response.data;
};

// ========== RUNNER FUNCTIONS ==========
export const getRunners = async (params?: any) => {
  const response = await api.get('/runnerprofile', { params });
  return response.data;
};

export const getRunnerById = async (runnerId: number) => {
  const response = await api.get(`/runnerprofile/${runnerId}`);
  return response.data;
};

export const getRunnerProducts = async (runnerId: number) => {
  const response = await api.get(`/runnerprofile/${runnerId}/products`);
  return response.data;
};

// ========== HELPER FUNCTIONS ==========
export const getUserRole = async (): Promise<string> => {
  const user = await getCurrentUser();
  return user?.role || 'customer';
};

export const getUserName = async (): Promise<string> => {
  const user = await getCurrentUser();
  return user?.name || 'User';
};

export const getUserEmail = async (): Promise<string> => {
  const user = await getCurrentUser();
  return user?.email || '';
};

export const getUserId = async (): Promise<number | null> => {
  const user = await getCurrentUser();
  return user?.id || null;
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem('token');
  return !!token;
};

export const isVerified = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.verification_status === 'VERIFIED' || false;
};

// ========== SYNC VERSIONS FOR COMPONENTS THAT NEED SYNC DATA ==========
// Warning: These are synchronous and should only be used when you're sure data is loaded
let cachedUser: User | null = null;

export const loadCachedUser = async () => {
  cachedUser = await getCurrentUser();
};

export const getCachedUser = (): User | null => {
  return cachedUser;
};

export const clearCache = () => {
  cachedUser = null;
};

export default api;