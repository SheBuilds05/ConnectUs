import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions for ProfileItem props
interface ProfileItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

// Helper Component for List Items
const ProfileItem = ({ icon, label, value }: ProfileItemProps) => (
  <View style={styles.infoRow}>
    <View style={styles.iconBox}>
      <Ionicons name={icon} size={20} color="#1a2e1a" />
    </View>
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem('user');
      console.log('Profile - Raw stored user:', storedUser);
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('Profile - Parsed user:', user);
        setUserData(user);
      } else {
        console.log('Profile - No user found');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

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
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/runner/edit-profile');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a2e1a" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#9ca3af" />
        <Text style={styles.errorText}>No profile data found</Text>
        <Text style={styles.errorSubText}>Please log in again</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUserData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/auth/login')}>
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get user details from stored data
  const fullName = userData.full_name || userData.name || 'Runner';
  const email = userData.email || 'No email';
  const phone = userData.phone || 'Not provided';
  const city = userData.city || 'Not provided';
  const totalJobs = userData.total_jobs || userData.completed_bookings_count || 0;
  const rating = userData.rating || '4.9';
  const experienceYears = userData.experience_years || '1';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header & Profile Photo */}
      <View style={styles.profileHeader}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ 
              uri: userData.profile_image || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200' 
            }} 
            style={styles.profileImage} 
          />
          <TouchableOpacity style={styles.editBadge} onPress={handleEditProfile}>
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{fullName}</Text>
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={14} color="#4ade80" />
          <Text style={styles.badgeText}>Verified Runner</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalJobs}</Text>
          <Text style={styles.statLabel}>Jobs</Text>
        </View>
        <View style={[styles.statItem, styles.borderSides]}>
          <Text style={styles.statNumber}>{rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{experienceYears}</Text>
          <Text style={styles.statLabel}>Experience</Text>
        </View>
      </View>

      {/* Information Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        
        <ProfileItem icon="mail-outline" label="Email" value={email} />
        <ProfileItem icon="call-outline" label="Phone" value={phone} />
        <ProfileItem icon="location-outline" label="Location" value={city} />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.mainButton} onPress={handleEditProfile}>
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

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9fafb' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a2e1a',
    textAlign: 'center',
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#1a2e1a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a2e1a',
  },
  loginButtonText: {
    color: '#1a2e1a',
    fontWeight: 'bold',
  },
  profileHeader: { 
    alignItems: 'center', 
    marginTop: 60, 
    marginBottom: 30 
  },
  imageContainer: { 
    position: 'relative' 
  },
  profileImage: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    borderWidth: 4,
    borderColor: '#4ade80' 
  },
  editBadge: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: '#1a2e1a', 
    padding: 8, 
    borderRadius: 20, 
    borderWidth: 3,
    borderColor: '#f9fafb' 
  },
  userName: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1a2e1a', 
    marginTop: 15 
  },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 5, 
    marginTop: 5 
  },
  badgeText: { 
    color: '#6b7280', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  statsRow: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    marginHorizontal: 20, 
    padding: 20, 
    borderRadius: 24, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, 
    shadowRadius: 10 
  },
  statItem: { 
    flex: 1, 
    alignItems: 'center' 
  },
  borderSides: { 
    borderLeftWidth: 1, 
    borderRightWidth: 1, 
    borderColor: '#f3f4f6' 
  },
  statNumber: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1a2e1a' 
  },
  statLabel: { 
    fontSize: 12, 
    color: '#9ca3af', 
    marginTop: 2 
  },
  section: { 
    padding: 20, 
    marginTop: 10 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1a2e1a', 
    marginBottom: 15 
  },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 15, 
    marginBottom: 20 
  },
  iconBox: { 
    backgroundColor: '#f3f4f6', 
    padding: 10, 
    borderRadius: 12 
  },
  infoLabel: { 
    fontSize: 12, 
    color: '#9ca3af', 
    fontWeight: '600' 
  },
  infoValue: { 
    fontSize: 15, 
    color: '#1a2e1a', 
    fontWeight: '500' 
  },
  actionContainer: { 
    padding: 20, 
    gap: 10, 
    marginBottom: 40 
  },
  mainButton: { 
    backgroundColor: '#1a2e1a', 
    padding: 18, 
    borderRadius: 18, 
    alignItems: 'center' 
  },
  mainButtonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    padding: 15 
  },
  logoutText: { 
    color: '#ef4444', 
    fontWeight: 'bold' 
  }
});