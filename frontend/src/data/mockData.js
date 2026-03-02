// src/data/mockData.js

export const categories = [
  { id: 1, name: 'food', iconName: 'ShoppingBasket' },
  { id: 2, name: 'Beauty', iconName: 'Sparkles' },
  { id: 3, name: 'Tech', iconName: 'Laptop' },
  { id: 4, name: 'Fashion', iconName: 'Shirt' },
  { id: 5, name: 'Gifts', iconName: 'Gift' },
];

export const runners = [
  {
    id: 1,
    name: 'Lindiwe M.',
    rating: 4.9,
    specialties: ['food', 'Beauty'],
    hourlyRate: 85,
    distance: 1.2,
    verified: true,
    bio: 'Professional shopper with 3+ years experience. Expert in sourcing fresh local produce and organic skincare.',
    completed: 238,
    pastProducts: [
      { id: 1, name: 'Fresh Produce', category: 'food' },
      { id: 2, name: 'Cosmetics', category: 'Beauty' },
      { id: 3, name: 'Household', category: 'food' }
    ],
    availability: ['Today 2PM', 'Today 4PM', 'Tomorrow 10AM']
  },
  {
    id: 2,
    name: 'Sipho K.',
    rating: 4.8,
    specialties: ['Tech', 'food'],
    hourlyRate: 95,
    distance: 2.5,
    verified: true,
    bio: 'Specializing in electronics procurement and hardware. I ensure all tech items are inspected before delivery.',
    completed: 156,
    pastProducts: [
      { id: 1, name: 'Peripherals', category: 'Tech' },
      { id: 2, name: 'Smart Devices', category: 'Tech' },
      { id: 3, name: 'Cables', category: 'Tech' }
    ],
    availability: ['Today 3PM', 'Tomorrow 9AM']
  },
  {
    id: 3,
    name: 'Thandi N.',
    rating: 5.0,
    specialties: ['Fashion', 'Beauty'],
    hourlyRate: 110,
    distance: 0.8,
    verified: true,
    bio: 'Personal stylist and premium shopper. Knowledgeable in high-end fashion brands and luxury beauty products.',
    completed: 312,
    pastProducts: [
      { id: 2, name: 'Skincare', category: 'Beauty' },
      { id: 3, name: 'Accessories', category: 'Fashion' }
    ],
    availability: ['Today 1PM', 'Today 5PM']
  }
];