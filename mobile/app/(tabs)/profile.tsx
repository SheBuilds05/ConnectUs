import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.email}>john@example.com</Text>
      
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => router.push('/favorites')}
      >
        <Text>Favorites</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => router.push('/wallet')}
      >
        <Text>Wallet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  email: { fontSize: 14, color: '#666', marginBottom: 20 },
  menuItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10 },
});