import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const runners = [
  { id: '1', name: 'John Doe', rating: 4.8, price: 25 },
  { id: '2', name: 'Jane Smith', rating: 4.9, price: 30 },
  { id: '3', name: 'Mike Johnson', rating: 4.7, price: 20 },
];

export default function ExploreScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <FlatList
        data={runners}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push(`/runner/${item.id}`)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text>⭐ {item.rating}</Text>
            <Text style={styles.price}>R{item.price}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#007AFF', marginTop: 5 },
});