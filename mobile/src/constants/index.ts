// src/constants/index.ts

import { QuickAction } from '../types';

export const QUICK_ACTIONS: QuickAction[] = [
  { title: 'Available Orders', icon: '📦', route: '/runner/orders', color: '#007AFF' },
  { title: 'Active Deliveries', icon: '🚚', route: '/runner/active-orders', color: '#34C759' },
  { title: 'Earnings', icon: '💰', route: '/runner/earnings', color: '#FF9500' },
  { title: 'My Profile', icon: '👤', route: '/runner/profile', color: '#5856D6' },
];

export const COLORS = {
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#5856D6',
  dark: '#000000',
  light: '#FFFFFF',
  gray: '#8E8E93',
  lightGray: '#E5E5EA',
  background: '#F8F9FA',
};

export const VEHICLE_TYPES = ['Motorcycle', 'Bicycle', 'Car', 'Scooter'] as const;

export const ORDER_STATUS = {
  available: 'Available',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
} as const;