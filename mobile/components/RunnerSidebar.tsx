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
  ActivityIndicator,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Type definitions
interface User {
  id: string;
  full_name: string;
  email: string;
  role?: string;
  phone?: string;
}

interface RunnerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RunnerSidebar({ isOpen, onClose }: RunnerSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUserData();
    }
  }, [isOpen]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Get user from localStorage/AsyncStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData(user);
      } else {
        // Fallback to default if no user found
        setUserData({
          id: '1',
          full_name: 'Runner User',
          email: 'runner@connectus.com',
          role: 'runner',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string): string => {
    if (!name) return 'R';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              // Clear user data from storage
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              
              onClose();
              setTimeout(() => {
                router.replace('/landing');
              }, 100);
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    { name: 'Dashboard', path: '/runner/dashboard', icon: 'grid-outline' },
    { name: 'Active Tasks', path: '/runner/tasks', icon: 'cube-outline' },
    { name: 'Wallet', path: '/runner/wallet', icon: 'wallet-outline' },
    { name: 'Profile', path: '/runner/profile', icon: 'person-outline' },
    { name: 'Settings', path: '/runner/settings', icon: 'settings-outline' },
  ];

  if (!isOpen) return null;

  return (
    <Modal 
      visible={isOpen} 
      transparent 
      animationType="slide" 
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#A3B18A" />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          ) : (
            <View style={styles.userSection}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {getInitials(userData?.full_name || 'Runner')}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {userData?.full_name || 'Runner User'}
                </Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {userData?.email || 'runner@connectus.com'}
                </Text>
                <View style={styles.userTierContainer}>
                  <Ionicons name="star" size={10} color="#A3B18A" />
                  <Text style={styles.userTier}>Pro Runner</Text>
                </View>
              </View>
            </View>
          )}

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
                    size={20}
                    color={isActive ? '#A3B18A' : 'rgba(255,255,255,0.6)'}
                    style={styles.navIcon}
                  />
                  <Text style={[styles.navText, isActive && styles.navTextActive]}>
                    {item.name}
                  </Text>
                  {isActive && (
                    <View style={styles.activeIndicator} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            onPress={handleLogout} 
            style={styles.logoutButton}
            disabled={isLoggingOut}
          >
            <Ionicons 
              name="log-out-outline" 
              size={20} 
              color="#f87171" 
            />
            <Text style={styles.logoutText}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Text>
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loadingText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
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
    width: 52,
    height: 52,
    borderRadius: 26,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A3A1A',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  userTierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userTier: {
    fontSize: 10,
    color: '#A3B18A',
    fontWeight: '500',
  },
  navMenu: {
    flex: 1,
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: 'rgba(163,177,138,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(163,177,138,0.3)',
  },
  navIcon: {
    width: 22,
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },
  navTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    right: 12,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A3B18A',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
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