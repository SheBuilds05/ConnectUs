import api from './api';

export interface Runner {
  runner_id: number;
  username: string;
  email: string;
  full_name?: string;
  completed_bookings_count: number;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  address: string;
  city: string;
  postal_code: string;
  profile_photo: string;
  id_document?: string;
  id_verified: boolean;
  bio: string;
  languages: string[];
  distance?: number;
}

export interface RunnerProduct {
  product_id: number;
  runner_id: number;
  product_name: string;
  product_description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  is_available: boolean;
  created_at: string;
}

interface GetRunnersParams {
  city?: string;
  verified?: boolean;
  limit?: number;
}

export const getRunners = async (params: GetRunnersParams = {}): Promise<Runner[]> => {
  try {
    const response = await api.get('/runners', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching runners:', error);
    if (error.response?.status === 404) {
      // If endpoint doesn't exist yet, return mock data for development
      console.log('Using mock runner data');
      return getMockRunners();
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch runners');
  }
};

export const getRunnerById = async (runnerId: number): Promise<Runner> => {
  try {
    const response = await api.get(`/runners/${runnerId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching runner:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch runner details');
  }
};

export const getRunnerProducts = async (runnerId: number): Promise<RunnerProduct[]> => {
  try {
    const response = await api.get(`/runners/${runnerId}/products`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching runner products:', error);
    return [];
  }
};

export const getRunnersByCity = async (city: string): Promise<Runner[]> => {
  try {
    const response = await api.get(`/runners/city/${encodeURIComponent(city)}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching runners by city:', error);
    return [];
  }
};

export const getRunnerStats = async (runnerId: number): Promise<any> => {
  try {
    const response = await api.get(`/runners/${runnerId}/stats`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching runner stats:', error);
    return null;
  }
};

export const updateRunnerProfile = async (runnerId: number, data: Partial<Runner>): Promise<Runner> => {
  try {
    const response = await api.put(`/runners/${runnerId}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating runner profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Mock data for development until backend is ready
const getMockRunners = (): Runner[] => {
  return [
    {
      runner_id: 1,
      username: 'sarah_j',
      email: 'sarah.j@example.com',
      full_name: 'Sarah Johnson',
      completed_bookings_count: 1247,
      verification_status: 'VERIFIED',
      address: '12 Main Street, Sandton',
      city: 'Johannesburg',
      postal_code: '2196',
      profile_photo: 'https://images.unsplash.com/photo-1494790108777-467ef3b5f5f0?w=200',
      id_verified: true,
      bio: 'Experienced runner with 5+ years of delivery experience. Love helping people get what they need!',
      languages: ['English', 'Zulu']
    },
    {
      runner_id: 2,
      username: 'michael_c',
      email: 'michael.c@example.com',
      full_name: 'Michael Chen',
      completed_bookings_count: 892,
      verification_status: 'VERIFIED',
      address: '45 Oxford Road, Illovo',
      city: 'Johannesburg',
      postal_code: '2196',
      profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      id_verified: true,
      bio: 'Tech enthusiast specializing in electronics deliveries. Fast and reliable service!',
      languages: ['English', 'Mandarin']
    },
    {
      runner_id: 3,
      username: 'jessica_w',
      email: 'jessica.w@example.com',
      full_name: 'Jessica Williams',
      completed_bookings_count: 2156,
      verification_status: 'VERIFIED',
      address: '78 Beach Road, Camps Bay',
      city: 'Cape Town',
      postal_code: '8001',
      profile_photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      id_verified: true,
      bio: 'Fashion lover and personal shopper. I can help you find the perfect outfit!',
      languages: ['English', 'Afrikaans']
    },
    {
      runner_id: 4,
      username: 'david_k',
      email: 'david.k@example.com',
      full_name: 'David Kim',
      completed_bookings_count: 654,
      verification_status: 'VERIFIED',
      address: '23 Berea Road',
      city: 'Durban',
      postal_code: '4001',
      profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      id_verified: true,
      bio: 'Quick and efficient runner. Specialize in food and document deliveries.',
      languages: ['English', 'Korean']
    }
  ];
};