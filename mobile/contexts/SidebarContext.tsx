// contexts/SidebarContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SidebarContextType {
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const navigateTo = (route: string) => {
    setIsOpen(false);
    router.push(route as any);
  };

  return (
    <SidebarContext.Provider value={{ openSidebar, closeSidebar, toggleSidebar }}>
      <View style={{ flex: 1 }}>
        {/* Sidebar Overlay */}
        {isOpen && (
          <TouchableOpacity 
            style={styles.overlay} 
            activeOpacity={1} 
            onPress={closeSidebar}
          />
        )}
        
        {/* Sidebar */}
        <View style={[styles.sidebar, isOpen && styles.sidebarOpen]}>
          <View style={styles.sidebarHeader}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200' }} 
              style={styles.sidebarAvatar} 
            />
            <Text style={styles.sidebarName}>Sarah Jenkins</Text>
            <Text style={styles.sidebarEmail}>sarah.j@connectus.com</Text>
          </View>
          
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigateTo('/(tabs)')}>
            <Ionicons name="home-outline" size={24} color="#1a2e1a" />
            <Text style={styles.sidebarItemText}>Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigateTo('/(tabs)/active-orders')}>
            <Ionicons name="cart-outline" size={24} color="#1a2e1a" />
            <Text style={styles.sidebarItemText}>Active Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigateTo('/(tabs)/explore')}>
            <Ionicons name="compass-outline" size={24} color="#1a2e1a" />
            <Text style={styles.sidebarItemText}>Explore</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigateTo('/(tabs)/reviews')}>
            <Ionicons name="star-outline" size={24} color="#1a2e1a" />
            <Text style={styles.sidebarItemText}>Reviews</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigateTo('/(tabs)/earnings')}>
            <Ionicons name="wallet-outline" size={24} color="#1a2e1a" />
            <Text style={styles.sidebarItemText}>Earnings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigateTo('/(tabs)/profile')}>
            <Ionicons name="person-outline" size={24} color="#1a2e1a" />
            <Text style={styles.sidebarItemText}>Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigateTo('/(tabs)/settings')}>
            <Ionicons name="settings-outline" size={24} color="#1a2e1a" />
            <Text style={styles.sidebarItemText}>Settings</Text>
          </TouchableOpacity>
        </View>
        
        {children}
      </View>
    </SidebarContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 998,
  },
  sidebar: {
    position: 'absolute',
    left: -280,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#ffffff',
    zIndex: 999,
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sidebarOpen: {
    left: 0,
  },
  sidebarHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    marginBottom: 20,
  },
  sidebarAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  sidebarName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a2e1a',
  },
  sidebarEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  sidebarItemText: {
    fontSize: 16,
    color: '#1a2e1a',
  },
});