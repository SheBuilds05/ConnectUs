import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';

export const Sidebar = ({ visible, onClose, userName }) => {
  const navigationItems = [
    { name: 'Dashboard', icon: 'home', route: 'dashboard' },
    { name: 'Orders', icon: 'package', route: 'orders' },
    { name: 'Active Orders', icon: 'bike', route: 'active-orders' },
    { name: 'Earnings', icon: 'dollar-sign', route: 'earnings' },
    { name: 'Wallet', icon: 'credit-card', route: 'wallet' },
    { name: 'Explore', icon: 'compass', route: 'explore' },
    { name: 'Reviews', icon: 'star', route: 'reviews' },
    { name: 'Profile', icon: 'user', route: 'profile' },
    { name: 'Settings', icon: 'settings', route: 'settings' },
  ];

  const handleNavigation = (route) => {
    onClose();
    router.push(`/(tabs)/${route}`);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <View style={styles.logo}>
              <View style={styles.logoIcon}>
                <Icon name="shopping-cart" size={24} color="white" />
              </View>
              <Text style={styles.logoText}>ConnectUs</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="x" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.sidebarUser}>
            <Icon name="user" size={40} color="#A3B18A" />
            <View>
              <Text style={styles.sidebarUserName}>{userName || 'Runner'}</Text>
              <Text style={styles.sidebarUserRole}>Verified Runner</Text>
            </View>
          </View>

          <View style={styles.sidebarNav}>
            {navigationItems.map((item) => (
              <TouchableOpacity
                key={item.route}
                style={styles.navItem}
                onPress={() => handleNavigation(item.route)}
              >
                <Icon name={item.icon} size={20} color="#A3B18A" />
                <Text style={styles.navText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sidebarFooter}>
            <TouchableOpacity style={styles.logoutButton}>
              <Icon name="log-out" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sidebar: { width: 280, backgroundColor: '#0D330E', height: '100%', padding: 20 },
  sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: { width: 40, height: 40, backgroundColor: '#6E8649', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  closeButton: { padding: 5 },
  sidebarUser: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 30, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  sidebarUserName: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  sidebarUserRole: { fontSize: 12, color: '#A3B18A' },
  sidebarNav: { flex: 1, gap: 5 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12 },
  navText: { fontSize: 14, color: '#A3B18A' },
  sidebarFooter: { paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  logoutText: { fontSize: 14, color: '#EF4444' },
});
