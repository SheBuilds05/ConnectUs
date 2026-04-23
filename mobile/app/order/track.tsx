import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserBookings, Booking } from '../../services/bookingService';
import { getCurrentUser } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TrackOrderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userIdFromParams = params.userId ? parseInt(params.userId as string) : null;
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState<string>('customer');
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(userIdFromParams || undefined);

  useEffect(() => {
    loadUserRole();
    loadUserIdFromStorage();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchBookings = async () => {
        setLoading(true);
        try {
          console.log('🔍 Fetching bookings for userId:', currentUserId);
          const data = await getUserBookings(currentUserId);
          console.log('📦 Received bookings:', data.length);
          setBookings(data);
        } catch (error) {
          console.error('Error fetching bookings:', error);
          Alert.alert('Error', 'Failed to load bookings');
        } finally {
          setLoading(false);
        }
      };
      
      fetchBookings();
    }, [currentUserId])
  );

  const loadUserRole = async () => {
    const user = await getCurrentUser();
    setUserRole(user?.role || 'customer');
  };

  const loadUserIdFromStorage = async () => {
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      if (userIdStr) {
        const userId = parseInt(userIdStr);
        console.log('📦 Loaded userId from storage:', userId);
        setCurrentUserId(userId);
      }
    } catch (error) {
      console.error('Error loading userId from storage:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getUserBookings(currentUserId);
      setBookings(data);
    } catch (error) {
      console.error('Error refreshing bookings:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return '#4CAF50';
      case 'IN_TRANSIT': return '#2196F3';
      case 'PURCHASING': return '#FF9800';
      case 'ACCEPTED': return '#9C27B0';
      case 'CREATED': return '#607D8B';
      case 'CANCELLED': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'checkmark-circle';
      case 'IN_TRANSIT': return 'car';
      case 'PURCHASING': return 'cart';
      case 'ACCEPTED': return 'checkmark';
      case 'CREATED': return 'time';
      case 'CANCELLED': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CREATED': return 'Pending';
      case 'ACCEPTED': return 'Accepted';
      case 'PURCHASING': return 'Shopping';
      case 'IN_TRANSIT': return 'On the Way';
      case 'DELIVERED': return 'Delivered';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };

  const getTimelineSteps = (status: string) => {
    const steps = [
      { key: 'CREATED', label: 'Order Placed', icon: 'cart-outline' },
      { key: 'ACCEPTED', label: 'Accepted', icon: 'checkmark-circle-outline' },
      { key: 'PURCHASING', label: 'Shopping', icon: 'bag-outline' },
      { key: 'IN_TRANSIT', label: 'On the Way', icon: 'car-outline' },
      { key: 'DELIVERED', label: 'Delivered', icon: 'home-outline' },
    ];
    
    const currentIndex = steps.findIndex(s => s.key === status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSetUserId = async () => {
    Alert.prompt(
      'Set User ID',
      'Enter your user ID:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Set',
          onPress: async (userIdStr: string | undefined) => {
            if (userIdStr) {
              const userId = parseInt(userIdStr);
              if (!isNaN(userId)) {
                await AsyncStorage.setItem('userId', userId.toString());
                console.log('✅ Manually set userId to:', userId);
                setCurrentUserId(userId);
                Alert.alert('Success', `UserId set to ${userId}. Pull to refresh.`);
              } else {
                Alert.alert('Error', 'Invalid user ID');
              }
            }
          },
        },
      ],
      'plain-text'
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#477023" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0D330E', '#1A4A1A']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)')} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Track Orders</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              onPress={handleSetUserId}
              style={styles.iconButton}
            >
              <Ionicons name="person-add-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={async () => {
                const storedUserId = await AsyncStorage.getItem('userId');
                Alert.alert(
                  'Debug Info',
                  `Current UserId: ${currentUserId || 'null'}\nStored UserId: ${storedUserId || 'null'}\nBookings Found: ${bookings.length}`
                );
              }}
              style={styles.iconButton}
            >
              <Ionicons name="bug-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#A3B18A" />}
          contentContainerStyle={styles.scrollContent}
        >
          {bookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={64} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySubtitle}>Your orders will appear here once you create a booking</Text>
              <TouchableOpacity style={styles.createButton} onPress={() => router.push('/create-booking')}>
                <Text style={styles.createButtonText}>Create Booking</Text>
              </TouchableOpacity>
            </View>
          ) : (
            bookings.map((booking) => {
              const timeline = getTimelineSteps(booking.status);
              const isActive = booking.status !== 'DELIVERED' && booking.status !== 'CANCELLED';
              
              return (
                <View key={booking.booking_id} style={styles.orderCard}>
                  {/* Order Header */}
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderId}>Order #{booking.booking_id}</Text>
                      <Text style={styles.orderDate}>{formatDate(booking.created_at)}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                      <Ionicons name={getStatusIcon(booking.status)} size={12} color={getStatusColor(booking.status)} />
                      <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                        {getStatusLabel(booking.status)}
                      </Text>
                    </View>
                  </View>

                  {/* Order Details */}
                  <View style={styles.orderDetails}>
                    <Text style={styles.productDescription}>{booking.product_description}</Text>
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={14} color="#A3B18A" />
                      <Text style={styles.locationText}>{booking.delivery_location}</Text>
                    </View>
                    <Text style={styles.orderAmount}>R{booking.budget?.toFixed(2)}</Text>
                  </View>

                  {/* Timeline */}
                  <View style={styles.timeline}>
                    {timeline.map((step, index) => (
                      <View key={step.key} style={styles.timelineStep}>
                        <View style={styles.timelineLeft}>
                          <View style={[styles.timelineDot, step.completed && styles.timelineDotCompleted, step.active && styles.timelineDotActive]}>
                            {step.completed && <Ionicons name="checkmark" size={10} color="#fff" />}
                          </View>
                          {index < timeline.length - 1 && (
                            <View style={[styles.timelineLine, step.completed && styles.timelineLineCompleted]} />
                          )}
                        </View>
                        <View style={styles.timelineContent}>
                          <Text style={[styles.timelineLabel, step.completed && styles.timelineLabelCompleted]}>
                            {step.label}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Runner Info (if assigned) */}
                  {booking.runner_id && booking.runner && (
                    <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']} style={styles.runnerCard}>
                      <Image source={{ uri: booking.runner.profile_photo || 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.runnerAvatar} />
                      <View style={styles.runnerInfo}>
                        <Text style={styles.runnerName}>{booking.runner.username}</Text>
                        <Text style={styles.runnerRole}>Your Delivery Partner</Text>
                      </View>
                      <TouchableOpacity style={styles.callButton}>
                        <Ionicons name="call-outline" size={20} color="#fff" />
                      </TouchableOpacity>
                    </LinearGradient>
                  )}

                  {/* Action Buttons for Active Orders */}
                  {isActive && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.trackButton}>
                        <Ionicons name="map-outline" size={18} color="#0D330E" />
                        <Text style={styles.trackButtonText}>Track Live</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.messageButton}>
                        <Ionicons name="chatbubble-outline" size={18} color="#0D330E" />
                        <Text style={styles.messageButtonText}>Message Runner</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 15 
  },
  backButton: { padding: 8 },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconButton: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, width: 36, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  scrollContent: { paddingBottom: 40 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 8, paddingHorizontal: 40 },
  createButton: { backgroundColor: '#A3B18A', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, marginTop: 24 },
  createButtonText: { color: '#0D330E', fontSize: 14, fontWeight: 'bold' },
  orderCard: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 20, marginHorizontal: 16, marginBottom: 16, padding: 16, overflow: 'hidden' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  orderId: { fontSize: 16, fontWeight: 'bold', color: '#0D330E' },
  orderDate: { fontSize: 11, color: '#999', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  orderDetails: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12, marginBottom: 12 },
  productDescription: { fontSize: 14, color: '#333', marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  locationText: { fontSize: 12, color: '#666', flex: 1 },
  orderAmount: { fontSize: 18, fontWeight: 'bold', color: '#477023', marginTop: 4 },
  timeline: { marginVertical: 12 },
  timelineStep: { flexDirection: 'row', marginBottom: 8 },
  timelineLeft: { alignItems: 'center', width: 30, marginRight: 12 },
  timelineDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  timelineDotCompleted: { backgroundColor: '#4CAF50' },
  timelineDotActive: { backgroundColor: '#477023', transform: [{ scale: 1.2 }] },
  timelineLine: { width: 2, height: 20, backgroundColor: '#e0e0e0', marginTop: 2 },
  timelineLineCompleted: { backgroundColor: '#4CAF50' },
  timelineContent: { flex: 1, justifyContent: 'center' },
  timelineLabel: { fontSize: 13, color: '#999' },
  timelineLabelCompleted: { color: '#333', fontWeight: '500' },
  runnerCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, marginTop: 12, gap: 12 },
  runnerAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#A3B18A' },
  runnerInfo: { flex: 1 },
  runnerName: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  runnerRole: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  callButton: { backgroundColor: '#477023', padding: 10, borderRadius: 30 },
  actionButtons: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  trackButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#E8F5E9', paddingVertical: 10, borderRadius: 10 },
  trackButtonText: { fontSize: 13, fontWeight: '500', color: '#0D330E' },
  messageButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#E3F2FD', paddingVertical: 10, borderRadius: 10 },
  messageButtonText: { fontSize: 13, fontWeight: '500', color: '#0D330E' },
});