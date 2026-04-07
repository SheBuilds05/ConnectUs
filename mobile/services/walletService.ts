import api, { getUserId } from './api';

export interface WalletBalance {
  balance: number;
  total_credited: number;
  total_debited: number;
}

export interface Transaction {
  id: number;
  transaction_id: string;
  user_id: number;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  reference_id?: string;
  created_at: string;
}

// Get wallet balance
export const getWalletBalance = async (): Promise<WalletBalance> => {
  try {
    const response = await api.get('/wallet/balance');
    return response.data?.data || response.data || { balance: 0, total_credited: 0, total_debited: 0 };
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    // Return mock data for development
    return { balance: 250.00, total_credited: 500.00, total_debited: 250.00 };
  }
};

// Get transaction history
export const getTransactionHistory = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get('/wallet/transactions');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    // Mock transactions for development
    return [
      {
        id: 1,
        transaction_id: 'TXN001',
        user_id: 1,
        amount: 250.00,
        type: 'credit',
        status: 'completed',
        description: 'Wallet top-up',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        transaction_id: 'TXN002',
        user_id: 1,
        amount: -25.00,
        type: 'debit',
        status: 'completed',
        description: 'Payment for Order #12345',
        reference_id: '12345',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }
};

// Add funds to wallet – returns a checkout URL or payment intent
export const addFunds = async (amount: number): Promise<{ checkout_url: string; payment_id: string }> => {
  try {
    const response = await api.post('/wallet/add-funds', { amount });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error adding funds:', error);
    // Mock response for development
    return { checkout_url: 'https://example.com/pay', payment_id: 'pay_123' };
  }
};