import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// 1. Make sure the function is named "Landing"
function Landing() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>Welcome to ConnectUs</Text>
      {/* Your other code... */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

// 2. This must match the function name above exactly
export default Landing;