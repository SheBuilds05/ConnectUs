import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getToken } from '../utils/storage';

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      // Check if any role has a token
      const adminToken = await getToken('admin');
      const runnerToken = await getToken('runner');
      const customerToken = await getToken('customer');

      if (adminToken || runnerToken || customerToken) {
        router.replace('/Dashboard'); // Redirect if logged in
      }
    };

    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ConnectUs 🚀</Text>

      <View style={styles.buttons}>
        <Button title="Login" onPress={() => router.push('/Login')} />
        <Button title="Register" onPress={() => router.push('/Register')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  buttons: { flexDirection: 'row', justifyContent: 'space-around', width: '80%' },
});