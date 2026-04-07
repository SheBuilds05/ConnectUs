import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="earnings" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="explore" />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="active-orders" />
    </Stack>
  );
}
