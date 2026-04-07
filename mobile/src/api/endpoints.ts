import { api } from './client';

export const authAPI = {
  login: (email: string, password: string) => {
    return Promise.resolve({
      data: {
        success: true,
        data: {
          token: 'mock-token',
          user: { id: 1, name: 'Test User', email: email, role: 'runner' }
        }
      }
    });
  },
  register: (data: any) => {
    return Promise.resolve({
      data: {
        success: true,
        data: {
          token: 'mock-token',
          user: { id: 1, name: data.name, email: data.email, role: 'runner' }
        }
      }
    });
  },
};

export const bookingsAPI = {
  getAvailable: () => Promise.resolve({ data: { success: true, data: [] } }),
  getMyBookings: (status?: string) => Promise.resolve({ data: { success: true, data: [] } }),
  accept: (bookingId: number) => Promise.resolve({ data: { success: true } }),
  updateStatus: (bookingId: number, status: string) => Promise.resolve({ data: { success: true } }),
  startDelivery: (bookingId: number) => Promise.resolve({ data: { success: true } }),
  completeDelivery: (bookingId: number) => Promise.resolve({ data: { success: true } }),
};

export const userAPI = {
  getStats: () => Promise.resolve({ 
    data: { 
      success: true, 
      data: { total_earnings: 4250, total_trips: 124, average_rating: 4.9 } 
    } 
  }),
  getProfile: () => Promise.resolve({ data: { success: true, data: {} } }),
  updateProfile: (data: any) => Promise.resolve({ data: { success: true } }),
};

export const earningsAPI = {
  getEarnings: (period?: string) => Promise.resolve({ data: { success: true, data: { today: 85, week: 450, month: 1850 } } }),
};
