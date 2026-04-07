import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image,
  ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBooking } from '../services/bookingService';
import { getCurrentUser } from '../services/api';

export default function CreateBookingScreen() {
  const router = useRouter();

  // UI state
  const [activeTab, setActiveTab] = useState(1);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isPriority, setIsPriority] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<any>({ runnerId: 0, runnerName: '' });
  const [isReady, setIsReady] = useState(false);

  const baseFee = 25;
  const priorityFee = isPriority ? 100 : 0;
  const total = (budget ? Number(budget) : 0) + baseFee + priorityFee;

  const steps = [
    { number: 1, name: 'Details', icon: 'cube-outline' },
    { number: 2, name: 'Location', icon: 'location-outline' },
    { number: 3, name: 'Payment', icon: 'shield-outline' }
  ];

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check auth
        const user = await getCurrentUser();
        if (!user) {
          Alert.alert(
            'Login Required',
            'Please log in to create a booking.',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => router.back() },
              { text: 'Login', onPress: () => router.push('/auth/login') }
            ]
          );
          setIsReady(true);
          return;
        }

        // Load data from AsyncStorage
        const stored = await AsyncStorage.getItem('pendingBooking');
        if (stored) {
          const data = JSON.parse(stored);
          setBookingData(data);
          if (data.productName) setDescription(data.productName);
          if (data.productPrice) setBudget(data.productPrice.toString());
          if (data.deliveryLocation) setLocation(data.deliveryLocation);
          if (data.specialInstructions) setSpecialInstructions(data.specialInstructions);
          await AsyncStorage.removeItem('pendingBooking');
        }
      } catch (err) {
        console.error('Initialization error:', err);
        Alert.alert('Error', 'Failed to load booking data');
      } finally {
        setIsReady(true);
      }
    };
    initialize();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

