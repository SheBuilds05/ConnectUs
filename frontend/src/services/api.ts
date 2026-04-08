import axios from 'axios';

const API_URL ='https://connectus-tpyp.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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

interface AdminRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  secretCode: string;
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

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const isAuthRoute = config.url?.includes('/auth/');
    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes('/login') &&
      !error.config?.url?.includes('/auth/')
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH FUNCTIONS ==========
export const registerCustomer = async (userData: CustomerRegisterData) => {
  try {
    const response = await api.post('/auth/register/customer', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
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
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    console.error('Runner registration error:', error);
    throw new Error(error.response?.data?.message || 'Runner registration failed');
  }
};
export const registerAdmin = async (userData: AdminRegisterData) => {
  try {
    const response = await api.post('/auth/register/admin', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Admin registration failed');
  }
};
export const loginUser = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

//  USER PROFILE FUNCTIONS 
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

// Get user profile from API
export const getUserProfile = async (): Promise<{ data: User }> => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Update user profile
export const updateUserProfile = async (profileData: Partial<User>): Promise<{ data: User }> => {
  const response = await api.put('/users/profile', profileData);
  // Update localStorage with new data
  if (response.data.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

//  Get user stats
export const getUserStats = async (): Promise<{ data: any }> => {
  const response = await api.get('/users/stats');
  return response.data;
};

// Get user reviews
export const getUserReviews = async (): Promise<{ data: any[] }> => {
  const response = await api.get('/users/reviews');
  return response.data;
};

//  ORDER FUNCTIONS 
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

//  EARNINGS FUNCTIONS 
export const getEarnings = async () => {
  const response = await api.get('/earnings');
  return response.data;
};

export const getEarningsHistory = async (period: string = 'month') => {
  const response = await api.get(`/earnings/history?period=${period}`);
  return response.data;
};

//  HELPER FUNCTIONS 
export const getUserRole = (): string => {
  const user = getCurrentUser();
  return user?.role || 'customer';
};

export const getUserName = (): string => {
  const user = getCurrentUser();
  return user?.name || 'User';
};

export const getUserEmail = (): string => {
  const user = getCurrentUser();
  return user?.email || '';
};

export const getUserId = (): number | null => {
  const user = getCurrentUser();
  return user?.id || null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const isVerified = (): boolean => {
  const user = getCurrentUser();
  return user?.verification_status === 'VERIFIED' || false;
};

export default api;
