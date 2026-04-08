import api from './api';

export interface RunnerProfile {
  runner_id: number;
  username: string;
  email: string;
  completed_bookings_count: number;
  verification_status: string;
  city: string;
  profile_photo: string;
  bio: string;
  languages: string[];
  id_verified: boolean;
  // optional additional fields from your backend
  phone?: string;
  rating?: number;
  address?: string;
  postal_code?: string;
  expertise?: string[];
  showcase_images?: string[];
  created_at?: string;
}

export interface Product {
  product_id: number;
  runner_id: number;
  category_id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  category_name?: string;
}

// Set to false to use real API
const USE_MOCK_DATA = false;

// --------------------------------------------------------------
// 1. GET ALL RUNNERS – uses your deployed endpoint /api/runners
// --------------------------------------------------------------
export const getRunners = async (params?: {
  lat?: number;
  lng?: number;
  category?: string;
  search?: string;
}): Promise<RunnerProfile[]> => {
  if (USE_MOCK_DATA) {
    console.log('🔁 Using mock runner data');
    return getMockRunners();
  }

  try {
    // ✅ CORRECT ENDPOINT: /runners (not /runnerprofile)
    const response = await api.get('/runners', { params });
    console.log('✅ Runners API success:', response.status);

    // Your backend returns a direct array (as shown in localhost)
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // fallback for wrapped responses
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error: any) {
    console.error('❌ Error fetching runners:', error.message);
    return []; // Return empty array – do not fallback to mock to avoid confusion
  }
};

// --------------------------------------------------------------
// 2. GET SINGLE RUNNER BY ID
// --------------------------------------------------------------
export const getRunnerById = async (runnerId: number): Promise<RunnerProfile | null> => {
  if (USE_MOCK_DATA) {
    return getMockRunners().find(r => r.runner_id === runnerId) || null;
  }

  try {
    const response = await api.get(`/runners/${runnerId}`);
    return response.data?.data || response.data;
  } catch (error: any) {
    console.error(`❌ Error fetching runner ${runnerId}:`, error.message);
    return null;
  }
};

// --------------------------------------------------------------
// 3. GET RUNNER PRODUCTS (if endpoint exists)
// --------------------------------------------------------------
export const getRunnerProducts = async (runnerId: number): Promise<Product[]> => {
  if (USE_MOCK_DATA) {
    return getMockProducts(runnerId);
  }

  try {
    // Try common endpoints – adjust to match your backend
    let products: any[] = [];
    try {
      const response = await api.get(`/runners/${runnerId}/products`);
      products = response.data?.data || response.data || [];
    } catch {
      // fallback – maybe products are separate
      const response = await api.get(`/products?runner_id=${runnerId}`);
      products = response.data?.data || response.data || [];
    }
    return Array.isArray(products) ? products : [];
  } catch (error: any) {
    console.error(`❌ Error fetching products for runner ${runnerId}:`, error.message);
    return [];
  }
};

// ========== MOCK DATA (only used if USE_MOCK_DATA = true) ==========
const getMockRunners = (): RunnerProfile[] => {
  return [
    {
      runner_id: 1,
      username: 'sarah_j',
      email: 'sarah.j@example.com',
      completed_bookings_count: 1247,
      verification_status: 'VERIFIED',
      city: 'Johannesburg',
      profile_photo: 'https://images.unsplash.com/photo-1494790108777-467ef3b5f5f0?w=200',
      bio: 'Experienced runner with 5+ years of delivery experience. Love helping people get what they need!',
      languages: ['English', 'Zulu'],
      id_verified: true,
    },
    {
      runner_id: 2,
      username: 'michael_c',
      email: 'michael.c@example.com',
      completed_bookings_count: 892,
      verification_status: 'VERIFIED',
      city: 'Johannesburg',
      profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      bio: 'Tech enthusiast specializing in electronics deliveries. Fast and reliable service!',
      languages: ['English', 'Mandarin'],
      id_verified: true,
    },
    {
      runner_id: 3,
      username: 'jessica_w',
      email: 'jessica.w@example.com',
      completed_bookings_count: 2156,
      verification_status: 'VERIFIED',
      city: 'Cape Town',
      profile_photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      bio: 'Fashion lover and personal shopper. I can help you find the perfect outfit!',
      languages: ['English', 'Afrikaans'],
      id_verified: true,
    },
    {
      runner_id: 4,
      username: 'david_k',
      email: 'david.k@example.com',
      completed_bookings_count: 654,
      verification_status: 'VERIFIED',
      city: 'Durban',
      profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      bio: 'Quick and efficient runner. Specialize in food and document deliveries.',
      languages: ['English', 'Korean'],
      id_verified: true,
    },
  ];
};

const getMockProducts = (runnerId: number): Product[] => {
  const mockProducts: Record<number, Product[]> = {
    1: [
      {
        product_id: 101,
        runner_id: 1,
        category_id: 5,
        title: 'Fresh Grocery Box',
        description: 'Assorted fresh fruits and vegetables',
        image_url: 'https://picsum.photos/id/108/200/150',
        price: 85,
        category_name: 'Groceries',
      },
    ],
    2: [
      {
        product_id: 201,
        runner_id: 2,
        category_id: 6,
        title: 'Latest Smartphone',
        description: 'Brand new smartphone with warranty',
        image_url: 'https://picsum.photos/id/0/200/150',
        price: 4999,
        category_name: 'Electronics',
      },
    ],
  };
  return mockProducts[runnerId] || [];
};