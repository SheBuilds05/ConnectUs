import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your deployed backend URL
const API_URL = 'https://connectus-tpyp.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
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
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log('Request data:', config.data);
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      // Don't auto-clear token on login attempts
      const isLoginAttempt = error.config?.url?.includes('/login');
      if (!isLoginAttempt) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// ========== AUTH FUNCTIONS ==========

// ✅ FIXED: Try multiple login endpoint formats
export const loginUser = async (email: string, password: string, rememberMe: boolean = false) => {
  try {
    console.log('Attempting login with email:', email);
    
    // Try different possible login endpoints
    const endpoints = [
      { url: '/users/login', body: { email, password, rememberMe } },
      { url: '/auth/login', body: { email, password, rememberMe } },
      { url: '/login', body: { email, password, rememberMe } },
      { url: '/users/login', body: { email, password } },
      { url: '/auth/login', body: { email, password } },
    ];
    
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint.url}`);
        const response = await api.post(endpoint.url, endpoint.body);
        
        if (response.data && (response.data.token || response.data.access_token)) {
          const token = response.data.token || response.data.access_token;
          const user = response.data.user || response.data;
          
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('user', JSON.stringify(user));
          console.log('✅ Login successful on:', endpoint.url);
          return response.data;
        }
      } catch (err: any) {
        console.log(`Failed on ${endpoint.url}:`, err.response?.status);
        lastError = err;
      }
    }
    
    // If all endpoints fail, throw the last error
    throw lastError || new Error('No working login endpoint found');
    
  } catch (error: any) {
    console.error('Login API error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid email or password');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Connection timeout. Please try again.');
    }
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Login failed');
  }
};

// Customer registration
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
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Logout endpoint error:', error);
      }
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  }
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
  return user?.user_id || user?.id || null;
};

export const getUserName = async (): Promise<string> => {
  const user = await getCurrentUser();
  return user?.full_name || 'User';
};

export const getUserEmail = async (): Promise<string> => {
  const user = await getCurrentUser();
  return user?.email || '';
};

// ========== RUNNER PROFILE FUNCTIONS ==========

export const getRunnerProfile = async (runnerId: number): Promise<RunnerProfile | null> => {
  try {
    const response = await api.get(`/runners/profile/${runnerId}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching runner profile:', error);
    return null;
  }
};

export const updateRunnerProfile = async (runnerId: number, profileData: Partial<RunnerProfile>) => {
  const response = await api.put(`/runners/profile/${runnerId}`, profileData);
  return response.data;
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

// ========== RUNNER DASHBOARD FUNCTIONS ==========

export const getRunnerDashboard = async (runnerId: number) => {
  try {
    const response = await api.get(`/runners/dashboard/${runnerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return null;
  }
};

export const getRunnerStats = async (runnerId: number) => {
  try {
    const response = await api.get(`/runners/stats/${runnerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
};

export const getRunnerSettings = async (runnerId: number) => {
  try {
    const response = await api.get(`/runners/settings/${runnerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
};

export const updateRunnerSettings = async (runnerId: number, settingsData: any) => {
  const response = await api.put(`/runners/settings/${runnerId}`, settingsData);
  return response.data;
};

export default api;