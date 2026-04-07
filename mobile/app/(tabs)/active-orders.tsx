import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { bookingsAPI } from '../../src/api/endpoints';

export default function ActiveOrdersScreen() {
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await bookingsAPI.getMyBookings('accepted,in-progress');
      if (res.data?.success) setActiveBookings(res.data?.data || []);
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
      <View style={styles.gridBackground} />
      <View style={[styles.glowTop, { backgroundColor: '#A3B18A' }]} />
      <View style={[styles.glowBottom, { backgroundColor: '#2D531A' }]} />

      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.locationBadge}>
            <Icon name="map-pin" size={14} color="#2D531A" />
            <Text style={styles.locationText}>Sandton, JHB</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.mainContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D330E']} />}>
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerLeft}>
              <View style={styles.bannerLine} />
              <Text style={styles.bannerLabel}>ACTIVE ORDERS</Text>
              <Text style={styles.bannerTitle}>Your current <Text style={styles.bannerName}>deliveries</Text></Text>
            </View>
          </View>
        </View>

        {activeBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="bike" size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>No active deliveries</Text>
            <Text style={styles.emptyText}>Accept a delivery to get started</Text>
          </View>
        ) : (
          activeBookings.map((booking, index) => (
            <View key={booking.booking_id || index} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>Booking #{booking.booking_id}</Text>
                  <Text style={styles.orderTitle}>{booking.product_description || 'Delivery Request'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: booking.status === 'accepted' ? '#6E8649' : '#F59E0B' }]}>
                  <Text style={styles.statusText}>{booking.status === 'accepted' ? 'ACCEPTED' : 'IN PROGRESS'}</Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.detailItem}>
                  <Icon name="map-pin" size={14} color="#6E8649" />
                  <Text style={styles.detailText}>{booking.delivery_location}</Text>
                </View>
                {booking.customer?.name && (
                  <View style={styles.detailItem}>
                    <Icon name="user" size={14} color="#6E8649" />
                    <Text style={styles.detailText}>{booking.customer.name}</Text>
                  </View>
                )}
                <View style={styles.detailItem}>
                  <Icon name="dollar-sign" size={14} color="#6E8649" />
                  <Text style={styles.detailText}>Payout: R {booking.budget?.toFixed(2) || '0'}</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                {booking.status === 'accepted' && (
                  <TouchableOpacity style={styles.startButton}>
                    <Icon name="navigation" size={16} color="white" />
                    <Text style={styles.buttonText}>Start Delivery</Text>
                  </TouchableOpacity>
                )}
                {booking.status === 'in-progress' && (
                  <TouchableOpacity style={styles.completeButton}>
                    <Icon name="check-circle" size={16} color="white" />
                    <Text style={styles.buttonText}>Complete Delivery</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.messageButton}>
                  <Icon name="message-circle" size={16} color="#0D330E" />
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
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
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  locationText: { fontSize: 12, fontWeight: '900', color: '#333' },
  mainContent: { flex: 1, marginTop: 100, paddingHorizontal: 20 },
  banner: { backgroundColor: '#0D330E', borderRadius: 32, padding: 24, marginBottom: 20 },
  bannerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 },
  bannerLeft: { flex: 1, gap: 12 },
  bannerLine: { width: 40, height: 2, backgroundColor: '#A3B18A' },
  bannerLabel: { fontSize: 10, color: '#A3B18A', fontWeight: '900', letterSpacing: 3 },
  bannerTitle: { fontSize: 28, fontWeight: '300', color: 'white', lineHeight: 36 },
  bannerName: { fontWeight: '900', fontStyle: 'italic', color: '#A3B18A' },
  emptyState: { alignItems: 'center', padding: 60, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#999', marginTop: 8 },
  orderCard: { backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 32, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', marginBottom: 12 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  orderId: { fontSize: 12, color: '#6E8649', fontWeight: '600', backgroundColor: 'rgba(110,134,73,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginBottom: 4 },
  orderTitle: { fontSize: 16, fontWeight: '600', color: '#0D330E' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 10, fontWeight: '600', color: 'white' },
  orderDetails: { gap: 8, marginBottom: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 14, color: '#666', flex: 1 },
  actionButtons: { flexDirection: 'row', gap: 12 },
  startButton: { flex: 1, backgroundColor: '#0D330E', paddingVertical: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  completeButton: { flex: 1, backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  messageButton: { flex: 1, backgroundColor: 'rgba(255,255,255,0.8)', paddingVertical: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#ddd' },
  buttonText: { color: 'white', fontSize: 12, fontWeight: '600' },
  messageButtonText: { color: '#0D330E', fontSize: 12, fontWeight: '600' },
});
