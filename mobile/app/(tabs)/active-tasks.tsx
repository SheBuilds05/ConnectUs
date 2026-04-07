import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RunnerSidebar from '../../components/RunnerSidebar';
import { bookingsAPI } from '../../src/api/endpoints';

// Define the booking type
interface Booking {
  booking_id: number;
  product_description?: string;
  delivery_location: string;
  status: string;
}

export default function ActiveTasksScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveTasks();
  }, []);

  const fetchActiveTasks = async () => {
    try {
      // FIX: Use getActive instead of getMyBookings
      const response = await bookingsAPI.getActive();
      if (response.data?.success && response.data?.data) {
        setActiveBookings(response.data.data);
      } else if (Array.isArray(response.data)) {
        setActiveBookings(response.data);
      } else {
        // Fallback mock data if API not ready
        setActiveBookings([
          { booking_id: 1, product_description: 'Delivery Package', delivery_location: 'Sandton City', status: 'accepted' },
          { booking_id: 2, product_description: 'Food Delivery', delivery_location: 'Rosebank', status: 'in-progress' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching active tasks:', error);
      // Set mock data for development
      setActiveBookings([
        { booking_id: 1, product_description: 'Delivery Package', delivery_location: 'Sandton City', status: 'accepted' },
        { booking_id: 2, product_description: 'Food Delivery', delivery_location: 'Rosebank', status: 'in-progress' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'accepted':
        return { text: 'Pending', color: '#d97706', bgColor: '#fef3c7' };
      case 'in-progress':
        return { text: 'In Progress', color: '#4ade80', bgColor: '#dcfce7' };
      default:
        return { text: status, color: '#666', bgColor: '#e5e7eb' };
    }
  };

  const getProgressWidth = (status: string) => {
    switch (status) {
      case 'accepted': return '20%';
      case 'in-progress': return '60%';
      default: return '0%';
    }
  };

  const getProgressText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Waiting for pickup';
      case 'in-progress': return 'Order being prepared';
      default: return 'Processing';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D330E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RunnerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Menu Button */}
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => setIsSidebarOpen(true)}
      >
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Active Tasks</Text>
          <Text style={styles.subtitle}>Your current deliveries</Text>
        </View>

        <View style={styles.tasksList}>
          {activeBookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkbox-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No active tasks</Text>
              <Text style={styles.emptySubtext}>You don't have any active deliveries</Text>
            </View>
          ) : (
            activeBookings.map((task) => {
              const statusDisplay = getStatusDisplay(task.status);
              const progressWidth = getProgressWidth(task.status);
              const progressText = getProgressText(task.status);
              
              return (
                <View key={task.booking_id} style={styles.taskCard}>
                  <View style={styles.taskHeader}>
                    <View style={styles.taskIcon}>
                      <Ionicons name="cube" size={24} color="#4ade80" />
                    </View>
                    <View style={[styles.taskStatus, { backgroundColor: statusDisplay.bgColor }]}>
                      <Text style={[styles.statusText, { color: statusDisplay.color }]}>
                        {statusDisplay.text}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.taskTitle}>{task.product_description || 'Delivery Request'}</Text>
                  <Text style={styles.taskLocation}>{task.delivery_location}</Text>
                  <View style={styles.taskProgress}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: progressWidth }]} />
                    </View>
                    <Text style={styles.progressText}>{progressText}</Text>
                  </View>
                </View>
              );
            })
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
  },
  menuButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 100,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0D330E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingTop: 100,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D330E',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tasksList: {
    padding: 20,
    gap: 16,
  },
  taskCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0D330E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D330E',
    marginBottom: 4,
  },
  taskLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  taskProgress: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});