import api, { getCurrentUser, getUserId } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Booking {
  booking_id: number;
  user_id: number;
  runner_id: number | null;
  status: 'CREATED' | 'ACCEPTED' | 'PURCHASING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  product_image_url?: string;
  product_description: string;
  delivery_location: string;
  budget: number;
  created_at: string;
  scheduled_for?: string;
  rating?: number;
  on_time?: boolean;
  rejection_reason?: string;
  runner?: {
    runner_id: number;
    username: string;
    phone: string;
    profile_photo: string;
  };
}

export interface CreateBookingData {
  runner_id?: number;
  product_description: string;
  delivery_location: string;
  budget: number;
  product_image_url?: string;
  scheduled_for?: string;
  special_instructions?: string;
}

// Calculate fees
export const calculateFees = (
  productCost: number,
  runnerRate: number = 25,
  distance: number = 5,
  isCourier: boolean = false
) => {
  const productFee = productCost;
  const runnerFee = runnerRate * distance;
  const deliveryFee = isCourier ? 50 : 25;
  const serviceFee = (productFee + runnerFee + deliveryFee) * 0.10;
  
  return {
    productFee,
    runnerFee,
    deliveryFee,
    serviceFee,
    total: productFee + runnerFee + deliveryFee + serviceFee
  };
};

// Create a new booking
export const createBooking = async (bookingData: CreateBookingData): Promise<Booking> => {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('You must be logged in to create a booking');
  }

  const userId = user.id || user.user_id;
  if (!userId) {
    throw new Error('Invalid user data – missing user id');
  }

  const payload = {
    user_id: userId,
    runner_id: bookingData.runner_id || null,
    product_description: bookingData.product_description,
    delivery_location: bookingData.delivery_location,
    budget: bookingData.budget,
    product_image_url: bookingData.product_image_url || null,
    scheduled_for: bookingData.scheduled_for || null,
    special_instructions: bookingData.special_instructions || null,
    status: 'CREATED'
  };

  console.log('📝 Creating booking with payload:', payload);

  const response = await api.post('/bookings', payload);
  const booking = response.data?.data || response.data;
  if (!booking || !booking.booking_id) {
    throw new Error('Invalid response from server – missing booking_id');
  }
  console.log('✅ Booking created:', booking.booking_id);
  return booking;
};

// Get user's bookings - with support for userId parameter (number | undefined)
export const getUserBookings = async (userIdParam?: number): Promise<Booking[]> => {
  console.log('🔍 getUserBookings - Starting...');
  console.log('🔍 userIdParam passed:', userIdParam);
  
  let userId: number | undefined = userIdParam;
  
  // If userId not provided, try to get from storage
  if (!userId) {
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      console.log('📦 userId from AsyncStorage:', userIdStr);
      if (userIdStr) {
        userId = parseInt(userIdStr);
      }
    } catch (err) {
      console.error('Error reading userId from storage:', err);
    }
  }
  
  // If still no userId, try getUserId()
  if (!userId) {
    const storedUserId = await getUserId();
    if (storedUserId) {
      userId = storedUserId;
    }
    console.log('📦 userId from getUserId():', userId);
  }
  
  if (!userId) {
    console.log('❌ getUserBookings - No userId found, returning empty array');
    return [];
  }
  
  console.log(`✅ Using userId: ${userId}`);
  
  try {
    const url = `/users/${userId}/bookings`;
    console.log(`📡 Fetching from URL: ${url}`);
    
    const response = await api.get(url);
    console.log('📡 Response status:', response.status);
    
    // Try different response structures
    let bookings: Booking[] = [];
    if (response.data?.data) {
      bookings = response.data.data;
      console.log('📦 Got bookings from response.data.data');
    } else if (Array.isArray(response.data)) {
      bookings = response.data;
      console.log('📦 Got bookings from response.data (array)');
    } else if (response.data?.bookings) {
      bookings = response.data.bookings;
      console.log('📦 Got bookings from response.data.bookings');
    } else {
      console.log('📦 No bookings found in response');
    }
    
    console.log(`✅ Found ${bookings.length} bookings for user ${userId}`);
    
    if (bookings.length > 0) {
      console.log('📦 First booking sample:', JSON.stringify(bookings[0], null, 2));
    }
    
    return bookings;
  } catch (error: any) {
    console.error('❌ Error fetching bookings:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
    return [];
  }
};

// Get single booking
export const getBookingById = async (bookingId: number): Promise<Booking | null> => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data?.data || response.data || null;
  } catch (error: any) {
    console.error(`Error fetching booking ${bookingId}:`, error.message);
    return null;
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId: number, status: string): Promise<void> => {
  await api.patch(`/bookings/${bookingId}/status`, { status });
};