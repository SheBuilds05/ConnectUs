import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WalletBalance {
  balance: number;
  total_credited: number;
  total_debited: number;
  total_held?: number;
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'credit' | 'debit' | 'hold';
  status: string;
  description: string;
  created_at: string;
}

// Helper to get user ID
const getUserId = async (): Promise<string | null> => {
  try {
    // First try to get from AsyncStorage
    let userId = await AsyncStorage.getItem('userId');
    if (userId) return userId;
    
    // Fallback to getting from user object
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      userId = user.user_id || user.id;
      if (userId) return userId.toString();
    }
    return null;
  } catch (error) {
    console.error('Error getting userId:', error);
    return null;
  }
};

// Create a hold for a booking
export const createHold = async (bookingId: number, amount: number): Promise<{ hold_id: number; message: string }> => {
  try {
    const userId = await getUserId();
    console.log('📦 Creating hold for userId:', userId, 'bookingId:', bookingId, 'amount:', amount);
    
    const response = await api.post('/wallet/hold', 
      { booking_id: bookingId, amount },
      { headers: { 'x-user-id': userId || '' } }
    );
    console.log('✅ Hold created:', response.data);
    return response.data?.data || response.data;
  } catch (error: any) {
    console.error('❌ Error creating hold:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to create hold');
  }
};

// Capture hold (when runner accepts)
export const captureHold = async (holdId: number): Promise<{ message: string }> => {
  const userId = await getUserId();
  const response = await api.post(`/wallet/capture/${holdId}`, {}, { headers: { 'x-user-id': userId || '' } });
  return response.data;
};

// Release hold (when runner rejects)
export const releaseHold = async (holdId: number): Promise<{ message: string }> => {
  const userId = await getUserId();
  const response = await api.post(`/wallet/release/${holdId}`, {}, { headers: { 'x-user-id': userId || '' } });
  return response.data;
};

// Get wallet balance
export const getWalletBalance = async (): Promise<WalletBalance> => {
  try {
    const userId = await getUserId();
    console.log('📦 Getting wallet balance for userId:', userId);
    
    const response = await api.get('/wallet/balance', {
      headers: { 'x-user-id': userId || '' }
    });
    return response.data?.data || response.data || { balance: 0, total_credited: 0, total_debited: 0 };
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return { balance: 0, total_credited: 0, total_debited: 0 };
  }
};

// Get transaction history
export const getTransactionHistory = async (): Promise<Transaction[]> => {
  try {
    const userId = await getUserId();
    console.log('📦 Getting transaction history for userId:', userId);
    
    const response = await api.get('/wallet/transactions', {
      headers: { 'x-user-id': userId || '' }
    });
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

// Add funds to wallet
export const addFunds = async (amount: number): Promise<{ success: boolean; payment_id: number; message: string }> => {
  const userId = await getUserId();
  const response = await api.post('/wallet/add-funds', 
    { amount },
    { headers: { 'x-user-id': userId || '' } }
  );
  return response.data?.data || response.data;
};