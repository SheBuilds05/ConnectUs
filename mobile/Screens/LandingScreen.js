import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Ensure you have this installed

const { height } = Dimensions.get('window');

export default function LandingScreen() {
  // Define your branded colors
  const BRAND_DEEP_FOREST = '#FFFFFF'; // The primary branding green
  const BRAND_ACCENT = '#32D792'; // Bright green for buttons/links
  const BRAND_DARK_BG = '#FFFFFF'; // Near-black green for gradient finish

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. Background Gradient */}
      <LinearGradient
        colors={[BRAND_DEEP_FOREST, BRAND_DARK_BG]}
        style={StyleSheet.absoluteFillObject} // Spans the entire screen
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }} // Top-to-bottom gradient
      />

      <SafeAreaView style={styles.safeAreaContainer}>
        {/* 2. Hero Section (Logo/Brand) */}
        <View style={styles.heroSection}>
          <View style={styles.logoRing}>
            <Text style={styles.logoEmoji}>🚀</Text>
          </View>
          <Text style={styles.brandName}>ConnectUs</Text>
          <Text style={styles.tagline}>
            Logistics. Elevated.
          </Text>
          <Text style={styles.taglineSubText}>
            Seamless solutions for Runners, Customers, and Administrators.
          </Text>
        </View>

        {/* 3. Action Section (Buttons) */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity 
            style={[styles.mainBtn, { backgroundColor: BRAND_ACCENT }]}
            onPress={() => router.push('login')}
          >
            <Text style={styles.mainBtnText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.ghostBtn}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.ghostBtnText}>Create Account</Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            Connecting Johannesbug's logistics network.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    // Provide a fallback solid color if the gradient fails
    backgroundColor: '#32D792',
  },
  safeAreaContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: height * 0.1, // Shift up slightly
  },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Subtle transparent white ring
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  logoEmoji: {
    fontSize: 50,
  },
  brandName: {
    fontSize: 40,
    fontWeight: '800',
    color: '#32D792',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '600',
    color: '#32D792',
    marginTop: 8,
  },
  taglineSubText: {
    fontSize: 15,
    color: '#A0AEC0', // Soft grey-green
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 23,
    paddingHorizontal: 15,
  },
  buttonWrapper: {
    paddingBottom: 40,
  },
  mainBtn: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    // Strong shadow to make the green pop
    shadowColor: '#32D792',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8, // For Android
  },
  mainBtnText: {
    color: '#031E17', // Contrast with the bright button
    shadowColor: '#32D792',
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'uppercase', // Bold feel
    letterSpacing: 0.5,
  },
  ghostBtn: {
    marginTop: 15,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ghostBtnText: {
    color: '#064232F',
    fontSize: 16,
    fontWeight: '700',
  },
  footerNote: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.3)', // Faded white
    fontSize: 12,
    marginTop: 25,
  }
});