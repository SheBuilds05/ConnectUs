import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      // ❌ Not logged in → go back
      router.replace('/login');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace('/');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Admin Dashboard 👨‍💼</Text>

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}