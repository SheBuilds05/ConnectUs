import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { supabase } from '../utils/supabase'; // FIX 1: Correctly import supabase
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState<'customer' | 'runner'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // FIX 2: Using the imported supabase client correctly
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
            role: role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        Alert.alert('Success', 'Account created! Please check your email.');
        router.replace('/login');
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  }; // FIX 3: Properly closed the handleRegister function

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.accent} />
        </TouchableOpacity>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the ConnectUs community</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor={Colors.gray}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor={Colors.gray}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={Colors.gray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Text style={styles.label}>I want to be a:</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={[styles.roleBtn, role === 'customer' && styles.activeRoleBtn]}
            onPress={() => setRole('customer')}
          >
            <Text style={[styles.roleText, role === 'customer' && styles.activeRoleText]}>CUSTOMER</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.roleBtn, role === 'runner' && styles.activeRoleBtn]}
            onPress={() => setRole('runner')}
          >
            <Text style={[styles.roleText, role === 'runner' && styles.activeRoleText]}>RUNNER</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.registerBtn, loading && { opacity: 0.7 }]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.darkBg} />
          ) : (
            <Text style={styles.registerBtnText}>REGISTER</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.darkBg },
  content: { padding: 30, paddingBottom: 50 },
  backBtn: { marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', color: Colors.white },
  subtitle: { fontSize: 16, color: Colors.gray, marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  label: { color: Colors.white, fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 15 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: Colors.deepForest,
    borderRadius: 12,
    padding: 15,
    color: Colors.white,
  },
  roleContainer: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  roleBtn: { 
    flex: 1, 
    padding: 15, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  activeRoleBtn: { backgroundColor: Colors.moss, borderColor: Colors.accent },
  roleText: { color: Colors.gray, fontWeight: '800' },
  activeRoleText: { color: Colors.white },
  registerBtn: { 
    backgroundColor: Colors.accent, 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center',
    marginTop: 10
  },
  registerBtnText: { color: Colors.darkBg, fontWeight: '900', fontSize: 18 },
});