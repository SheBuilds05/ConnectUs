// mobile/components/RunnerSidebar.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentUser, logoutUser } from '../services/api';

interface RunnerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RunnerSidebar({ isOpen, onClose }: RunnerSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState({
    initials: 'R',
    name: 'Runner',
    email: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = await getCurrentUser();
    if (user) {
      const name = user.full_name || 'Runner';
      const email = user.email || '';
      const initials = name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      setUserData({ initials: initials || 'R', name, email });
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/runner/dashboard', icon: 'grid-outline' },
    { name: 'Active Tasks', path: '/runner/tasks', icon: 'cube-outline' },
    { name: 'Wallet', path: '/runner/wallet', icon: 'wallet-outline' },
    { name: 'Profile', path: '/runner/profile', icon: 'person-outline' },
    { name: 'Settings', path: '/runner/settings', icon: 'settings-outline' },
  ];

const handleLogout = async () => {
  console.log('Logging out...');
  await logoutUser();
  onClose();
  setTimeout(() => {
    router.replace('/landing');
  }, 100);
};
  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <LinearGradient
          colors={['#1A3A1A', '#0D1F0D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.sidebar}
        >
          {/* Header with Logo and Close */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Image
                  source={{ uri: 'https://raw.githubusercontent.com/SheBuilds05/ConnectUs/main/dir/lOGO.png' }}
                  style={styles.logoImage}
                />
              </View>
              <Text style={styles.logoText}>
                Runner<Text style={styles.logoAccent}>Hub</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* User Info Section */}
          <View style={styles.userSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{userData.initials}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userTier}>Runner Tier: Pro</Text>
            </View>
          </View>

          {/* Navigation Menu */}
          <View style={styles.navMenu}>
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <TouchableOpacity
                  key={item.path}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={() => {
                    onClose();
                    router.push(item.path as any);
                  }}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={isActive ? '#A3B18A' : 'rgba(255,255,255,0.6)'}
                    style={styles.navIcon}
                  />
                  <Text style={[styles.navText, isActive && styles.navTextActive]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={18} color="#f87171" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebar: {
    width: 280,
    height: '100%',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: '#A3B18A',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoAccent: {
    color: '#A3B18A',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#A3B18A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A3A1A',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  userTier: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  navMenu: {
    flex: 1,
    gap: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: 'rgba(163,177,138,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(163,177,138,0.3)',
  },
  navIcon: {
    width: 20,
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  navTextActive: {
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f87171',
  },
});
