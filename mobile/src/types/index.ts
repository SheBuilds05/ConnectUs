export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  rating?: number;
  total_trips?: number;
  total_earnings?: number;
}

export interface Booking {
  booking_id: number;
  customer_id: number;
  runner_id?: number;
  product_description?: string;
  delivery_location: string;
  budget?: number;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  scheduled_for?: string;
  created_at: string;
  updated_at: string;
  product_image_url?: string;
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface UserStats {
  total_trips: number;
  total_earnings: number;
  average_rating: number;
  acceptance_rate: number;
  completion_rate: number;
  online_hours: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}