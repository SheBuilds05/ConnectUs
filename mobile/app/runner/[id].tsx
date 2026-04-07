import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRunnerById, getRunnerProducts, RunnerProfile, Product } from '../../services/runnerService';
import { calculateFees } from '../../services/bookingService';

export default function RunnerDetailsScreen() {
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params as { id?: string };
  const runnerId = id ? parseInt(id) : null;

  console.log('🔍 RunnerDetails - URL ID:', id);
  console.log('🔍 RunnerDetails - Parsed runnerId:', runnerId);

  const [runner, setRunner] = useState<RunnerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<'hand' | 'courier'>('hand');
  const [feeBreakdown, setFeeBreakdown] = useState({
    productFee: 0,
    runnerFee: 0,
    deliveryFee: 0,
    serviceFee: 0,
    total: 0
  });

  useEffect(() => {
    if (runnerId) {
      loadRunnerDetails();
    }
  }, [runnerId]);

  useEffect(() => {
    if (selectedProduct) {
      calculateTotalFees();
    }
  }, [selectedProduct, selectedDeliveryType]);

  const loadRunnerDetails = async () => {
    if (!runnerId) return;
    console.log('📥 Loading runner details for ID:', runnerId);
    setLoading(true);
    try {
      const [runnerData, productsData] = await Promise.all([
        getRunnerById(runnerId),
        getRunnerProducts(runnerId)
      ]);
      console.log('✅ Runner loaded:', runnerData?.username, 'ID:', runnerData?.runner_id);
      console.log('✅ Products loaded:', productsData.length);
      setRunner(runnerData);
      setProducts(productsData);
    } catch (error) {
      console.error('❌ Error loading runner details:', error);
      Alert.alert('Error', 'Failed to load runner details');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalFees = () => {
    if (!selectedProduct || !runner) return;
    const runnerRate = Math.max(20, Math.min(50, Math.floor(runner.completed_bookings_count / 10) + 20));
    const fees = calculateFees(
      selectedProduct.price,
      runnerRate,
      5,
      selectedDeliveryType === 'courier'
    );
    setFeeBreakdown(fees);
  };

  const handleProductSelect = (product: Product) => {
    console.log('🛒 Product selected:', product.title, 'ID:', product.product_id);
    setSelectedProduct(product);
    setShowBookingModal(true);
  };

  const handleCreateBooking = () => {
    console.log('📝 handleCreateBooking called');
    console.log('  - Runner:', runner?.username, 'ID:', runner?.runner_id);
    console.log('  - Selected Product:', selectedProduct?.title);
    console.log('  - Delivery Location:', deliveryLocation);
    console.log('  - Delivery Type:', selectedDeliveryType);
    
    if (!deliveryLocation.trim()) {
      Alert.alert('Error', 'Please enter delivery location');
      return;
    }
    
    const bookingParams = {
      runnerId: runner?.runner_id,
      runnerName: runner?.username,
      productId: selectedProduct?.product_id,
      productName: selectedProduct?.title,
      productPrice: selectedProduct?.price,
      productFee: feeBreakdown.productFee,
      runnerFee: feeBreakdown.runnerFee,
      deliveryFee: feeBreakdown.deliveryFee,
      serviceFee: feeBreakdown.serviceFee,
      totalAmount: feeBreakdown.total,
      deliveryLocation,
      specialInstructions,
      deliveryType: selectedDeliveryType
    };
    
    console.log('🚀 Navigating to create-booking with params:', JSON.stringify(bookingParams, null, 2));
    router.push({
      pathname: '/create-booking',
      params: bookingParams
    });
  };

  const handleDirectBooking = async () => {
    console.log('📝 Direct booking - Runner:', runner?.username, 'ID:', runner?.runner_id);
    
    const bookingData = {
      runnerId: runner?.runner_id,
      runnerName: runner?.username,
      productId: '',
      productName: '',
      productPrice: 0,
    };
    
    console.log('💾 Saving to AsyncStorage:', JSON.stringify(bookingData));
    await AsyncStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    
    // Verify it was saved
    const saved = await AsyncStorage.getItem('pendingBooking');
    console.log('✅ Verification - saved data:', saved);
    
    console.log('🚀 Navigating to create-booking (direct)');
    router.push('/create-booking');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#477023" />
        <Text style={styles.loadingText}>Loading runner details...</Text>
      </View>
    );
  }

  if (!runner) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="sad-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>Runner not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonCircle}>
            <Ionicons name="arrow-back" size={24} color="#0D330E" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={22} color="#0D330E" />
          </TouchableOpacity>
        </View>

        {/* Runner Profile Section */}
        <View style={styles.profileSection}>
          <Image source={{ uri: runner.profile_photo || 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.profileImage} />
          <Text style={styles.runnerName}>{runner.username}</Text>
          <Text style={styles.runnerUsername}>{runner.email}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={18} color="#FFD700" />
              <Text style={styles.statValue}>{runner.rating || '4.5'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="briefcase" size={18} color="#477023" />
              <Text style={styles.statValue}>{runner.completed_bookings_count || 0}</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={18} color={runner.verification_status === 'VERIFIED' ? '#4CAF50' : '#FF9800'} />
              <Text style={styles.statValue}>{runner.verification_status === 'VERIFIED' ? 'Verified' : 'Pending'}</Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {runner.username}</Text>
          <Text style={styles.bioText}>{runner.bio || 'No bio provided yet.'}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color="#666" />
            <Text style={styles.infoText}>{runner.city}, {runner.address || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={18} color="#666" />
            <Text style={styles.infoText}>{runner.phone || 'Phone not provided'}</Text>
          </View>
        </View>

        {/* Expertise Section */}
        {runner.expertise && runner.expertise.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specialties</Text>
            <View style={styles.categoriesContainer}>
              {runner.expertise.map((category, index) => (
                <View key={index} style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products & Services</Text>
          <Text style={styles.sectionSubtitle}>What {runner.username} can help you find</Text>
          {products.length === 0 ? (
            <View style={styles.noProducts}>
              <Text style={styles.noProductsText}>No products listed yet</Text>
            </View>
          ) : (
            products.map((product) => (
              <TouchableOpacity key={product.product_id} style={styles.productCard} onPress={() => handleProductSelect(product)}>
                <Image source={{ uri: product.image_url || 'https://picsum.photos/200/150' }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.title}</Text>
                  <Text style={styles.productDescription} numberOfLines={2}>{product.description}</Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>R{product.price}</Text>
                    {product.category_name && (
                      <View style={styles.categoryTag}>
                        <Text style={styles.categoryTagText}>{product.category_name}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
        
      {/* Book Runner Button - Direct Booking */}
      <TouchableOpacity 
        style={styles.bookRunnerButton}
        onPress={handleDirectBooking}
      >
        <LinearGradient colors={['#0D330E', '#1A4A1A']} style={styles.bookRunnerGradient}>
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.bookRunnerText}>Book This Runner</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Booking Modal */}
      <Modal visible={showBookingModal} animationType="slide" transparent onRequestClose={() => setShowBookingModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book {runner?.username}</Text>
              <TouchableOpacity onPress={() => setShowBookingModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedProduct && (
                <View style={styles.selectedProductCard}>
                  <Text style={styles.selectedProductName}>{selectedProduct.title}</Text>
                  <Text style={styles.selectedProductPrice}>R{selectedProduct.price}</Text>
                </View>
              )}
              <Text style={styles.inputLabel}>Delivery Location *</Text>
              <TextInput style={styles.input} placeholder="Enter delivery address" value={deliveryLocation} onChangeText={setDeliveryLocation} />
              <Text style={styles.inputLabel}>Delivery Type</Text>
              <View style={styles.deliveryTypeContainer}>
                <TouchableOpacity style={[styles.deliveryTypeButton, selectedDeliveryType === 'hand' && styles.deliveryTypeActive]} onPress={() => setSelectedDeliveryType('hand')}>
                  <Ionicons name="walk" size={24} color={selectedDeliveryType === 'hand' ? '#fff' : '#666'} />
                  <Text style={[styles.deliveryTypeText, selectedDeliveryType === 'hand' && styles.deliveryTypeTextActive]}>Hand Delivery</Text>
                  <Text style={styles.deliveryTypePrice}>R25</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.deliveryTypeButton, selectedDeliveryType === 'courier' && styles.deliveryTypeActive]} onPress={() => setSelectedDeliveryType('courier')}>
                  <Ionicons name="car" size={24} color={selectedDeliveryType === 'courier' ? '#fff' : '#666'} />
                  <Text style={[styles.deliveryTypeText, selectedDeliveryType === 'courier' && styles.deliveryTypeTextActive]}>Courier</Text>
                  <Text style={styles.deliveryTypePrice}>R50</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.inputLabel}>Special Instructions (Optional)</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder="Any special requests..." value={specialInstructions} onChangeText={setSpecialInstructions} multiline numberOfLines={3} />
              <View style={styles.feeBreakdown}>
                <Text style={styles.breakdownTitle}>Fee Breakdown</Text>
                <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Product Cost</Text><Text style={styles.breakdownValue}>R{feeBreakdown.productFee.toFixed(2)}</Text></View>
                <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Runner Fee</Text><Text style={styles.breakdownValue}>R{feeBreakdown.runnerFee.toFixed(2)}</Text></View>
                <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Delivery Fee</Text><Text style={styles.breakdownValue}>R{feeBreakdown.deliveryFee.toFixed(2)}</Text></View>
                <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Service Fee (10%)</Text><Text style={styles.breakdownValue}>R{feeBreakdown.serviceFee.toFixed(2)}</Text></View>
                <View style={[styles.breakdownRow, styles.totalRow]}><Text style={styles.totalLabel}>Total Amount</Text><Text style={styles.totalValue}>R{feeBreakdown.total.toFixed(2)}</Text></View>
              </View>
              <TouchableOpacity style={styles.bookButton} onPress={handleCreateBooking}>
                <LinearGradient colors={['#0D330E', '#1A4A1A']} style={styles.bookButtonGradient}>
                  <Text style={styles.bookButtonText}>Continue to Booking</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  errorText: { fontSize: 18, color: '#666', marginTop: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 },
  backButtonCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  shareButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  profileSection: { alignItems: 'center', paddingVertical: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#477023', marginBottom: 12 },
  runnerName: { fontSize: 24, fontWeight: 'bold', color: '#0D330E' },
  runnerUsername: { fontSize: 14, color: '#666', marginBottom: 16 },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 16, marginHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: '#e0e0e0' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#0D330E', marginTop: 4 },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  section: { backgroundColor: '#fff', marginTop: 12, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0D330E', marginBottom: 12 },
  sectionSubtitle: { fontSize: 13, color: '#666', marginBottom: 16 },
  bioText: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  infoText: { fontSize: 14, color: '#666', flex: 1 },
  categoriesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  categoryText: { fontSize: 12, color: '#477023', fontWeight: '500' },
  productCard: { flexDirection: 'row', backgroundColor: '#f9f9f9', borderRadius: 12, padding: 12, marginBottom: 12, alignItems: 'center' },
  productImage: { width: 80, height: 80, borderRadius: 10 },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 16, fontWeight: '600', color: '#0D330E', marginBottom: 4 },
  productDescription: { fontSize: 12, color: '#666', marginBottom: 8 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#477023' },
  categoryTag: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  categoryTagText: { fontSize: 10, color: '#477023' },
  noProducts: { alignItems: 'center', paddingVertical: 30 },
  noProductsText: { fontSize: 14, color: '#999' },
  backButton: { backgroundColor: '#477023', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, marginTop: 20 },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#0D330E' },
  selectedProductCard: { backgroundColor: '#E8F5E9', borderRadius: 12, padding: 16, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectedProductName: { fontSize: 16, fontWeight: '600', color: '#0D330E' },
  selectedProductPrice: { fontSize: 18, fontWeight: 'bold', color: '#477023' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 14, backgroundColor: '#f9f9f9' },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  deliveryTypeContainer: { flexDirection: 'row', gap: 12 },
  deliveryTypeButton: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  deliveryTypeActive: { backgroundColor: '#477023', borderColor: '#477023' },
  deliveryTypeText: { fontSize: 14, fontWeight: '600', color: '#666', marginTop: 8 },
  deliveryTypeTextActive: { color: '#fff' },
  deliveryTypePrice: { fontSize: 12, color: '#999', marginTop: 4 },
  feeBreakdown: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 16, marginTop: 20 },
  breakdownTitle: { fontSize: 16, fontWeight: 'bold', color: '#0D330E', marginBottom: 12 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  breakdownLabel: { fontSize: 13, color: '#666' },
  breakdownValue: { fontSize: 13, fontWeight: '500', color: '#333' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 10, marginTop: 6 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#0D330E' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#477023' },
  bookButton: { marginTop: 24, marginBottom: 20, borderRadius: 12, overflow: 'hidden' },
  bookButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 8 },
  bookButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  bookRunnerButton: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookRunnerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  bookRunnerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});