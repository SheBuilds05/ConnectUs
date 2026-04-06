// src/screens/UserHomeScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native'; // Add this
import { getRunners } from '../../services/runnerService';
import { getCurrentUser, getUserName, getUserEmail, logoutUser } from '../../services/api';
import { Runner } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Category Button Component
const CategoryButton = ({ name, icon, isActive, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      alignItems: 'center',
      marginRight: 20,
      opacity: isActive ? 1 : 0.6,
    }}
  >
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isActive ? '#2D531A' : '#F3F4F6',
        shadowColor: isActive ? '#2D531A' : 'transparent',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: isActive ? 5 : 0,
      }}
    >
      <Ionicons name={icon} size={24} color={isActive ? 'white' : '#6B7280'} />
    </View>
    <Text
      style={{
        fontSize: 11,
        marginTop: 6,
        color: isActive ? '#2D531A' : '#6B7280',
        fontWeight: isActive ? '600' : '400',
      }}
    >
      {name}
    </Text>
  </TouchableOpacity>
);

// Runner Card Component
const RunnerCard = ({ runner, onPress }: { runner: Runner; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: '#F3F4F6',
      marginHorizontal: 16,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {/* Avatar */}
      <View
        style={{
          width: 64,
          height: 64,
          backgroundColor: '#F3F4F6',
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          overflow: 'hidden',
        }}
      >
        {runner.profile_photo ? (
          <Image
            source={{ uri: runner.profile_photo }}
            style={{ width: '100%', height: '100%', borderRadius: 12 }}
          />
        ) : (
          <Ionicons name="person-outline" size={28} color="#9CA3AF" />
        )}
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1F2937' }}>
            {runner.username}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={14} color="#FBBF24" />
            <Text style={{ fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
              {runner.rating || '4.9'}
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }} numberOfLines={1}>
          {runner.bio?.substring(0, 60)}...
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Ionicons name="location-outline" size={12} color="#6B7280" />
          <Text style={{ fontSize: 10, color: '#6B7280', marginLeft: 4 }}>
            {runner.city || 'Near you'}
          </Text>
          <View
            style={{
              width: 4,
              height: 4,
              backgroundColor: '#D1D5DB',
              borderRadius: 2,
              marginHorizontal: 8,
            }}
          />
          <Text style={{ fontSize: 10, color: '#2D531A', fontWeight: '600' }}>
            {runner.completed_bookings_count} jobs
          </Text>
        </View>
      </View>
    </View>

    {/* Specialties */}
    <View style={{ flexDirection: 'row', marginTop: 12, gap: 8, flexWrap: 'wrap' }}>
      {runner.bio?.toLowerCase().includes('food') && (
        <View
          style={{
            backgroundColor: '#E8F5E9',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 16,
          }}
        >
          <Text style={{ fontSize: 9, color: '#2D531A', fontWeight: '600' }}>🍔 Food</Text>
        </View>
      )}
      {runner.bio?.toLowerCase().includes('tech') && (
        <View
          style={{
            backgroundColor: '#EBF5FF',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 16,
          }}
        >
          <Text style={{ fontSize: 9, color: '#2563EB', fontWeight: '600' }}>💻 Tech</Text>
        </View>
      )}
      {runner.bio?.toLowerCase().includes('beauty') && (
        <View
          style={{
            backgroundColor: '#FCE7F3',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 16,
          }}
        >
          <Text style={{ fontSize: 9, color: '#DB2777', fontWeight: '600' }}>💄 Beauty</Text>
        </View>
      )}
      {runner.bio?.toLowerCase().includes('fashion') && (
        <View
          style={{
            backgroundColor: '#FCE7F3',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 16,
          }}
        >
          <Text style={{ fontSize: 9, color: '#DB2777', fontWeight: '600' }}>👗 Fashion</Text>
        </View>
      )}
      {runner.bio?.toLowerCase().includes('grocery') && (
        <View
          style={{
            backgroundColor: '#E8F5E9',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 16,
          }}
        >
          <Text style={{ fontSize: 9, color: '#2D531A', fontWeight: '600' }}>🛒 Grocery</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

// Bottom Navigation Component - Moved inside to access navigation
const BottomNav = ({ currentRoute }: { currentRoute: string }) => {
  const navigation = useNavigation() as any;
  
  const menuItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', route: 'UserHome' },
    { name: 'Explore', icon: 'search-outline', activeIcon: 'search', route: 'Explore' },
    { name: 'Wallet', icon: 'wallet-outline', activeIcon: 'wallet', route: 'Wallet' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', route: 'Profile' },
  ];

  const handleNavigation = (routeName: string) => {
    try {
      navigation.navigate(routeName);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingVertical: 12,
          paddingBottom: 24,
        }}
      >
        {menuItems.map((item, index) => {
          const isActive = currentRoute === item.route;
          return (
            <TouchableOpacity
              key={index}
              style={{ alignItems: 'center', gap: 4 }}
              onPress={() => handleNavigation(item.route)}
            >
              <Ionicons
                name={isActive ? (item.activeIcon as any) : (item.icon as any)}
                size={24}
                color={isActive ? '#2D531A' : '#9CA3AF'}
              />
              <Text
                style={{
                  fontSize: 10,
                  marginTop: 4,
                  color: isActive ? '#2D531A' : '#9CA3AF',
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Sidebar Component - Moved inside to access navigation
const SidebarComponent = ({ isVisible, onClose, userName, userEmail }: any) => {
  const navigation = useNavigation() as any;
  const route = useRoute() as any;
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const menuItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', route: 'UserHome' },
    { name: 'Create Booking', icon: 'add-circle-outline', activeIcon: 'add-circle', route: 'CreateBooking' },
    { name: 'Track Order', icon: 'location-outline', activeIcon: 'location', route: 'TrackOrder' },
    { name: 'Wallet', icon: 'wallet-outline', activeIcon: 'wallet', route: 'Wallet' },
    { name: 'Favorites', icon: 'heart-outline', activeIcon: 'heart', route: 'Favorites' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', route: 'Profile' },
    { name: 'Settings', icon: 'settings-outline', activeIcon: 'settings', route: 'Settings' },
    { name: 'Help', icon: 'help-circle-outline', activeIcon: 'help-circle', route: 'Help' },
  ];

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

  const handleNavigation = (routeName: string) => {
    onClose();
    setTimeout(() => {
      try {
        navigation.navigate(routeName);
      } catch (error) {
        console.error('Navigation error:', error);
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
            try {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Navigation reset error:', error);
            }
          },
        },
      ],
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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

              <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
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
                    {getInitials(userName)}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }} numberOfLines={1}>
                    {userName}
                  </Text>
                  <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }} numberOfLines={1}>
                    {userEmail}
                  </Text>

                  <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}
                    onPress={() => handleNavigation('Notifications')}
                  >
                    <Ionicons name="notifications-outline" size={12} color="#A3B18A" />
                    <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>2 new notifications</Text>
                  </TouchableOpacity>
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
                <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Version 1.0.0</Text>
                </View>

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

const UserHomeScreen = () => {
  const navigation = useNavigation() as any;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; city: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [currentRoute, setCurrentRoute] = useState('UserHome');

  const categories = [
    { name: 'Food', icon: 'restaurant-outline' },
    { name: 'Tech', icon: 'laptop-outline' },
    { name: 'Beauty', icon: 'rose-outline' },
    { name: 'Fashion', icon: 'shirt-outline' },
    { name: 'Gifts', icon: 'gift-outline' },
  ];

  useEffect(() => {
    loadUserData();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (location?.lat && location?.lng) {
      fetchRunners();
    }
  }, [activeCategory, location]);

  const loadUserData = async () => {
    try {
      const name = await getUserName();
      const email = await getUserEmail();
      setUserName(name);
      setUserEmail(email);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        fetchRunners();
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(userLocation.coords);
      
      setLocation({
        lat: userLocation.coords.latitude,
        lng: userLocation.coords.longitude,
        city: geocode[0]?.city || geocode[0]?.region || 'Your Location',
      });
    } catch (error) {
      console.error('Error getting location:', error);
      fetchRunners();
    }
  };

  const fetchRunners = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedRunners = await getRunners({
        lat: location?.lat,
        lng: location?.lng,
        category: activeCategory || undefined,
        search: searchTerm || undefined,
      });
      setRunners(fetchedRunners);
    } catch (error: any) {
      console.error('Error fetching runners:', error);
      setError(error.message || 'Failed to load runners');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRunners();
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const handleRunnerPress = (runnerId: number) => {
    try {
      navigation.navigate('RunnerDetails', { runnerId });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleNotifications = () => {
    try {
      navigation.navigate('Notifications');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Filter runners based on search term
  const filteredRunners = runners.filter(
    (runner) =>
      runner.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      runner.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      runner.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#D3D3D3' }}>
      <StatusBar style="dark" />
      
      {/* Sidebar */}
      <SidebarComponent
        isVisible={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userName={userName}
        userEmail={userEmail}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {/* Header */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity onPress={() => setIsSidebarOpen(true)}>
              <Ionicons name="menu" size={24} color="#0D330E" />
            </TouchableOpacity>

            <View>
              <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center' }}>
                Welcome back,
              </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0D330E' }}>
                {userName.split(' ')[0]}
              </Text>
            </View>

            <TouchableOpacity onPress={handleNotifications}>
              <View>
                <Ionicons name="notifications-outline" size={24} color="#4B5563" />
                <View
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 8,
                    height: 8,
                    backgroundColor: 'red',
                    borderRadius: 4,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              onPress={getUserLocation}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.6)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Ionicons name="location-outline" size={14} color="#2D531A" />
              <Text style={{ fontSize: 12, color: '#4B5563', marginLeft: 4 }}>
                {location?.city || 'Getting location...'}
              </Text>
              <Ionicons name="refresh-outline" size={12} color="#2D531A" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
                borderWidth: 1,
                borderColor: '#F3F4F6',
              }}
            >
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                style={{ flex: 1, marginLeft: 12, fontSize: 14 }}
                placeholder="Search for runners or services..."
                value={searchTerm}
                onChangeText={handleSearch}
              />
              {searchTerm !== '' && (
                <TouchableOpacity onPress={() => handleSearch('')}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Hero Banner */}
          <View
            style={{
              backgroundColor: '#0D330E',
              marginHorizontal: 16,
              marginTop: 24,
              borderRadius: 16,
              padding: 24,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: -40,
                right: -40,
                width: 128,
                height: 128,
                backgroundColor: '#A3B18A',
                borderRadius: 64,
                opacity: 0.2,
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -32,
                left: -32,
                width: 96,
                height: 96,
                backgroundColor: '#A3B18A',
                borderRadius: 48,
                opacity: 0.2,
              }}
            />

            <Text
              style={{
                color: '#A3B18A',
                fontSize: 10,
                fontWeight: 'bold',
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              PREMIUM SERVICE
            </Text>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>
              Your personal assistant for everything
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 16 }}>
              Connect with trusted local runners near {location?.city || 'you'}
            </Text>

            <View style={{ flexDirection: 'row', gap: 24, marginTop: 8 }}>
              <View>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                  {runners.length}+
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, textTransform: 'uppercase' }}>
                  Runners
                </Text>
              </View>
              <View>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>15min</Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, textTransform: 'uppercase' }}>
                  Response
                </Text>
              </View>
              <View>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>4.9</Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, textTransform: 'uppercase' }}>
                  Rating
                </Text>
              </View>
            </View>
          </View>

          {/* Categories */}
          <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 }}>
              Categories
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((cat) => (
                <CategoryButton
                  key={cat.name}
                  name={cat.name}
                  icon={cat.icon}
                  isActive={activeCategory === cat.name}
                  onPress={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Runners Section */}
          <View style={{ marginTop: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937' }}>
                Available Runners
              </Text>
              <TouchableOpacity onPress={fetchRunners}>
                <Ionicons name="refresh-outline" size={20} color="#2D531A" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={{ paddingVertical: 48, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2D531A" />
                <Text style={{ color: '#6B7280', marginTop: 8 }}>Loading runners...</Text>
              </View>
            ) : error ? (
              <View style={{ paddingVertical: 48, alignItems: 'center', paddingHorizontal: 32 }}>
                <Ionicons name="alert-circle-outline" size={48} color="#F59E0B" />
                <Text style={{ color: '#6B7280', marginTop: 8, textAlign: 'center' }}>{error}</Text>
                <TouchableOpacity
                  onPress={fetchRunners}
                  style={{
                    marginTop: 16,
                    backgroundColor: '#2D531A',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '600' }}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : filteredRunners.length === 0 ? (
              <View style={{ paddingVertical: 48, alignItems: 'center' }}>
                <Ionicons name="people-outline" size={48} color="#9CA3AF" />
                <Text style={{ color: '#6B7280', marginTop: 8 }}>No runners found</Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Try adjusting your search</Text>
              </View>
            ) : (
              filteredRunners.map((runner) => (
                <RunnerCard
                  key={runner.runner_id}
                  runner={runner}
                  onPress={() => handleRunnerPress(runner.runner_id)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Navigation */}
      <BottomNav currentRoute={currentRoute} />
    </View>
  );
};

export default UserHomeScreen;