const handleCreateBooking = async () => {
  console.log('1. Button clicked');
  if (!description.trim()) {
    Alert.alert('Error', 'Please describe what you need');
    return;
  }
  if (!location.trim()) {
    Alert.alert('Error', 'Please enter delivery location');
    return;
  }
  if (!budget || Number(budget) <= 0) {
    Alert.alert('Error', 'Please enter a valid budget');
    return;
  }
  console.log('2. Validation passed');

  setIsProcessing(true);
  setError(null);
  const payload = {
  runner_id: bookingData?.runnerId || 0,
  product_description: description,
  delivery_location: location,
  budget: total,
  product_image_url: imageUri || undefined,
  scheduled_for: new Date().toISOString(),
  special_instructions: specialInstructions,
};

  try {
    console.log('3. Calling createBooking with payload:', payload);
    const booking = await createBooking(payload);
    console.log('4. Booking created:', booking);
    setIsPaid(true);
    console.log('5. isPaid set to true');
  } catch (err: any) {
    console.log('6. Error caught:', err);
    const msg = err.message || 'Failed to create booking';
    setError(msg);
    Alert.alert('Booking Failed', msg);
  } finally {
    setIsProcessing(false);
  }
};

  const handleExit = () => {
    router.back();
  };

  const renderStepContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What do you need?</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              placeholder="E.g. 2L Milk, Bread, and a newspaper..."
              placeholderTextColor="#999"
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
              {imageUri ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={() => setImageUri(null)}>
                    <Ionicons name="close-circle" size={28} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="cloud-upload-outline" size={40} color="#477023" />
                  <Text style={styles.uploadText}>Upload Product Image</Text>
                  <Text style={styles.uploadSubtext}>Tap to add a photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Delivery Details</Text>
            <Text style={styles.inputLabel}>Delivery Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Street Address, Suburb"
              placeholderTextColor="#999"
            />
            <Text style={styles.inputLabel}>Item Budget (ZAR)</Text>
            <TextInput
              style={styles.input}
              value={budget}
              onChangeText={setBudget}
              placeholder="Enter amount"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            <Text style={styles.inputLabel}>Special Instructions (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textAreaSmall]}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              placeholder="Any special requests for the runner..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={2}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.priorityOption, isPriority && styles.priorityOptionActive]}
              onPress={() => setIsPriority(!isPriority)}
            >
              <View style={styles.priorityLeft}>
                <Ionicons name="time-outline" size={24} color="#477023" />
                <View style={styles.priorityTextContainer}>
                  <Text style={styles.priorityTitle}>Priority Delivery</Text>
                  <Text style={styles.prioritySubtext}>Faster delivery guaranteed</Text>
                </View>
              </View>
              <View style={[styles.checkbox, isPriority && styles.checkboxActive]}>
                {isPriority && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
            </TouchableOpacity>

            <View style={styles.priceBreakdown}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Budget</Text>
                <Text style={styles.priceValue}>R{budget ? Number(budget).toFixed(2) : '0.00'}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Service Fee</Text>
                <Text style={styles.priceValue}>R{baseFee.toFixed(2)}</Text>
              </View>
              {isPriority && (
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, styles.priorityText]}>Priority Fee</Text>
                  <Text style={[styles.priceValue, styles.priorityText]}>R100.00</Text>
                </View>
              )}
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>R{total.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
              onPress={handleCreateBooking}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payButtonText}>Confirm & Pay R{total.toFixed(2)}</Text>
              )}
            </TouchableOpacity>
          </View>
        );
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#477023" />
      </View>
    );
  }

  if (isPaid) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <LinearGradient colors={['#0D330E', '#1A4A1A']} style={styles.successGradient}>
          <View style={styles.successContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#A3B18A" />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successMessage}>
              Your order has been placed and a runner is being assigned.
            </Text>
            <TouchableOpacity style={styles.trackButton} onPress={() => router.push('/order/track')}>
              <Text style={styles.trackButtonText}>Track My Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createAnotherButton}
              onPress={() => {
                setIsPaid(false);
                setActiveTab(1);
                setDescription('');
                setLocation('');
                setBudget('');
                setImageUri(null);
                setIsPriority(false);
                setSpecialInstructions('');
                setError(null);
              }}
            >
              <Text style={styles.createAnotherText}>Create Another</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
            <Ionicons name="log-out" size={20} color="#fff" />
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#D3D3D3', '#C0C0C0']} style={styles.gradient}>
        <TouchableOpacity style={styles.exitFloatingButton} onPress={handleExit}>
          <Ionicons name="log-out" size={18} color="#fff" />
          <Text style={styles.exitFloatingText}>Exit</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Booking</Text>
              <Text style={styles.subtitle}>Fast, reliable, and secure delivery</Text>
            </View>

            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <View key={step.number} style={styles.stepWrapper}>
                  <View style={styles.stepItem}>
                    <View style={[styles.stepCircle, activeTab >= step.number && styles.stepCircleActive]}>
                      {activeTab > step.number ? (
                        <Ionicons name="checkmark" size={20} color="#fff" />
                      ) : (
                        <Ionicons name={step.icon as any} size={20} color={activeTab >= step.number ? '#fff' : '#666'} />
                      )}
                    </View>
                    <Text style={[styles.stepName, activeTab >= step.number && styles.stepNameActive]}>
                      {step.name}
                    </Text>
                  </View>
                  {index < steps.length - 1 && <View style={[styles.stepLine, activeTab > step.number && styles.stepLineActive]} />}
                </View>
              ))}
            </View>

            <View style={styles.formCard}>
              {renderStepContent()}
              <View style={styles.navigationButtons}>
                {activeTab > 1 && (
                  <TouchableOpacity style={styles.backButton} onPress={() => setActiveTab(activeTab - 1)}>
                    <Text style={styles.backButtonText}>← Back</Text>
                  </TouchableOpacity>
                )}
                {activeTab < 3 && (
                  <TouchableOpacity style={styles.nextButton} onPress={() => setActiveTab(activeTab + 1)}>
                    <Text style={styles.nextButtonText}>Next</Text>
                    <Ionicons name="chevron-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  exitFloatingButton: {
    position: 'absolute', bottom: 20, right: 20, zIndex: 999,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#0D330E', paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 30, borderWidth: 1, borderColor: '#A3B18A',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
  },
  exitFloatingText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 30 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#0D330E', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#0D330E', opacity: 0.8 },
  stepsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 30 },
  stepWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  stepItem: { alignItems: 'center', flex: 1 },
  stepCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#ddd', marginBottom: 8 },
  stepCircleActive: { backgroundColor: '#477023', borderColor: '#477023' },
  stepName: { fontSize: 11, color: '#666', fontWeight: '600' },
  stepNameActive: { color: '#477023' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#ddd', marginHorizontal: 8 },
  stepLineActive: { backgroundColor: '#477023' },
  formCard: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 30, padding: 24, marginHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  stepContent: { gap: 20 },
  stepTitle: { fontSize: 20, fontWeight: 'bold', color: '#0D330E', textAlign: 'center', marginBottom: 10 },
  textArea: { borderWidth: 1, borderColor: '#ddd', borderRadius: 16, padding: 16, fontSize: 16, minHeight: 120, backgroundColor: '#fff' },
  textAreaSmall: { minHeight: 80, textAlignVertical: 'top' },
  uploadArea: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#477023', borderRadius: 24, backgroundColor: 'rgba(71,112,35,0.05)', overflow: 'hidden' },
  uploadPlaceholder: { alignItems: 'center', padding: 40 },
  uploadText: { fontSize: 16, fontWeight: '600', color: '#477023', marginTop: 12 },
  uploadSubtext: { fontSize: 12, color: '#999', marginTop: 4 },
  imagePreviewContainer: { position: 'relative' },
  imagePreview: { width: '100%', height: 200, resizeMode: 'cover' },
  removeImageButton: { position: 'absolute', top: 8, right: 8, backgroundColor: '#fff', borderRadius: 14 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#0D330E', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#fff' },
  errorContainer: { backgroundColor: '#FFE5E5', padding: 12, borderRadius: 12, marginBottom: 10 },
  errorText: { color: '#FF3B30', fontSize: 14 },
  priorityOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 2, borderColor: '#ddd', borderRadius: 16, padding: 16, backgroundColor: '#fff' },
  priorityOptionActive: { borderColor: '#477023', backgroundColor: 'rgba(71,112,35,0.05)' },
  priorityLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  priorityTextContainer: { flex: 1 },
  priorityTitle: { fontSize: 16, fontWeight: '600', color: '#0D330E' },
  prioritySubtext: { fontSize: 12, color: '#666', marginTop: 2 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#477023', borderColor: '#477023' },
  priceBreakdown: { backgroundColor: '#f5f5f5', borderRadius: 16, padding: 16, gap: 12 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: 14, color: '#666' },
  priceValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  priorityText: { color: '#477023' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 12, marginTop: 4 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#0D330E' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#477023' },
  payButton: { backgroundColor: '#0D330E', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  payButtonDisabled: { opacity: 0.7 },
  payButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  navigationButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  backButton: { paddingVertical: 12, paddingHorizontal: 20 },
  backButtonText: { fontSize: 16, color: '#666', fontWeight: '600' },
  nextButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#477023', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 16 },
  nextButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  successContainer: { flex: 1 },
  successGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  successContent: { alignItems: 'center', padding: 24 },
  successIconContainer: { marginBottom: 20 },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  successMessage: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 30, paddingHorizontal: 20 },
  trackButton: { backgroundColor: '#A3B18A', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 30, width: '100%', alignItems: 'center', marginBottom: 12 },
  trackButtonText: { color: '#0D330E', fontSize: 16, fontWeight: 'bold' },
  createAnotherButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 30, width: '100%', alignItems: 'center' },
  createAnotherText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  exitButton: { position: 'absolute', bottom: 30, right: 20, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25 },
  exitButtonText: { color: '#fff', fontSize: 14 },
});