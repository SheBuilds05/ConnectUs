import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getRunners, RunnerProfile } from '../../services/runnerService';
import { getCurrentUser, logoutUser } from '../../services/api';

const { width } = Dimensions.get('window');

interface Location {
  lat: number;
  lng: number;
  city: string;
}

const categories = [
  { id: '1', name: 'Fresh Produce', icon: 'leaf', color: '#4CAF50' },
  { id: '2', name: 'Beauty', icon: 'sparkles', color: '#FF69B4' },
  { id: '3', name: 'Fashion', icon: 'shirt', color: '#9C27B0' },
  { id: '4', name: 'Home', icon: 'home', color: '#FF9800' },
  { id: '5', name: 'Groceries', icon: 'cart', color: '#2196F3' },
  { id: '6', name: 'Electronics', icon: 'phone-portrait', color: '#607D8B' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [userInitials, setUserInitials] = useState('U');
  const [location, setLocation] = useState<Location>({
    lat: -26.1076,
    lng: 28.0547,
    city: 'Sandton'
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [runners, setRunners] = useState<RunnerProfile[]>([]);
  const [filteredRunners, setFilteredRunners] = useState<RunnerProfile[]>([]);
  const [isLoadingRunners, setIsLoadingRunners] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logoUrl = "https://raw.githubusercontent.com/SheBuilds05/ConnectUs/main/dir/lOGO.png";

  const sidebarMenuItems = [
    { id: 'create-booking', label: 'Create Booking', icon: 'add-circle-outline', route: '/create-booking', color: '#477023' },
    { id: 'track-order', label: 'Track Order', icon: 'map-outline', route: '/order/track', color: '#2196F3' },
    { id: 'wallet', label: 'Wallet', icon: 'wallet-outline', route: '/wallet', color: '#FFA500' },
  ];

  // Load user data
  useEffect(() => {
    loadUserData();
    getUserLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRunners();
    }, [])
  );

const loadUserData = async () => {
  try {
    const user = await getCurrentUser();
    console.log('Loaded user:', user); // Debug log
    
    if (user) {
      // Try different possible field names from your backend
      const name = user.full_name || user.email?.split('@')[0] || 'User';
      console.log('Display name:', name); // Debug log
      setUserName(name);
      setUserEmail(user.email || '');
      
      // Generate initials from the display name
      const initials = name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      setUserInitials(initials);
    } else {
      console.log('No user found in storage');
    }
  } catch (error) {
    console.error('Error loading user:', error);
  }
};
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setTimeout(() => {
      setLocation({
        lat: -26.1076,
        lng: 28.0547,
        city: 'Sandton'
      });
      setIsLoadingLocation(false);
    }, 1000);
  };

  const fetchRunners = async () => {
    setIsLoadingRunners(true);
    try {
      const fetchedRunners = await getRunners({
        lat: location.lat,
        lng: location.lng,
        category: activeCategory || undefined,
        search: searchTerm || undefined
      });
      console.log('Fetched runners:', fetchedRunners.length);
      setRunners(fetchedRunners);
      setFilteredRunners(fetchedRunners);
    } catch (error) {
      console.error('Error fetching runners:', error);
      Alert.alert('Error', 'Failed to load runners');
    } finally {
      setIsLoadingRunners(false);
    }
  };

  const filterRunners = useCallback(() => {
    let filtered = [...runners];
    
    if (activeCategory) {
      filtered = filtered.filter(r => 
        r.expertise?.some(exp => exp.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredRunners(filtered);
  }, [runners, activeCategory, searchTerm]);

  useEffect(() => {
    filterRunners();
  }, [filterRunners]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRunners();
    setRefreshing(false);
  };

  const handleRunnerPress = (runner: RunnerProfile) => {
    router.push(`/runner/${runner.runner_id}`);
  };

  // ✅ Fixed logout function
 const handleLogout = () => {
  setIsSidebarOpen(false);
  Alert.alert(
    'Logout', 
    'Are you sure you want to logout?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutUser();
            // Use a small delay to ensure storage is cleared
            setTimeout(() => {
              // Navigate to login screen
              router.push('/auth/login');
            }, 100);
          } catch (error) {
            console.error('Logout error:', error);
            router.push('/auth/login');
          }
        }
      }
    ]
  );
};

  const SidebarContent = () => (
    <LinearGradient
      colors={['#2D531A', '#1A3A1A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.sidebarContainer, { width: 260 }]}
    >
      <View style={styles.sidebarHeader}>
        <View style={styles.brandContainer}>
          <View style={styles.logoCircle}>
            <Image source={{ uri: logoUrl }} style={styles.sidebarLogoImage} />
          </View>
          <Text style={styles.brandText}>
            Connect<Text style={styles.brandAccent}>Us</Text>
          </Text>
        </View>
        
        <TouchableOpacity onPress={() => setIsSidebarOpen(false)} style={styles.closeButton}>
          <Ionicons name="close" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.userProfileSection}>
        <View style={styles.userInitialsCircle}>
          <Text style={styles.userInitials}>{userInitials}</Text>
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
          <Text style={styles.userEmail} numberOfLines={1}>{userEmail}</Text>
        </View>
      </View>

      <View style={styles.navMenu}>
        {sidebarMenuItems.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.navItem}
            onPress={() => {
              setIsSidebarOpen(false);
              router.push(item.route as any);
            }}
          >
            <View style={[styles.navIconContainer, { backgroundColor: `${item.color}20` }]}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <Text style={styles.navText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sidebarFooter}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out" size={18} color="#FFB3B3" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>© 2026 ConnectUs</Text>
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#D3D3D3', '#C0C0C0']} style={styles.gradient}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsSidebarOpen(true)} style={styles.menuButton}>
              <Ionicons name="menu" size={24} color="#0D330E" />
            </TouchableOpacity>
            
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={14} color="#2D531A" />
              {isLoadingLocation ? (
                <ActivityIndicator size="small" color="#2D531A" />
              ) : (
                <Text style={styles.locationText}>{location.city}</Text>
              )}
            </View>
            
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications" size={22} color="#666" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          <LinearGradient colors={['#0D330E', '#1A4A1A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
            <View style={styles.bannerContent}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userNameBanner}>{userName.split(' ')[0]}!</Text>
              <Text style={styles.bannerSubtitle}>Discover hidden gems and local runners near you.</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{runners.length}+</Text>
                  <Text style={styles.statLabel}>Runners</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{filteredRunners.length}</Text>
                  <Text style={styles.statLabel}>Available</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>24/7</Text>
                  <Text style={styles.statLabel}>Support</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.logoContainer}>
              <Image source={{ uri: logoUrl }} style={styles.logo} />
            </View>
          </LinearGradient>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search runners..."
                placeholderTextColor="#999"
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <LinearGradient colors={['#0D330E', '#1A4A1A']} style={styles.filterGradient}>
                <Ionicons name="options" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer} contentContainerStyle={styles.categoriesContent}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryItem, activeCategory === cat.name && styles.categoryItemActive]}
                onPress={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: activeCategory === cat.name ? cat.color : `${cat.color}20` }]}>
                  <Ionicons name={cat.icon as any} size={22} color={activeCategory === cat.name ? '#fff' : cat.color} />
                </View>
                <Text style={[styles.categoryName, activeCategory === cat.name && styles.categoryNameActive]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.runnersSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Runners Near You</Text>
              <TouchableOpacity onPress={fetchRunners}>
                <Ionicons name="refresh" size={18} color="#2D531A" />
              </TouchableOpacity>
            </View>

            {isLoadingRunners ? (
              <ActivityIndicator size="large" color="#2D531A" style={styles.loader} />
            ) : filteredRunners.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No runners found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
              </View>
            ) : (
              <View style={styles.runnersGrid}>
                {filteredRunners.map((runner) => (
                  <TouchableOpacity
                    key={runner.runner_id}
                    style={styles.runnerCard}
                    onPress={() => handleRunnerPress(runner)}
                  >
                    <Image source={{ uri: runner.profile_photo || 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.runnerAvatar} />
                    <Text style={styles.runnerName}>{runner.username}</Text>
                    <View style={styles.runnerRating}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={styles.ratingText}>{runner.rating || '4.5'}</Text>
                      <Text style={styles.deliveryCount}>• {runner.completed_bookings_count || 0} deliveries</Text>
                    </View>
                    <Text style={styles.runnerPrice}>From R{Math.max(20, Math.min(50, Math.floor((runner.completed_bookings_count || 0) / 10) + 20))}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <Modal visible={isSidebarOpen} animationType="slide" transparent={true} onRequestClose={() => setIsSidebarOpen(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsSidebarOpen(false)}>
            <SidebarContent />
          </TouchableOpacity>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 },
  menuButton: { padding: 8 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  locationText: { fontSize: 11, fontWeight: 'bold', color: '#333' },
  notificationButton: { padding: 8, position: 'relative' },
  notificationBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, backgroundColor: 'red', borderRadius: 4 },
  banner: { margin: 16, borderRadius: 24, overflow: 'hidden', flexDirection: 'row', minHeight: 200 },
  bannerContent: { flex: 1.5, padding: 16 },
  welcomeText: { color: '#A3B18A', fontSize: 10, letterSpacing: 2, marginBottom: 4 },
  userNameBanner: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  bannerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 10, marginBottom: 12, lineHeight: 14 },
  statsContainer: { flexDirection: 'row', gap: 12 },
  statItem: { alignItems: 'center' },
  statValue: { color: '#A3B18A', fontSize: 14, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 7 },
  logoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 70, height: 70, borderRadius: 35 },
  searchContainer: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 25, paddingHorizontal: 12, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 13 },
  filterButton: { borderRadius: 25, overflow: 'hidden' },
  filterGradient: { padding: 10, alignItems: 'center', justifyContent: 'center' },
  categoriesContainer: { marginBottom: 16 },
  categoriesContent: { paddingHorizontal: 12, gap: 12 },
  categoryItem: { alignItems: 'center', gap: 6 },
  categoryItemActive: { transform: [{ scale: 1.05 }] },
  categoryIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  categoryName: { fontSize: 9, color: '#666', fontWeight: '600' },
  categoryNameActive: { color: '#2D531A' },
  runnersSection: { paddingHorizontal: 16, paddingBottom: 80 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0D330E' },
  loader: { marginTop: 40 },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 18, color: '#666', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 8 },
  runnersGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  runnerCard: { width: (width - 48) / 2, backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  runnerAvatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 6 },
  runnerName: { fontSize: 13, fontWeight: '600', marginBottom: 3 },
  runnerRating: { flexDirection: 'row', alignItems: 'center', marginBottom: 3, gap: 3 },
  ratingText: { fontSize: 10, color: '#666' },
  deliveryCount: { fontSize: 8, color: '#999' },
  runnerPrice: { fontSize: 12, fontWeight: 'bold', color: '#2D531A' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sidebarContainer: { height: '100%', padding: 16 },
  sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1.5, borderColor: '#A3B18A', overflow: 'hidden' },
  sidebarLogoImage: { width: '100%', height: '100%' },
  brandText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  brandAccent: { color: '#A3B18A' },
  closeButton: { padding: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 },
  userProfileSection: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 12, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  userInitialsCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#A3B18A', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' },
  userInitials: { fontSize: 16, fontWeight: 'bold', color: '#2D531A' },
  userInfoContainer: { flex: 1 },
  userName: { fontSize: 12, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  userEmail: { fontSize: 9, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  navMenu: { flex: 1, gap: 6 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)' },
  navIconContainer: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  navText: { flex: 1, fontSize: 13, fontWeight: '500', color: '#fff' },
  sidebarFooter: { marginTop: 'auto', paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10, marginTop: 6 },
  logoutText: { fontSize: 13, fontWeight: '600', color: '#FFB3B3' },
  copyrightContainer: { paddingHorizontal: 10, paddingVertical: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8, marginTop: 10 },
  copyrightText: { fontSize: 7, color: 'rgba(255,255,255,0.3)', textAlign: 'center' },
});