// mobile/src/screens/TrackOrderScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const TrackOrderScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    // Simulate loading - replace with actual API call
    setTimeout(() => {
      setActiveOrders([
        {
          id: 'ORD-001',
          runner: 'Sarah J.',
          status: 'in_progress',
          estimatedDelivery: '30 min',
          items: ['Groceries', 'Vegetables'],
          pickupLocation: 'Checkers, Sandton',
          deliveryLocation: '12 Main St, Sandton',
        },
      ]);
      setCompletedOrders([
        {
          id: 'ORD-002',
          runner: 'Michael C.',
          status: 'delivered',
          deliveredAt: '2024-03-15 14:30',
          items: ['Laptop charger'],
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return 'time-outline';
      case 'in_progress': return 'bicycle-outline';
      case 'delivered': return 'checkmark-circle-outline';
      default: return 'time-outline';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return '#F59E0B';
      case 'in_progress': return '#3B82F6';
      case 'delivered': return '#10B981';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2D531A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Track Orders</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Active Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Orders</Text>
          {activeOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No active orders</Text>
            </View>
          ) : (
            activeOrders.map((order) => (
              <TouchableOpacity key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}10` }]}>
                    <Ionicons name={getStatusIcon(order.status)} size={12} color={getStatusColor(order.status)} />
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                      {getStatusText(order.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <Text style={styles.runnerName}>Runner: {order.runner}</Text>
                  <Text style={styles.estimatedTime}>⏱️ Estimated: {order.estimatedDelivery}</Text>
                </View>

                <View style={styles.locationInfo}>
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text style={styles.locationText}>Pickup: {order.pickupLocation}</Text>
                  </View>
                  <View style={styles.locationRow}>
                    <Ionicons name="navigate-outline" size={16} color="#6B7280" />
                    <Text style={styles.locationText}>Delivery: {order.deliveryLocation}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.trackButton}>
                  <Text style={styles.trackButtonText}>Track Live</Text>
                  <Ionicons name="arrow-forward" size={16} color="#2D531A" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Completed Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed Orders</Text>
          {completedOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="archive-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No completed orders</Text>
            </View>
          ) : (
            completedOrders.map((order) => (
              <View key={order.id} style={[styles.orderCard, styles.completedCard]}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: '#10B98110' }]}>
                    <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                    <Text style={[styles.statusText, { color: '#10B981' }]}>Delivered</Text>
                  </View>
                </View>
                <Text style={styles.runnerName}>Runner: {order.runner}</Text>
                <Text style={styles.deliveredAt}>📦 Delivered on {order.deliveredAt}</Text>
                <TouchableOpacity style={styles.reorderButton}>
                  <Text style={styles.reorderButtonText}>Reorder</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  completedCard: {
    opacity: 0.8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: 12,
  },
  runnerName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 12,
    color: '#F59E0B',
  },
  deliveredAt: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
  },
  locationInfo: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginTop: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D531A',
  },
  reorderButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  reorderButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
  },
});

export default TrackOrderScreen;