import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  avatar?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

interface RegisterResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('auth_token');
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call - replace with actual API
      const response: LoginResponse = await mockLoginApi(credentials);
      
      if (response.success && response.user && response.token) {
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        await AsyncStorage.setItem('auth_token', response.token);
        setUser(response.user);
        router.replace('/(tabs)' as any);
        return { success: true, user: response.user };
      } else {
        const errorMessage = response.message || 'Login failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call - replace with actual API
      const response: RegisterResponse = await mockRegisterApi(data);
      
      if (response.success && response.user && response.token) {
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        await AsyncStorage.setItem('auth_token', response.token);
        setUser(response.user);
        router.replace('/(tabs)' as any);
        return { success: true, user: response.user };
      } else {
        const errorMessage = response.message || 'Registration failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('auth_token');
      setUser(null);
      router.replace('/(auth)/login' as any);
    } catch (err: any) {
      const errorMessage = err.message || 'Logout failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (user) {
        const updatedUser = { ...user, ...profileData };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };
};

// Mock API functions (replace with real API calls)
const mockLoginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (credentials.email === 'test@example.com' && credentials.password === 'password') {
    return {
      success: true,
      user: {
        id: '1',
        name: 'Test User',
        email: credentials.email,
        role: 'runner',
        phone: '+27 123 456 789',
      },
      token: 'mock-jwt-token',
    };
  }
  
  return {
    success: false,
    message: 'Invalid email or password',
  };
};

const mockRegisterApi = async (data: RegisterData): Promise<RegisterResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    user: {
      id: '2',
      name: data.name,
      email: data.email,
      role: 'runner',
      phone: data.phone,
    },
    token: 'mock-jwt-token',
  };
};