import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/theme';
import { getUserRole, removeToken } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminDashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const currentRole = await getUserRole();
      if (currentRole === 'admin') {
        setRole('admin');
      } else {
        router.replace('/'); 
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await removeToken();
    Alert.alert('Success', 'Admin session ended.');
    router.replace('/');
  };

  if (!role) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>System Overview</Text>
            <Text style={styles.title}>Admin Panel</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={Colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color={Colors.accent} />
            <Text style={styles.statNumber}>1,284</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="bicycle" size={24} color={Colors.accent} />
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Active Runners</Text>
          </View>
        </View>

        {/* Action Sections */}
        <Text style={styles.sectionTitle}>Management</Text>
        
        <TouchableOpacity style={styles.actionRow}>
          <LinearGradient colors={[Colors.deepForest, Colors.darkBg]} style={styles.actionIcon}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.accent} />
          </LinearGradient>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Verify Runners</Text>
            <Text style={styles.actionSub}>12 pending applications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow}>
          <LinearGradient colors={[Colors.deepForest, Colors.darkBg]} style={styles.actionIcon}>
            <Ionicons name="alert-circle" size={20} color="#FFD700" />
          </LinearGradient>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Dispute Center</Text>
            <Text style={styles.actionSub}>2 open tickets</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow}>
          <LinearGradient colors={[Colors.deepForest, Colors.darkBg]} style={styles.actionIcon}>
            <Ionicons name="wallet" size={20} color={Colors.white} />
          </LinearGradient>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>System Revenue</Text>
            <Text style={styles.actionSub}>View escrow & payouts</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
        </TouchableOpacity>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ConnectUs v1.0.4 Premium Admin</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.darkBg },
  scrollContent: { padding: 25 },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 30,
    marginTop: 10 
  },
  greeting: { color: Colors.gray, fontSize: 14, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '900', color: Colors.white },
  logoutBtn: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    padding: 12, 
    borderRadius: 12 
  },

  statsGrid: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  statCard: { 
    flex: 1, 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    padding: 20, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.05)' 
  },
  statNumber: { 
    color: Colors.white, 
    fontSize: 22, 
    fontWeight: '800', 
    marginTop: 10 
  },
  statLabel: { color: Colors.gray, fontSize: 12, marginTop: 2 },

  sectionTitle: { 
    color: Colors.white, 
    fontSize: 18, 
    fontWeight: '700', 
    marginBottom: 15 
  },

  actionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    padding: 15, 
    borderRadius: 18, 
    marginBottom: 12 
  },
  actionIcon: { 
    width: 45, 
    height: 45, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  actionText: { flex: 1, marginLeft: 15 },
  actionTitle: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  actionSub: { color: Colors.gray, fontSize: 12, marginTop: 2 },

  footer: { marginTop: 40, alignItems: 'center', opacity: 0.3 },
  footerText: { color: Colors.white, fontSize: 12 }
});