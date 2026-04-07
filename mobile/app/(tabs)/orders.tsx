import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../src/context/AuthContext';
import { bookingsAPI } from '../../src/api/endpoints';
import { Sidebar } from '../../src/components/Sidebar';

export default function OrdersScreen() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('available');
  const [availableBookings, setAvailableBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [availableRes, activeRes, completedRes] = await Promise.all([
        bookingsAPI.getAvailable(),
        bookingsAPI.getMyBookings('accepted,in-progress'),
        bookingsAPI.getMyBookings('completed'),
      ]);
      if (availableRes.data?.success) setAvailableBookings(availableRes.data?.data || []);
      if (activeRes.data?.success) setActiveBookings(activeRes.data?.data || []);
      if (completedRes.data?.success) setCompletedBookings(completedRes.data?.data || []);
    } catch (error) { console.error(error);
    } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchData(); };

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#0D330E" /></View>;
  }

  const getBookings = () => {
    if (activeTab === 'available') return availableBookings;
    if (activeTab === 'active') return activeBookings;
    return completedBookings;
  };

  const bookings = getBookings();

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
              <Text style={styles.bannerLabel}>MY DELIVERIES</Text>
              <Text style={styles.bannerTitle}>Track all your <Text style={styles.bannerName}>missions</Text></Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tab, activeTab === 'available' && styles.activeTab]} onPress={() => setActiveTab('available')}>
            <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>Available ({availableBookings.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'active' && styles.activeTab]} onPress={() => setActiveTab('active')}>
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active ({activeBookings.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'completed' && styles.activeTab]} onPress={() => setActiveTab('completed')}>
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed ({completedBookings.length})</Text>
          </TouchableOpacity>
        </View>

        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="package" size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>No {activeTab} deliveries</Text>
          </View>
        ) : (
          bookings.map((booking, index) => (
            <View key={booking.booking_id || index} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Booking #{booking.booking_id}</Text>
                <Text style={styles.orderTitle}>{booking.product_description || 'Delivery Request'}</Text>
              </View>
              <View style={styles.orderDetails}>
                <Icon name="map-pin" size={14} color="#6E8649" />
                <Text style={styles.orderLocation}>{booking.delivery_location}</Text>
              </View>
            </View>
          ))
        )}
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
  tabsContainer: { flexDirection: 'row', gap: 8, marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 40, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 40 },
  activeTab: { backgroundColor: '#0D330E' },
  tabText: { fontSize: 12, fontWeight: '500', color: '#666' },
  activeTabText: { color: 'white' },
  emptyState: { alignItems: 'center', padding: 60, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 16 },
  orderCard: { backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 32, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', marginBottom: 12 },
  orderId: { fontSize: 12, color: '#6E8649', fontWeight: '600', marginBottom: 4 },
  orderTitle: { fontSize: 16, fontWeight: '600', color: '#0D330E', marginBottom: 8 },
  orderDetails: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderLocation: { fontSize: 14, color: '#666', flex: 1 },
});
