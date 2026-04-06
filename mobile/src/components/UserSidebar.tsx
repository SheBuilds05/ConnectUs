// src/components/UserSidebar.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router'; // Modern Expo Router hooks
import { getUserName, getUserEmail, logoutUser } from '../../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface UserSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
}

interface UserData {
  initials: string;
  name: string;
  email: string;
}

const UserSidebar = ({ isVisible, onClose, userName: propName, userEmail: propEmail }: UserSidebarProps) => {
  const router = useRouter();
  const segments = useSegments();
  
  const [userData, setUserData] = useState<UserData>({
    initials: 'U',
    name: 'Loading...',
    email: 'loading@example.com'
  });
  
  const slideAnim = React.useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // These routes must match your filenames in the /app directory exactly
  const menuItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', route: '(tabs)' },
    { name: 'Create Booking', icon: 'add-circle-outline', activeIcon: 'add-circle', route: 'CreateBooking' },
    { name: 'Track Order', icon: 'location-outline', activeIcon: 'location', route: 'TrackOrder' },
    { name: 'Wallet', icon: 'wallet-outline', activeIcon: 'wallet', route: 'Wallet' },
    { name: 'Favorites', icon: 'heart-outline', activeIcon: 'heart', route: 'Favorites' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', route: 'Profile' },
    { name: 'Settings', icon: 'settings-outline', activeIcon: 'settings', route: 'Settings' },
    { name: 'Help', icon: 'help-circle-outline', activeIcon: 'help-circle', route: 'Help' },
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SCREEN_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const loadUserData = async () => {
    try {
      const name = (await getUserName()) || 'User';
      const email = (await getUserEmail()) || 'user@example.com';
      
      const initials = name
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      
      setUserData({
        initials: initials || 'U',
        name: propName || name,
        email: propEmail || email,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleNavigation = (routeName: string) => {
    onClose();
    setTimeout(() => {
      try {
        // Expo Router uses path strings. (tabs) usually maps to the root '/'
        const path = routeName === '(tabs)' ? '/' : `/${routeName}`;
        router.push(path as any);
      } catch (error) {
        console.error('Navigation error:', error);
        Alert.alert('Error', `Route ${routeName} not found.`);
      }
    }, 300);
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
            await logoutUser();
            onClose();
            router.replace('/Login'); 
          },
        },
      ],
    );
  };

  const isActiveRoute = (routeName: string) => {
    // Check if the current route segment matches the menu item route
    return segments.includes(routeName) || (routeName === '(tabs)' && segments.length === 0);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            opacity: fadeAnim,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={{
            width: SCREEN_WIDTH * 0.75,
            backgroundColor: '#1A3A1A',
            height: '100%',
            transform: [{ translateX: slideAnim }],
            shadowColor: '#000',
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <ScrollView 
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            {/* Branding Area */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50, marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 2, borderColor: '#A3B18A', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <Image source={{ uri: 'https://raw.githubusercontent.com/SheBuilds05/ConnectUs/main/dir/lOGO.png' }} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text style={{ fontSize: 20, fontWeight: '900', color: 'white' }}>
                  Connect<Text style={{ color: '#A3B18A' }}>Us</Text>
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* User Profile Section */}
            <View style={{ marginHorizontal: 16, marginBottom: 24, padding: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#A3B18A', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2D531A' }}>{userData.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }} numberOfLines={1}>{userData.name}</Text>
                  <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }} numberOfLines={1}>{userData.email}</Text>
                </View>
              </View>
            </View>

            {/* Navigation Menu */}
            <View style={{ paddingHorizontal: 12, gap: 4 }}>
              {menuItems.map((item, index) => {
                const isActive = isActiveRoute(item.route);
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderRadius: 16,
                      backgroundColor: isActive ? '#477023' : 'transparent',
                      marginBottom: 4,
                    }}
                    onPress={() => handleNavigation(item.route)}
                  >
                    <Ionicons
                      name={isActive ? (item.activeIcon as any) : (item.icon as any)}
                      size={20}
                      color={isActive ? 'white' : 'rgba(255,255,255,0.7)'}
                    />
                    <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', color: isActive ? 'white' : 'rgba(255,255,255,0.7)' }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer Area */}
            <View style={{ marginTop: 'auto', paddingTop: 24 }}>
              <TouchableOpacity onPress={handleLogout} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16, marginHorizontal: 12 }}>
                <Ionicons name="log-out-outline" size={20} color="#FCA5A5" />
                <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', color: '#FCA5A5' }}>Logout</Text>
              </TouchableOpacity>
              <View style={{ marginTop: 16, alignItems: 'center' }}>
                <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>© 2026 ConnectUs. Version 1.0.0</Text>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default UserSidebar;