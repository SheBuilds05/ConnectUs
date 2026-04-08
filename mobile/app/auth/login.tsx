import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { loginUser } from '../../services/api';

const colors = {
  forest: '#0D330E',
  leaf: '#2D531A',
  moss: '#477023',
  sage: '#6E8649',
  canvas: '#D3D3D3',
  white: '#FFFFFF',
  text: '#1F2E2A',
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email: email.trim().toLowerCase() });
      
      const response = await loginUser(email.trim().toLowerCase(), password, false);
      
      console.log('Login successful:', response);
      console.log('User role:', response.user?.role);
      
      // Redirect based on user role
      if (response.user?.role === 'runner') {
        console.log('Redirecting to runner dashboard');
        router.replace('/runner/dashboard');
     } else if (response.user?.role === 'admin') {
  console.log('Redirecting to admin dashboard');
  router.replace('/admin/dashboard');
} else {
        // customer or default
        console.log('Redirecting to customer dashboard');
        router.replace('/(tabs)');
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.canvas, colors.canvas]} style={styles.gradient}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.content}>
            <View style={styles.logoSection}>
              <View style={styles.logoBox}>
                <Text style={styles.logoText}>C</Text>
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue to ConnectUs</Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color={colors.sage} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.sage + '80'}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.sage} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.sage + '80'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.sage} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={[colors.forest, colors.leaf]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginGradient}
                >
                  {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.loginButtonText}>Sign In</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.registerLink}>
                  Do not have an account? <Text style={styles.registerLinkBold}>Register here</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  bgCircle1: {
    position: 'absolute',
    top: '-10%',
    right: '-20%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.moss + '20',
    zIndex: 0,
  },
  bgCircle2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-20%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.forest + '20',
    zIndex: 0,
  },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoBox: {
    backgroundColor: colors.forest,
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: { color: colors.white, fontSize: 32, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '700', color: colors.forest, marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: colors.leaf, opacity: 0.9 },
  errorContainer: { backgroundColor: '#fee', padding: 12, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#fcc' },
  errorText: { color: '#c33', fontSize: 13, textAlign: 'center' },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { color: colors.forest, fontWeight: '500', fontSize: 14 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 30, // ✅ Changed from 12 to 30 for rounder corners
    borderWidth: 1,
    borderColor: colors.sage + '30',
    paddingHorizontal: 18, // Slightly more padding for better look
    height: 52,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: colors.text },
  loginButton: { borderRadius: 50, overflow: 'hidden', marginTop: 8 },
  loginButtonDisabled: { opacity: 0.7 },
  loginGradient: { paddingVertical: 16, alignItems: 'center' },
  loginButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 16, marginVertical: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.sage + '30' },
  dividerText: { color: colors.leaf, fontSize: 14 },
  registerLink: { textAlign: 'center', color: colors.leaf, fontSize: 14 },
  registerLinkBold: { color: colors.moss, fontWeight: '600' },
});