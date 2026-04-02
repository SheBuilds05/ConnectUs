import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WalletScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
        <Text style={styles.subtitle}>Manage your earnings and transactions</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>R 2,450.00</Text>
        <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={24} color="#4ade80" />
          <Text style={styles.statAmount}>R 1,250</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={24} color="#4ade80" />
          <Text style={styles.statAmount}>R 3,800</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
      </View>

      {/* Bonus Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bonuses & Promotions</Text>
        <View style={styles.bonusCard}>
          <View style={styles.bonusIcon}>
            <Ionicons name="gift" size={24} color="#4ade80" />
          </View>
          <View style={styles.bonusContent}>
            <Text style={styles.bonusTitle}>Weekend Bonus</Text>
            <Text style={styles.bonusDescription}>Complete 10 deliveries this weekend</Text>
          </View>
          <Text style={styles.bonusAmount}>+R 150</Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        
        <TransactionItem 
          icon="cart" 
          title="Delivery #1234" 
          date="Today, 2:30 PM" 
          amount="+R 45.00" 
          positive={true}
        />
        
        <TransactionItem 
          icon="wallet" 
          title="Withdrawal" 
          date="Yesterday, 10:15 AM" 
          amount="-R 200.00" 
          positive={false}
        />
        
        <TransactionItem 
          icon="star" 
          title="Bonus - Peak Hour" 
          date="Mar 28, 2025" 
          amount="+R 25.00" 
          positive={true}
        />
        
        <TransactionItem 
          icon="cart" 
          title="Delivery #1230" 
          date="Mar 27, 2025" 
          amount="+R 55.00" 
          positive={true}
        />
      </View>
    </ScrollView>
  );
}

// ✅ FIXED: Added TypeScript interface for TransactionItem props
interface TransactionItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  date: string;
  amount: string;
  positive: boolean;
}

// Transaction Item Component with proper typing
const TransactionItem: React.FC<TransactionItemProps> = ({ icon, title, date, amount, positive }) => {
  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Ionicons name={icon} size={20} color="#1a2e1a" />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{title}</Text>
        <Text style={styles.transactionDate}>{date}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        positive ? styles.positiveAmount : styles.negativeAmount
      ]}>
        {amount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a2e1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: '#1a2e1a',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  withdrawButton: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  withdrawButtonText: {
    color: '#1a2e1a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: 20,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  statAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a2e1a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a2e1a',
    marginBottom: 16,
  },
  bonusCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,           // ✅ FIXED: changed from borderWeight to borderWidth
    borderColor: '#f3f4f6',
  },
  bonusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bonusContent: {
    flex: 1,
  },
  bonusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2e1a',
  },
  bonusDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  bonusAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ade80',
  },
  transactionItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a2e1a',
  },
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveAmount: {
    color: '#4ade80',
  },
  negativeAmount: {
    color: '#ef4444',
  },
});