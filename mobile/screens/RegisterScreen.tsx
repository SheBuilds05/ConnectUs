import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';

// REMOVE ({ navigation }: any) and use this:
export default function RegisterScreen() {
  const router = useRouter();
  const [role, setRole] = useState<'Customer' | 'Runner'>('Customer');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join the ConnectUs network</Text>

      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={[styles.roleBtn, role === 'Customer' && styles.activeRole]} 
          onPress={() => setRole('Customer')}
        >
          <Text style={[styles.roleText, role === 'Customer' && styles.activeRoleText]}>Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleBtn, role === 'Runner' && styles.activeRole]} 
          onPress={() => setRole('Runner')}
        >
          <Text style={styles.roleText}>Runner</Text>
        </TouchableOpacity>
      </View>

      <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor={Colors.gray} />
      <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={Colors.gray} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor={Colors.gray} secureTextEntry />
      
      <TouchableOpacity style={styles.mainBtn} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.mainBtnText}>Register as {role}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.linkText}>Already have an account? <Text style={{color: Colors.accent}}>Login</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.darkBg, padding: 30, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '800', color: Colors.white },
  subtitle: { color: Colors.accent, fontSize: 16, marginBottom: 30 },
  roleContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  roleBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: Colors.gray, alignItems: 'center' },
  activeRole: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  roleText: { color: Colors.white, fontWeight: '600' },
  activeRoleText: { color: Colors.darkBg },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', color: Colors.white, padding: 18, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  mainBtn: { backgroundColor: Colors.accent, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  mainBtnText: { color: Colors.darkBg, fontWeight: '800', fontSize: 16 },
  linkText: { color: Colors.gray, textAlign: 'center', marginTop: 25 }
});