import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        {/* Main Tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Screens that are not in tabs */}
        <Stack.Screen name="create-booking" options={{ title: 'Create Booking', headerShown: true }} />
        <Stack.Screen name="order/track" options={{ title: 'Track Order', headerShown: true }} />
        <Stack.Screen name="wallet" options={{ title: 'Wallet', headerShown: true }} />
        <Stack.Screen name="runner/[id]" options={{ title: 'Runner Details', headerShown: true }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}