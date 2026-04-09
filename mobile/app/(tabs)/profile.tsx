import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUser, logoutUser, getUserStats } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    jobs: 0,
    rating: 0,
    experience: '0y',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const userData = await getCurrentUser();
      console.log('📦 User data:', userData);
      setUser(userData);
      
      // Load user stats (for runners)
      if (userData?.role === 'runner') {
        // Fetch runner stats from backend
        const userId = userData.user_id || userData.id;
        if (userId) {
          try {
            const statsData = await getUserStats(userId);
            setStats({
              jobs: statsData?.total_trips || statsData?.completed_bookings_count || 0,
              rating: statsData?.rating || 4.5,
              experience: statsData?.experience || '1y',
            });
          } catch (err) {
            console.error('Error loading stats:', err);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a2e1a" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUserData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayName = user.full_name || user.name || 'User';
  const displayEmail = user.email || '';
  const displayPhone = user.phone || 'Not provided';
  const userRole = user.role || 'customer';
  const isRunner = userRole === 'runner';
  const profilePhoto = user.profile_photo || user.avatar_url;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.imageContainer}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>{getInitials(displayName)}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{displayName}</Text>
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={14} color={isRunner ? "#4ade80" : "#2196F3"} />
          <Text style={styles.badgeText}>{isRunner ? 'Verified Runner' : 'Customer'}</Text>
        </View>
      </View>

      {/* Stats Row (for runners) */}
      {isRunner && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.jobs}</Text>
            <Text style={styles.statLabel}>Jobs</Text>
          </View>
          <View style={[styles.statItem, styles.borderSides]}>
            <Text style={styles.statNumber}>{stats.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.experience}</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
        </View>
      )}

      {/* Information Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        
        <ProfileItem icon="mail-outline" label="Email" value={displayEmail} />
        <ProfileItem icon="call-outline" label="Phone" value={displayPhone} />
        
        {/* Show additional info for runners */}
        {isRunner && (
          <>
            <ProfileItem icon="location-outline" label="Location" value={user.city || 'Not specified'} />
            <ProfileItem icon="briefcase-outline" label="Specialties" value={user.expertise?.join(', ') || 'General'} />
          </>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Helper Component for List Items
const ProfileItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconBox}>
      <Ionicons name={icon as any} size={20} color="#1a2e1a" />
    </View>
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
  errorText: { fontSize: 16, color: '#ef4444', marginBottom: 16 },
  retryButton: { backgroundColor: '#1a2e1a', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryButtonText: { color: 'white', fontWeight: 'bold' },
  profileHeader: { alignItems: 'center', marginTop: 60, marginBottom: 30 },
  imageContainer: { position: 'relative' },
  profileImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: '#4ade80' },
  placeholderImage: { backgroundColor: '#1a2e1a', alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontSize: 36, fontWeight: 'bold', color: 'white' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1a2e1a', padding: 8, borderRadius: 20, borderWidth: 3, borderColor: '#f9fafb' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1a2e1a', marginTop: 15 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  badgeText: { color: '#6b7280', fontSize: 14, fontWeight: '500' },
  statsRow: { flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 20, padding: 20, borderRadius: 24, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, marginBottom: 10 },
  statItem: { flex: 1, alignItems: 'center' },
  borderSides: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#f3f4f6' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#1a2e1a' },
  statLabel: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  section: { padding: 20, paddingTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a2e1a', marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 20 },
  iconBox: { backgroundColor: '#f3f4f6', padding: 10, borderRadius: 12 },
  infoLabel: { fontSize: 12, color: '#9ca3af', fontWeight: '600' },
  infoValue: { fontSize: 15, color: '#1a2e1a', fontWeight: '500' },
  actionContainer: { padding: 20, gap: 10, marginBottom: 40 },
  mainButton: { backgroundColor: '#1a2e1a', padding: 18, borderRadius: 18, alignItems: 'center' },
  mainButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 15 },
  logoutText: { color: '#ef4444', fontWeight: 'bold' },
});