import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import LoginScreen from '@/Screens/LoginScreen';

export default function Page() {
  return <LoginScreen />;
}
export default function LoginScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState('Customer');

  const handleLogin = () => {
    // If Admin, go to Dashboard; else go to User Home (to be built)
    if (selectedRole === 'Admin') {
      navigation.navigate('AdminDashboard');
    } else {
      console.log(`Login as ${selectedRole}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login as a {selectedRole}</Text>

      <View style={styles.roleContainer}>
        {['Customer', 'Runner', 'Admin'].map((role) => (
          <TouchableOpacity 
            key={role} 
            style={[styles.roleTab, selectedRole === role && styles.activeTab]}
            onPress={() => setSelectedRole(role)}
          >
            <Text style={[styles.roleText, selectedRole === role && styles.activeRoleText]}>{role}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.form}>
        <TextInput placeholder="Email Address" style={styles.input} keyboardType="email-address" />
        <TextInput placeholder="Password" style={styles.input} secureTextEntry />
        
        <TouchableOpacity style={styles.mainBtn} onPress={handleLogin}>
          <Text style={styles.btnText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('register')}>
          <Text style={styles.footerText}>Don't have an account? <Text style={styles.link}>Register</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 40, color: '#2D3436' },
  subtitle: { fontSize: 16, color: '#636E72', marginBottom: 30 },
  roleContainer: { flexDirection: 'row', backgroundColor: '#F0F2F5', borderRadius: 10, padding: 5, marginBottom: 30 },
  roleTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#00B894' },
  roleText: { color: '#636E72', fontWeight: '600' },
  activeRoleText: { color: '#fff' },
  input: { backgroundColor: '#F9FAFB', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#EDF2F7' },
  mainBtn: { backgroundColor: '#2D3436', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footerText: { textAlign: 'center', marginTop: 20, color: '#636E72' },
  link: { color: '#00B894', fontWeight: 'bold' }
});