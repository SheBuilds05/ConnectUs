// mobile/src/screens/CreateBookingScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateBookingScreen = ({ navigation, route }: any) => {
  const { runnerId, runner } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [bookingType, setBookingType] = useState('delivery');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [items, setItems] = useState([{ name: '', quantity: '1', notes: '' }]);

  const bookingTypes = [
    { id: 'delivery', name: 'Delivery', icon: 'bicycle-outline' },
    { id: 'shopping', name: 'Shopping', icon: 'cart-outline' },
    { id: 'pickup', name: 'Pickup', icon: 'business-outline' },
    { id: 'other', name: 'Other', icon: 'help-outline' },
  ];

  const addItem = () => {
    setItems([...items, { name: '', quantity: '1', notes: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    if (!address) {
      Alert.alert('Error', 'Please enter delivery address');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Booking Created!',
        'Your booking has been submitted successfully. The runner will confirm shortly.',
        [{ text: 'OK', onPress: () => navigation.navigate('TrackOrder') }]
      );
    }, 1500);
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
          <Text style={styles.headerTitle}>Create Booking</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Runner Info */}
        {runner && (
          <View style={styles.runnerCard}>
            <Text style={styles.runnerLabel}>Selected Runner</Text>
            <View style={styles.runnerInfo}>
              <View style={styles.runnerAvatar}>
                <Text style={styles.runnerInitials}>
                  {runner.username?.charAt(0) || 'R'}
                </Text>
              </View>
              <View>
                <Text style={styles.runnerName}>{runner.username}</Text>
                <Text style={styles.runnerRating}>⭐ 4.9 • {runner.completed_bookings_count} jobs</Text>
              </View>
            </View>
          </View>
        )}

        {/* Booking Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Type</Text>
          <View style={styles.bookingTypes}>
            {bookingTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  bookingType === type.id && styles.typeButtonActive,
                ]}
                onPress={() => setBookingType(type.id)}
              >
                <Ionicons 
                  name={type.icon as any} 
                  size={24} 
                  color={bookingType === type.id ? '#2D531A' : '#6B7280'} 
                />
                <Text style={[
                  styles.typeText,
                  bookingType === type.id && styles.typeTextActive,
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Items List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Items</Text>
            <TouchableOpacity onPress={addItem} style={styles.addButton}>
              <Ionicons name="add-circle-outline" size={24} color="#2D531A" />
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemNumber}>Item {index + 1}</Text>
                {items.length > 1 && (
                  <TouchableOpacity onPress={() => removeItem(index)}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Item name"
                value={item.name}
                onChangeText={(text) => updateItem(index, 'name', text)}
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.quantityInput]}
                  placeholder="Qty"
                  value={item.quantity}
                  onChangeText={(text) => updateItem(index, 'quantity', text)}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Special notes (optional)"
                  value={item.notes}
                  onChangeText={(text) => updateItem(index, 'notes', text)}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.locationInput}
              placeholder="Delivery address"
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>

          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <Text style={styles.dateText}>
              {date.toLocaleDateString()} at {date.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
// In CreateBookingScreen.tsx, update the DateTimePicker onChange handler:

<DateTimePicker
  value={date}
  mode="datetime"
  onChange={(event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  }}
/>
          )}

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Special instructions (e.g., gate code, building number)"
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Booking</Text>
          )}
        </TouchableOpacity>
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
  runnerCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  runnerLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  runnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  runnerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2D531A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  runnerInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  runnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  runnerRating: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  bookingTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2D531A',
  },
  typeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  typeTextActive: {
    color: '#2D531A',
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    color: '#2D531A',
  },
  itemCard: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  quantityInput: {
    width: 80,
  },
  notesInput: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    marginLeft: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2D531A',
    marginHorizontal: 16,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateBookingScreen;