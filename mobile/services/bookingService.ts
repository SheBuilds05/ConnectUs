import api, { getCurrentUser, getUserId } from './api';

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
  runner_id?: number; // ✅ Made optional
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
  // Get the current user from AsyncStorage
  const user = await getCurrentUser();
  console.log('[createBooking] Retrieved user:', user);
  
  if (!user) {
    console.error('[createBooking] No user found – user not logged in');
    throw new Error('You must be logged in to create a booking');
  }

  // Use user.id (your User interface has 'id')
  const userId = user.id;
  if (!userId) {
    console.error('[createBooking] User object has no id', user);
    throw new Error('Invalid user data – missing user id');
  }

  console.log('[createBooking] Using userId:', userId);

  // ✅ runner_id is optional - send null if not provided
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

  console.log('[createBooking] Sending payload:', payload);

  try {
    const response = await api.post('/bookings', payload);
    console.log('[createBooking] API response:', response.data);
    const booking = response.data?.data || response.data;
    if (!booking || !booking.booking_id) {
      throw new Error('Invalid response from server – missing booking_id');
    }
    return booking;
  } catch (error: any) {
    console.error('[createBooking] Error details:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create booking';
    throw new Error(errorMessage);
  }
};

// Get user's bookings
export const getUserBookings = async (): Promise<Booking[]> => {
  const userId = await getUserId();
  if (!userId) {
    return [];
  }
  try {
    const response = await api.get(`/users/${userId}/bookings`);
    const bookings = response.data?.data || response.data || [];
    return Array.isArray(bookings) ? bookings : [];
  } catch (error: any) {
    console.error('Error fetching bookings:', error.message);
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
  try {
    await api.patch(`/bookings/${bookingId}/status`, { status });
  } catch (error: any) {
    console.error(`Error updating booking ${bookingId} status:`, error.message);
    throw new Error(error.response?.data?.message || 'Failed to update booking status');
  }
};