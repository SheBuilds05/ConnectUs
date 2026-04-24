// app/admin/dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentUser, logoutUser } from '../../services/api';
import api from '../../services/api';

interface User {
  user_id: number;
  full_name: string;
  email: string;
  role: string;
  is_blocked?: boolean;
  status?: string;
  created_at?: string;
}

interface Runner {
  runner_id: number;
  username: string;
  email: string;
  city: string;
  verification_status: string;
  completed_bookings_count: number;
  is_blocked?: boolean;
}

interface Booking {
  booking_id: number;
  user_id: number;
  runner_id: number | null;
  product_description: string;
  delivery_location: string;
  budget: number;
  status: string;
  created_at: string;
  customer_name?: string;
  runner_name?: string;
}

type Tab = 'users' | 'runners' | 'bookings';

interface ConfirmModal {
  type: 'block' | 'unblock' | 'remove';
  entityType: 'user' | 'runner';
  id: number;
  name: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [runners, setRunners] = useState<Runner[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<ConfirmModal | null>(null);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (user?.role !== 'admin') {
      router.replace('/landing');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([fetchUsers(), fetchRunners(), fetchBookings()]);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data?.data || response.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    }
  };

  const fetchRunners = async () => {
    try {
      const response = await api.get('/admin/runners');
      setRunners(response.data?.data || response.data || []);
    } catch (err) {
      console.error('Error fetching runners:', err);
      setRunners([]);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/admin/bookings');
      setBookings(response.data?.data || response.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookings([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleBlock = async (entityType: 'user' | 'runner', id: number, block: boolean) => {
    try {
      await api.patch(`/admin/${entityType}s/${id}/block`, { is_blocked: block });
      showMessage(`${block ? 'Blocked' : 'Unblocked'} successfully`);
      await fetchData();
    } catch (err) {
      Alert.alert('Error', 'Action failed');
    }
    setConfirmModal(null);
  };

  const handleRemove = async (entityType: 'user' | 'runner', id: number) => {
    try {
      await api.delete(`/admin/${entityType}s/${id}`);
      showMessage(`Removed successfully`);
      await fetchData();
    } catch (err) {
      Alert.alert('Error', 'Remove failed');
    }
    setConfirmModal(null);
  };

  const showMessage = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 3000);
  };

 const handleLogout = async () => {
  await logoutUser();
  router.replace('/landing');
};

  const getFilteredData = () => {
    if (activeTab === 'users') {
      return users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeTab === 'runners') {
      return runners.filter(r =>
        r.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return bookings.filter(b =>
      b.product_description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  const renderStatusBadge = (status?: string, isBlocked?: boolean) => {
    if (isBlocked) {
      return (
        <View style={styles.badgeBlocked}>
          <Text style={styles.badgeBlockedText}>Blocked</Text>
        </View>
      );
    }
    if (status === 'VERIFIED' || status === 'APPROVED') {
      return (
        <View style={styles.badgeVerified}>
          <Text style={styles.badgeVerifiedText}>Verified</Text>
        </View>
      );
    }
    if (status === 'PENDING') {
      return (
        <View style={styles.badgePending}>
          <Text style={styles.badgePendingText}>Pending</Text>
        </View>
      );
    }
    return (
      <View style={styles.badgeActive}>
        <Text style={styles.badgeActiveText}>Active</Text>
      </View>
    );
  };

  const renderBookingStatus = (status: string) => {
    const statusStyles: Record<string, any> = {
      DELIVERED: { container: styles.statusDelivered, text: styles.statusDeliveredText },
      IN_TRANSIT: { container: styles.statusTransit, text: styles.statusTransitText },
      PURCHASING: { container: styles.statusPurchasing, text: styles.statusPurchasingText },
      CREATED: { container: styles.statusCreated, text: styles.statusCreatedText },
      CANCELLED: { container: styles.statusCancelled, text: styles.statusCancelledText },
    };
    const current = statusStyles[status] || statusStyles.CREATED;
    return (
      <View style={current.container}>
        <Text style={current.text}>{status?.replace('_', ' ')}</Text>
      </View>
    );
  };

  const renderActionButtons = (entityType: 'user' | 'runner', id: number, name: string, isBlocked?: boolean) => (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[styles.actionBtn, isBlocked ? styles.unblockBtn : styles.blockBtn]}
        onPress={() => setConfirmModal({ type: isBlocked ? 'unblock' : 'block', entityType, id, name })}
      >
        <Ionicons name={isBlocked ? 'checkmark-circle' : 'ban'} size={18} color={isBlocked ? '#15803d' : '#ea580c'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionBtn, styles.removeBtn]}
        onPress={() => setConfirmModal({ type: 'remove', entityType, id, name })}
      >
        <Ionicons name="trash-bin" size={18} color="#dc2626" />
      </TouchableOpacity>
    </View>
  );

  const tabs = [
    { key: 'users' as Tab, label: 'Customers', icon: 'people', count: users.length },
    { key: 'runners' as Tab, label: 'Runners', icon: 'bicycle', count: runners.length },
    { key: 'bookings' as Tab, label: 'Bookings', icon: 'cube', count: bookings.length },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0A1F0A', '#0D330E']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Admin Panel</Text>
            <Text style={styles.title}>Dashboard</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={fetchData} style={styles.refreshBtn}>
              <Ionicons name="refresh" size={22} color="#A3B18A" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={22} color="#A3B18A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <LinearGradient colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']} style={styles.statCard}>
            <Ionicons name="people" size={24} color="#A3B18A" />
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Customers</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']} style={styles.statCard}>
            <Ionicons name="bicycle" size={24} color="#A3B18A" />
            <Text style={styles.statNumber}>{runners.length}</Text>
            <Text style={styles.statLabel}>Total Runners</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']} style={styles.statCard}>
            <Ionicons name="cube" size={24} color="#A3B18A" />
            <Text style={styles.statNumber}>{bookings.length}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </LinearGradient>
        </View>

        {/* Message */}
        {actionMsg ? (
          <View style={styles.successMsg}>
            <Ionicons name="checkmark-circle" size={18} color="#15803d" />
            <Text style={styles.successMsgText}>{actionMsg}</Text>
          </View>
        ) : null}
        {error ? (
          <View style={styles.errorMsg}>
            <Ionicons name="alert-circle" size={18} color="#dc2626" />
            <Text style={styles.errorMsgText}>{error}</Text>
          </View>
        ) : null}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons name={tab.icon as any} size={18} color={activeTab === tab.key ? '#fff' : '#8E8E93'} />
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
              <View style={styles.tabCount}>
                <Text style={styles.tabCountText}>{tab.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${activeTab}...`}
            placeholderTextColor="#666"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Text style={styles.searchCount}>{filteredData.length} items</Text>
        </View>

        {/* Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          style={styles.content}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#A3B18A" style={styles.loader} />
          ) : filteredData.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={48} color="#666" />
              <Text style={styles.emptyText}>No {activeTab} found</Text>
            </View>
          ) : activeTab === 'users' ? (
            (filteredData as User[]).map((user) => (
              <View key={user.user_id} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user.full_name?.charAt(0) || 'U'}</Text>
                  </View>
                  <View>
                    <Text style={styles.listItemTitle}>{user.full_name}</Text>
                    <Text style={styles.listItemSubtitle}>{user.email}</Text>
                  </View>
                </View>
                <View style={styles.listItemRight}>
                  {renderStatusBadge(user.status, user.is_blocked)}
                  {renderActionButtons('user', user.user_id, user.full_name, user.is_blocked)}
                </View>
              </View>
            ))
          ) : activeTab === 'runners' ? (
            (filteredData as Runner[]).map((runner) => (
              <View key={runner.runner_id} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{runner.username?.charAt(0) || 'R'}</Text>
                  </View>
                  <View>
                    <Text style={styles.listItemTitle}>{runner.username}</Text>
                    <Text style={styles.listItemSubtitle}>{runner.email} • {runner.city || '—'}</Text>
                  </View>
                </View>
                <View style={styles.listItemRight}>
                  {renderStatusBadge(runner.verification_status, runner.is_blocked)}
                  <Text style={styles.deliveryCount}>{runner.completed_bookings_count} deliveries</Text>
                  {renderActionButtons('runner', runner.runner_id, runner.username, runner.is_blocked)}
                </View>
              </View>
            ))
          ) : (
            (filteredData as Booking[]).map((booking) => (
              <View key={booking.booking_id} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <View style={styles.bookingIcon}>
                    <Ionicons name="cube-outline" size={24} color="#A3B18A" />
                  </View>
                  <View>
                    <Text style={styles.listItemTitle}>#{booking.booking_id}</Text>
                    <Text style={styles.listItemSubtitle} numberOfLines={1}>
                      {booking.product_description}
                    </Text>
                    <Text style={styles.bookingLocation}>
                      <Ionicons name="location-outline" size={12} /> {booking.delivery_location}
                    </Text>
                  </View>
                </View>
                <View style={styles.listItemRight}>
                  {renderBookingStatus(booking.status)}
                  <Text style={styles.bookingPrice}>R{booking.budget?.toFixed(2)}</Text>
                  <Text style={styles.bookingDate}>
                    {new Date(booking.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Confirmation Modal */}
        <Modal visible={!!confirmModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {confirmModal?.type === 'block' && 'Block User'}
                {confirmModal?.type === 'unblock' && 'Unblock User'}
                {confirmModal?.type === 'remove' && 'Remove Account'}
              </Text>
              <Text style={styles.modalMessage}>
                {confirmModal?.type === 'block' && `Are you sure you want to block ${confirmModal.name}?`}
                {confirmModal?.type === 'unblock' && `Are you sure you want to unblock ${confirmModal.name}?`}
                {confirmModal?.type === 'remove' && `This will permanently delete ${confirmModal.name}'s account. This cannot be undone.`}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setConfirmModal(null)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalConfirmBtn, confirmModal?.type === 'remove' && styles.modalConfirmDanger]}
                  onPress={() => {
                    if (confirmModal) {
                      if (confirmModal.type === 'block') handleBlock(confirmModal.entityType, confirmModal.id, true);
                      else if (confirmModal.type === 'unblock') handleBlock(confirmModal.entityType, confirmModal.id, false);
                      else if (confirmModal.type === 'remove') handleRemove(confirmModal.entityType, confirmModal.id);
                    }
                  }}
                >
                  <Text style={styles.modalConfirmText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  greeting: { color: '#8E8E93', fontSize: 12, fontWeight: '500' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerActions: { flexDirection: 'row', gap: 12 },
  refreshBtn: { padding: 10, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12 },
  logoutBtn: { padding: 10, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12 },
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 20 },
  statCard: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  statLabel: { fontSize: 11, color: '#8E8E93', marginTop: 4 },
  successMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#dcfce7',
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  successMsgText: { color: '#15803d', fontSize: 13 },
  errorMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorMsgText: { color: '#dc2626', fontSize: 13 },
  tabsContainer: { flexDirection: 'row', marginHorizontal: 20, gap: 8, marginBottom: 16 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tabActive: { backgroundColor: '#0D330E' },
  tabLabel: { fontSize: 13, fontWeight: '500', color: '#8E8E93' },
  tabLabelActive: { color: '#fff' },
  tabCount: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabCountText: { fontSize: 10, color: '#fff' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 10, color: '#fff', fontSize: 14 },
  searchCount: { fontSize: 11, color: '#666' },
  content: { flex: 1, paddingHorizontal: 20 },
  loader: { marginTop: 40 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#666', fontSize: 14, marginTop: 12 },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  listItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#A3B18A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#0D330E' },
  bookingIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(163,177,138,0.2)', alignItems: 'center', justifyContent: 'center' },
  listItemTitle: { fontSize: 15, fontWeight: '600', color: '#fff' },
  listItemSubtitle: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  bookingLocation: { fontSize: 11, color: '#666', marginTop: 2 },
  listItemRight: { alignItems: 'flex-end', gap: 6 },
  actionButtons: { flexDirection: 'row', gap: 8, marginTop: 8 },
  actionBtn: { padding: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)' },
  blockBtn: { backgroundColor: 'rgba(234,88,12,0.15)' },
  unblockBtn: { backgroundColor: 'rgba(21,128,61,0.15)' },
  removeBtn: { backgroundColor: 'rgba(220,38,38,0.15)' },
  deliveryCount: { fontSize: 11, color: '#A3B18A' },
  bookingPrice: { fontSize: 14, fontWeight: 'bold', color: '#A3B18A' },
  bookingDate: { fontSize: 10, color: '#666' },
  badgeBlocked: { backgroundColor: 'rgba(220,38,38,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeBlockedText: { fontSize: 10, fontWeight: 'bold', color: '#ef4444' },
  badgeVerified: { backgroundColor: 'rgba(34,197,94,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeVerifiedText: { fontSize: 10, fontWeight: 'bold', color: '#22c55e' },
  badgePending: { backgroundColor: 'rgba(245,158,11,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgePendingText: { fontSize: 10, fontWeight: 'bold', color: '#f59e0b' },
  badgeActive: { backgroundColor: 'rgba(163,177,138,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeActiveText: { fontSize: 10, fontWeight: 'bold', color: '#A3B18A' },
  statusDelivered: { backgroundColor: 'rgba(34,197,94,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusDeliveredText: { fontSize: 10, fontWeight: 'bold', color: '#22c55e' },
  statusTransit: { backgroundColor: 'rgba(59,130,246,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusTransitText: { fontSize: 10, fontWeight: 'bold', color: '#3b82f6' },
  statusPurchasing: { backgroundColor: 'rgba(245,158,11,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusPurchasingText: { fontSize: 10, fontWeight: 'bold', color: '#f59e0b' },
  statusCreated: { backgroundColor: 'rgba(107,114,128,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusCreatedText: { fontSize: 10, fontWeight: 'bold', color: '#6b7280' },
  statusCancelled: { backgroundColor: 'rgba(220,38,38,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusCancelledText: { fontSize: 10, fontWeight: 'bold', color: '#ef4444' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1a1a1a', borderRadius: 24, padding: 24, width: '80%', maxWidth: 340 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  modalMessage: { fontSize: 14, color: '#8E8E93', marginBottom: 24, lineHeight: 20 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
  modalCancelText: { color: '#fff', fontWeight: '600' },
  modalConfirmBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#0D330E', alignItems: 'center' },
  modalConfirmDanger: { backgroundColor: '#dc2626' },
  modalConfirmText: { color: '#fff', fontWeight: '600' },
});
