import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Force logout on every app start - clear storage first
    forceLogoutAndCheck();
  }, []);

  const forceLogoutAndCheck = async () => {
    try {
      // Force clear storage on every app start
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      console.log('🔍 Storage cleared - forcing logout');
      
      // After clearing, set authenticated to false
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Force logout error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#477023" />
        <Text style={{ marginTop: 20, color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  console.log('🔍 Redirecting to: /auth/login');
  
  // Always redirect to login since we cleared storage
  return <Redirect href="/auth/login" />;
}