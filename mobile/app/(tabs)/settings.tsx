import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        {/* Toggle Items */}
        <View style={styles.settingRow}>
          <View style={styles.rowLeft}>
            <Ionicons name="notifications-outline" size={22} color="#1a2e1a" />
            <Text style={styles.settingText}>Push Notifications</Text>
          </View>
          <Switch 
            value={isNotificationsEnabled} 
            onValueChange={setIsNotificationsEnabled}
            trackColor={{ false: '#d1d5db', true: '#4ade80' }}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={22} color="#1a2e1a" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch 
            value={isDarkMode} 
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#d1d5db', true: '#1a2e1a' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingLink icon="help-circle-outline" title="Help Center" />
        <SettingLink icon="shield-checkmark-outline" title="Privacy Policy" />
        <SettingLink icon="document-text-outline" title="Terms of Service" />
      </View>
    </ScrollView>
  );
}

const SettingLink = ({ icon, title }) => (
  <TouchableOpacity style={styles.settingRow}>
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={22} color="#1a2e1a" />
      <Text style={styles.settingText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { marginTop: 60, paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a2e1a' },
  section: { backgroundColor: 'white', marginHorizontal: 20, padding: 15, borderRadius: 24, marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#9ca3af', marginBottom: 15, marginLeft: 5, textTransform: 'uppercase' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  settingText: { fontSize: 16, color: '#1a2e1a', fontWeight: '500' }
});