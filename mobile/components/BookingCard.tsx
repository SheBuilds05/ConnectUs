import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type BookingCardProps = {
  customer: string;
  address: string;
  status?: string;
  onPress?: () => void;
};

export default function BookingCard({
  customer,
  address,
  status = "Pending",
  onPress,
}: BookingCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.customer}>{customer}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>

      <Text style={styles.address}>{address}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  customer: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    fontSize: 12,
    color: "#2563eb",
  },
  address: {
    fontSize: 14,
    color: "#6b7280",
  },
});