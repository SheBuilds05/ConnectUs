import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Helper to detect if we are on web
const isWeb = Platform.OS === 'web';

/**
 * Save token for a role
 * @param role 'admin' | 'runner' | 'customer'
 * @param token string
 */
export async function setToken(role: string, token: string) {
  if (isWeb) {
    localStorage.setItem(role, token);
  } else {
    await SecureStore.setItemAsync(role, token);
  }
}

/**
 * Get token for a role
 * @param role 'admin' | 'runner' | 'customer'
 * @returns token string or null
 */
export async function getToken(role: string): Promise<string | null> {
  if (isWeb) {
    const token = localStorage.getItem(role);
    return token ? token : null;
  } else {
    return await SecureStore.getItemAsync(role);
  }
}

/**
 * Remove token for a role
 * @param role 'admin' | 'runner' | 'customer'
 */
export async function removeToken(role: string) {
  if (isWeb) {
    localStorage.removeItem(role);
  } else {
    await SecureStore.deleteItemAsync(role);
  }
}