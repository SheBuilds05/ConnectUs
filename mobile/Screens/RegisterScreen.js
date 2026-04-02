import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import RegisterScreen from '@/Screens/RegisterScreen';

export default function Page() {
  return <RegisterScreen />;
}
export default function RegisterScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState('Customer');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join ConnectUs as a {selectedRole}</Text>

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
          <TextInput placeholder="Full Name" style={styles.input} />
          <TextInput placeholder="Email Address" style={styles.input} keyboardType="email-address" />
          <TextInput placeholder="Phone Number" style={styles.input} keyboardType="phone-pad" />
          <TextInput placeholder="Password" style={styles.input} secureTextEntry />
          <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry />

          {selectedRole === 'Runner' && (
            <TextInput placeholder="Vehicle Type (e.g. Bike, Car)" style={styles.input} />
          )}

          <TouchableOpacity style={styles.mainBtn}>
            <Text style={styles.btnText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('login')}>
            <Text style={styles.footerText}>Already have an account? <Text style={styles.link}>Login</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reuse the styles from LoginScreen to keep the UI consistent
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 40, color: '#2D3436' },
  subtitle: { fontSize: 16, color: '#636E72', marginBottom: 30 },
  roleContainer: { flexDirection: 'row', backgroundColor: '#F0F2F5', borderRadius: 10, padding: 5, marginBottom: 30 },
  roleTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#00B894' },
  roleText: { color: '#636E72', fontWeight: '600' },
  activeRoleText: { color: '#fff' },
  input: { backgroundColor: '#F9FAFB', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#EDF2F7' },
  mainBtn: { backgroundColor: '#00B894', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footerText: { textAlign: 'center', marginTop: 20, marginBottom: 40, color: '#636E72' },
  link: { color: '#2D3436', fontWeight: 'bold' }
});