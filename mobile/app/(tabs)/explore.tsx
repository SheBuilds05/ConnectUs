import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { bookingsAPI } from '../../src/api/endpoints';

export default function ExploreScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await bookingsAPI.getAvailable();
      if (res.data?.success) setBookings(res.data?.data || []);
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
              <Text style={styles.bannerLabel}>EXPLORE</Text>
              <Text style={styles.bannerTitle}>Discover new <Text style={styles.bannerName}>missions</Text></Text>
              <Text style={styles.bannerSubtitle}>Find available delivery opportunities near you</Text>
            </View>
          </View>
        </View>

        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="compass" size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>No missions to explore</Text>
            <Text style={styles.emptyText}>Check back later</Text>
          </View>
        ) : (
          bookings.map((booking, index) => (
            <TouchableOpacity key={booking.booking_id || index} style={styles.missionCard}>
              <View style={styles.missionIcon}><Icon name="compass" size={28} color="white" /></View>
              <View style={styles.missionInfo}>
                <View style={styles.missionTags}>
                  <Text style={styles.missionStore}>Pick n Pay</Text>
                  <Text style={styles.missionLocation}>Sandton Hub</Text>
                </View>
                <Text style={styles.missionTitle}>{booking.product_description || 'Delivery Request'}</Text>
                <Text style={styles.missionEarnings}><Icon name="zap" size={12} color="#6E8649" /> R {booking.budget?.toFixed(2) || '85.00'} Earning</Text>
              </View>
              <View style={styles.missionArrow}><Icon name="arrow-right" size={24} color="#0D330E" /></View>
            </TouchableOpacity>
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
  bannerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)', maxWidth: 280 },
  emptyState: { alignItems: 'center', padding: 60, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#999', marginTop: 8 },
  missionCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 32, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', marginBottom: 12 },
  missionIcon: { width: 56, height: 56, backgroundColor: '#0D330E', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  missionInfo: { flex: 1, gap: 4 },
  missionTags: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  missionStore: { fontSize: 9, fontWeight: '900', backgroundColor: '#6E8649', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, color: 'white' },
  missionLocation: { fontSize: 9, fontWeight: 'bold', color: 'gray', letterSpacing: 1 },
  missionTitle: { fontSize: 16, fontWeight: '900', fontStyle: 'italic', color: '#0D330E' },
  missionEarnings: { fontSize: 11, fontWeight: 'bold', color: '#6E8649' },
  missionArrow: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: 'rgba(13,51,14,0.1)', alignItems: 'center', justifyContent: 'center' },
});
