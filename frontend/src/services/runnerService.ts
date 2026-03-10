// src/services/runnerService.ts
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
  phone?: string;
  created_at?: string;
}

export interface RunnerProduct {
  product_id: number;
  runner_id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category_id?: number;
  category_name?: string;
}

interface GetRunnersParams {
  lat?: number;
  lng?: number;
  city?: string;
  category?: string;
  search?: string;
  verified?: boolean;
  limit?: number;
}

export const getRunners = async (params: GetRunnersParams = {}): Promise<Runner[]> => {
  try {
    const response = await api.get('/runners', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching runners:', error);
    // Return mock data for development
    return getMockRunners();
  }
};

export const getRunnerById = async (runnerId: number): Promise<Runner> => {
  try {
    const response = await api.get(`/runners/${runnerId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching runner:', error);
    // Return mock runner by ID
    const mockRunners = getMockRunners();
    const runner = mockRunners.find(r => r.runner_id === runnerId);
    if (runner) return runner;
    throw new Error('Runner not found');
  }
};

// UPDATED: Use the new products endpoint
export const getRunnerProducts = async (runnerId: number): Promise<RunnerProduct[]> => {
  try {
    // Use the new products endpoint we created
    const response = await api.get(`/products/runner/${runnerId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching runner products:', error);
    // Return empty array if error
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

// Mock data for development (fallback if API fails)
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
      bio: 'Experienced runner with 5+ years of delivery experience. Love helping people get what they need! I specialize in food delivery and grocery shopping.',
      languages: ['English', 'Zulu'],
      phone: '+27 71 234 5678',
      created_at: '2024-01-15T10:30:00Z'
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
      bio: 'Tech enthusiast specializing in electronics deliveries. Fast and reliable service! I handle all your tech needs.',
      languages: ['English', 'Mandarin'],
      phone: '+27 72 345 6789',
      created_at: '2024-01-20T09:15:00Z'
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
      bio: 'Fashion lover and personal shopper. I can help you find the perfect outfit! Available for shopping and deliveries in Cape Town.',
      languages: ['English', 'Afrikaans'],
      phone: '+27 73 456 7890',
      created_at: '2023-11-05T14:20:00Z'
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
      bio: 'Quick and efficient runner. Specialize in food and document deliveries. Always on time!',
      languages: ['English', 'Korean'],
      phone: '+27 74 567 8901',
      created_at: '2024-02-10T08:45:00Z'
    },
    {
      runner_id: 5,
      username: 'amanda_n',
      email: 'amanda.n@example.com',
      full_name: 'Amanda Ndlovu',
      completed_bookings_count: 1876,
      verification_status: 'VERIFIED',
      address: '56 Pretoria Street',
      city: 'Pretoria',
      postal_code: '0002',
      profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      id_verified: true,
      bio: 'Professional shopper with a passion for helping others. I love grocery shopping and finding the best deals!',
      languages: ['English', 'Zulu', 'Sotho'],
      phone: '+27 75 678 9012',
      created_at: '2023-12-01T11:10:00Z'
    },
    {
      runner_id: 6,
      username: 'thabo_m',
      email: 'thabo.m@example.com',
      full_name: 'Thabo Mbeki',
      completed_bookings_count: 432,
      verification_status: 'VERIFIED',
      address: '89 Vilakazi Street, Orlando West',
      city: 'Soweto',
      postal_code: '1809',
      profile_photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
      id_verified: true,
      bio: 'Your friendly neighborhood runner. Available for all your daily needs! Quick responses and friendly service.',
      languages: ['English', 'Zulu', 'Sotho'],
      phone: '+27 76 789 0123',
      created_at: '2024-02-25T13:40:00Z'
    },
    {
      runner_id: 7,
      username: 'priya_p',
      email: 'priya.p@example.com',
      full_name: 'Priya Patel',
      completed_bookings_count: 987,
      verification_status: 'VERIFIED',
      address: '34 Florida Road',
      city: 'Durban',
      postal_code: '4001',
      profile_photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200',
      id_verified: true,
      bio: 'I specialize in quick food deliveries and pharmacy pickups. Always on time and careful with your items!',
      languages: ['English', 'Hindi', 'Tamil'],
      phone: '+27 77 890 1234',
      created_at: '2024-01-05T16:30:00Z'
    },
    {
      runner_id: 8,
      username: 'john_d',
      email: 'john.d@example.com',
      full_name: 'John Doe',
      completed_bookings_count: 321,
      verification_status: 'PENDING',
      address: '123 Long Street',
      city: 'Cape Town',
      postal_code: '8001',
      profile_photo: 'https://images.unsplash.com/photo-1531427186627-2fd044ec7e1c?w=200',
      id_verified: false,
      bio: 'New but enthusiastic runner! Ready to help with any small deliveries. Building my reputation one delivery at a time.',
      languages: ['English'],
      phone: '+27 78 901 2345',
      created_at: '2024-03-01T09:00:00Z'
    },
    {
      runner_id: 9,
      username: 'khensani34',
      email: 'nkhensani.manganye@capaciti.org.za',
      full_name: 'Khensani Manganye',
      completed_bookings_count: 0,
      verification_status: 'PENDING',
      address: '76 amershoff',
      city: 'johannesburg',
      postal_code: '2000',
      profile_photo: '',
      id_verified: false,
      bio: 'your wish is my command',
      languages: ['English'],
      phone: '0609330637',
      created_at: '2024-03-09T00:00:00Z'
    },
    {
      runner_id: 10,
      username: 'rose',
      email: 'rose@gmail.com',
      full_name: 'Rose',
      completed_bookings_count: 0,
      verification_status: 'PENDING',
      address: '76 Biirch street',
      city: 'Pretoria',
      postal_code: '0001',
      profile_photo: '',
      id_verified: false,
      bio: '',
      languages: ['English'],
      phone: '0697535599',
      created_at: '2024-03-09T00:00:00Z'
    },
    {
      runner_id: 11,
      username: 'Deolyn',
      email: 'deolyneast@gmail.com',
      full_name: 'Deolyn',
      completed_bookings_count: 0,
      verification_status: 'PENDING',
      address: '1111 goose close',
      city: 'Pretoria',
      postal_code: '1724',
      profile_photo: '',
      id_verified: false,
      bio: '',
      languages: ['English'],
      phone: '0813480409',
      created_at: '2024-03-09T00:00:00Z'
    }
  ];
};