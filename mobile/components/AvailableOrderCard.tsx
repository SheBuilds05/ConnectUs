import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

interface AvailableOrderCardProps {
  booking: {
    booking_id: string | number;
    store_name?: string;
    service_type?: string;
    price?: string | number; // Fixes ts(2322)
  };
  onAccept: (id: string | number) => void;
}

export const AvailableOrderCard = ({ booking, onAccept }: AvailableOrderCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <View style={styles.badgeRow}>
          <Text style={styles.storeBadge}>{booking.store_name?.toUpperCase() || 'STORE'}</Text>
        </View>
        <Text style={styles.title}>{booking.service_type || 'Delivery Mission'}</Text>
        <Text style={styles.price}>R {booking.price?.toString() || '0.00'}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.actionBtn} 
        onPress={() => onAccept(booking.booking_id)}
      >
        <Icon name="chevron-right" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#121212', 
    padding: 20, 
    borderRadius: 25, 
    marginBottom: 15, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 162, 200, 0.1)'
  },
  info: { flex: 1 },
  badgeRow: { marginBottom: 5 },
  storeBadge: { 
    backgroundColor: '#C8A2C8', 
    color: '#000', 
    fontSize: 9, 
    fontWeight: '900', 
    paddingHorizontal: 8, 
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '900', fontStyle: 'italic' },
  price: { color: '#C8A2C8', fontSize: 14, fontWeight: '700', marginTop: 2 },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#C8A2C8',
    justifyContent: 'center',
    alignItems: 'center'
  }
});