// app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../services/api';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await getCurrentUser();
      if (token && user) {
        setIsAuthenticated(true);
        setUserRole(user.role || 'customer');
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#477023" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/landing" />;
  }

  // Role-based redirect
  if (userRole === 'runner') {
    return <Redirect href="/runner/dashboard" />;
  } else if (userRole === 'admin') {
    return <Redirect href="/admin/dashboard" />;
  } else {
    return <Redirect href="/(tabs)" />;
  }
};