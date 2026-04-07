import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../src/context/AuthContext';
import { earningsAPI } from '../../src/api/endpoints';
import { Sidebar } from '../../src/components/Sidebar';

export default function WalletScreen() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [balance, setBalance] = useState(1250.50);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await earningsAPI.getEarnings();
      if (res.data?.success && res.data?.data) {
        setBalance(res.data.data.total || 1250.50);
      }
    } catch (error) { console.error(error);
    } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const handleWithdraw = () => {
    Alert.alert('Withdraw', 'Withdrawal feature coming soon', [{ text: 'OK' }]);
  };

  const sampleTransactions = [
    { id: 1, title: 'Package Delivery', date: 'Mar 30, 2024', amount: 15.00 },
    { id: 2, title: 'Food Delivery', date: 'Mar 29, 2024', amount: 8.50 },
    { id: 3, title: 'Package Delivery', date: 'Mar 28, 2024', amount: 12.00 },
  ];

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#0D330E" /></View>;
  }

  return (
    <View style={styles.container}>
      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} userName={user?.name} />

      <View style={styles.gridBackground} />
      <View style={[styles.glowTop, { backgroundColor: '#A3B18A' }]} />
      <View style={[styles.glowBottom, { backgroundColor: '#2D531A' }]} />

      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.menuButton}>
            <Icon name="menu" size={20} color="white" />
          </TouchableOpacity>
          <View style={styles.locationBadge}>
            <Icon name="map-pin" size={14} color="#2D531A" />
            <Text style={styles.locationText}>Sandton, JHB</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="bell" size={20} color="#0D330E" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.mainContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D330E']} />}>
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerLeft}>
              <View style={styles.bannerLine} />
              <Text style={styles.bannerLabel}>WALLET</Text>
              <Text style={styles.bannerTitle}>Your <Text style={styles.bannerName}>earnings</Text></Text>
            </View>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>R {balance.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {sampleTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionIcon}>
                <Icon name="credit-card" size={20} color="#6E8649" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={styles.transactionAmount}>+R {transaction.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.withdrawCard}>
          <Text style={styles.withdrawLabel}>Available for Withdrawal</Text>
          <Text style={styles.withdrawAmount}>R {balance.toFixed(2)}</Text>
          <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
            <Icon name="arrow-down" size={16} color="white" />
            <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D3D3D3' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#D3D3D3' },
  gridBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03 },
  glowTop: { position: 'absolute', top: 0, right: -80, width: 384, height: 384, borderRadius: 192, opacity: 0.2 },
  glowBottom: { position: 'absolute', bottom: 0, left: -80, width: 384, height: 384, borderRadius: 192, opacity: 0.1 },
  header: { position: 'absolute', top: 0, right: 0, left: 0, zIndex: 40, padding: 16, paddingTop: 48 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  menuButton: { padding: 10, backgroundColor: '#0D330E', borderRadius: 999 },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  locationText: { fontSize: 12, fontWeight: '900', color: '#333' },
  notificationButton: { padding: 10, backgroundColor: 'white', borderRadius: 999, position: 'relative' },
  notificationDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: 'red', borderRadius: 4, borderWidth: 2, borderColor: 'white' },
  mainContent: { flex: 1, marginTop: 100, paddingHorizontal: 20 },
  banner: { backgroundColor: '#0D330E', borderRadius: 32, padding: 24, marginBottom: 20 },
  bannerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 },
  bannerLeft: { flex: 1, gap: 12 },
  bannerLine: { width: 40, height: 2, backgroundColor: '#A3B18A' },
  bannerLabel: { fontSize: 10, color: '#A3B18A', fontWeight: '900', letterSpacing: 3 },
  bannerTitle: { fontSize: 28, fontWeight: '300', color: 'white', lineHeight: 36 },
  bannerName: { fontWeight: '900', fontStyle: 'italic', color: '#A3B18A' },
  balanceCard: { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 32, padding: 24, alignItems: 'center', marginBottom: 20 },
  balanceLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  balanceAmount: { fontSize: 44, fontWeight: 'bold', color: '#0D330E' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#0D330E', marginBottom: 16 },
  transactionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 20, padding: 16, marginBottom: 12 },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(110,134,73,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 16, fontWeight: '600', color: '#0D330E' },
  transactionDate: { fontSize: 12, color: '#666', marginTop: 2 },
  transactionAmount: { fontSize: 16, fontWeight: '700', color: '#10B981' },
  withdrawCard: { backgroundColor: '#0D330E', borderRadius: 32, padding: 24, alignItems: 'center', marginBottom: 40 },
  withdrawLabel: { fontSize: 14, color: '#A3B18A', marginBottom: 8 },
  withdrawAmount: { fontSize: 36, fontWeight: 'bold', color: 'white', marginBottom: 16 },
  withdrawButton: { backgroundColor: '#6E8649', flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30 },
  withdrawButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
});
