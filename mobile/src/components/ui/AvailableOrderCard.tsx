import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Booking {
  booking_id: number;
  store_name: string;
  service_type: string;
  price: number;
}

interface AvailableOrderCardProps {
  booking: Booking;
  onAccept: (id: number) => void;
}

const AvailableOrderCard: React.FC<AvailableOrderCardProps> = ({ booking, onAccept }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.storeName}>{booking.store_name}</Text>
      <Text style={styles.serviceType}>{booking.service_type}</Text>
      <Text style={styles.price}>R{booking.price.toFixed(2)}</Text>
      <TouchableOpacity style={styles.acceptButton} onPress={() => onAccept(booking.booking_id)}>
        <Text style={styles.acceptText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  storeName: {
    color: '#C8A2C8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceType: {
    color: '#FFF',
    fontSize: 14,
  },
  price: {
    color: '#C8A2C8',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  acceptButton: {
    backgroundColor: '#C8A2C8',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  acceptText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default AvailableOrderCard;
