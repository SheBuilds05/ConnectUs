import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = 'https://oentvlyiqwtxmrvtqtpy.supabase.co';
// Be sure to use your actual anon key from the Supabase dashboard
const supabaseAnonKey = 'YOUR_ANON_KEY'; 

// This helper function safely picks the right storage
const getStorage = () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      return window.localStorage;
    }
    // Return a dummy storage for the server-side pass
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return AsyncStorage;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});