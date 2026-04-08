import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Type definitions for ProfileItem props
interface ProfileItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

// Helper Component for List Items (moved before it's used)
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
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Header & Profile Photo */}
      <View style={styles.profileHeader}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200' }} 
            style={styles.profileImage} 
          />
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>Sarah Jenkins</Text>
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={14} color="#4ade80" />
          <Text style={styles.badgeText}>Verified Runner</Text>
        </View>
      </View>

      {/* 2. Stats Row (Mirrors your Dashboard) */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Jobs</Text>
        </View>
        <View style={[styles.statItem, styles.borderSides]}>
          <Text style={styles.statNumber}>4.9</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2y</Text>
          <Text style={styles.statLabel}>Experience</Text>
        </View>
      </View>

      {/* 3. Information Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        
        <ProfileItem icon="mail-outline" label="Email" value="sarah.j@connectus.com" />
        <ProfileItem icon="call-outline" label="Phone" value="+27 82 123 4567" />
        <ProfileItem icon="location-outline" label="Location" value="Sandton, Johannesburg" />
      </View>

      {/* 4. Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  profileHeader: { alignItems: 'center', marginTop: 60, marginBottom: 30 },
  imageContainer: { position: 'relative' },
  profileImage: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    borderWidth: 4,  // ✅ FIXED: Changed from 'borderWeight' to 'borderWidth'
    borderColor: '#4ade80' 
  },
  editBadge: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: '#1a2e1a', 
    padding: 8, 
    borderRadius: 20, 
    borderWidth: 3,  // ✅ FIXED: Changed from 'borderWeight' to 'borderWidth'
    borderColor: '#f9fafb' 
  },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1a2e1a', marginTop: 15 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  badgeText: { color: '#6b7280', fontSize: 14, fontWeight: '500' },
  statsRow: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    marginHorizontal: 20, 
    padding: 20, 
    borderRadius: 24, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 10 
  },
  statItem: { flex: 1, alignItems: 'center' },
  borderSides: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#f3f4f6' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#1a2e1a' },
  statLabel: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  section: { padding: 20, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a2e1a', marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 20 },
  iconBox: { backgroundColor: '#f3f4f6', padding: 10, borderRadius: 12 },
  infoLabel: { fontSize: 12, color: '#9ca3af', fontWeight: '600' },
  infoValue: { fontSize: 15, color: '#1a2e1a', fontWeight: '500' },
  actionContainer: { padding: 20, gap: 10, marginBottom: 40 },
  mainButton: { backgroundColor: '#1a2e1a', padding: 18, borderRadius: 18, alignItems: 'center' },
  mainButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 15 },
  logoutText: { color: '#ef4444', fontWeight: 'bold' }
});