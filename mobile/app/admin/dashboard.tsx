// app/admin/dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentUser, logoutUser } from '../../services/api';

const colors = {
  forest: '#0D330E',
  leaf: '#2D531A',
  moss: '#477023',
  sage: '#6E8649',
  canvas: '#D3D3D3',
  white: '#FFFFFF',
  text: '#1F2E2A',
  darkBg: '#0A1F0A',
  gray: '#8E8E93',
  accent: '#A3B18A',
  deepForest: '#0D330E',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 1284,
    activeRunners: 156,
    pendingVerifications: 12,
    openDisputes: 2,
    totalRevenue: 45280,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user?.role === 'admin') {
        setRole('admin');
      } else {
        router.replace('/landing');
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
            router.replace('/landing');
          },
        },
      ]
    );
  };

  if (!role) return null;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.darkBg, colors.forest]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>System Overview</Text>
              <Text style={styles.title}>Admin Panel</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color={colors.accent} />
            </TouchableOpacity>
          </View>

          {/* Stats Grid - First Row */}
          <View style={styles.statsGrid}>
            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              style={styles.statCard}
            >
              <Ionicons name="people" size={28} color={colors.accent} />
              <Text style={styles.statNumber}>{stats.totalUsers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </LinearGradient>

            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              style={styles.statCard}
            >
              <Ionicons name="bicycle" size={28} color={colors.accent} />
              <Text style={styles.statNumber}>{stats.activeRunners}</Text>
              <Text style={styles.statLabel}>Active Runners</Text>
            </LinearGradient>
          </View>

          {/* Stats Grid - Second Row */}
          <View style={styles.statsGrid}>
            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              style={styles.statCard}
            >
              <Ionicons name="shield-checkmark" size={28} color="#FFD700" />
              <Text style={styles.statNumber}>{stats.pendingVerifications}</Text>
              <Text style={styles.statLabel}>Pending Verifications</Text>
            </LinearGradient>

            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              style={styles.statCard}
            >
              <Ionicons name="alert-circle" size={28} color="#FF6B6B" />
              <Text style={styles.statNumber}>{stats.openDisputes}</Text>
              <Text style={styles.statLabel}>Open Disputes</Text>
            </LinearGradient>
          </View>

          {/* Revenue Card */}
          <LinearGradient
            colors={[colors.forest, colors.deepForest]}
            style={styles.revenueCard}
          >
            <View style={styles.revenueHeader}>
              <Text style={styles.revenueTitle}>Total Revenue</Text>
              <Ionicons name="trending-up" size={24} color={colors.accent} />
            </View>
            <Text style={styles.revenueAmount}>R{stats.totalRevenue.toLocaleString()}</Text>
            <Text style={styles.revenueSubtext}>+12% from last month</Text>
          </LinearGradient>

          {/* Management Section */}
          <Text style={styles.sectionTitle}>Management</Text>

          <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/admin/verify-runners')}>
            <LinearGradient colors={[colors.deepForest, colors.forest]} style={styles.actionIcon}>
              <Ionicons name="shield-checkmark" size={22} color={colors.accent} />
            </LinearGradient>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Verify Runners</Text>
              <Text style={styles.actionSub}>{stats.pendingVerifications} pending applications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/admin/dashboard')}>
            <LinearGradient colors={[colors.deepForest, colors.forest]} style={styles.actionIcon}>
              <Ionicons name="alert-circle" size={22} color="#FFD700" />
            </LinearGradient>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Dispute Center</Text>
              <Text style={styles.actionSub}>{stats.openDisputes} open tickets</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/admin/dashboard')}>
            <LinearGradient colors={[colors.deepForest, colors.forest]} style={styles.actionIcon}>
              <Ionicons name="wallet" size={22} color={colors.white} />
            </LinearGradient>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>System Revenue</Text>
              <Text style={styles.actionSub}>View escrow & payouts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/admin/dashboard')}>
            <LinearGradient colors={[colors.deepForest, colors.forest]} style={styles.actionIcon}>
              <Ionicons name="people" size={22} color={colors.accent} />
            </LinearGradient>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>User Management</Text>
              <Text style={styles.actionSub}>Manage all platform users</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>ConnectUs v1.0.4 Premium Admin</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  greeting: { color: colors.gray, fontSize: 14, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '900', color: colors.white },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 12,
    borderRadius: 12,
  },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  statNumber: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  statLabel: { color: colors.gray, fontSize: 11, marginTop: 2, textAlign: 'center' },
  revenueCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  revenueTitle: { color: colors.gray, fontSize: 14, fontWeight: '500' },
  revenueAmount: { color: colors.white, fontSize: 32, fontWeight: 'bold', marginBottom: 4 },
  revenueSubtext: { color: colors.accent, fontSize: 12 },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: { flex: 1, marginLeft: 15 },
  actionTitle: { color: colors.white, fontWeight: '700', fontSize: 16 },
  actionSub: { color: colors.gray, fontSize: 12, marginTop: 2 },
  footer: { marginTop: 40, alignItems: 'center', opacity: 0.3 },
  footerText: { color: colors.white, fontSize: 12 },
});