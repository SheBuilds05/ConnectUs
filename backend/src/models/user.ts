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

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role?: 'runner' | 'admin';
}

export interface UserUpdate {
  name?: string;
  avatar_url?: string | null;
  is_online?: boolean;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  rating: number;
  total_trips: number;
  total_earnings: number;
  avatar_url: string | null;
  is_online: boolean;
  created_at: Date;
}

export const toUserResponse = (user: any): UserResponse => {
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword as UserResponse;
};