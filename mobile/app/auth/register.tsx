// app/auth/register.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { registerCustomer, registerRunner, registerAdmin } from '../../services/api';

const colors = {
  forest: '#0D330E',
  leaf: '#2D531A',
  moss: '#477023',
  sage: '#6E8649',
  canvas: '#D3D3D3',
  white: '#FFFFFF',
  text: '#1F2E2A',
};

export default function RegisterScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'customer' | 'runner' | 'admin' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Customer form state
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    idNumber: '',
  });

  // Runner form state
  const [runnerData, setRunnerData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    idNumber: '',
    bio: '',
  });

  // Admin form state
  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretCode: '',
  });

  // Validation helpers
  const validateSAID = (id: string) => /^\d{13}$/.test(id);

  const handleCustomerSubmit = async () => {
    const { firstName, lastName, email, password, confirmPassword, idNumber } = customerData;
    if (!firstName || !lastName || !email || !password || !idNumber) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!validateSAID(idNumber)) {
      setError('Please enter a valid 13-digit SA ID number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await registerCustomer({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        id_num: idNumber,
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => router.replace('/auth/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRunnerSubmit = async () => {
    const { username, email, password, confirmPassword, phone, address, city, idNumber } = runnerData;
    if (!username || !email || !password || !phone || !address || !city || !idNumber) {
      setError('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!validateSAID(idNumber)) {
      setError('Please enter a valid 13-digit SA ID number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await registerRunner({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone,
        address,
        city,
        postalCode: runnerData.postalCode,
        id_number: idNumber,
        bio: runnerData.bio,
      });
      setSuccess('Runner registration successful! Your profile is pending verification.');
      setTimeout(() => router.replace('/auth/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async () => {
    const { firstName, lastName, email, password, confirmPassword, secretCode } = adminData;
    if (!firstName || !lastName || !email || !password || !secretCode) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (secretCode !== '1875') {
      setError('Invalid secret code');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await registerAdmin({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        secretCode,
      });
      setSuccess('Admin account created! Redirecting...');
      setTimeout(() => router.replace('/admin'), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setCustomerData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      idNumber: '',
    });
    setRunnerData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      idNumber: '',
      bio: '',
    });
    setAdminData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      secretCode: '',
    });
  };

  const renderAccountTypeSelection = () => (
    <View style={styles.typeSelection}>
      <Text style={styles.sectionTitle}>I want to register as:</Text>
      <View style={styles.typeGrid}>
        {/* Customer Card */}
        <TouchableOpacity
          style={styles.typeCard}
          onPress={() => setSelectedType('customer')}
          disabled={loading}
        >
          <Ionicons name="person-outline" size={40} color={colors.forest} style={styles.typeIcon} />
          <Text style={styles.typeTitle}>Customer</Text>
          <Text style={styles.typeDesc}>I need items delivered to me</Text>
        </TouchableOpacity>

        {/* Runner Card */}
        <TouchableOpacity
          style={styles.typeCard}
          onPress={() => setSelectedType('runner')}
          disabled={loading}
        >
          <Ionicons name="bicycle-outline" size={40} color={colors.forest} style={styles.typeIcon} />
          <Text style={styles.typeTitle}>Runner</Text>
          <Text style={styles.typeDesc}>I want to deliver items to others</Text>
        </TouchableOpacity>

        {/* Admin Card (full width) */}
        <TouchableOpacity
          style={[styles.typeCard, styles.typeCardFull]}
          onPress={() => setSelectedType('admin')}
          disabled={loading}
        >
          <Ionicons name="shield-outline" size={40} color={colors.forest} style={styles.typeIcon} />
          <Text style={styles.typeTitle}>Admin</Text>
          <Text style={styles.typeDesc}>Platform administrator access</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCustomerForm = () => (
    <View style={styles.form}>
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First name"
            value={customerData.firstName}
            onChangeText={(text) => setCustomerData({ ...customerData, firstName: text })}
            editable={!loading}
          />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last name"
            value={customerData.lastName}
            onChangeText={(text) => setCustomerData({ ...customerData, lastName: text })}
            editable={!loading}
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={customerData.email}
          onChangeText={(text) => setCustomerData({ ...customerData, email: text })}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>SA ID Number</Text>
        <TextInput
          style={styles.input}
          placeholder="13-digit SA ID number"
          value={customerData.idNumber}
          onChangeText={(text) => setCustomerData({ ...customerData, idNumber: text.replace(/\D/g, '').slice(0, 13) })}
          keyboardType="numeric"
          maxLength={13}
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password (min. 6 characters)"
          value={customerData.password}
          onChangeText={(text) => setCustomerData({ ...customerData, password: text })}
          secureTextEntry
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          value={customerData.confirmPassword}
          onChangeText={(text) => setCustomerData({ ...customerData, confirmPassword: text })}
          secureTextEntry
          editable={!loading}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleCustomerSubmit} disabled={loading}>
        <LinearGradient colors={[colors.forest, colors.leaf]} style={styles.submitGradient}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Create Customer Account</Text>}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { setSelectedType(null); resetForms(); }}>
        <Text style={styles.backLink}>← Choose different account type</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRunnerForm = () => (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Choose a username"
          value={runnerData.username}
          onChangeText={(text) => setRunnerData({ ...runnerData, username: text })}
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={runnerData.email}
          onChangeText={(text) => setRunnerData({ ...runnerData, email: text })}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+27 XX XXX XXXX"
          value={runnerData.phone}
          onChangeText={(text) => setRunnerData({ ...runnerData, phone: text })}
          keyboardType="phone-pad"
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>SA ID Number</Text>
        <TextInput
          style={styles.input}
          placeholder="13-digit SA ID number"
          value={runnerData.idNumber}
          onChangeText={(text) => setRunnerData({ ...runnerData, idNumber: text.replace(/\D/g, '').slice(0, 13) })}
          keyboardType="numeric"
          maxLength={13}
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Street address"
          value={runnerData.address}
          onChangeText={(text) => setRunnerData({ ...runnerData, address: text })}
          editable={!loading}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={runnerData.city}
            onChangeText={(text) => setRunnerData({ ...runnerData, city: text })}
            editable={!loading}
          />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.label}>Postal Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Postal code"
            value={runnerData.postalCode}
            onChangeText={(text) => setRunnerData({ ...runnerData, postalCode: text })}
            editable={!loading}
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Bio (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Tell us a bit about yourself..."
          value={runnerData.bio}
          onChangeText={(text) => setRunnerData({ ...runnerData, bio: text })}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password (min. 6 characters)"
          value={runnerData.password}
          onChangeText={(text) => setRunnerData({ ...runnerData, password: text })}
          secureTextEntry
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          value={runnerData.confirmPassword}
          onChangeText={(text) => setRunnerData({ ...runnerData, confirmPassword: text })}
          secureTextEntry
          editable={!loading}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleRunnerSubmit} disabled={loading}>
        <LinearGradient colors={[colors.forest, colors.leaf]} style={styles.submitGradient}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Become a Runner</Text>}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { setSelectedType(null); resetForms(); }}>
        <Text style={styles.backLink}>← Choose different account type</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAdminForm = () => (
    <View style={styles.form}>
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First name"
            value={adminData.firstName}
            onChangeText={(text) => setAdminData({ ...adminData, firstName: text })}
            editable={!loading}
          />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last name"
            value={adminData.lastName}
            onChangeText={(text) => setAdminData({ ...adminData, lastName: text })}
            editable={!loading}
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Admin email"
          value={adminData.email}
          onChangeText={(text) => setAdminData({ ...adminData, email: text })}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Secret Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter admin secret code"
          value={adminData.secretCode}
          onChangeText={(text) => setAdminData({ ...adminData, secretCode: text })}
          secureTextEntry
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          value={adminData.password}
          onChangeText={(text) => setAdminData({ ...adminData, password: text })}
          secureTextEntry
          editable={!loading}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          value={adminData.confirmPassword}
          onChangeText={(text) => setAdminData({ ...adminData, confirmPassword: text })}
          secureTextEntry
          editable={!loading}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleAdminSubmit} disabled={loading}>
        <LinearGradient colors={[colors.forest, colors.leaf]} style={styles.submitGradient}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Create Admin Account</Text>}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { setSelectedType(null); resetForms(); }}>
        <Text style={styles.backLink}>← Choose different account type</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.canvas, colors.canvas]} style={styles.gradient}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.logoSection}>
              <LinearGradient colors={[colors.forest, colors.leaf]} style={styles.logoBox}>
                <Text style={styles.logoText}>C</Text>
              </LinearGradient>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join ConnectUs and start your journey</Text>
            </View>

            {error ? <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View> : null}
            {success ? <View style={styles.successContainer}><Text style={styles.successText}>{success}</Text></View> : null}

            {!selectedType && renderAccountTypeSelection()}
            {selectedType === 'customer' && renderCustomerForm()}
            {selectedType === 'runner' && renderRunnerForm()}
            {selectedType === 'admin' && renderAdminForm()}

            {!selectedType && (
              <View style={styles.loginLink}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                  <Text style={styles.loginLinkText}>Sign in</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.forest, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.leaf, opacity: 0.9, textAlign: 'center' },
  errorContainer: { backgroundColor: '#fee', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#fcc' },
  errorText: { color: '#c33', fontSize: 13, textAlign: 'center' },
  successContainer: { backgroundColor: '#e6ffe6', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#b3ffb3' },
  successText: { color: '#2d531a', fontSize: 13, textAlign: 'center' },
  typeSelection: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.forest, marginBottom: 16 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  typeCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.sage + '30',
  },
  typeCardFull: { width: '100%', marginTop: 12 },
  typeIcon: { marginBottom: 8 },
  typeTitle: { fontSize: 16, fontWeight: '600', color: colors.forest, marginBottom: 4 },
  typeDesc: { fontSize: 12, color: colors.leaf, textAlign: 'center' },
  form: { marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 16 },
  halfField: { flex: 1 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: colors.forest, marginBottom: 6 },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.sage + '30',
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  submitButton: { borderRadius: 50, overflow: 'hidden', marginTop: 8, marginBottom: 16 },
  submitGradient: { paddingVertical: 14, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backLink: { textAlign: 'center', color: colors.moss, fontSize: 14, marginTop: 12 },
  loginLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  loginText: { color: colors.leaf, fontSize: 14 },
  loginLinkText: { color: colors.moss, fontWeight: '600', fontSize: 14 },
});
