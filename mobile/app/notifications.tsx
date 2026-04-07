import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Custom Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1a2e1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markRead}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <NotificationItem 
          icon="cube-outline" 
          color="#4ade80"
          title="New Request Nearby" 
          message="Pick up: McDonald's Sandton. Reward: R45.00" 
          time="2 mins ago"
          isNew={true}
        />
        <NotificationItem 
          icon="wallet-outline" 
          color="#3b82f6"
          title="Payment Received" 
          message="R120.00 has been added to your wallet for Order #2104." 
          time="1 hour ago"
          isNew={true}
        />
        <NotificationItem 
          icon="star-outline" 
          color="#f59e0b"
          title="New Rating" 
          message="A user gave you 5 stars! 'Great service, very fast.'" 
          time="Yesterday"
          isNew={false}
        />
        <NotificationItem 
          icon="gift-outline" 
          color="#a855f7"
          title="Bonus Goal Update" 
          message="You are 2 deliveries away from your R500 monthly bonus!" 
          time="2 days ago"
          isNew={false}
        />
      </ScrollView>
    </View>
  );
}

// Helper Component for Notification Rows
const NotificationItem = ({ icon, title, message, time, isNew, color }) => (
  <TouchableOpacity style={[styles.notiBox, isNew && styles.notiUnread]}>
    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <View style={styles.textContainer}>
      <View style={styles.row}>
        <Text style={styles.notiTitle}>{title}</Text>
        {isNew && <View style={styles.newDot} />}
      </View>
      <Text style={styles.notiMessage}>{message}</Text>
      <Text style={styles.notiTime}>{time}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a2e1a' },
  markRead: { color: '#4ade80', fontWeight: '600', fontSize: 14 },
  content: { flex: 1 },
  notiBox: { 
    flexDirection: 'row', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f9fafb' 
  },
  notiUnread: { backgroundColor: '#f0fdf4' },
  iconContainer: { 
    width: 45, 
    height: 45, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  textContainer: { flex: 1, marginLeft: 15 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notiTitle: { fontWeight: 'bold', color: '#1a2e1a', fontSize: 15 },
  newDot: { width: 8, height: 8, backgroundColor: '#4ade80', borderRadius: 4 },
  notiMessage: { color: '#6b7280', fontSize: 13, marginTop: 4, lineHeight: 18 },
  notiTime: { color: '#9ca3af', fontSize: 11, marginTop: 8 }
});