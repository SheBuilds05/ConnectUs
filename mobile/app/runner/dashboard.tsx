import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RunnerSidebar from '../../components/RunnerSidebar';

const { width, height } = Dimensions.get('window');

const API_BASE_URL = 'https://connectus-tpyp.onrender.com';

interface DashboardData {
  profile: {
    full_name?: string;
    name?: string;
    city?: string;
    wallet_balance?: number;
  };
  stats: {
    successRate: number;
    level: string;
    totalTrips: number;
    activeMissions: number;
  };
  notifications: any[];
}

export default function RunnerDashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [runnerName, setRunnerName] = useState("Runner");

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        setLoading(false);
        return;
      }
      const user = JSON.parse(storedUser);
      setRunnerName(user.full_name || user.name || "Runner");

      if (user.user_id) {
        const response = await axios.get(`${API_BASE_URL}/api/runners/dashboard/${user.user_id}`);
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardStats();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardStats();
  };

  const profile = dashboardData?.profile || {};
  const stats = dashboardData?.stats || { 
    successRate: 0, 
    level: "JUNIOR", 
    totalTrips: 0, 
    activeMissions: 0 
  };
  const notifications = dashboardData?.notifications || [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D330E" />
        <Text style={styles.loadingText}>Synchronizing Systems...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#F0F4EF', '#E8EDE4']}
        style={styles.gradient}
      >
        {/* Decorative Background Elements */}
        <View style={styles.decorativeBubble1} />
        <View style={styles.decorativeBubble2} />
        <View style={styles.decorativeGlassBubble} />
        <View style={styles.decorativeShape} />

        {/* Sidebar */}
        <RunnerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Header */}
        <View style={[styles.header, isSidebarOpen && styles.headerShifted]}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => setIsSidebarOpen(true)} style={styles.menuButton}>
              <Ionicons name="menu" size={20} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={14} color="#477023" />
              <Text style={styles.locationText}>{profile.city || "Johannesburg"}</Text>
            </View>

            <TouchableOpacity onPress={() => setShowNotifications(!showNotifications)} style={styles.notificationButton}>
              <Ionicons name="notifications" size={20} color="#0D330E" />
              {notifications.length > 0 && <View style={styles.notificationBadge} />}
            </TouchableOpacity>
          </View>
          
          <View style={styles.operationsHub}>
            <Text style={styles.operationsHubText}>Operations Hub</Text>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0D330E']} />}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Banner */}
          <LinearGradient
            colors={['#0D330E', '#1A4A1A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerTag}>
                <View style={styles.bannerLine} />
                <Text style={styles.bannerTagText}>Live Performance</Text>
              </View>
              <Text style={styles.bannerTitle}>
                Keep it up,{"\n"}
                <Text style={styles.bannerTitleAccent}>{runnerName.split(' ')[0]}.</Text>
              </Text>
            </View>
            
            <View style={styles.bannerStats}>
              <View style={styles.bannerStatItem}>
                <Text style={styles.bannerStatLabel}>Success</Text>
                <Text style={styles.bannerStatValue}>{stats.successRate}%</Text>
              </View>
              <View style={styles.bannerStatDivider} />
              <View style={styles.bannerStatItem}>
                <Text style={styles.bannerStatLabel}>Rank</Text>
                <Text style={styles.bannerStatValue}>{stats.level}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {/* Wallet Card */}
            <LinearGradient
              colors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)']}
              style={styles.walletTile}
            >
              <View style={styles.walletIcon}>
                <Ionicons name="wallet" size={28} color="#fff" />
              </View>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletAmount}>
                R {profile.wallet_balance?.toFixed(2) || "0.00"}
              </Text>
            </LinearGradient>

            {/* Trust Score Card */}
            <LinearGradient
              colors={['#6E8649', '#5a7340']}
              style={styles.ratingTile}
            >
              <Ionicons name="star" size={48} color="#C5D3B0" style={styles.ratingIcon} />
              <Text style={styles.ratingValue}>4.9</Text>
              <Text style={styles.ratingLabel}>Runner Score</Text>
            </LinearGradient>

            {/* Quick Stats Column */}
            <View style={styles.quickStatsColumn}>
              <LinearGradient
                colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.3)']}
                style={styles.quickStatItem}
              >
                <View style={styles.quickStatIcon}>
                  <Ionicons name="checkmark-circle" size={24} color="#0D330E" />
                </View>
                <View>
                  <Text style={styles.quickStatValue}>{stats.totalTrips}</Text>
                  <Text style={styles.quickStatLabel}>Trips Completed</Text>
                </View>
              </LinearGradient>

              <LinearGradient
                colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.3)']}
                style={styles.quickStatItem}
              >
                <View style={styles.quickStatIcon}>
                  <Ionicons name="time" size={24} color="#6E8649" />
                </View>
                <View>
                  <Text style={styles.quickStatValue}>{currentTime}</Text>
                  <Text style={styles.quickStatLabel}>Active Time</Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4EF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0D330E',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  // Decorative elements
  decorativeBubble1: {
    position: 'absolute',
    top: -height * 0.05,
    left: -width * 0.05,
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: '#C2D1B2',
    opacity: 0.3,
  },
  decorativeBubble2: {
    position: 'absolute',
    bottom: height * 0.1,
    right: -width * 0.05,
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: '#A3B18A',
    opacity: 0.2,
  },
  decorativeGlassBubble: {
    position: 'absolute',
    top: '40%',
    right: '15%',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  decorativeShape: {
    position: 'absolute',
    bottom: '20%',
    left: '10%',
    width: 50,
    height: 50,
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'rgba(13,51,14,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(13,51,14,0.1)',
    borderRadius: 12,
  },
  header: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 40,
    padding: 16,
    paddingTop: 48,
  },
  headerShifted: {
    marginLeft: 280,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  menuButton: {
    padding: 10,
    backgroundColor: '#0D330E',
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#C2D1B2',
  },
  locationText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
  },
  notificationButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 999,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  operationsHub: {
    alignItems: 'center',
    marginTop: 8,
  },
  operationsHubText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0D330E',
    textTransform: 'uppercase',
    letterSpacing: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingTop: 140,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  banner: {
    borderRadius: 48,
    padding: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  bannerContent: {
    marginBottom: 20,
  },
  bannerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  bannerLine: {
    width: 40,
    height: 2,
    backgroundColor: '#A3B18A',
  },
  bannerTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#A3B18A',
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#fff',
    lineHeight: 38,
  },
  bannerTitleAccent: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#C5D3B0',
  },
  bannerStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 32,
    padding: 16,
    gap: 16,
  },
  bannerStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  bannerStatLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#A3B18A',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontStyle: 'italic',
  },
  bannerStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statsGrid: {
    gap: 16,
  },
  walletTile: {
    borderRadius: 56,
    padding: 24,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  walletIcon: {
    padding: 14,
    backgroundColor: '#0D330E',
    borderRadius: 20,
    width: 56,
    marginBottom: 16,
  },
  walletLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: 'rgba(13,51,14,0.4)',
    marginBottom: 4,
  },
  walletAmount: {
    fontSize: 44,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#0D330E',
  },
  ratingTile: {
    borderRadius: 56,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  ratingIcon: {
    marginBottom: 12,
  },
  ratingValue: {
    fontSize: 40,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#fff',
  },
  ratingLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  quickStatsColumn: {
    gap: 12,
  },
  quickStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 40,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatIcon: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#0D330E',
  },
  quickStatLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(13,51,14,0.4)',
  },
});