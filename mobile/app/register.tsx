import { View, TextInput, Button, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    console.log(email, password);

    router.push('/login');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Register</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginVertical: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginVertical: 10 }}
      />

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}