import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Type definitions
interface Task {
  id: string;
  orderNumber: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  deliveryTime: string;
  distance: string;
  earnings: number;
  status: 'accepted' | 'picked_up' | 'in_transit' | 'delivered';
  customerName: string;
  customerPhone: string;
  items: string;
}

export default function ActiveTasksScreen() {
  const [activeTasks, setActiveTasks] = useState<Task[]>([
    {
      id: '1',
      orderNumber: '#ORD-2104',
      pickupLocation: 'Sandton City Mall, Sandton',
      dropoffLocation: 'Rosebank Towers, Rosebank',
      pickupTime: '2:30 PM',
      deliveryTime: '3:15 PM',
      distance: '3.2 km',
      earnings: 85.00,
      status: 'accepted',
      customerName: 'John Doe',
      customerPhone: '+27 82 123 4567',
      items: 'Groceries - 3 bags',
    },
    {
      id: '2',
      orderNumber: '#ORD-2105',
      pickupLocation: 'Nando\'s, Braamfontein',
      dropoffLocation: 'Wits University, Braamfontein',
      pickupTime: '3:00 PM',
      deliveryTime: '3:30 PM',
      distance: '1.5 km',
      earnings: 45.00,
      status: 'picked_up',
      customerName: 'Jane Smith',
      customerPhone: '+27 83 456 7890',
      items: 'Food delivery - 2 meals',
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'accepted':
        return '#f59e0b';
      case 'picked_up':
        return '#3b82f6';
      case 'in_transit':
        return '#8b5cf6';
      case 'delivered':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'picked_up':
        return 'Picked Up';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  const handleUpdateStatus = (taskId: string, newStatus: Task['status']) => {
    setActiveTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    
    Alert.alert(
      'Status Updated',
      `Task status changed to ${getStatusText(newStatus)}`,
      [{ text: 'OK' }]
    );
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const renderTaskCard = (task: Task) => (
    <TouchableOpacity
      key={task.id}
      style={styles.taskCard}
      onPress={() => openTaskDetails(task)}
      activeOpacity={0.7}
    >
      {/* Header */}
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

      {/* Locations */}
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

      {/* Details Row */}
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

      {/* Action Buttons */}
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
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Active Tasks</Text>
          <Text style={styles.subtitle}>
            You have {activeTasks.length} active task{activeTasks.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Tasks List */}
        {activeTasks.length > 0 ? (
          activeTasks.map(renderTaskCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle-outline" size={80} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No Active Tasks</Text>
            <Text style={styles.emptyStateText}>
              You're all caught up! Check back later for new delivery requests.
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
              <ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a2e1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  taskCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a2e1a',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  earnings: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ade80',
  },
  locations: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  pickupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 10,
  },
  dropoffDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 10,
  },
  dashedLine: {
    width: 2,
    height: 16,
    backgroundColor: '#d1d5db',
    marginLeft: 3,
    marginVertical: 2,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  detailsRow: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  pickupButton: {
    backgroundColor: '#3b82f6',
  },
  deliverButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    gap: 6,
  },
  callButtonText: {
    color: '#1a2e1a',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a2e1a',
  },
  modalSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  modalValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a2e1a',
    marginBottom: 2,
  },
  modalSubValue: {
    fontSize: 14,
    color: '#6b7280',
  },
  modalEarnings: {
    color: '#4ade80',
    fontSize: 20,
  },
  modalCloseButton: {
    backgroundColor: '#1a2e1a',
    margin: 20,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});