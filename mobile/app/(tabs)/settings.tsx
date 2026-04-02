import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your app preferences</Text>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <SettingsItem 
          icon="notifications-outline" 
          title="Notifications" 
          description="Receive order alerts and updates"
          type="toggle"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
        
        <SettingsItem 
          icon="moon-outline" 
          title="Dark Mode" 
          description="Switch to dark theme"
          type="toggle"
          value={darkModeEnabled}
          onValueChange={setDarkModeEnabled}
        />
        
        <SettingsItem 
          icon="volume-high-outline" 
          title="Sound Effects" 
          description="Play sounds for notifications"
          type="toggle"
          value={soundEnabled}
          onValueChange={setSoundEnabled}
        />
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <SettingsItem 
          icon="person-outline" 
          title="Personal Information" 
          description="Update your profile details"
          type="link"
          onPress={() => console.log('Navigate to personal info')}
        />
        
        <SettingsItem 
          icon="card-outline" 
          title="Payment Methods" 
          description="Manage your payout options"
          type="link"
          onPress={() => console.log('Navigate to payment methods')}
        />
        
        <SettingsItem 
          icon="location-outline" 
          title="Delivery Zones" 
          description="Set your preferred delivery areas"
          type="link"
          onPress={() => console.log('Navigate to delivery zones')}
        />
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <SettingsItem 
          icon="help-circle-outline" 
          title="Help Center" 
          description="FAQs and troubleshooting"
          type="link"
          onPress={() => console.log('Navigate to help center')}
        />
        
        <SettingsItem 
          icon="chatbubble-outline" 
          title="Contact Support" 
          description="Get help from our team"
          type="link"
          onPress={() => console.log('Navigate to contact support')}
        />
        
        <SettingsItem 
          icon="document-text-outline" 
          title="Terms & Conditions" 
          description="Read our terms of service"
          type="link"
          onPress={() => console.log('Navigate to terms')}
        />
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <SettingsItem 
          icon="information-circle-outline" 
          title="App Version" 
          description="Version 1.0.0"
          type="info"
        />
        
        <SettingsItem 
          icon="shield-checkmark-outline" 
          title="Privacy Policy" 
          description="How we protect your data"
          type="link"
          onPress={() => console.log('Navigate to privacy policy')}
        />
      </View>

      {/* Danger Zone */}
      <View style={styles.dangerSection}>
        <TouchableOpacity style={styles.dangerButton}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.dangerButtonText}>Logout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ✅ FIXED: Added TypeScript interface for SettingsItem props
interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;  // Valid Ionicons name
  title: string;
  description?: string;
  type: 'toggle' | 'link' | 'info';
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
}

// Settings Item Component with proper typing
const SettingsItem: React.FC<SettingsItemProps> = ({ 
  icon, 
  title, 
  description, 
  type, 
  value, 
  onValueChange, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.settingsItem} 
      onPress={onPress}
      disabled={type === 'toggle' || type === 'info'}
      activeOpacity={type === 'link' ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color="#1a2e1a" />
      </View>
      
      <View style={styles.itemContent}>
        <View>
          <Text style={styles.itemTitle}>{title}</Text>
          {description && (
            <Text style={styles.itemDescription}>{description}</Text>
          )}
        </View>
        
        {type === 'toggle' && (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#d1d5db', true: '#4ade80' }}
            thumbColor={value ? '#ffffff' : '#f3f4f6'}
          />
        )}
        
        {type === 'link' && (
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a2e1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a2e1a',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 12,
    color: '#9ca3af',
  },
  dangerSection: {
    marginTop: 30,
    marginBottom: 40,
    paddingHorizontal: 20,
    gap: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});