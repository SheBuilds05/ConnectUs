import AsyncStorage from '@react-native-async-storage/async-storage';

// Standardized names
export const setToken = async (token: string) => {
  await AsyncStorage.setItem('userToken', token);
};

export const setUserRole = async (role: string) => {
  await AsyncStorage.setItem('userRole', role);
};

// Arguments made optional (?) to stop the "Expected 0, got 1" errors
export const getToken = async (key?: string) => {
  return await AsyncStorage.getItem('userToken');
};

export const getUserRole = async () => {
  return await AsyncStorage.getItem('userRole');
};

export const removeToken = async (key?: string) => {
  await AsyncStorage.removeItem('userToken');
  await AsyncStorage.removeItem('userRole');
};

// --- ALIASES TO PREVENT ERRORS IN LOGIN.TSX ---
export const storeToken = setToken;
export const storeData = setUserRole;
export const getData = getUserRole;