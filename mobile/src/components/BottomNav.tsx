// src/components/BottomNav.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomNav = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const menuItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', route: 'UserHome' },
    { name: 'Explore', icon: 'search-outline', activeIcon: 'search', route: 'Explore' },
    { name: 'Wallet', icon: 'wallet-outline', activeIcon: 'wallet', route: 'Wallet' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', route: 'Profile' },
  ];

  const isActive = (routeName: string) => {
    return route.name === routeName;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.route as never)}
          >
            <Ionicons
              name={isActive(item.route) ? (item.activeIcon as any) : (item.icon as any)}
              size={24}
              color={isActive(item.route) ? '#2D531A' : '#9CA3AF'}
            />
            <Text
              style={[
                styles.menuText,
                { color: isActive(item.route) ? '#2D531A' : '#9CA3AF' },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 24,
  },
  menuItem: {
    alignItems: 'center',
    gap: 4,
  },
  menuText: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default BottomNav;