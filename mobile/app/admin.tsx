import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getToken, removeToken } from '../utils/storage';

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      // Check which role has a token
      if (await getToken('admin')) setRole('admin');
      else if (await getToken('runner')) setRole('runner');
      else if (await getToken('customer')) setRole('customer');
      else router.replace('/Landing'); // No token, go back to Landing
    };

    fetchRole();
  }, []);

  const handleLogout = async () => {
    if (!role) return;
    await removeToken(role);
    Alert.alert('Logged out', 'You have been logged out successfully');
    router.replace('/Landing');
  };

  if (!role) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}!</Text>

      {role === 'admin' && <Text style={styles.info}>You have full access to the system.</Text>}
      {role === 'runner' && <Text style={styles.info}>You can view and accept deliveries.</Text>}
      {role === 'customer' && <Text style={styles.info}>You can book runners and track your orders.</Text>}

      <View style={{ marginTop: 30 }}>
        <Button title="Logout" onPress={handleLogout} color="#FF4500" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 22, marginBottom: 20 },
  info: { fontSize: 16, textAlign: 'center', marginVertical: 5 },
});