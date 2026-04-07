import React, { createContext, useContext, useState, useEffect } from 'react';

// Define what the User looks like
interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    name: "Khensani", // Default for testing
    email: "khensani@example.com",
    role: "runner"
  });
  const [loading, setLoading] = useState(false);

  const signIn = () => {
    // Implement signIn logic
  };

  const register = async (email: string, password: string, name: string) => {
    // Implement register logic, e.g., API call
    setLoading(true);
    // Simulate registration
    setTimeout(() => {
      setUser({ name, email, role: 'user' });
      setLoading(false);
    }, 1000);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};