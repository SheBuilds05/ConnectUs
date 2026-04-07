// src/services/runnerService.ts
import api from './api';
import { Runner, RunnerProduct } from '../types';

export interface GetRunnersParams {
  city?: string;
  verified?: boolean;
  limit?: number;
  lat?: number;
  lng?: number;
  category?: string;
  search?: string;
}

// Flag to use mock data when backend is unavailable
const USE_MOCK_DATA = false; // ✅ Using real backend data

export const getRunners = async (params: GetRunnersParams = {}): Promise<Runner[]> => {
  console.log('🚀 getRunners called with USE_MOCK_DATA =', USE_MOCK_DATA);
  console.log('📝 Params received:', JSON.stringify(params, null, 2));
  
  // Use mock data for development
  if (USE_MOCK_DATA) {
    console.log('📱 Using mock runner data (development mode)');
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockData = getMockRunners();
    console.log('✅ Returning mock runners count:', mockData.length);
    return mockData;
  }

  try {
    console.log('🌐 Attempting to fetch from REAL backend...');
    console.log('🔗 API endpoint: /runners');
    console.log('📦 Request params:', params);
    
    const response = await api.get('/runners', { params });
    
    console.log('📡 Response status:', response.status);
    console.log('📊 Response data length:', response.data?.length);
    
    if (response.data && Array.isArray(response.data)) {
      console.log('✅ Successfully received', response.data.length, 'runners from REAL backend');
      if (response.data.length > 0) {
        console.log('📝 Sample runner from backend:', {
          id: response.data[0].runner_id,
          username: response.data[0].username,
          city: response.data[0].city
        });
      }
      return response.data;
    } else {
      console.warn('⚠️ Unexpected response format:', response.data);
      return [];
    }
  } catch (error: any) {
    console.error('❌ REAL BACKEND ERROR:');
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('🔄 Falling back to mock data due to backend error');
    const mockData = getMockRunners();
    console.log('✅ Returning mock runners count:', mockData.length);
    return mockData;
  }
};

