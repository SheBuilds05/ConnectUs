import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Dimensions, 
  Modal,
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Standard for Expo mobile icons

const { width } = Dimensions.get('window');

// Your exact color palette
const colors = {
  resedaGreen: '#6E8649',
  fernGreen: '#477023',
  darkMoss: '#2D531A',
  pakistanGreen: '#0D330E',
  gray: '#D3D3D3',
  white: '#FFFFFF',
  text: '#0D330E',
  background: '#F2F2F2'
};

export default function LandingScreen() {
  const router = useRouter();
  const [showAbout, setShowAbout] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Navigation Header */}
        <View style={styles.nav}>
          <View style={styles.logoContainer}>
            <LinearGradient 
              colors={[colors.pakistanGreen, colors.resedaGreen]} 
              style={styles.logoBadge}
            >
              <Text style={styles.logoChar}>C</Text>
            </LinearGradient>
            <Text style={styles.logoText}>ConnectUs<Text style={{color: colors.resedaGreen}}>.</Text></Text>
          </View>
          <TouchableOpacity onPress={() => setShowAbout(true)}>
            <Ionicons name="information-circle-outline" size={28} color={colors.pakistanGreen} />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <LinearGradient 
          colors={[colors.pakistanGreen, colors.darkMoss]} 
          style={styles.heroBanner}
        >
          <View style={styles.trustedBadge}>
            <Text style={styles.trustedText}>⚡ Trusted by 10,000+ users</Text>
          </View>
          <Text style={styles.heroTitle}>Your Local Items,{"\n"}
            <Text style={{color: colors.resedaGreen}}>Delivered Instantly</Text>
          </Text>
          <Text style={styles.heroSubtitle}>Connect with trusted local runners who shop for you.</Text>
        </LinearGradient>

        {/* Search Bar - Floating Style */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TextInput 
              placeholder="What do you need?" 
              style={styles.searchInput}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.searchBtn}>
              <Ionicons name="search" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.primaryAction}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.primaryActionText}>Find a Runner</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryAction}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.secondaryActionText}>Become a Runner</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
          {[{v:'10k+',l:'Runners'}, {v:'50k+',l:'Deliveries'}, {v:'98%',l:'Happy'}, {v:'100+',l:'Cities'}].map((s,i)=>(
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{s.v}</Text>
              <Text style={styles.statLabel}>{s.l}</Text>
            </View>
          ))}
        </ScrollView>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.stepCard}>
            <Ionicons name="camera-outline" size={32} color={colors.resedaGreen} />
            <View style={styles.stepTextContent}>
              <Text style={styles.stepTitle}>Upload Photos</Text>
              <Text style={styles.stepDesc}>Snap the items you need and upload them instantly.</Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <Ionicons name="git-network-outline" size={32} color={colors.fernGreen} />
            <View style={styles.stepTextContent}>
              <Text style={styles.stepTitle}>AI Matching</Text>
              <Text style={styles.stepDesc}>Our AI finds the perfect local runner near you.</Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <Ionicons name="shield-checkmark-outline" size={32} color={colors.pakistanGreen} />
            <View style={styles.stepTextContent}>
              <Text style={styles.stepTitle}>Secure Payments</Text>
              <Text style={styles.stepDesc}>Pay safely through our protected escrow system.</Text>
            </View>
          </View>
        </View>

        {/* Auth Footer */}
        <View style={styles.authFooter}>
          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginBtnText}>Already a member? Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.signUpBtn}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.signUpBtnText}>Sign Up Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* About Modal */}
      <Modal visible={showAbout} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>About ConnectUs</Text>
            <Text style={styles.modalDesc}>
              ConnectUs is a professional marketplace connecting people with local shopping assistants (Runners) using AI and secure escrow payments.
            </Text>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowAbout(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  nav: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20 
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBadge: { 
    width: 35, height: 35, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  logoChar: { color: colors.white, fontWeight: 'bold', fontSize: 18 },
  logoText: { fontSize: 20, fontWeight: '800', color: colors.pakistanGreen },
  
  heroBanner: { padding: 30, paddingTop: 40, paddingBottom: 60, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  trustedBadge: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    alignSelf: 'flex-start',
    marginBottom: 15
  },
  trustedText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  heroTitle: { fontSize: 32, fontWeight: '900', color: colors.white, lineHeight: 38 },
  heroSubtitle: { color: colors.gray, fontSize: 16, marginTop: 10, opacity: 0.9 },

  searchSection: { marginTop: -30, paddingHorizontal: 20 },
  searchBar: { 
    flexDirection: 'row', 
    backgroundColor: colors.white, 
    borderRadius: 15, 
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    padding: 5
  },
  searchInput: { flex: 1, paddingHorizontal: 15, height: 50, color: colors.text },
  searchBtn: { backgroundColor: colors.pakistanGreen, padding: 12, borderRadius: 12 },

  actionGrid: { padding: 20, gap: 12 },
  primaryAction: { backgroundColor: colors.pakistanGreen, padding: 18, borderRadius: 12, alignItems: 'center' },
  primaryActionText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  secondaryAction: { borderWidth: 2, borderColor: colors.pakistanGreen, padding: 18, borderRadius: 12, alignItems: 'center' },
  secondaryActionText: { color: colors.pakistanGreen, fontWeight: '700', fontSize: 16 },

  statsRow: { paddingLeft: 20, paddingVertical: 10, gap: 15 },
  statCard: { backgroundColor: '#F8F9F8', padding: 20, borderRadius: 15, width: 120, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: colors.fernGreen },
  statLabel: { fontSize: 12, color: colors.darkMoss },

  section: { padding: 25 },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: colors.pakistanGreen, marginBottom: 20 },
  stepCard: { flexDirection: 'row', gap: 20, marginBottom: 25, alignItems: 'center' },
  stepTextContent: { flex: 1 },
  stepTitle: { fontSize: 18, fontWeight: '700', color: colors.pakistanGreen },
  stepDesc: { color: colors.darkMoss, fontSize: 14, marginTop: 4 },

  authFooter: { padding: 25, paddingBottom: 40, backgroundColor: '#f9f9f9' },
  loginBtn: { padding: 10, alignItems: 'center' },
  loginBtnText: { color: colors.darkMoss, fontWeight: '600' },
  signUpBtn: { backgroundColor: colors.resedaGreen, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  signUpBtnText: { color: colors.white, fontWeight: '800', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 30, borderRadius: 25, width: '85%', alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: colors.pakistanGreen, marginBottom: 15 },
  modalDesc: { textAlign: 'center', color: colors.darkMoss, lineHeight: 22 },
  modalClose: { marginTop: 20, backgroundColor: colors.pakistanGreen, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
  modalCloseText: { color: 'white', fontWeight: '700' }
});