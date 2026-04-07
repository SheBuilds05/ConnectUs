// mobile/src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Define proper types for settings items
type SettingItem = 
  | { icon: string; label: string; type: 'switch'; value: boolean; onValueChange: (value: boolean) => void }
  | { icon: string; label: string; type: 'link'; route: string }
  | { icon: string; label: string; type: 'action'; onPress: () => void };

const SettingsScreen = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Preferences',
      items: [
        { icon: 'notifications-outline', label: 'Push Notifications', type: 'switch', value: notifications, onValueChange: setNotifications },
        { icon: 'location-outline', label: 'Location Services', type: 'switch', value: locationServices, onValueChange: setLocationServices },
        { icon: 'moon-outline', label: 'Dark Mode', type: 'switch', value: darkMode, onValueChange: setDarkMode },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', type: 'link', route: 'Profile' },
        { icon: 'card-outline', label: 'Payment Methods', type: 'link', route: 'PaymentMethods' },
        { icon: 'shield-checkmark-outline', label: 'Privacy & Security', type: 'link', route: 'Privacy' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help Center', type: 'link', route: 'Help' },
        { icon: 'chatbubble-outline', label: 'Contact Us', type: 'link', route: 'Contact' },
        { icon: 'document-text-outline', label: 'Terms & Conditions', type: 'link', route: 'Terms' },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: 'information-circle-outline', label: 'About ConnectUs', type: 'link', route: 'About' },
        { icon: 'star-outline', label: 'Rate App', type: 'action', onPress: () => Alert.alert('Rate App', 'This feature is coming soon!') },
        { icon: 'share-outline', label: 'Share App', type: 'action', onPress: () => Alert.alert('Share', 'Share feature coming soon!') },
      ],
    },
  ];

  const clearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear app cache?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared successfully!') },
      ]
    );
  };

  // Helper function to render each setting item
  const renderSettingItem = (item: SettingItem, index: number, isLast: boolean) => {
    switch (item.type) {
      case 'switch':
        return (
          <TouchableOpacity
            key={index}
            style={[styles.settingItem, isLast && styles.lastItem]}
            activeOpacity={0.7}
            onPress={() => item.onValueChange(!item.value)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name={item.icon as any} size={22} color="#6B7280" />
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: '#E5E7EB', true: '#2D531A' }}
              thumbColor="white"
            />
          </TouchableOpacity>
        );
      
      case 'link':
        return (
          <TouchableOpacity
            key={index}
            style={[styles.settingItem, isLast && styles.lastItem]}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name={item.icon as any} size={22} color="#6B7280" />
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#D1D5DB" />
          </TouchableOpacity>
        );
      
      case 'action':
        return (
          <TouchableOpacity
            key={index}
            style={[styles.settingItem, isLast && styles.lastItem]}
            onPress={item.onPress}
          >
            <View style={styles.settingLeft}>
              <Ionicons name={item.icon as any} size={22} color="#6B7280" />
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#D1D5DB" />
          </TouchableOpacity>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => 
                renderSettingItem(item, itemIndex, itemIndex === section.items.length - 1)
              )}
            </View>
          </View>
        ))}

        {/* Clear Cache Button */}
        <TouchableOpacity style={styles.clearCacheButton} onPress={clearCache}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
          <Text style={styles.clearCacheText}>Clear Cache</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
    color: '#1F2937',
  },
  clearCacheButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  clearCacheText: {
    fontSize: 15,
    color: '#EF4444',
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 20,
    marginBottom: 40,
  },
});

export default SettingsScreen;