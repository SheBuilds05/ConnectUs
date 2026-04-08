import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your deployed backend URL
const API_URL = 'https://connectus-tpyp.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ========== TYPES ==========

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  role: 'customer' | 'runner' | 'admin';
  status: string;
  created_at: string;
  last_login_at?: string;
  id: number;
}

export interface RunnerProfile {
  runner_id: number;
  username: string;
  email: string;
  completed_bookings_count: number;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  city: string;
  profile_photo: string;
  bio: string;
  languages: string[];
  id_verified: boolean;
  phone?: string;
  rating?: number;
  address?: string;
  postal_code?: string;
  expertise?: string[];
  showcase_images?: string[];
  created_at?: string;
}

export interface WalletBalance {
  balance: number;
  total_credited: number;
  total_debited: number;
}

export interface Transaction {
  transaction_id: string;
  user_id: number;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  created_at: string;
}

// ========== AXIOS INTERCEPTORS ==========

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// ========== AUTH FUNCTIONS ==========

export const loginUser = async (email: string, password: string, rememberMe: boolean = false) => {
  try {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login API error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Customer registration (with firstName, lastName, id_num)
export const registerCustomer = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  id_num: string;
}) => {
  const response = await api.post('/auth/register/customer', {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
    id_num: userData.id_num,
  });
  
  if (response.data.token) {
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Runner registration
export const registerRunner = async (userData: {
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  id_number: string;
  bio: string;
}) => {
  const response = await api.post('/auth/register/runner', userData);
  
  if (response.data.token) {
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Admin registration
export const registerAdmin = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  secretCode: string;
}) => {
  const response = await api.post('/auth/register/admin', userData);
  
  if (response.data.token) {
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const getUserId = async (): Promise<number | null> => {
  const user = await getCurrentUser();
  return user?.user_id || null;
};

export const getUserName = async (): Promise<string> => {
  const user = await getCurrentUser();
  return user?.full_name || 'User';
};

export const getUserEmail = async (): Promise<string> => {
  const user = await getCurrentUser();
  return user?.email || '';
};

// ========== WALLET FUNCTIONS ==========

export const getWalletBalance = async (): Promise<WalletBalance> => {
  try {
    const response = await api.get('/wallet/balance');
    return response.data?.data || response.data || { balance: 0, total_credited: 0, total_debited: 0 };
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return { balance: 0, total_credited: 0, total_debited: 0 };
  }
};

export const getTransactionHistory = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get('/wallet/transactions');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const processPayment = async (bookingId: number, amount: number): Promise<{ success: boolean; transaction_id: string }> => {
  const response = await api.post('/wallet/pay', { booking_id: bookingId, amount });
  return response.data?.data || response.data;
};

export const addFunds = async (amount: number): Promise<{ checkout_url: string; payment_id: string }> => {
  const response = await api.post('/wallet/add-funds', { amount });
  return response.data?.data || response.data;
};

// ========== RUNNER FUNCTIONS ==========

export const getRunners = async (params?: any) => {
  const response = await api.get('/runners', { params });
  return response.data;
};

export const getRunnerById = async (runnerId: number) => {
  const response = await api.get(`/runners/${runnerId}`);
  return response.data;
};

export const getRunnerProducts = async (runnerId: number) => {
  const response = await api.get(`/runners/${runnerId}/products`);
  return response.data;
};

export default api;