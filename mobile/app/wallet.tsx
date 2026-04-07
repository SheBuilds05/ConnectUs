import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getWalletBalance, getTransactionHistory, addFunds, WalletBalance, Transaction } from '../services/walletService';

export default function WalletScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addingFunds, setAddingFunds] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [balanceData, transactionsData] = await Promise.all([
        getWalletBalance(),
        getTransactionHistory(),
      ]);
      setBalance(balanceData);
      setTransactions(transactionsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddFunds = async () => {
    Alert.prompt(
      'Add Funds',
      'Enter amount in ZAR:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: async (amount?: string) => {
            const numAmount = parseFloat(amount || '0');
            if (isNaN(numAmount) || numAmount <= 0) {
              Alert.alert('Error', 'Please enter a valid amount');
              return;
            }
            setAddingFunds(true);
            try {
              const result = await addFunds(numAmount);
              Alert.alert('Success', `Payment initiated. Redirecting to ${result.checkout_url}`);
              // In a real app, you would open a WebView with the checkout_url
            } catch (error) {
              Alert.alert('Error', 'Failed to add funds');
            } finally {
              setAddingFunds(false);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#477023" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0D330E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Balance Card */}
        <LinearGradient colors={['#0D330E', '#1A4A1A']} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>R{balance?.balance.toFixed(2) || '0.00'}</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddFunds} disabled={addingFunds}>
            {addingFunds ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Funds</Text>
              </>
            )}
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>R{balance?.total_credited.toFixed(2) || '0.00'}</Text>
            <Text style={styles.statLabel}>Total Deposited</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>R{balance?.total_debited.toFixed(2) || '0.00'}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            transactions.map((tx) => (
              <View key={tx.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.transactionIcon,
                      { backgroundColor: tx.type === 'credit' ? '#E8F5E9' : '#FFEBEE' },
                    ]}
                  >
                    <Ionicons
                      name={tx.type === 'credit' ? 'trending-up' : 'trending-down'}
                      size={20}
                      color={tx.type === 'credit' ? '#4CAF50' : '#F44336'}
                    />
                  </View>
                  <View>
                    <Text style={styles.transactionDescription}>{tx.description}</Text>
                    <Text style={styles.transactionDate}>{formatDate(tx.created_at)}</Text>
                    {tx.reference_id && (
                      <Text style={styles.transactionRef}>Ref: {tx.reference_id}</Text>
                    )}
                  </View>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: tx.type === 'credit' ? '#4CAF50' : '#F44336' },
                  ]}
                >
                  {tx.type === 'credit' ? '+' : '-'}R{Math.abs(tx.amount).toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0D330E' },
  balanceCard: { margin: 16, padding: 24, borderRadius: 20, alignItems: 'center' },
  balanceLabel: { color: '#A3B18A', fontSize: 14, marginBottom: 8 },
  balanceAmount: { color: '#fff', fontSize: 42, fontWeight: 'bold', marginBottom: 16 },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25 },
  addButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  statsRow: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 20, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: '#e0e0e0' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#0D330E' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  transactionsSection: { marginHorizontal: 16, marginBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0D330E', marginBottom: 12 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 8 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  transactionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  transactionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  transactionDescription: { fontSize: 14, fontWeight: '500', color: '#333' },
  transactionDate: { fontSize: 11, color: '#999', marginTop: 2 },
  transactionRef: { fontSize: 10, color: '#aaa', marginTop: 2 },
  transactionAmount: { fontSize: 16, fontWeight: 'bold' },
});