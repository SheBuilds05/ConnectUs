import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* --- TOP NAVIGATION BAR --- */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100' }} 
            style={styles.avatarMini} 
          />
          <View>
            <Text style={styles.welcomeText}>Morning, Sarah</Text>
            <Text style={styles.statusText}>● Online</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color="#1a2e1a" />
          {/* The Red Badge (Unread Notification) */}
          <View style={styles.badgeDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Daily Overview</Text>
          <Text style={styles.subGreeting}>You have 5 new requests nearby</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#1a2e1a' }]}>
            <Ionicons name="cart" size={24} color="#4ade80" />
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#4ade80' }]}>
            <Ionicons name="star" size={24} color="#1a2e1a" />
            <Text style={[styles.statValue, { color: '#1a2e1a' }]}>4.9</Text>
            <Text style={[styles.statLabel, { color: '#1a2e1a' }]}>Rating</Text>
          </View>
        </View>

        {/* Earnings Preview */}
        <View style={styles.earningsCard}>
          <View>
            <Text style={styles.earningsLabel}>This Week</Text>
            <Text style={styles.earningsAmount}>R 1,250.00</Text>
          </View>
          <TouchableOpacity style={styles.viewWalletBtn}>
            <Text style={styles.viewWalletText}>Wallet</Text>
          </TouchableOpacity>
        </View>

        {/* Available Errand Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Errands</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>

        {/* Errand Item */}
        <View style={styles.errandItem}>
          <View style={styles.errandIcon}>
            <Ionicons name="fast-food" size={24} color="#1a2e1a" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.errandTitle}>Dinner Delivery</Text>
            <Text style={styles.errandDetail}>2.5km • McDonald's</Text>
          </View>
          <Text style={styles.errandPrice}>R 45.00</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // New Top Bar Styles
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60, // Space for the phone's status bar
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarMini: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee' },
  welcomeText: { fontSize: 16, fontWeight: 'bold', color: '#1a2e1a' },
  statusText: { fontSize: 12, color: '#4ade80', fontWeight: '600' },
  notificationBtn: { 
    width: 45, 
    height: 45, 
    backgroundColor: '#f3f4f6', 
    borderRadius: 15, 
    alignItems: 'center', 
    justifyContent: 'center',
    position: 'relative'
  },
  badgeDot: { 
    position: 'absolute', 
    top: 12, 
    right: 12, 
    width: 10, 
    height: 10, 
    backgroundColor: '#ef4444', 
    borderRadius: 5, 
    borderWidth: 2, 
    borderColor: '#f3f4f6' 
  },

  // Existing Dashboard Styles
  content: { flex: 1, padding: 20 },
  header: { marginBottom: 25 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1a2e1a' },
  subGreeting: { color: '#6b7280', fontSize: 14, marginTop: 4 },
  statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  statCard: { flex: 1, padding: 20, borderRadius: 24 },
  statValue: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  earningsCard: { backgroundColor: 'white', padding: 20, borderRadius: 24, borderWeight: 1, borderColor: '#f3f4f6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  earningsLabel: { color: '#9ca3af', fontSize: 12, fontWeight: '600' },
  earningsAmount: { fontSize: 20, fontWeight: 'bold', color: '#1a2e1a' },
  viewWalletBtn: { backgroundColor: '#f3f4f6', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  viewWalletText: { fontSize: 12, fontWeight: 'bold', color: '#1a2e1a' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a2e1a' },
  seeAll: { color: '#4ade80', fontWeight: 'bold' },
  errandItem: { backgroundColor: 'white', padding: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  errandIcon: { backgroundColor: '#f3f4f6', padding: 10, borderRadius: 15 },
  errandTitle: { fontWeight: 'bold', color: '#1a2e1a' },
  errandDetail: { fontSize: 12, color: '#9ca3af' },
  errandPrice: { fontWeight: 'bold', color: '#1a2e1a', fontSize: 16 }
});