export const getRunnerById = async (runnerId: number): Promise<Runner> => {
  console.log(`🚀 getRunnerById called for ID: ${runnerId}, USE_MOCK_DATA = ${USE_MOCK_DATA}`);
  
  if (USE_MOCK_DATA) {
    console.log(`📱 Using mock runner data for ID: ${runnerId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockRunner = getMockRunners().find(r => r.runner_id === runnerId);
    if (!mockRunner) {
      console.error(`❌ Mock runner with ID ${runnerId} not found`);
      throw new Error('Runner not found');
    }
    console.log(`✅ Found mock runner: ${mockRunner.username}`);
    return mockRunner;
  }

  try {
    console.log(`🌐 Fetching runner ${runnerId} from REAL backend...`);
    const response = await api.get(`/runners/${runnerId}`);
    console.log(`✅ Successfully fetched runner ${runnerId} from backend:`, response.data?.username);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error fetching runner ${runnerId} from backend:`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    } else {
      console.error(`Message: ${error.message}`);
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch runner details');
  }
};

export const getRunnerProducts = async (runnerId: number): Promise<RunnerProduct[]> => {
  console.log(`🚀 getRunnerProducts called for runner ${runnerId}, USE_MOCK_DATA = ${USE_MOCK_DATA}`);
  
  if (USE_MOCK_DATA) {
    console.log(`📱 Using mock products for runner: ${runnerId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    const products = getMockProducts(runnerId);
    console.log(`✅ Returning ${products.length} mock products for runner ${runnerId}`);
    return products;
  }

  try {
    console.log(`🌐 Fetching products for runner ${runnerId} from REAL backend...`);
    const response = await api.get(`/runners/${runnerId}/products`);
    console.log(`✅ Successfully fetched ${response.data?.length || 0} products for runner ${runnerId}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error fetching products for runner ${runnerId}:`, error.message);
    return [];
  }
};

export const getRunnersByCity = async (city: string): Promise<Runner[]> => {
  console.log(`🚀 getRunnersByCity called for city: ${city}, USE_MOCK_DATA = ${USE_MOCK_DATA}`);
  
  if (USE_MOCK_DATA) {
    console.log(`📱 Using mock runners for city: ${city}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const filtered = getMockRunners().filter(r => 
      r.city.toLowerCase().includes(city.toLowerCase())
    );
    console.log(`✅ Found ${filtered.length} mock runners in ${city}`);
    return filtered;
  }

  try {
    console.log(`🌐 Fetching runners in ${city} from REAL backend...`);
    const response = await api.get(`/runners/city/${encodeURIComponent(city)}`);
    console.log(`✅ Successfully fetched ${response.data?.length || 0} runners in ${city}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error fetching runners by city ${city}:`, error.message);
    return [];
  }
};

export const getRunnerStats = async (runnerId: number): Promise<any> => {
  console.log(`🚀 getRunnerStats called for runner ${runnerId}, USE_MOCK_DATA = ${USE_MOCK_DATA}`);
  
  if (USE_MOCK_DATA) {
    const statsMap: Record<number, any> = {
      1: {
        total_earnings: 12500,
        completed_bookings: 238,
        avg_rating: 4.9,
        response_time: 15,
        completion_rate: 98,
        total_hours: 342,
      },
      2: {
        total_earnings: 8900,
        completed_bookings: 156,
        avg_rating: 4.8,
        response_time: 12,
        completion_rate: 97,
        total_hours: 234,
      },
      3: {
        total_earnings: 15600,
        completed_bookings: 312,
        avg_rating: 4.9,
        response_time: 18,
        completion_rate: 99,
        total_hours: 456,
      },
    };
    
    const stats = statsMap[runnerId] || {
      total_earnings: 10500,
      completed_bookings: 200,
      avg_rating: 4.8,
      response_time: 15,
      completion_rate: 98,
      total_hours: 300,
    };
    console.log(`📱 Returning mock stats for runner ${runnerId}:`, stats);
    return stats;
  }

  try {
    console.log(`🌐 Fetching stats for runner ${runnerId} from REAL backend...`);
    const response = await api.get(`/runners/${runnerId}/stats`);
    console.log(`✅ Successfully fetched stats for runner ${runnerId}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error fetching stats for runner ${runnerId}:`, error.message);
    return null;
  }
};

export const updateRunnerProfile = async (runnerId: number, data: Partial<Runner>): Promise<Runner> => {
  console.log(`🚀 updateRunnerProfile called for runner ${runnerId}, USE_MOCK_DATA = ${USE_MOCK_DATA}`);
  console.log('📝 Update data:', data);
  
  if (USE_MOCK_DATA) {
    console.log(`📱 Mock update for runner: ${runnerId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockRunner = getMockRunners().find(r => r.runner_id === runnerId);
    if (!mockRunner) {
      console.error(`❌ Mock runner with ID ${runnerId} not found`);
      throw new Error('Runner not found');
    }
    const updated = { ...mockRunner, ...data };
    console.log(`✅ Mock update completed for runner ${runnerId}`);
    return updated;
  }

  try {
    console.log(`🌐 Updating runner ${runnerId} profile on REAL backend...`);
    const response = await api.put(`/runners/${runnerId}`, data);
    console.log(`✅ Successfully updated runner ${runnerId} profile`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error updating runner profile ${runnerId}:`, error.message);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const getFeaturedRunners = async (limit: number = 4): Promise<Runner[]> => {
  console.log(`🚀 getFeaturedRunners called with limit: ${limit}, USE_MOCK_DATA = ${USE_MOCK_DATA}`);
  
  if (USE_MOCK_DATA) {
    console.log('📱 Using mock featured runners');
    await new Promise(resolve => setTimeout(resolve, 500));
    const featured = getMockRunners().slice(0, limit);
    console.log(`✅ Returning ${featured.length} mock featured runners`);
    return featured;
  }

  try {
    console.log(`🌐 Fetching ${limit} featured runners from REAL backend...`);
    const response = await api.get('/runners/featured', { params: { limit } });
    console.log(`✅ Successfully fetched ${response.data?.length || 0} featured runners`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching featured runners:', error.message);
    return [];
  }
};

export const getNearbyRunners = async (
  lat: number, 
  lng: number, 
  radius: number = 5
): Promise<Runner[]> => {
  console.log(`🚀 getNearbyRunners called with lat: ${lat}, lng: ${lng}, radius: ${radius}, USE_MOCK_DATA = ${USE_MOCK_DATA}`);
  
  if (USE_MOCK_DATA) {
    console.log('📱 Using mock nearby runners');
    await new Promise(resolve => setTimeout(resolve, 600));
    const nearby = getMockRunners().map(runner => ({
      ...runner,
      distance: Math.random() * radius,
    }));
    console.log(`✅ Returning ${nearby.length} mock nearby runners`);
    return nearby;
  }

  try {
    console.log('🌐 Fetching nearby runners from REAL backend...');
    const response = await api.get('/runners/nearby', {
      params: { lat, lng, radius }
    });
    console.log(`✅ Successfully fetched ${response.data?.length || 0} nearby runners`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error fetching nearby runners:', error.message);
    return [];
  }
};

export const searchRunners = async (query: string): Promise<Runner[]> => {
  console.log(`🚀 searchRunners called with query: "${query}", USE_MOCK_DATA = ${USE_MOCK_DATA}`);
  
  if (USE_MOCK_DATA) {
    console.log(`📱 Searching mock runners for: "${query}"`);
    await new Promise(resolve => setTimeout(resolve, 400));
    const results = getMockRunners().filter(runner =>
      runner.username.toLowerCase().includes(query.toLowerCase()) ||
      runner.bio.toLowerCase().includes(query.toLowerCase()) ||
      runner.city.toLowerCase().includes(query.toLowerCase())
    );
    console.log(`✅ Found ${results.length} mock runners matching "${query}"`);
    return results;
  }

  try {
    console.log(`🌐 Searching runners for "${query}" on REAL backend...`);
    const response = await api.get('/runners/search', {
      params: { q: query }
    });
    console.log(`✅ Successfully found ${response.data?.length || 0} runners matching "${query}"`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Error searching runners for "${query}":`, error.message);
    return [];
  }
};

// Mock products for development (kept for fallback)
const getMockProducts = (runnerId: number): RunnerProduct[] => {
  const productsByRunner: Record<number, RunnerProduct[]> = {
    1: [
      {
        product_id: 101,
        runner_id: 1,
        product_name: 'Fresh Vegetable Basket',
        product_description: 'Assorted fresh vegetables from local market.',
        price: 85,
        category: 'Grocery',
        condition: 'new',
        images: [],
        is_available: true,
        created_at: new Date().toISOString(),
      },
      {
        product_id: 102,
        runner_id: 1,
        product_name: 'Organic Fruit Pack',
        product_description: 'Seasonal organic fruits.',
        price: 120,
        category: 'Grocery',
        condition: 'new',
        images: [],
        is_available: true,
        created_at: new Date().toISOString(),
      },
    ],
    2: [
      {
        product_id: 201,
        runner_id: 2,
        product_name: 'Laptop Repair Service',
        product_description: 'Professional laptop repair and maintenance.',
        price: 350,
        category: 'Tech',
        condition: 'service',
        images: [],
        is_available: true,
        created_at: new Date().toISOString(),
      },
    ],
    3: [
      {
        product_id: 301,
        runner_id: 3,
        product_name: 'Personal Shopping Session',
        product_description: '2-hour personal shopping assistance.',
        price: 250,
        category: 'Fashion',
        condition: 'service',
        images: [],
        is_available: true,
        created_at: new Date().toISOString(),
      },
    ],
  };
  
  return productsByRunner[runnerId] || [];
};

// Mock runners data for development (kept for fallback)
const getMockRunners = (): Runner[] => {
  return [
    {
      runner_id: 1,
      username: 'Lindiwe M.',
      email: 'lindiwe@example.com',
      full_name: 'Lindiwe Mkhize',
      completed_bookings_count: 238,
      verification_status: 'VERIFIED',
      address: '12 Main Street, Sandton',
      city: 'Johannesburg',
      postal_code: '2196',
      profile_photo: '',
      id_verified: true,
      bio: 'Expert shopper with 3+ years experience.',
      languages: ['English', 'Zulu'],
      distance: 1.2,
    },
    {
      runner_id: 2,
      username: 'Sipho K.',
      email: 'sipho@example.com',
      full_name: 'Sipho Khumalo',
      completed_bookings_count: 156,
      verification_status: 'VERIFIED',
      address: '45 Oxford Road, Illovo',
      city: 'Johannesburg',
      postal_code: '2196',
      profile_photo: '',
      id_verified: true,
      bio: 'Tech enthusiast. Fast and reliable!',
      languages: ['English', 'Zulu'],
      distance: 2.5,
    },
    {
      runner_id: 3,
      username: 'Thandi N.',
      email: 'thandi@example.com',
      full_name: 'Thandi Ndlovu',
      completed_bookings_count: 312,
      verification_status: 'VERIFIED',
      address: '78 Vilakazi Street, Orlando West',
      city: 'Johannesburg',
      postal_code: '1809',
      profile_photo: '',
      id_verified: true,
      bio: 'Personal stylist and shopper.',
      languages: ['English', 'Zulu', 'Sotho'],
      distance: 0.8,
    },
    {
      runner_id: 4,
      username: 'Marcus J.',
      email: 'marcus@example.com',
      full_name: 'Marcus Johnson',
      completed_bookings_count: 189,
      verification_status: 'VERIFIED',
      address: '23 Berea Road',
      city: 'Johannesburg',
      postal_code: '4001',
      profile_photo: '',
      id_verified: true,
      bio: 'Efficient and reliable.',
      languages: ['English'],
      distance: 1.8,
    },
    {
      runner_id: 5,
      username: 'Nosipho D.',
      email: 'nosipho@example.com',
      full_name: 'Nosipho Dlamini',
      completed_bookings_count: 156,
      verification_status: 'VERIFIED',
      address: '56 Pretoria Street',
      city: 'Johannesburg',
      postal_code: '0002',
      profile_photo: '',
      id_verified: true,
      bio: 'Beauty expert.',
      languages: ['English', 'Zulu'],
      distance: 2.1,
    },
    {
      runner_id: 6,
      username: 'James M.',
      email: 'james@example.com',
      full_name: 'James Mokoena',
      completed_bookings_count: 203,
      verification_status: 'VERIFIED',
      address: '89 Vilakazi Street',
      city: 'Johannesburg',
      postal_code: '1809',
      profile_photo: '',
      id_verified: true,
      bio: 'Quick and thorough.',
      languages: ['English', 'Zulu', 'Sotho'],
      distance: 3.0,
    },
  ];
};

export default {
  getRunners,
  getRunnerById,
  getRunnerProducts,
  getRunnersByCity,
  getRunnerStats,
  updateRunnerProfile,
  getFeaturedRunners,
  getNearbyRunners,
  searchRunners,
};