import { View, Text, Button } from 'react-native';

export default function AdminDashboard({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Admin Dashboard 👨‍💼</Text>

      <Text>Welcome Admin!</Text>

      <Button title="Logout" onPress={() => navigation.navigate('Landing')} />
    </View>
  );
}