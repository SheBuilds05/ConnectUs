import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'https://connectus-tpyp.onrender.com';

interface BankingDetails {
  bank: string;
  account: string;
  branch: string;
}

interface SettingsData {
  isAvailable: boolean;
  heavyLifting: boolean;
  notifications: boolean;
  emailReports: boolean;
  bankingDetails: BankingDetails;
  preferredPartner: string;
  serviceLevel: string;
}

export default function SettingsScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<null | 'password' | 'banking' | 'deactivate'>(null);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Settings state
  const [isAvailable, setIsAvailable] = useState(true);
  const [heavyLifting, setHeavyLifting] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailReports, setEmailReports] = useState(false);
  const [bankingDetails, setBankingDetails] = useState<BankingDetails>({
    bank: 'Standard Bank',
    account: '8829',
    branch: '250655',
  });
  const [preferredPartner, setPreferredPartner] = useState('The Courier Guy');
  const [serviceLevel, setServiceLevel] = useState('Standard Door-to-Door');

  // Temporary state for modals
  const [bankInputs, setBankInputs] = useState({ bank: '', account: '', branch: '' });

  const showNotification = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const fetchSettings = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      
      if (user.user_id) {
        const response = await axios.get(`${API_BASE_URL}/api/runners/settings/${user.user_id}`);
        const data = response.data;
        
        setIsAvailable(data.isAvailable ?? true);
        setHeavyLifting(data.heavyLifting ?? false);
        setNotifications(data.notifications ?? true);
        setEmailReports(data.emailReports ?? false);
        setPreferredPartner(data.preferredPartner ?? 'The Courier Guy');
        setServiceLevel(data.serviceLevel ?? 'Standard Door-to-Door');
        
        if (data.bankingDetails) {
          setBankingDetails(data.bankingDetails);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (key: string, value: any) => {
    try {
      setSaving(true);
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) return;
      
      const user = JSON.parse(storedUser);
      
      await axios.put(`${API_BASE_URL}/api/runners/settings/${user.user_id}`, {
        [key]: value,
      });
      
      showNotification(`${key} updated successfully`);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    try {
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email: emailInput });
      showNotification('Reset link sent to your email!');
      setActiveModal(null);
      setEmailInput('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset link');
    }
  };

  const handleBankUpdate = async () => {
    if (!bankInputs.bank || !bankInputs.account) {
      Alert.alert('Error', 'Please fill in bank name and account number');
      return;
    }
    
    const lastFour = bankInputs.account.slice(-4);
    const newBankingDetails = {
      bank: bankInputs.bank,
      account: lastFour,
      branch: bankInputs.branch || 'N/A',
    };
    
    setBankingDetails(newBankingDetails);
    await saveSettings('bankingDetails', newBankingDetails);
    
    setActiveModal(null);
    setBankInputs({ bank: '', account: '', branch: '' });
  };

  const handleDeactivate = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) return;
      
      const user = JSON.parse(storedUser);
      await axios.post(`${API_BASE_URL}/api/runners/deactivate/${user.user_id}`);
      
      Alert.alert('Account Deactivated', 'Your account will be deactivated in 3 days.');
      setActiveModal(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to deactivate account');
    }
  };

  const handleToggleAvailability = async () => {
    const newValue = !isAvailable;
    setIsAvailable(newValue);
    await saveSettings('isAvailable', newValue);
    showNotification(newValue ? 'You are now ONLINE' : 'You are now OFFLINE');
  };

  const handleToggleHeavyLifting = async () => {
    const newValue = !heavyLifting;
    setHeavyLifting(newValue);
    await saveSettings('heavyLifting', newValue);
    showNotification(newValue ? 'Heavy Lifting Enabled' : 'Heavy Lifting Disabled');
  };

  const handleToggleNotifications = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    await saveSettings('notifications', newValue);
    showNotification('Push notifications updated');
  };

  const handleToggleEmailReports = async () => {
    const newValue = !emailReports;
    setEmailReports(newValue);
    await saveSettings('emailReports', newValue);
    showNotification('Email preferences updated');
  };

  useFocusEffect(
    useCallback(() => {
      fetchSettings();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D330E" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Toast Notification */}
      {toast.show && (
        <View style={styles.toastContainer}>
          <LinearGradient colors={['#0D330E', '#1A4A1A']} style={styles.toastContent}>
            <Ionicons name="checkmark-circle" size={18} color="#A3B18A" />
            <Text style={styles.toastText}>{toast.message}</Text>
          </LinearGradient>
        </View>
      )}

      {/* Modals */}
      <Modal visible={activeModal === 'password'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.modalClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Update Password</Text>
            <Text style={styles.modalSubtitle}>Enter your email to receive a reset link</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="runner@example.com"
              value={emailInput}
              onChangeText={setEmailInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handlePasswordReset}>
              <Text style={styles.modalButtonText}>Send Reset Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={activeModal === 'banking'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.modalClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Banking Details</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Bank Name"
              value={bankInputs.bank}
              onChangeText={(text) => setBankInputs({ ...bankInputs, bank: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Account Number"
              value={bankInputs.account}
              onChangeText={(text) => setBankInputs({ ...bankInputs, account: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Branch Code"
              value={bankInputs.branch}
              onChangeText={(text) => setBankInputs({ ...bankInputs, branch: text })}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleBankUpdate}>
              <Text style={styles.modalButtonText}>Save Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={activeModal === 'deactivate'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.modalClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <View style={styles.deactivateIcon}>
              <Ionicons name="shield-checkmark" size={40} color="#ef4444" />
            </View>
            <Text style={styles.modalTitle}>Deactivate Account?</Text>
            <Text style={styles.modalSubtitle}>Are you sure you want to request account deactivation?</Text>
            <View style={styles.deactivateButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setActiveModal(null)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.deactivateButton]} onPress={handleDeactivate}>
                <Text style={styles.modalButtonText}>Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Runner Settings</Text>
          <Text style={styles.subtitle}>Configure your shopping & delivery parameters</Text>
        </View>

        {/* Availability Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#477023" />
            <Text style={styles.sectionTitle}>Availability & Experience</Text>
          </View>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Accepting New Requests</Text>
              <Text style={styles.settingDescription}>Enable to receive live shopping alerts</Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={handleToggleAvailability}
              trackColor={{ false: '#D3D3D3', true: '#477023' }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Heavy Lifting</Text>
              <Text style={styles.settingDescription}>Deliver items over 20kg</Text>
            </View>
            <Switch
              value={heavyLifting}
              onValueChange={handleToggleHeavyLifting}
              trackColor={{ false: '#D3D3D3', true: '#477023' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Logistics Section */}
        <LinearGradient colors={['#0D330E', '#1A4A1A']} style={styles.logisticsSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cube" size={20} color="rgba(255,255,255,0.7)" />
            <Text style={styles.logisticsTitle}>Logistics & Equipment</Text>
          </View>
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Preferred Partner</Text>
            <TouchableOpacity style={styles.picker}>
              <Text style={styles.pickerText}>{preferredPartner}</Text>
              <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Service Level</Text>
            <TouchableOpacity style={styles.picker}>
              <Text style={styles.pickerText}>{serviceLevel}</Text>
              <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Financial Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card" size={20} color="#477023" />
            <Text style={styles.sectionTitle}>Financial & Payouts</Text>
          </View>
          
          <View style={styles.bankingCard}>
            <View style={styles.bankingInfo}>
              <View style={styles.bankingIcon}>
                <Ionicons name="globe" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.bankingName}>{bankingDetails.bank} •••• {bankingDetails.account}</Text>
                <Text style={styles.bankingLabel}>Primary Payout Method</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.changeButton} onPress={() => setActiveModal('banking')}>
              <Text style={styles.changeButtonText}>Change Method</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          {/* Security Card */}
          <LinearGradient colors={['#6E8649', '#5a7340']} style={styles.securityCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
            </View>
            <Text style={styles.securityTitle}>Account Security</Text>
            <Text style={styles.securityText}>Last password change: 2 months ago</Text>
            <TouchableOpacity style={styles.securityButton} onPress={() => setActiveModal('password')}>
              <Text style={styles.securityButtonText}>Update Password</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Notifications Card */}
          <View style={styles.notificationsCard}>
            <Text style={styles.notificationsTitle}>Notifications</Text>
            
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Push Alerts</Text>
                <Text style={styles.settingDescription}>Order status updates</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: '#D3D3D3', true: '#4ade80' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Email Reports</Text>
                <Text style={styles.settingDescription}>Weekly summaries</Text>
              </View>
              <Switch
                value={emailReports}
                onValueChange={handleToggleEmailReports}
                trackColor={{ false: '#D3D3D3', true: '#4ade80' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* Deactivate Button */}
          <TouchableOpacity style={styles.deactivateAccountButton} onPress={() => setActiveModal('deactivate')}>
            <Text style={styles.deactivateAccountText}>Deactivate Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#0D330E',
    fontWeight: 'bold',
  },
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 100,
    alignItems: 'center',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  modalClose: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: '#0D330E',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#D3D3D3',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#0D330E',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  deactivateIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  deactivateButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#D3D3D3',
    flex: 1,
  },
  cancelButtonText: {
    color: '#0D330E',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  deactivateButton: {
    backgroundColor: '#ef4444',
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: '#2D531A',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(0,0,0,0.4)',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#477023',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D330E',
    textTransform: 'uppercase',
  },
  settingDescription: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.4)',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#D3D3D3',
    marginVertical: 8,
  },
  logisticsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 40,
  },
  logisticsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.7)',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 14,
    borderRadius: 20,
  },
  pickerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bankingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D3D3D3',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  bankingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bankingIcon: {
    backgroundColor: '#6E8649',
    padding: 10,
    borderRadius: 16,
  },
  bankingName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D330E',
  },
  bankingLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(0,0,0,0.4)',
  },
  changeButton: {
    backgroundColor: '#477023',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rightColumn: {
    marginHorizontal: 16,
    marginBottom: 40,
  },
  securityCard: {
    padding: 24,
    borderRadius: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#fff',
  },
  securityText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
    marginBottom: 16,
  },
  securityButton: {
    backgroundColor: '#0D330E',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  securityButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  notificationsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 40,
    marginBottom: 16,
  },
  notificationsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: '#477023',
    marginBottom: 12,
  },
  deactivateAccountButton: {
    borderWidth: 2,
    borderColor: '#0D330E',
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: 'center',
  },
  deactivateAccountText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: '#0D330E',
  },
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});