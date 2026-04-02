import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  // Determine if we should use dark or light colors based on the device
  const isDark = colorScheme === 'dark';
  

  return (
    <Tabs
      screenOptions={{
        // Your brand color: Runner Light Green
        tabBarActiveTintColor: '#4ade80',
        tabBarInactiveTintColor: isDark ? '#888' : '#9ca3af',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          borderTopWidth: 0,
          elevation: 10,
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      
      {/* 1. Dashboard (Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 2. Wallet (Earnings) */}
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 3. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 4. Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
