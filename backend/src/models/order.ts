export type OrderStatus = 'available' | 'accepted' | 'picking-up' | 'delivering' | 'delivered' | 'cancelled';

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
  status: OrderStatus;
  assigned_to: number | null;
  assigned_at: Date | null;
  picked_up_at: Date | null;
  delivered_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface OrderCreate {
  order_number: string;
  restaurant_name: string;
  restaurant_address: string;
  customer_name: string;
  customer_address: string;
  customer_phone?: string;
  items: string[];
  total_amount: number;
  distance: number;
  estimated_time: number;
  payout: number;
}

export interface OrderUpdate {
  status?: OrderStatus;
  assigned_to?: number | null;
  assigned_at?: Date | null;
  picked_up_at?: Date | null;
  delivered_at?: Date | null;
}

export interface OrderResponse extends Omit<Order, 'assigned_to'> {
  assigned_to?: {
    id: number;
    name: string;
    rating: number;
  } | null;
}