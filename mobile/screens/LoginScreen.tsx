import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { setToken, setUserRole } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  
  // State
  const [role, setRole] = useState<'customer' | 'runner' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      const mockToken = `session_${role}_${Math.random().toString(36).substr(2, 5)}`;
      
      // Save to your storage utility
      await setToken(mockToken);
      await setUserRole(role as any);

      Alert.alert('Welcome Back', `Logged in as ${role}`);
      
      // Redirect to the main layout
      router.replace('/(tabs)');
      
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoIcon}>
             <Ionicons name="leaf" size={40} color={Colors.accent} />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to ConnectUs</Text>
        </View>

        {/* Role Selection Tabs */}
        <View style={styles.tabContainer}>
          {['customer', 'runner', 'admin'].map((r) => (
            <TouchableOpacity 
              key={r}
              style={[styles.tab, role === r && styles.activeTab]}
              onPress={() => setRole(r as any)}
            >
              <Text style={[styles.tabText, role === r && styles.activeTabText]}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={Colors.gray} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={Colors.gray}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.gray} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginBtn, isLoading && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginBtnText}>
              {isLoading ? 'Authenticating...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.darkBg },
  scrollContent: { flexGrow: 1, padding: 30, justifyContent: 'center' },
  
  header: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { marginBottom: 15 },
  title: { fontSize: 32, fontWeight: '800', color: Colors.white },
  subtitle: { color: Colors.gray, fontSize: 16, marginTop: 5, textAlign: 'center' },

  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 12, 
    padding: 5, 
    marginBottom: 30 
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: Colors.accent },
  tabText: { color: Colors.gray, fontWeight: '600' },
  activeTabText: { color: Colors.darkBg },

  form: { width: '100%' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 15,
    paddingHorizontal: 15
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: Colors.white, paddingVertical: 18, fontSize: 16 },
  
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 25 },
  forgotText: { color: Colors.accent, fontSize: 14, fontWeight: '600' },

  loginBtn: { 
    backgroundColor: Colors.accent, 
    padding: 20, 
    borderRadius: 15, 
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8
  },
  loginBtnText: { color: Colors.darkBg, fontWeight: '800', fontSize: 18 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: Colors.gray },
  signUpLink: { color: Colors.accent, fontWeight: '700' }
});