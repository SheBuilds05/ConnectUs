import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { setToken } from '../utils/storage';

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState('customer'); // default role
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Normally you would call your backend API here
    // For demo, we just create a fake token
    const token = `${role}-token`;
    await setToken(role, token);

    Alert.alert('Success', `${role.charAt(0).toUpperCase() + role.slice(1)} registered`);
    router.replace('/Dashboard'); // Redirect to unified dashboard
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter full name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Select Role</Text>
      <View style={styles.roles}>
        {['admin', 'runner', 'customer'].map((r) => (
          <Button
            key={r}
            title={r.charAt(0).toUpperCase() + r.slice(1)}
            color={role === r ? '#1E90FF' : '#aaa'}
            onPress={() => setRole(r)}
          />
        ))}
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Register" onPress={registerUser} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  roles: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
});