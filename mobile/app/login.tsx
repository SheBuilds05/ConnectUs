import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { setToken, setUserRole } from '../utils/storage';
import { loginUserAPI } from '../utils/api'; // Ensure this utility is created
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<'customer' | 'runner' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const loginUser = async () => {
    // 1. Basic Validation
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      // 2. Real API Call to your Node.js Backend
      const data = await loginUserAPI(email, password);

      // 3. Save session data from Database
      await setToken(data.token);
      await setUserRole(data.role);

      Alert.alert('Success', `Welcome back!`);
      
      // 4. Role-based Routing
      if (data.role === 'admin') {
        router.replace('/AdminDashboard');
      } else {
        router.replace('/Dashboard');
      }
    } catch (error: any) {
      // Handles "User not found", "Wrong password", or "Network error"
      Alert.alert('Login Failed', error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Member Login</Text>
        <Text style={styles.subtitle}>Sign in to your ConnectUs account</Text>

        {/* Input Fields */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={Colors.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor={Colors.gray}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.loginBtn, loading && { opacity: 0.7 }]} 
          onPress={loginUser}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.darkBg} />
          ) : (
            <Text style={styles.loginBtnText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')} style={styles.footer}>
          <Text style={styles.footerText}>
            Not a member yet? <Text style={styles.linkText}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.darkBg },
  content: { padding: 30, justifyContent: 'center', flex: 1 },
  title: { fontSize: 32, fontWeight: '900', color: Colors.white, textAlign: 'center' },
  subtitle: { fontSize: 16, color: Colors.gray, textAlign: 'center', marginBottom: 40 },
  
  inputGroup: { marginBottom: 30 },
  label: { color: Colors.white, fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 15 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: Colors.deepForest,
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 15,
    color: Colors.white,
    fontSize: 16,
  },

  loginBtn: { 
    backgroundColor: Colors.accent, 
    paddingVertical: 18, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 10
  },
  loginBtnText: { color: Colors.darkBg, fontWeight: '900', fontSize: 18, letterSpacing: 1 },

  footer: { marginTop: 25, alignItems: 'center' },
  footerText: { color: Colors.gray },
  linkText: { color: Colors.accent, fontWeight: 'bold' }
});