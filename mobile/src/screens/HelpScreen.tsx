// mobile/src/screens/HelpScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const HelpScreen = ({ navigation }: any) => {
  const faqs = [
    {
      question: 'How do I book a runner?',
      answer: 'Simply search for runners in your area, select one that fits your needs, and click "Book Now". Fill in the details and submit your booking.',
    },
    {
      question: 'How is pricing calculated?',
      answer: 'Pricing is based on distance, time, and the type of service. You\'ll see the estimated price before confirming your booking.',
    },
    {
      question: 'Can I cancel a booking?',
      answer: 'Yes, you can cancel up to 30 minutes before the scheduled time for a full refund. Cancellations after that may incur a fee.',
    },
    {
      question: 'How do I contact my runner?',
      answer: 'Once a booking is confirmed, you can chat with your runner through the in-app messaging system.',
    },
    {
      question: 'Is my payment secure?',
      answer: 'Yes, all payments are processed securely through our encrypted payment system.',
    },
  ];

  const contactOptions = [
    { icon: 'mail-outline', label: 'Email Support', value: 'support@connectus.com', action: 'mailto:support@connectus.com' },
    { icon: 'call-outline', label: 'Call Us', value: '+27 123 456 789', action: 'tel:+27123456789' },
    { icon: 'logo-whatsapp', label: 'WhatsApp', value: '+27 123 456 789', action: 'https://wa.me/27123456789' },
  ];

  const handleContact = (action: string) => {
    Linking.openURL(action);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Contact Options */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactCards}>
            {contactOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactCard}
                onPress={() => handleContact(option.action)}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name={option.icon as any} size={24} color="#2D531A" />
                </View>
                <Text style={styles.contactLabel}>{option.label}</Text>
                <Text style={styles.contactValue}>{option.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.question}>{faq.question}</Text>
              <Text style={styles.answer}>{faq.answer}</Text>
            </View>
          ))}
        </View>

        {/* Report Issue Button */}
        <TouchableOpacity style={styles.reportButton}>
          <Ionicons name="flag-outline" size={20} color="#EF4444" />
          <Text style={styles.reportButtonText}>Report an Issue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  contactSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  contactCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  contactCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 10,
    color: '#2D531A',
    fontWeight: '500',
  },
  faqSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  faqItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  question: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  answer: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  reportButtonText: {
    fontSize: 15,
    color: '#EF4444',
    fontWeight: '500',
  },
});

export default HelpScreen;