import axios from 'axios';

const API_URL ='http://localhost:5000/api';

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

interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'runner';
  verification_status?: string;
  city?: string;
  profile_photo?: string;
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth functions
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
    throw new Error(error.response?.data?.message || 'Runner registration failed');
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

export const getUserRole = (): string => {
  const user = getCurrentUser();
  return user?.role || 'customer';
};

export const getUserName = (): string => {
  const user = getCurrentUser();
  return user?.name || 'User';
};

// ✅ Add this function - Get User Email
export const getUserEmail = (): string => {
  const user = getCurrentUser();
  return user?.email || '';
};

// ✅ Add this function - Get User ID
export const getUserId = (): number | null => {
  const user = getCurrentUser();
  return user?.id || null;
};

// ✅ Add this function - Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// ✅ Add this function - Check if user is verified (for runners)
export const isVerified = (): boolean => {
  const user = getCurrentUser();
  return user?.verification_status === 'VERIFIED' || false;
};

export default api;