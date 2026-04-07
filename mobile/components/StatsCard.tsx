import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type StatsCardProps = {
  title: string;
  value: string | number;
};

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 3,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray800,
  },
  title: {
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 4,
  },
});