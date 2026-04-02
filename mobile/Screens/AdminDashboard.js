import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function AdminDashboard() {
  const stats = [
    { label: 'Active Runners', count: 12 },
    { label: 'Pending Orders', count: 45 },
    { label: 'Issues Reported', count: 3 }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Admin Panel</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((item, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statCount}>{item.count}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.actionItem}><Text>Manage Users</Text></TouchableOpacity>
      <TouchableOpacity style={styles.actionItem}><Text>View All Transactions</Text></TouchableOpacity>
      <TouchableOpacity style={styles.actionItem}><Text>System Settings</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 40, backgroundColor: '#2D3436' },
  headerText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'space-around' },
  statCard: { backgroundColor: '#fff', width: '45%', padding: 20, borderRadius: 10, marginVertical: 10, elevation: 3 },
  statCount: { fontSize: 24, fontWeight: 'bold', color: '#00B894' },
  statLabel: { color: '#636E72', marginTop: 5 },
  actionItem: { backgroundColor: '#fff', padding: 20, marginHorizontal: 20, marginVertical: 5, borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#00B894' }
});