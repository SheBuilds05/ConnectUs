import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // On load, check if a user is already logged in (LocalStorage & SessionStorage)
  useEffect(() => {
    const loadStoredAuth = () => {
      // Try to get token from localStorage first, then sessionStorage
      let storedToken = localStorage.getItem('token');
      if (!storedToken) {
        storedToken = sessionStorage.getItem('token');
      }
      
      // Try to get user from localStorage first, then sessionStorage
      let storedUser = localStorage.getItem('user');
      if (!storedUser) {
        storedUser = sessionStorage.getItem('user');
      }
      
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          console.log('Auth restored from storage:', { user: parsedUser, tokenExists: !!storedToken });
        } catch (error) {
          console.error('Error parsing stored user:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        }
      } else {
        console.log('No stored auth found');
      }
    };
    
    loadStoredAuth();
  }, []);

  const login = (userData: User, authToken: string) => {
    console.log('Login called with:', { userData, tokenExists: !!authToken });
    
    // Store in both localStorage and sessionStorage for redundancy
    localStorage.setItem('token', authToken);
    sessionStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('user', JSON.stringify(userData));
    
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    console.log('Logout called');
    
    // Clear all storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};