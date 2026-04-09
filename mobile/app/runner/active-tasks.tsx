// mobile/app/runner/active-tasks.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api, { getCurrentUser, getUserId } from '../../services/api';
import { getUserBookings, updateBookingStatus, Booking } from '../../services/bookingService';

// Type definitions
type TaskStatus = 'accepted' | 'picked_up' | 'in_transit' | 'delivered';

interface Task {
  id: string;
  orderNumber: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  deliveryTime: string;
  distance: string;
  earnings: number;
  status: TaskStatus;
  customerName: string;
  customerPhone: string;
  items: string;
}

export default function ActiveTasksScreen() {
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadActiveTasks();
    }, [])
  );

  const loadActiveTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = await getUserId();
      console.log('Current runner ID:', userId);
      
      if (!userId) {
        setError('Please login again');
        setLoading(false);
        return;
      }
      
      // Get all bookings using your existing service
      const allBookings = await getUserBookings();
      console.log('Total bookings fetched:', allBookings.length);
      
      // Filter bookings that are accepted or in_transit for this runner
      const activeBookings = allBookings.filter(
        (booking: Booking) => 
          booking.runner_id === userId && 
          (booking.status === 'ACCEPTED' || booking.status === 'IN_TRANSIT')
      );
      
      console.log('Active bookings for runner:', activeBookings.length);
      
      if (activeBookings.length > 0) {
        // Transform bookings to Task format with proper type casting
        const formattedTasks: Task[] = activeBookings.map((booking: Booking) => {
          // Map backend status to frontend status with proper type
          let taskStatus: TaskStatus = 'accepted';
          if (booking.status === 'IN_TRANSIT') {
            taskStatus = 'in_transit';
          } else if (booking.status === 'ACCEPTED') {
            taskStatus = 'accepted';
          } else if (booking.status === 'PURCHASING') {
            taskStatus = 'picked_up';
          } else if (booking.status === 'DELIVERED') {
            taskStatus = 'delivered';
          }
          
          return {
            id: booking.booking_id.toString(),
            orderNumber: `#ORD-${booking.booking_id}`,
            pickupLocation: 'Pickup location', // You may need to add this to your booking schema
            dropoffLocation: booking.delivery_location,
            pickupTime: booking.scheduled_for ? new Date(booking.scheduled_for).toLocaleTimeString() : 'N/A',
            deliveryTime: 'N/A',
            distance: 'N/A',
            earnings: booking.budget,
            status: taskStatus,
            customerName: booking.runner?.username || 'Customer',
            customerPhone: booking.runner?.phone || 'N/A',
            items: booking.product_description,
          };
        });
        
        setActiveTasks(formattedTasks);
        setError(null);
      } else {
        setActiveTasks([]);
        setError('No active tasks assigned to you');
      }
      
    } catch (error: any) {
      console.error('Error loading tasks:', error);
      setError(`Failed to load tasks: ${error.message}`);
      setActiveTasks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActiveTasks();
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'accepted': return '#f59e0b';
      case 'picked_up': return '#3b82f6';
      case 'in_transit': return '#8b5cf6';
      case 'delivered': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'picked_up': return 'Picked Up';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const bookingId = parseInt(taskId);
      let apiStatus = '';
      
      // Map frontend status to backend status
      switch (newStatus) {
        case 'accepted':
          apiStatus = 'ACCEPTED';
          break;
        case 'picked_up':
          apiStatus = 'PURCHASING';
          break;
        case 'in_transit':
          apiStatus = 'IN_TRANSIT';
          break;
        case 'delivered':
          apiStatus = 'DELIVERED';
          break;
      }
      
      // Use your existing updateBookingStatus service
      await updateBookingStatus(bookingId, apiStatus);
      
      // Update local state
      setActiveTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      
      Alert.alert('Success', `Task status updated to ${getStatusText(newStatus)}`);
    } catch (error: any) {
      console.error('Error updating status:', error);
      Alert.alert('Error', error.message || 'Failed to update status. Please try again.');
    }
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ade80" />
        <Text style={styles.loadingText}>Fetching your tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4ade80']} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Active Tasks</Text>
          <Text style={styles.subtitle}>
            You have {activeTasks.length} active task{activeTasks.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={20} color="#f59e0b" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {activeTasks.length > 0 ? (
          activeTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskCard}
              onPress={() => openTaskDetails(task)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderNumber}>{task.orderNumber}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '20' }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(task.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
                      {getStatusText(task.status)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.earnings}>R{task.earnings.toFixed(2)}</Text>
              </View>

              <View style={styles.locations}>
                <View style={styles.locationRow}>
                  <View style={styles.pickupDot} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {task.pickupLocation}
                  </Text>
                </View>
                <View style={styles.dashedLine} />
                <View style={styles.locationRow}>
                  <View style={styles.dropoffDot} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {task.dropoffLocation}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{task.pickupTime}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{task.distance}</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                {task.status === 'accepted' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.pickupButton]}
                    onPress={() => handleUpdateStatus(task.id, 'picked_up')}
                  >
                    <Ionicons name="cube-outline" size={18} color="white" />
                    <Text style={styles.actionButtonText}>Mark as Picked Up</Text>
                  </TouchableOpacity>
                )}
                
                {task.status === 'picked_up' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deliverButton]}
                    onPress={() => handleUpdateStatus(task.id, 'delivered')}
                  >
                    <Ionicons name="checkmark-circle-outline" size={18} color="white" />
                    <Text style={styles.actionButtonText}>Mark as Delivered</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.callButton}>
                  <Ionicons name="call-outline" size={18} color="#1a2e1a" />
                  <Text style={styles.callButtonText}>Call Customer</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle-outline" size={80} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No Active Tasks</Text>
            <Text style={styles.emptyStateText}>
              {error || "You don't have any active tasks at the moment."}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Task Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Task Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1a2e1a" />
              </TouchableOpacity>
            </View>

            {selectedTask && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Order Number</Text>
                  <Text style={styles.modalValue}>{selectedTask.orderNumber}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Customer Details</Text>
                  <Text style={styles.modalValue}>{selectedTask.customerName}</Text>
                  <Text style={styles.modalSubValue}>{selectedTask.customerPhone}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Items to Deliver</Text>
                  <Text style={styles.modalValue}>{selectedTask.items}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Pickup Location</Text>
                  <Text style={styles.modalValue}>{selectedTask.pickupLocation}</Text>
                  <Text style={styles.modalSubValue}>Time: {selectedTask.pickupTime}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Dropoff Location</Text>
                  <Text style={styles.modalValue}>{selectedTask.dropoffLocation}</Text>
                  <Text style={styles.modalSubValue}>Time: {selectedTask.deliveryTime}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Earnings</Text>
                  <Text style={[styles.modalValue, styles.modalEarnings]}>
                    R{selectedTask.earnings.toFixed(2)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#6b7280' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#f9fafb' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a2e1a' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef3c7', marginHorizontal: 16, marginBottom: 12, padding: 12, borderRadius: 12, gap: 8 },
  errorText: { flex: 1, fontSize: 12, color: '#d97706' },
  taskCard: { backgroundColor: 'white', marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  orderNumber: { fontSize: 16, fontWeight: 'bold', color: '#1a2e1a' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginTop: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '500' },
  earnings: { fontSize: 18, fontWeight: 'bold', color: '#4ade80' },
  locations: { marginBottom: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  pickupDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginRight: 10 },
  dropoffDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444', marginRight: 10 },
  dashedLine: { width: 2, height: 16, backgroundColor: '#d1d5db', marginLeft: 3, marginVertical: 2 },
  locationText: { flex: 1, fontSize: 14, color: '#374151' },
  detailsRow: { flexDirection: 'row', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6', marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  detailText: { fontSize: 12, color: '#6b7280', marginLeft: 4 },
  actionButtons: { flexDirection: 'row', gap: 10 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, gap: 6 },
  pickupButton: { backgroundColor: '#3b82f6' },
  deliverButton: { backgroundColor: '#10b981' },
  actionButtonText: { color: 'white', fontSize: 12, fontWeight: '600' },
  callButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: '#f3f4f6', gap: 6 },
  callButtonText: { color: '#1a2e1a', fontSize: 12, fontWeight: '500' },
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyStateTitle: { fontSize: 20, fontWeight: 'bold', color: '#374151', marginTop: 20, marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a2e1a' },
  modalSection: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  modalLabel: { fontSize: 12, fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', marginBottom: 6 },
  modalValue: { fontSize: 16, fontWeight: '500', color: '#1a2e1a', marginBottom: 2 },
  modalSubValue: { fontSize: 14, color: '#6b7280' },
  modalEarnings: { color: '#4ade80', fontSize: 20 },
  modalCloseButton: { backgroundColor: '#1a2e1a', margin: 20, padding: 16, borderRadius: 16, alignItems: 'center' },
  modalCloseText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});