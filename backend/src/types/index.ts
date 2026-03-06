export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'runner' | 'admin';
  avatar_url: string | null;
  is_online: boolean;
  rating: number;
  total_trips: number;
  total_earnings: number;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: number;
  order_number: string;
  restaurant_name: string;
  restaurant_address: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string | null;
  items: string[];
  total_amount: number;
  distance: number;
  estimated_time: number;
  payout: number;
  status: 'available' | 'accepted' | 'picking-up' | 'delivering' | 'delivered' | 'cancelled';
  assigned_to: number | null;
  assigned_at: Date | null;
  picked_up_at: Date | null;
  delivered_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  id: number;
  order_id: number;
  user_id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  avatar_url: string | null;
  created_at: Date;
}

export interface Earnings {
  id: number;
  user_id: number;
  order_id: number;
  amount: number;
  type: 'order' | 'bonus' | 'withdrawal';
  status: 'pending' | 'completed' | 'failed';
  created_at: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthRequest extends Express.Request {
  user?: Omit<User, 'password_hash'>;
}

export interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}