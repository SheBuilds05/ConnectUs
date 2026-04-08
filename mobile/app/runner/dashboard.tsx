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
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RunnerSidebar from '../../components/RunnerSidebar';
import { getCurrentUser } from '../../services/api';

const { width } = Dimensions.get('window');

export default function RunnerDashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Runner');
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    balance: 4250,
    rating: 4.9,
    totalTrips: 124,
    onlineHours: '06h 12m',
    successRate: 98,
    level: 'PRO',
  });

  const loadUserData = async () => {
    const user = await getCurrentUser();
    if (user) {
      const name = user.full_name || 'Runner';
      setUserName(name);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh – replace with actual API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const liveMissions = [
    {
      id: 1,
      store: 'Pick n Pay',
      location: 'Sandton Hub',
      type: 'Grocery Delivery',
      earnings: 85,
    },
    {
      id: 2,
      store: 'Woolworths',
      location: 'Rosebank',
      type: 'Food Delivery',
      earnings: 65,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#D3D3D3', '#C0C0C0']} style={styles.gradient}>
        {/* Fixed Header */}
        <View style={[styles.header, isSidebarOpen && styles.headerShifted]}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => setIsSidebarOpen(true)} style={styles.menuButton}>
              <Ionicons name="menu" size={24} color="#0D330E" />
            </TouchableOpacity>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={14} color="#2D531A" />
              <Text style={styles.locationText}>Sandton, JHB</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications" size={22} color="#666" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Duty Status:</Text>
            <Text style={styles.statusActive}>Active Now</Text>
            <View style={styles.activeDot} />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
                <Text style={styles.bannerTagText}>Runner Performance</Text>
              </View>
              <Text style={styles.bannerTitle}>
                Keep it up,{' '}
                <Text style={styles.bannerTitleAccent}>{userName.split(' ')[0]}.</Text>
              </Text>
              <Text style={styles.bannerSubtitle}>
                You are in the top 5% of runners in Sandton today. Higher demand expected in 20 minutes.
              </Text>
            </View>
            <View style={styles.bannerStats}>
              <View style={styles.bannerStatItem}>
                <Text style={styles.bannerStatLabel}>Success Rate</Text>
                <Text style={styles.bannerStatValue}>{stats.successRate}%</Text>
              </View>
              <View style={styles.bannerStatDivider} />
              <View style={styles.bannerStatItem}>
                <Text style={styles.bannerStatLabel}>Level</Text>
                <Text style={styles.bannerStatValue}>{stats.level}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Earnings Tile */}
          <TouchableOpacity style={styles.earningsTile} onPress={() => router.push('/runner/earnings')}>
            <View style={styles.earningsHeader}>
              <View style={styles.earningsIcon}>
                <Ionicons name="wallet" size={24} color="#fff" />
              </View>
              <View style={styles.earningsBadge}>
                <Text style={styles.earningsBadgeText}>+12% vs last week</Text>
              </View>
            </View>
            <Text style={styles.earningsLabel}>Balance Available</Text>
            <Text style={styles.earningsAmount}>R {stats.balance.toLocaleString()}</Text>
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawButtonText}>Withdraw Earnings</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Rating and Quick Stats */}
          <View style={styles.statsRow}>
            <LinearGradient
              colors={['#6E8649', '#5a7340']}
              style={styles.ratingTile}
            >
              <Ionicons name="star" size={40} color="#fff" style={styles.ratingIcon} />
              <Text style={styles.ratingValue}>{stats.rating}</Text>
              <Text style={styles.ratingLabel}>Trust Score</Text>
            </LinearGradient>

            <View style={styles.quickStats}>
              <View style={styles.quickStatItem}>
                <View style={styles.quickStatIcon}>
                  <Ionicons name="checkmark-circle" size={20} color="#0D330E" />
                </View>
                <Text style={styles.quickStatValue}>{stats.totalTrips}</Text>
                <Text style={styles.quickStatLabel}>Total Trips</Text>
              </View>
              <View style={styles.quickStatItem}>
                <View style={styles.quickStatIcon}>
                  <Ionicons name="time" size={20} color="#6E8649" />
                </View>
                <Text style={styles.quickStatValue}>{stats.onlineHours}</Text>
                <Text style={styles.quickStatLabel}>Online Today</Text>
              </View>
            </View>
          </View>

          {/* Live Missions */}
          <View style={styles.missionsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>Live Missions</Text>
              <View style={styles.sectionLine} />
            </View>

            {liveMissions.map((mission) => (
              <TouchableOpacity key={mission.id} style={styles.missionCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)']}
                  style={styles.missionCardGradient}
                >
                  <View style={styles.missionLeft}>
                    <View style={styles.missionIcon}>
                      <Ionicons name="cube" size={28} color="#0D330E" />
                    </View>
                    <View>
                      <View style={styles.missionTags}>
                        <Text style={styles.missionStore}>{mission.store}</Text>
                        <Text style={styles.missionLocation}>{mission.location}</Text>
                      </View>
                      <Text style={styles.missionType}>{mission.type}</Text>
                      <Text style={styles.missionEarnings}>
                        <Ionicons name="flash" size={12} color="#6E8649" /> R {mission.earnings} Earning
                      </Text>
                    </View>
                  </View>
                  <View style={styles.missionArrow}>
                    <Ionicons name="arrow-forward" size={24} color="#0D330E" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <RunnerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(10px)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginHorizontal: 16,
    marginTop: 8,
  },
  headerShifted: {
    marginLeft: 260,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: { padding: 8 },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  locationText: { fontSize: 11, fontWeight: 'bold', color: '#333' },
  notificationButton: { padding: 8, position: 'relative' },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: 'red',
    borderRadius: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  statusLabel: { fontSize: 10, color: '#666', fontWeight: 'bold', textTransform: 'uppercase' },
  statusActive: { fontSize: 12, fontWeight: 'bold', color: '#0D330E' },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50' },
  scrollContent: { paddingBottom: 40 },
  banner: {
    margin: 16,
    borderRadius: 30,
    overflow: 'hidden',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bannerContent: { flex: 1 },
  bannerTag: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  bannerLine: { width: 30, height: 2, backgroundColor: '#A3B18A' },
  bannerTagText: { fontSize: 10, fontWeight: 'bold', color: '#A3B18A', letterSpacing: 2 },
  bannerTitle: { fontSize: 24, fontWeight: '300', color: '#fff', marginBottom: 8 },
  bannerTitleAccent: { fontWeight: 'bold', fontStyle: 'italic', color: '#A3B18A' },
  bannerSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.6)', maxWidth: '80%' },
  bannerStats: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  bannerStatItem: { alignItems: 'center' },
  bannerStatLabel: { fontSize: 8, fontWeight: 'bold', color: '#A3B18A', letterSpacing: 1 },
  bannerStatValue: { fontSize: 20, fontWeight: 'bold', color: '#fff', fontStyle: 'italic' },
  bannerStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  earningsTile: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 32,
    margin: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  earningsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  earningsIcon: { backgroundColor: '#0D330E', padding: 12, borderRadius: 16 },
  earningsBadge: { backgroundColor: 'rgba(110,134,73,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  earningsBadgeText: { fontSize: 9, fontWeight: 'bold', color: '#0D330E' },
  earningsLabel: { fontSize: 10, fontWeight: 'bold', color: 'rgba(13,51,14,0.4)', letterSpacing: 2, marginBottom: 4 },
  earningsAmount: { fontSize: 40, fontWeight: 'bold', color: '#0D330E', marginBottom: 20 },
  withdrawButton: { backgroundColor: '#0D330E', paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  withdrawButtonText: { color: '#fff', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 12 },
  ratingTile: {
    flex: 1,
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ratingIcon: { marginBottom: 12 },
  ratingValue: { fontSize: 36, fontWeight: 'bold', color: '#fff', fontStyle: 'italic' },
  ratingLabel: { fontSize: 10, fontWeight: 'bold', color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  quickStats: { flex: 1.2, gap: 12 },
  quickStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 24,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  quickStatIcon: { backgroundColor: '#fff', padding: 8, borderRadius: 12 },
  quickStatValue: { fontSize: 20, fontWeight: 'bold', color: '#0D330E', fontStyle: 'italic' },
  quickStatLabel: { fontSize: 9, fontWeight: 'bold', color: 'rgba(13,51,14,0.4)', letterSpacing: 1, marginLeft: 'auto' },
  missionsSection: { marginHorizontal: 16, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.1)' },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#0D330E', letterSpacing: 3 },
  missionCard: { marginBottom: 12, borderRadius: 28, overflow: 'hidden' },
  missionCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 28,
  },
  missionLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  missionIcon: { backgroundColor: '#0D330E', padding: 12, borderRadius: 20 },
  missionTags: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  missionStore: { fontSize: 9, fontWeight: 'bold', backgroundColor: '#6E8649', color: '#fff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  missionLocation: { fontSize: 9, color: '#666' },
  missionType: { fontSize: 16, fontWeight: 'bold', color: '#0D330E', marginBottom: 4 },
  missionEarnings: { fontSize: 11, color: '#6E8649', fontWeight: 'bold' },
  missionArrow: { backgroundColor: 'rgba(13,51,14,0.05)', padding: 12, borderRadius: 30 },
});