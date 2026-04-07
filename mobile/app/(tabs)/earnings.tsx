import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../src/context/AuthContext';
import { userAPI } from '../../src/api/endpoints';
import { Sidebar } from '../../src/components/Sidebar';

export default function EarningsScreen() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const statsRes = await userAPI.getStats();
      if (statsRes.data?.success) setStats(statsRes.data?.data);
    } catch (error) { console.error(error);
    } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchData(); };

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
              <Text style={styles.bannerLabel}>EARNINGS</Text>
              <Text style={styles.bannerTitle}>Track your <Text style={styles.bannerName}>income</Text></Text>
            </View>
          </View>
        </View>

        <View style={styles.earningsTile}>
          <Text style={styles.earningsLabel}>BALANCE AVAILABLE</Text>
          <Text style={styles.earningsAmount}>R {stats?.total_earnings?.toFixed(2) || '4,250'}</Text>
          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.withdrawText}>WITHDRAW EARNINGS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}><Text style={styles.statValue}>{stats?.total_trips || 0}</Text><Text style={styles.statLabel}>Total Trips</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>{stats?.average_rating?.toFixed(1) || '4.9'}</Text><Text style={styles.statLabel}>Rating</Text></View>
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
  earningsTile: { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 32, padding: 24, alignItems: 'center', marginBottom: 20 },
  earningsLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(13,51,14,0.4)', letterSpacing: 3, marginBottom: 8 },
  earningsAmount: { fontSize: 44, fontWeight: '900', fontStyle: 'italic', color: '#0D330E' },
  withdrawButton: { backgroundColor: '#0D330E', paddingVertical: 12, borderRadius: 20, alignItems: 'center', marginTop: 16, paddingHorizontal: 24 },
  withdrawText: { fontSize: 10, fontWeight: '900', color: 'white', letterSpacing: 2 },
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 24, padding: 20, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#0D330E' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 8 },
});
