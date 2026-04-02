import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WalletScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
        <Text style={styles.subtitle}>Manage your earnings</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>R 2,450.00</Text>
        
        <TouchableOpacity style={styles.withdrawBtn}>
          <Text style={styles.withdrawText}>Withdraw to Bank</Text>
          <Ionicons name="arrow-forward" size={18} color="#1a2e1a" />
        </TouchableOpacity>
      </View>

      {/* Monthly Bonus */}
      <View style={styles.bonusCard}>
        <View style={styles.row}>
          <Ionicons name="gift" size={20} color="#4ade80" />
          <Text style={styles.bonusTitle}>Monthly Bonus</Text>
        </View>
        <Text style={styles.bonusDesc}>R500 scheduled for April 1st</Text>
      </View>

      {/* Recent Transactions Section */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.transaction}>
        <View style={styles.iconCircle}>
          <Ionicons name="basket" size={20} color="#4ade80" />
        </View>
        <View style={{flex: 1, ml: 10}}>
          <Text style={styles.transName}>Grocery Order #2104</Text>
          <Text style={styles.transDate}>March 2, 2026</Text>
        </View>
        <Text style={styles.transAmount}>+ R120.00</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 20 },
  header: { marginTop: 40, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a2e1a' },
  subtitle: { color: '#6b7280' },
  balanceCard: { backgroundColor: '#1a2e1a', borderRadius: 24, padding: 24, marginBottom: 20 },
  balanceLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  balanceAmount: { color: '#ffffff', fontSize: 36, fontWeight: 'bold', marginVertical: 10 },
  withdrawBtn: { backgroundColor: '#4ade80', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  withdrawText: { color: '#1a2e1a', fontWeight: 'bold' },
  bonusCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: 20, borderWeight: 1, borderColor: '#f3f4f6' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bonusTitle: { fontWeight: 'bold', color: '#1a2e1a' },
  bonusDesc: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 20, color: '#1a2e1a' },
  transaction: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 15, borderRadius: 15, marginBottom: 10 },
  iconCircle: { backgroundColor: '#f0fdf4', padding: 10, borderRadius: 12 },
  transName: { fontWeight: 'bold', fontSize: 14 },
  transDate: { fontSize: 12, color: '#9ca3af' },
  transAmount: { fontWeight: 'bold', color: '#10b981' }
});
