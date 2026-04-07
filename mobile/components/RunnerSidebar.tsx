import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

interface RunnerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RunnerSidebar({ isOpen, onClose }: RunnerSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  const [userData, setUserData] = useState({
    initials: 'KH',
    name: 'Khensani',
    tier: 'Pro'
  });

  useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: 'grid-outline' },
    { name: 'Active Tasks', path: '/active-tasks', icon: 'cube-outline' },
    { name: 'Wallet', path: '/wallet', icon: 'wallet-outline' },
    { name: 'Profile', path: '/profile', icon: 'person-outline' },
    { name: 'Settings', path: '/settings', icon: 'settings-outline' },
  ];

  const navigateTo = (path: string) => {
    onClose();
    router.push(path as any);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Ionicons name="bicycle" size={24} color="#A3B18A" />
              </View>
              <Text style={styles.logoText}>
                Runner<Text style={styles.logoHighlight}>Hub</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.userSection}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitials}>{userData.initials}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userTier}>Runner Tier: {userData.tier}</Text>
            </View>
          </View>

          <View style={styles.navContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.path}
                style={[
                  styles.navItem,
                  isActive(item.path) && styles.navItemActive
                ]}
                onPress={() => navigateTo(item.path)}
              >
                <Ionicons 
                  name={item.icon as any} 
                  size={18} 
                  color={isActive(item.path) ? '#A3B18A' : 'rgba(255,255,255,0.4)'} 
                />
                <Text style={[
                  styles.navText,
                  isActive(item.path) && styles.navTextActive
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={18} color="#f87171" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#1A3A1A',
    zIndex: 1000,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: '#A3B18A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  },
  logoHighlight: {
    color: '#A3B18A',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#A3B18A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitials: {
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
  },
  userTier: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  navContainer: {
    flex: 1,
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  navItemActive: {
    backgroundColor: 'rgba(163, 177, 138, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(163, 177, 138, 0.3)',
  },
  navText: {
    fontSize: 14,
    fontWeight: 'bold',
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
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f87171',
  },
});