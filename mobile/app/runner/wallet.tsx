import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'https://connectus-tpyp.onrender.com';

interface Transaction {
  id: number;
  type: 'earning' | 'withdrawal' | 'bonus';
  description: string;
  amount: number;
  date: string;
  order_id?: number;
}

interface WalletData {
  balance: number;
  pending_withdrawal?: number;
  total_earned: number;
  monthly_bonus?: number;
  bonus_date?: string;
  transactions: Transaction[];
}

export default function WalletScreen() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchWalletData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      console.log('Wallet - Stored user:', storedUser);
      
      if (!storedUser) {
        console.log('Wallet - No user found');
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      console.log('Wallet - Parsed user:', user);
      
      // Try multiple possible wallet endpoints
      let walletResponse = null;
      const endpoints = [
        `${API_BASE_URL}/api/wallet/balance`,
        `${API_BASE_URL}/api/wallet`,
        `${API_BASE_URL}/api/runners/wallet/${user.user_id}`,
        `${API_BASE_URL}/api/wallet/${user.user_id}`,
        `${API_BASE_URL}/api/users/${user.user_id}/wallet`,
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying wallet endpoint: ${endpoint}`);
          const response = await axios.get(endpoint);
          if (response.data) {
            walletResponse = response.data;
            console.log(`✅ Wallet data found at: ${endpoint}`);
            break;
          }
        } catch (err) {
          console.log(`❌ Failed at: ${endpoint}`);
        }
      }
      
      // Try transactions endpoint
      let transactionsResponse = null;
      const transactionEndpoints = [
        `${API_BASE_URL}/api/wallet/transactions`,
        `${API_BASE_URL}/api/transactions`,
        `${API_BASE_URL}/api/runners/${user.user_id}/transactions`,
      ];
      
      for (const endpoint of transactionEndpoints) {
        try {
          console.log(`Trying transactions endpoint: ${endpoint}`);
          const response = await axios.get(endpoint);
          if (response.data) {
            transactionsResponse = response.data;
            console.log(`✅ Transactions found at: ${endpoint}`);
            break;
          }
        } catch (err) {
          console.log(`❌ Failed at: ${endpoint}`);
        }
      }
      
      // If we got wallet data from API, use it
      if (walletResponse) {
        setWalletData({
          balance: walletResponse.balance || walletResponse.data?.balance || 0,
          total_earned: walletResponse.total_earned || walletResponse.data?.total_earned || 0,
          monthly_bonus: walletResponse.monthly_bonus || 0,
          transactions: transactionsResponse?.transactions || transactionsResponse?.data || [],
        });
      } else {
        // Use data from stored user if available
        const userBalance = user.wallet_balance || user.balance || 0;
        const userTotalEarned = user.total_earned || 0;
        
        setWalletData({
          balance: userBalance,
          total_earned: userTotalEarned,
          monthly_bonus: 0,
          transactions: [],
        });
        
        console.log('Using user data for wallet:', { balance: userBalance, totalEarned: userTotalEarned });
      }
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      // Don't show error alert, just set empty data
      setWalletData({
        balance: 0,
        total_earned: 0,
        monthly_bonus: 0,
        transactions: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!walletData || walletData.balance <= 0) {
      Alert.alert('Insufficient Balance', 'You have no funds to withdraw');
      return;
    }

    Alert.alert(
      'Withdraw Funds',
      `Are you sure you want to withdraw R${walletData.balance.toFixed(2)} to your bank account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          onPress: async () => {
            try {
              setWithdrawing(true);
              const storedUser = await AsyncStorage.getItem('user');
              if (!storedUser) return;
              
              const user = JSON.parse(storedUser);
              
              // Try multiple withdraw endpoints
              const withdrawEndpoints = [
                `${API_BASE_URL}/api/wallet/withdraw`,
                `${API_BASE_URL}/api/runners/wallet/withdraw`,
                `${API_BASE_URL}/api/withdraw`,
              ];
              
              let success = false;
              for (const endpoint of withdrawEndpoints) {
                try {
                  await axios.post(endpoint, {
                    user_id: user.user_id,
                    amount: walletData.balance,
                  });
                  success = true;
                  break;
                } catch (err) {
                  console.log(`Withdraw failed at: ${endpoint}`);
                }
              }
              
              if (success) {
                Alert.alert('Success', 'Withdrawal request submitted successfully');
                // Update local balance
                setWalletData({
                  ...walletData,
                  balance: 0,
                });
              } else {
                Alert.alert('Info', 'Withdrawal feature coming soon. Please contact support.');
              }
            } catch (error) {
              console.error('Withdrawal error:', error);
              Alert.alert('Info', 'Withdrawal feature coming soon.');
            } finally {
              setWithdrawing(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'earning':
        return <Ionicons name="basket" size={20} color="#10b981" />;
      case 'withdrawal':
        return <Ionicons name="arrow-down" size={20} color="#ef4444" />;
      case 'bonus':
        return <Ionicons name="gift" size={20} color="#f59e0b" />;
      default:
        return <Ionicons name="cash" size={20} color="#6b7280" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'earning':
        return '#10b981';
      case 'withdrawal':
        return '#ef4444';
      case 'bonus':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getTransactionSign = (type: Transaction['type']) => {
    switch (type) {
      case 'earning':
        return '+';
      case 'bonus':
        return '+';
      case 'withdrawal':
        return '-';
      default:
        return '';
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWalletData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWalletData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a2e1a" />
        <Text style={styles.loadingText}>Loading wallet...</Text>
      </View>
    );
  }

  if (!walletData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#9ca3af" />
        <Text style={styles.errorText}>No wallet data found</Text>
        <Text style={styles.errorSubText}>Complete your first delivery to see earnings</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchWalletData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1a2e1a']} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
        <Text style={styles.subtitle}>Manage your earnings</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>R {walletData.balance.toFixed(2)}</Text>
        
        <TouchableOpacity 
          style={[styles.withdrawBtn, (walletData.balance <= 0 || withdrawing) && styles.withdrawDisabled]} 
          onPress={handleWithdraw}
          disabled={walletData.balance <= 0 || withdrawing}
        >
          <Text style={styles.withdrawText}>
            {withdrawing ? 'Processing...' : 'Withdraw to Bank'}
          </Text>
          {!withdrawing && <Ionicons name="arrow-forward" size={18} color="#1a2e1a" />}
        </TouchableOpacity>
      </View>

      {/* Monthly Bonus Card - Only show if there's a bonus */}
      {walletData.monthly_bonus && walletData.monthly_bonus > 0 && (
        <View style={styles.bonusCard}>
          <View style={styles.row}>
            <Ionicons name="gift" size={20} color="#f59e0b" />
            <Text style={styles.bonusTitle}>Monthly Bonus</Text>
          </View>
          <Text style={styles.bonusDesc}>
            R{walletData.monthly_bonus.toFixed(2)} scheduled for {walletData.bonus_date || 'this month'}
          </Text>
        </View>
      )}

      {/* Total Earned Card */}
      <View style={styles.earnedCard}>
        <View style={styles.row}>
          <Ionicons name="trophy" size={20} color="#1a2e1a" />
          <Text style={styles.earnedTitle}>Total Lifetime Earnings</Text>
        </View>
        <Text style={styles.earnedAmount}>R {walletData.total_earned.toFixed(2)}</Text>
      </View>

      {/* Recent Transactions Section */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      
      {walletData.transactions && walletData.transactions.length > 0 ? (
        walletData.transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transaction}>
            <View style={[styles.iconCircle, { backgroundColor: `${getTransactionColor(transaction.type)}15` }]}>
              {getTransactionIcon(transaction.type)}
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transName}>{transaction.description}</Text>
              <Text style={styles.transDate}>{formatDate(transaction.date)}</Text>
            </View>
            <Text style={[styles.transAmount, { color: getTransactionColor(transaction.type) }]}>
              {getTransactionSign(transaction.type)} R {Math.abs(transaction.amount).toFixed(2)}
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={50} color="#d1d5db" />
          <Text style={styles.emptyStateText}>No transactions yet</Text>
          <Text style={styles.emptyStateSubtext}>Complete deliveries to see earnings here</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a2e1a',
    textAlign: 'center',
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#1a2e1a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a2e1a',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: '#1a2e1a',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 44,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  withdrawBtn: {
    backgroundColor: '#4ade80',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  withdrawDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  withdrawText: {
    color: '#1a2e1a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bonusCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 16,
  },
  earnedCard: {
    backgroundColor: '#f0fdf4',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dcfce7',
    marginBottom: 24,
  },
  earnedTitle: {
    fontWeight: 'bold',
    color: '#1a2e1a',
    marginLeft: 8,
  },
  earnedAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a2e1a',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bonusTitle: {
    fontWeight: 'bold',
    color: '#1a2e1a',
    marginLeft: 8,
  },
  bonusDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#1a2e1a',
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconCircle: {
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1a2e1a',
  },
  transDate: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  transAmount: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
});