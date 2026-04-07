import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Image, Alert,
} from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../src/context/AuthContext';
import { userAPI } from '../../src/api/endpoints';
import { Sidebar } from '../../src/components/Sidebar';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      await userAPI.getProfile();
    } catch (error) { console.error(error);
    } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchProfile(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchProfile(); };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: async () => { await logout(); router.replace('/(auth)/login'); } }
    ]);
  };

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
              <Text style={styles.bannerLabel}>PROFILE</Text>
              <Text style={styles.bannerTitle}>Your <Text style={styles.bannerName}>account</Text></Text>
            </View>
          </View>
        </View>

        <View style={styles.profileCard}>
          <Image source={{ uri: 'https://ui-avatars.com/api/?name=' + (user?.name || 'Runner') + '&background=0D330E&color=fff&size=100' }} style={styles.avatar} />
          <Text style={styles.name}>{user?.name || 'Test Runner'}</Text>
          <Text style={styles.email}>{user?.email || 'runner@connectus.com'}</Text>
          <View style={styles.verifiedBadge}><Icon name="check-circle" size={14} color="#10B981" /><Text style={styles.verifiedText}>Verified Runner</Text></View>
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
  profileCard: { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 32, padding: 24, alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, borderWidth: 3, borderColor: '#6E8649' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#0D330E', marginBottom: 4 },
  email: { fontSize: 14, color: '#666', marginBottom: 12 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  verifiedText: { fontSize: 12, color: '#10B981', fontWeight: '500' },
});
