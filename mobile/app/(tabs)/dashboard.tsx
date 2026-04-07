import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../src/context/AuthContext';
import { bookingsAPI, userAPI } from '../../src/api/endpoints';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [availableBookings, setAvailableBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName = user?.name || 'Test User';

  const navigationItems = [
    { name: 'Dashboard', icon: 'home', route: 'dashboard' },
    { name: 'Orders', icon: 'package', route: 'orders' },
    { name: 'Active Orders', icon: 'bike', route: 'active-orders' },
    { name: 'Earnings', icon: 'dollar-sign', route: 'earnings' },
    { name: 'Wallet', icon: 'credit-card', route: 'wallet' },
    { name: 'Explore', icon: 'compass', route: 'explore' },
    { name: 'Reviews', icon: 'star', route: 'reviews' },
    { name: 'Profile', icon: 'user', route: 'profile' },
    { name: 'Settings', icon: 'settings', route: 'settings' },
  ];

  const handleMenuPress = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNavigation = (route) => {
    setSidebarOpen(false);
    router.push(`/(tabs)/${route}`);
  };

  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'You have 3 new notifications');
  };

  const handleWithdrawPress = () => {
    Alert.alert('Withdraw', 'Withdrawal feature coming soon');
  };

  const handleMissionPress = (bookingId) => {
    Alert.alert('Accept Mission', 'Accept mission #' + bookingId + '?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Accept', onPress: () => console.log('Mission accepted:', bookingId) }
    ]);
  };

  const fetchData = async () => {
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        bookingsAPI.getAvailable(),
        userAPI.getStats(),
      ]);
      if (bookingsRes.data?.success) setAvailableBookings(bookingsRes.data?.data || []);
      if (statsRes.data?.success) setStats(statsRes.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D330E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.gridBackground} />
      <View style={[styles.glowTop, { backgroundColor: '#A3B18A' }]} />
      <View style={[styles.glowBottom, { backgroundColor: '#2D531A' }]} />

      {/* Sidebar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sidebarOpen}
        onRequestClose={handleCloseSidebar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <View style={styles.logo}>
                <View style={styles.logoIcon}>
                  <Icon name="shopping-cart" size={24} color="white" />
                </View>
                <Text style={styles.logoText}>ConnectUs</Text>
              </View>
              <TouchableOpacity onPress={handleCloseSidebar} style={styles.closeButton}>
                <Icon name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.sidebarUser}>
              <Icon name="user" size={40} color="#A3B18A" />
              <View>
                <Text style={styles.sidebarUserName}>{userName}</Text>
                <Text style={styles.sidebarUserRole}>Verified Runner</Text>
              </View>
            </View>

            <View style={styles.sidebarNav}>
              {navigationItems.map((item) => (
                <TouchableOpacity
                  key={item.route}
                  style={styles.navItem}
                  onPress={() => handleNavigation(item.route)}
                >
                  <Icon name={item.icon} size={20} color="#A3B18A" />
                  <Text style={styles.navText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sidebarFooter}>
              <TouchableOpacity style={styles.logoutButton}>
                <Icon name="log-out" size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
            <Icon name="menu" size={20} color="white" />
          </TouchableOpacity>
          <View style={styles.locationBadge}>
            <Icon name="map-pin" size={14} color="#2D531A" />
            <Text style={styles.locationText}>Sandton, JHB</Text>
          </View>
          <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
            <Icon name="bell" size={20} color="#0D330E" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.mainContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D330E']} />}
      >
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerLeft}>
              <View style={styles.bannerLine} />
              <Text style={styles.bannerLabel}>RUNNER PERFORMANCE</Text>
              <Text style={styles.bannerTitle}>
                Keep it up, {'\n'}
                <Text style={styles.bannerName}>{userName}.</Text>
              </Text>
              <Text style={styles.bannerSubtitle}>
                You are in the top 5% of runners in Sandton today. Higher demand expected in 20 minutes.
              </Text>
            </View>
            <View style={styles.statsBox}>
              <View style={styles.statBoxItem}>
                <Text style={styles.statBoxLabel}>SUCCESS RATE</Text>
                <Text style={styles.statBoxValue}>98%</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBoxItem}>
                <Text style={styles.statBoxLabel}>LEVEL</Text>
                <Text style={styles.statBoxValue}>PRO</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.earningsTile}>
          <View style={styles.earningsHeader}>
            <View style={styles.earningsIcon}>
              <Icon name="dollar-sign" size={24} color="white" />
            </View>
            <View style={styles.earningsBadge}>
              <Text style={styles.earningsBadgeText}>+12% vs last week</Text>
            </View>
          </View>
          <Text style={styles.earningsLabel}>BALANCE AVAILABLE</Text>
          <Text style={styles.earningsAmount}>R {stats?.total_earnings?.toFixed(2) || '4,250'}</Text>
          <TouchableOpacity onPress={handleWithdrawPress} style={styles.withdrawButton}>
            <Text style={styles.withdrawText}>WITHDRAW EARNINGS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ratingTile}>
          <Icon name="star" size={40} color="white" />
          <Text style={styles.ratingValue}>{stats?.average_rating?.toFixed(1) || '4.9'}</Text>
          <Text style={styles.ratingLabel}>TRUST SCORE</Text>
        </View>

        <View style={styles.missionsSection}>
          <View style={styles.missionsHeader}>
            <View style={styles.missionsLine} />
            <Text style={styles.missionsTitle}>LIVE MISSIONS</Text>
            <View style={styles.missionsLine} />
          </View>

          {availableBookings.length === 0 ? (
            <View style={styles.emptyMissions}>
              <Text style={styles.emptyText}>No deliveries available</Text>
            </View>
          ) : (
            availableBookings.slice(0, 2).map((booking, index) => (
              <TouchableOpacity
                key={booking.booking_id || index}
                style={styles.missionCard}
                onPress={() => handleMissionPress(booking.booking_id)}
              >
                <View style={styles.missionIcon}>
                  <Icon name="package" size={28} color="white" />
                </View>
                <View style={styles.missionInfo}>
                  <View style={styles.missionTags}>
                    <Text style={styles.missionStore}>Pick n Pay</Text>
                    <Text style={styles.missionLocation}>Sandton Hub</Text>
                  </View>
                  <Text style={styles.missionTitle}>Grocery Delivery</Text>
                  <Text style={styles.missionEarnings}>
                    <Icon name="zap" size={12} color="#6E8649" /> R {booking.budget?.toFixed(2) || '85.00'} Earning
                  </Text>
                </View>
                <View style={styles.missionArrow}>
                  <Icon name="arrow-right" size={24} color="#0D330E" />
                </View>
              </TouchableOpacity>
            ))
          )}
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sidebar: { width: 280, backgroundColor: '#0D330E', height: '100%', padding: 20 },
  sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: { width: 40, height: 40, backgroundColor: '#6E8649', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  closeButton: { padding: 5 },
  sidebarUser: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 30, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  sidebarUserName: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  sidebarUserRole: { fontSize: 12, color: '#A3B18A' },
  sidebarNav: { flex: 1, gap: 5 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12 },
  navText: { fontSize: 14, color: '#A3B18A' },
  sidebarFooter: { paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  logoutText: { fontSize: 14, color: '#EF4444' },
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
  bannerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)', maxWidth: 280 },
  statsBox: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 16, gap: 24 },
  statBoxItem: { alignItems: 'center' },
  statBoxLabel: { fontSize: 9, fontWeight: '900', color: '#A3B18A', letterSpacing: 2, marginBottom: 4 },
  statBoxValue: { fontSize: 24, fontWeight: '900', color: 'white', fontStyle: 'italic' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  earningsTile: { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 32, padding: 24, gap: 12, marginBottom: 20 },
  earningsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  earningsIcon: { padding: 12, backgroundColor: '#0D330E', borderRadius: 20 },
  earningsBadge: { paddingHorizontal: 12, paddingVertical: 4, backgroundColor: 'rgba(110,134,73,0.2)', borderRadius: 999 },
  earningsBadgeText: { fontSize: 9, fontWeight: '900', fontStyle: 'italic', color: '#0D330E' },
  earningsLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(13,51,14,0.4)', letterSpacing: 3 },
  earningsAmount: { fontSize: 44, fontWeight: '900', fontStyle: 'italic', color: '#0D330E' },
  withdrawButton: { backgroundColor: '#0D330E', paddingVertical: 12, borderRadius: 20, alignItems: 'center', marginTop: 8 },
  withdrawText: { fontSize: 10, fontWeight: '900', color: 'white', letterSpacing: 2 },
  ratingTile: { backgroundColor: '#6E8649', borderRadius: 32, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 },
  ratingValue: { fontSize: 40, fontWeight: '900', fontStyle: 'italic', color: 'white' },
  ratingLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.6)', letterSpacing: 2 },
  missionsSection: { gap: 16, marginBottom: 40 },
  missionsHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  missionsLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.1)' },
  missionsTitle: { fontSize: 10, fontWeight: '900', color: 'rgba(13,51,14,0.6)', letterSpacing: 4 },
  emptyMissions: { backgroundColor: 'white', padding: 40, borderRadius: 24, alignItems: 'center' },
  emptyText: { color: '#999' },
  missionCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 32, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  missionIcon: { width: 56, height: 56, backgroundColor: '#0D330E', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  missionInfo: { flex: 1, gap: 4 },
  missionTags: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  missionStore: { fontSize: 9, fontWeight: '900', backgroundColor: '#6E8649', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, color: 'white' },
  missionLocation: { fontSize: 9, fontWeight: 'bold', color: 'gray', letterSpacing: 1 },
  missionTitle: { fontSize: 16, fontWeight: '900', fontStyle: 'italic', color: '#0D330E' },
  missionEarnings: { fontSize: 11, fontWeight: 'bold', color: '#6E8649' },
  missionArrow: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: 'rgba(13,51,14,0.1)', alignItems: 'center', justifyContent: 'center' },
});
