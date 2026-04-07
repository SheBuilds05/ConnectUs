import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0D330E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.notificationItem}>
          <View style={styles.notificationIcon}>
            <Ionicons name="flash" size={24} color="#6E8649" />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>New Delivery Request</Text>
            <Text style={styles.notificationMessage}>You have a new delivery request from Pick n Pay</Text>
            <Text style={styles.notificationTime}>2 minutes ago</Text>
          </View>
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationIcon}>
            <Ionicons name="wallet" size={24} color="#6E8649" />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Earnings Updated</Text>
            <Text style={styles.notificationMessage}>You earned R85.00 from your last delivery</Text>
            <Text style={styles.notificationTime}>1 hour ago</Text>
          </View>
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationIcon}>
            <Ionicons name="star" size={24} color="#6E8649" />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>New Rating Received</Text>
            <Text style={styles.notificationMessage}>You received a 5-star rating from a customer</Text>
            <Text style={styles.notificationTime}>3 hours ago</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D330E',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(110, 134, 73, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D330E',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
});