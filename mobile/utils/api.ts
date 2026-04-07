// Important: Replace with your actual IPv4 address from ipconfig
const BASE_URL = 'http://192.168.1.xxx:5000/api'; 

export const loginUserAPI = async (email: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  } catch (error: any) {
    console.error("API Login Error:", error);
    throw error;
  }
};