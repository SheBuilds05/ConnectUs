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
import { useNavigation, useRoute } from '@react-navigation/native';
import { getCurrentUser, getUserName, getUserEmail, logoutUser } from '../services/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const navigation = useNavigation();
  const route = useRoute();
  const [userData, setUserData] = useState<UserData>({
    initials: 'U',
    name: 'Loading...',
    email: 'loading@example.com'
  });
  
  const slideAnim = React.useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const menuItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', route: 'UserHome' },
    { name: 'Create Booking', icon: 'add-circle-outline', activeIcon: 'add-circle', route: 'CreateBooking' },
    { name: 'Track Order', icon: 'location-outline', activeIcon: 'location', route: 'TrackOrder' },
    { name: 'Settings', icon: 'settings-outline', activeIcon: 'settings', route: 'Settings' },
  ];

  useEffect(() => {
    // Load user data from storage
    loadUserData();
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Animate sidebar in
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
      // Animate sidebar out
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
      const user = await getCurrentUser();
      const name = await getUserName();
      const email = await getUserEmail();
      
      // Generate initials from name
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
    // Small delay to allow sidebar animation to complete
    setTimeout(() => {
      navigation.navigate(routeName as never);
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
            // Navigate to login screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' as never }],
            });
          },
        },
      ],
    );
  };

  const isActiveRoute = (routeName: string) => {
    return route.name === routeName;
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Overlay */}
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

        {/* Sidebar Content */}
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 20,
                paddingTop: 50,
                marginBottom: 20,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {/* Logo Circle */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 2,
                    borderColor: '#A3B18A',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={{ uri: 'https://raw.githubusercontent.com/SheBuilds05/ConnectUs/main/dir/lOGO.png' }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
                <Text style={{ fontSize: 20, fontWeight: '900', color: 'white' }}>
                  Connect<Text style={{ color: '#A3B18A' }}>Us</Text>
                </Text>
              </View>

              {/* Close button */}
              <TouchableOpacity
                onPress={onClose}
                style={{
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* User Profile Section */}
            <View
              style={{
                marginHorizontal: 16,
                marginBottom: 24,
                padding: 16,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                {/* User Initials Circle */}
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: '#A3B18A',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: 'rgba(255,255,255,0.3)',
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2D531A' }}>
                    {userData.initials}
                  </Text>
                </View>

                {/* User Info */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }} numberOfLines={1}>
                    {userData.name}
                  </Text>
                  <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }} numberOfLines={1}>
                    {userData.email}
                  </Text>

                  {/* Notification indicator */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <Ionicons name="notifications-outline" size={12} color="#A3B18A" />
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>2 new notifications</Text>
                  </View>
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
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontWeight: 'bold',
                        color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {item.name}
                    </Text>
                    {isActive && (
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: '#A3B18A',
                        }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer Area */}
            <View style={{ marginTop: 'auto', paddingTop: 24 }}>
              <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 16 }}>
                {/* Version */}
                <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Version 1.0.0</Text>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                  onPress={handleLogout}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderRadius: 16,
                    marginHorizontal: 12,
                  }}
                >
                  <Ionicons name="log-out-outline" size={20} color="#FCA5A5" />
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: 'bold', color: '#FCA5A5' }}>
                    Logout
                  </Text>
                  <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>→ exit</Text>
                </TouchableOpacity>

                {/* Copyright */}
                <View
                  style={{
                    marginTop: 16,
                    marginHorizontal: 16,
                    padding: 12,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                    © 2026 ConnectUs. All rights reserved.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default UserSidebar;