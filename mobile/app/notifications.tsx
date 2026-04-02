import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.headerSubtitle}>Stay updated with your orders</Text>
      </View>

      {/* Today Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today</Text>
        
        <NotificationItem 
          icon="checkmark-circle"
          title="Delivery Completed"
          message="You successfully delivered order #1234 to Sarah Johnson"
          time="2 minutes ago"
          isNew={true}
          color="#4ade80"
        />
        
        <NotificationItem 
          icon="cash"
          title="Payment Received"
          message="R 45.00 has been added to your wallet"
          time="1 hour ago"
          isNew={true}
          color="#4ade80"
        />
      </View>

      {/* Yesterday Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yesterday</Text>
        
        <NotificationItem 
          icon="star"
          title="New Rating"
          message="You received a 5-star rating from John Doe"
          time="Yesterday, 8:30 PM"
          isNew={false}
          color="#fbbf24"
        />
        
        <NotificationItem 
          icon="alert-circle"
          title="Order Cancelled"
          message="Order #1228 has been cancelled by customer"
          time="Yesterday, 3:15 PM"
          isNew={false}
          color="#ef4444"
        />
      </View>

      {/* This Week Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        
        <NotificationItem 
          icon="gift"
          title="Bonus Earned"
          message="You earned R 150 for completing weekend deliveries"
          time="Mar 28, 2025"
          isNew={false}
          color="#8b5cf6"
        />
        
        <NotificationItem 
          icon="person-add"
          title="New Customer Request"
          message="New delivery request from Mike Thompson"
          time="Mar 27, 2025"
          isNew={false}
          color="#3b82f6"
        />
        
        <NotificationItem 
          icon="trending-up"
          title="Weekly Summary"
          message="You completed 25 deliveries this week"
          time="Mar 26, 2025"
          isNew={false}
          color="#6366f1"
        />
      </View>

      {/* Mark All Read Button */}
      <TouchableOpacity style={styles.markAllButton}>
        <Text style={styles.markAllButtonText}>Mark All as Read</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ✅ FIXED: Added TypeScript interface for NotificationItem props
interface NotificationItemProps {
  icon: keyof typeof Ionicons.glyphMap;  // Valid Ionicons name
  title: string;
  message: string;
  time: string;
  isNew: boolean;
  color: string;
}

// Notification Item Component with proper typing
const NotificationItem: React.FC<NotificationItemProps> = ({ 
  icon, 
  title, 
  message, 
  time, 
  isNew, 
  color 
}) => {
  return (
    <TouchableOpacity style={[styles.notificationItem, isNew && styles.notificationItemNew]}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{title}</Text>
          {isNew && <View style={styles.newBadge} />}
        </View>
        <Text style={styles.notificationMessage}>{message}</Text>
        <Text style={styles.notificationTime}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a2e1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  notificationItemNew: {
    backgroundColor: '#f0fdf4',
    borderColor: '#dcfce7',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2e1a',
    flex: 1,
  },
  newBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  markAllButton: {
    backgroundColor: '#1a2e1a',
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 40,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  markAllButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});