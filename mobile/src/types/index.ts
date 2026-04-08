// src/types/index.ts
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
  rating?: number;
  distance?: number;
  phone?: string;
  created_at?: string;
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

export interface Category {
  id: number;
  name: string;
  icon: string;
  count?: number;
}

export interface Booking {
  booking_id: number;
  runner_id: number;
  customer_id: number;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  total_amount: number;
  booking_date: string;
  delivery_address?: string;
  created_at?: string;
}

export interface User {
  user_id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'runner' | 'admin';
  created_at?: string;
}

export interface Review {
  review_id: number;
  booking_id: number;
  customer_id: number;
  runner_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}