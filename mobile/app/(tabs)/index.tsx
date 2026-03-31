import React, { useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  // Function to get token depending on platform
  const getToken = async () => {
    if (Platform.OS === 'web') {
      // Web fallback
      return localStorage.getItem('token');
    } else {
      return await SecureStore.getItemAsync('token');
    }
  };

  const checkUser = async () => {
    try {
      const token = await getToken();

      if (token) {
        router.replace('/admin'); // Redirect if token exists
      }
    } catch (error) {
      console.log('Error checking user token:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        Welcome to ConnectUs - Your Runner Companion!
      </Text>
      <Text style={{ marginTop: 10, fontSize: 16, color: '#1f3b13' }}>
        Please log in to continue.
      </Text>
    </View>
  );
}