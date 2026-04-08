import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const colors = {
  resedaGreen: '#6E8649',
  fernGreen: '#477023',
  darkMoss: '#2D531A',
  pakistanGreen: '#0D330E',
  gray: '#D3D3D3',
  white: '#FFFFFF',
  text: '#0D330E',
};

export default function LandingPage() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [showAbout, setShowAbout] = useState(false);

  const scrollToSection = (section: string) => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    // In a real app, you would measure the position of each section and scroll to it.
    // For simplicity, we'll just scroll to top for now.
  };

  const stats = [
    { value: '10k+', label: 'Runners' },
    { value: '50k+', label: 'Deliveries' },
    { value: '98%', label: 'Happy' },
    { value: '100+', label: 'Cities' },
  ];

  const features = [
    {
      icon: 'cloud-upload-outline',
      title: 'Upload Photos',
      desc: 'Take photos of the items you need and upload them.',
    },
    {
      icon: 'bulb-outline',
      title: 'AI Matching',
      desc: 'Our AI matches you with the perfect local runner.',
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Secure Payments',
      desc: 'Pay securely with our protected escrow system.',
    },
  ];

  const footerLinks = [
    {
      title: 'Company',
      links: ['About Our Mission', 'Our Story', 'Press & Media', 'Careers'],
    },
    {
      title: 'Services',
      links: ['Find a Runner', 'Become a Runner', 'Business Solutions', 'Pricing'],
    },
    {
      title: 'Support',
      links: ['Help Center', 'Safety Standards', 'Terms of Service', 'Privacy Policy'],
    },
  ];

  return (
    <LinearGradient colors={[colors.gray, colors.gray]} style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.logoContainer}>
          <LinearGradient
            colors={[colors.pakistanGreen, colors.resedaGreen]}
            style={styles.logoBox}
          >
            <Text style={styles.logoText}>C</Text>
          </LinearGradient>
          <Text style={styles.logoTitle}>
            ConnectUs<Text style={styles.logoAccent}>.</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginBtn}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.signupBtnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Banner */}
        <LinearGradient
          colors={[colors.pakistanGreen, colors.darkMoss]}
          style={styles.banner}
        >
          <Text style={styles.bannerTitle}>Your Local Items, Delivered</Text>
          <Text style={styles.bannerSubtitle}>
            Connect with trusted local runners in your area
          </Text>
        </LinearGradient>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroLeft}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⚡ Trusted by 10,000+ users</Text>
            </View>
            <Text style={styles.heroTitle}>
              Your Local Items,{' '}
              <Text style={styles.heroTitleAccent}>Delivered Instantly</Text>
            </Text>
            <Text style={styles.heroDesc}>
              Connect with trusted local runners who can shop and deliver anything
              you need. Fast, reliable, and secure.
            </Text>

            <View style={styles.searchBar}>
              <TextInput
                style={styles.searchInput}
                placeholder="What would you like delivered?"
                placeholderTextColor={colors.resedaGreen + '80'}
              />
              <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={styles.findRunnerBtn}
                onPress={() => router.push('/(tabs)')}
              >
                <Text style={styles.findRunnerBtnText}>Find a Runner</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.becomeRunnerBtn}
                onPress={() => router.push('/auth/register')}
              >
                <Text style={styles.becomeRunnerBtnText}>Become a Runner</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statsGrid}>
              {stats.map((stat, idx) => (
                <View key={idx} style={styles.statItem}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.howItWorks}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, idx) => (
              <View key={idx} style={styles.featureCard}>
                <Ionicons
                  name={feature.icon as any}
                  size={40}
                  color={colors.resedaGreen}
                  style={styles.featureIcon}
                />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <LinearGradient
          colors={[colors.pakistanGreen, colors.darkMoss]}
          style={styles.cta}
        >
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of users who trust ConnectUs today.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.ctaButtonText}>Create Free Account</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <View style={styles.footerBrand}>
              <Text style={styles.footerBrandTitle}>ConnectUs</Text>
              <Text style={styles.footerBrandDesc}>
                The most trusted local runner network. We make getting items from
                your favorite local shops easier and faster than ever before.
              </Text>
              <View style={styles.socialIcons}>
                {['FB', 'TW', 'IG', 'LN'].map((social) => (
                  <View key={social} style={styles.socialIcon}>
                    <Text style={styles.socialIconText}>{social}</Text>
                  </View>
                ))}
              </View>
            </View>

            {footerLinks.map((section, idx) => (
              <View key={idx} style={styles.footerSection}>
                <Text style={styles.footerSectionTitle}>{section.title}</Text>
                {section.links.map((link, linkIdx) => (
                  <TouchableOpacity
                    key={linkIdx}
                    onPress={() => {
                      if (link === 'About Our Mission') setShowAbout(true);
                      else if (link === 'Find a Runner')
                        router.push('/(tabs)');
                      else if (link === 'Become a Runner')
                        router.push('/auth/register');
                      else if (link === 'Help Center')
                        Linking.openURL('mailto:support@connectus.com');
                      // other links can be implemented similarly
                    }}
                  >
                    <Text style={styles.footerLink}>{link}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.footerBottom}>
            <Text style={styles.copyright}>
              © 2026 ConnectUs Marketplace Inc. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* About Modal */}
      <Modal visible={showAbout} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowAbout(false)}
            >
              <Ionicons name="close" size={24} color={colors.pakistanGreen} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>About ConnectUs</Text>
            <Text style={styles.modalText}>
              ConnectUs is a professional marketplace connecting people with local
              shopping assistants (Runners) using AI and secure escrow payments.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowAbout(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: colors.resedaGreen + '30',
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: colors.white, fontWeight: '600', fontSize: 20 },
  logoTitle: { fontSize: 18, fontWeight: '700', color: colors.pakistanGreen },
  logoAccent: { color: colors.resedaGreen },
  headerButtons: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  loginBtn: { color: colors.pakistanGreen, fontWeight: '500' },
  signupBtn: {
    backgroundColor: colors.pakistanGreen,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signupBtnText: { color: colors.white, fontWeight: '600' },
  banner: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  bannerTitle: { color: colors.white, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  bannerSubtitle: { color: colors.gray, fontSize: 14, textAlign: 'center', opacity: 0.9 },
  hero: { paddingHorizontal: 20, marginBottom: 40 },
  heroLeft: { marginBottom: 24 },
  badge: {
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.resedaGreen + '30',
  },
  badgeText: { color: colors.fernGreen, fontWeight: '600', fontSize: 12 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: colors.pakistanGreen, marginBottom: 12 },
  heroTitleAccent: { color: colors.resedaGreen },
  heroDesc: { fontSize: 14, color: colors.darkMoss, lineHeight: 22, marginBottom: 24 },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.resedaGreen + '30',
    marginBottom: 20,
    overflow: 'hidden',
  },
  searchInput: { flex: 1, padding: 12, fontSize: 14 },
  searchButton: {
    backgroundColor: colors.pakistanGreen,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchButtonText: { color: colors.white, fontWeight: '600' },
  heroButtons: { flexDirection: 'row', gap: 12 },
  findRunnerBtn: {
    backgroundColor: colors.pakistanGreen,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  findRunnerBtnText: { color: colors.white, fontWeight: '600' },
  becomeRunnerBtn: {
    borderWidth: 2,
    borderColor: colors.pakistanGreen,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  becomeRunnerBtnText: { color: colors.pakistanGreen, fontWeight: '600' },
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.resedaGreen + '20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statItem: {
    width: '48%',
    backgroundColor: colors.gray + '40',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: { fontSize: 24, fontWeight: '700', color: colors.fernGreen },
  statLabel: { fontSize: 12, color: colors.darkMoss, marginTop: 4 },
  howItWorks: { backgroundColor: colors.white, paddingVertical: 48, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 24, fontWeight: '700', color: colors.pakistanGreen, textAlign: 'center', marginBottom: 32 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  featureCard: {
    width: (width - 56) / 3,
    backgroundColor: colors.gray + '20',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.resedaGreen + '10',
    marginBottom: 16,
  },
  featureIcon: { marginBottom: 12 },
  featureTitle: { fontSize: 14, fontWeight: '600', color: colors.pakistanGreen, textAlign: 'center', marginBottom: 6 },
  featureDesc: { fontSize: 12, color: colors.darkMoss, textAlign: 'center' },
  cta: { paddingVertical: 48, paddingHorizontal: 20, alignItems: 'center' },
  ctaTitle: { fontSize: 24, fontWeight: '700', color: colors.white, marginBottom: 8 },
  ctaSubtitle: { fontSize: 14, color: colors.gray, marginBottom: 24, textAlign: 'center' },
  ctaButton: { backgroundColor: colors.resedaGreen, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8 },
  ctaButtonText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  footer: { backgroundColor: '#081f09', padding: 20, paddingTop: 32 },
  footerTop: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 32 },
  footerBrand: { width: '100%', marginBottom: 24 },
  footerBrandTitle: { fontSize: 24, fontWeight: '700', color: colors.white, marginBottom: 12 },
  footerBrandDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  socialIcons: { flexDirection: 'row', gap: 12 },
  socialIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.resedaGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconText: { color: colors.resedaGreen, fontSize: 12, fontWeight: '600' },
  footerSection: { width: '48%', marginBottom: 20 },
  footerSectionTitle: { fontSize: 16, fontWeight: '600', color: colors.resedaGreen, marginBottom: 16 },
  footerLink: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 12 },
  footerBottom: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 20, alignItems: 'center' },
  copyright: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.white, borderRadius: 20, padding: 24, width: '80%', maxWidth: 400, position: 'relative' },
  modalClose: { position: 'absolute', top: 12, right: 16 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: colors.pakistanGreen, textAlign: 'center', marginBottom: 12 },
  modalText: { color: colors.darkMoss, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  modalButton: { backgroundColor: colors.pakistanGreen, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalButtonText: { color: colors.white, fontWeight: '600' },
});