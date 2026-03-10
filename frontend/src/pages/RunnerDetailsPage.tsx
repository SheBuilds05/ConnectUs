// src/pages/RunnerDetailsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Award, 
  Shield, 
  Clock, 
  User, 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  Calendar, 
  Package, 
  Heart,
  Share2, 
  ChevronRight, 
  Zap, 
  AlertCircle, 
  ThumbsUp 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getRunnerById, getRunnerProducts } from '../services/runnerService';

// Define types
interface Runner {
  runner_id: number;
  username: string;
  city?: string;
  bio?: string;
  completed_bookings_count?: number;
  verification_status?: string;
  profile_photo?: string;
  languages?: string[];
  phone?: string;
  created_at?: string;
  id_verified?: boolean;
}

interface Product {
  product_id: number;
  title: string; // Corrected from product_name to match your SQL table
  description: string; // Corrected from product_description to match your SQL table
  price: number;
  image_url?: string; // Corrected from images[] to match your SQL table
  condition?: string;
  category_id?: number;
}

export const RunnerDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { runnerId } = useParams<{ runnerId: string }>();
  const location = useLocation();
  
  const [runner, setRunner] = useState<Runner | null>(location.state?.runner || null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(!runner);
  const [error, setError] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchRunnerProducts = useCallback(async (id: number): Promise<void> => {
    try {
      const data = await getRunnerProducts(id);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }, []);

  const fetchRunnerDetails = useCallback(async (): Promise<void> => {
    if (!runnerId) return;
    setLoading(true);
    try {
      const data = await getRunnerById(parseInt(runnerId));
      setRunner(data);
      if (data) {
        await fetchRunnerProducts(data.runner_id);
      }
    } catch (err) {
      setError('Failed to load runner details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [runnerId, fetchRunnerProducts]);

  // Effect handles initial load and prevents duplicate fetching
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      if (!runner && runnerId) {
        fetchRunnerDetails();
      } else if (runner && products.length === 0) {
        fetchRunnerProducts(runner.runner_id);
      }
    }

    return () => { isMounted = false; };
  }, [runner, runnerId, products.length, fetchRunnerDetails, fetchRunnerProducts]);

  const handleGoBack = (): void => {
    navigate(-1);
  };

  const handleBookRunner = (): void => {
    navigate('/user/bookings', { 
      state: { selectedRunner: runner, from: 'details' } 
    });
  };

  const handleMessage = (): void => {
    navigate('/user/messages', { 
      state: { selectedRunner: runner, from: 'details' } 
    });
  };

  const handleCall = (): void => {
    if (runner?.phone) {
      window.location.href = `tel:${runner.phone}`;
    } else {
      alert('Phone number not available');
    }
  };

  const toggleFavorite = (): void => {
    setIsFavorite(!isFavorite);
  };

  const getPlaceholderColor = (): string => {
    const colors: string[] = [
      'from-blue-500 to-blue-600', 'from-green-500 to-green-600',
      'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600', 'from-teal-500 to-teal-600',
      'from-indigo-500 to-indigo-600', 'from-red-500 to-red-600'
    ];
    const index = (runner?.username?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  const getInitials = (): string => {
    return runner?.username?.charAt(0).toUpperCase() || 'R';
  };

  const getVerificationBadge = (): JSX.Element | null => {
    switch(runner?.verification_status) {
      case 'VERIFIED':
        return (
          <div className="flex items-center gap-1 bg-green-500 px-2 py-1 rounded-full">
            <CheckCircle2 size={14} className="text-white" />
            <span className="text-[10px] font-bold text-white">VERIFIED</span>
          </div>
        );
      case 'PENDING':
        return (
          <div className="flex items-center gap-1 bg-yellow-500 px-2 py-1 rounded-full">
            <AlertCircle size={14} className="text-white" />
            <span className="text-[10px] font-bold text-white">PENDING</span>
          </div>
        );
      default:
        return null;
    }
  };

  const rating = ((runner?.completed_bookings_count || 0) / 100 + 4).toFixed(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2D531A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading runner profile...</p>
        </div>
      </div>
    );
  }

  if (error || !runner) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md shadow-lg">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || 'Runner not found'}</p>
          <button 
            onClick={handleGoBack}
            className="px-6 py-3 bg-[#2D531A] text-white rounded-xl font-bold hover:bg-[#1a3a0f] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 z-30">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button onClick={handleGoBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-[#2D531A]">Runner Profile</h1>
          <div className="flex gap-2">
            <button onClick={toggleFavorite} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart size={22} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 size={22} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0D330E] to-[#1A4A1A] px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getPlaceholderColor()} flex items-center justify-center shadow-xl border-4 border-white/30 flex-shrink-0`}>
            <span className="text-white text-4xl font-bold">{getInitials()}</span>
          </div>
          <div className="flex-1 text-white">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="text-3xl font-bold">{runner.username}</h2>
              {getVerificationBadge()}
            </div>
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-1"><MapPin size={16} /><span>{runner.city || 'South Africa'}</span></div>
              <div className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-current" /><span>{rating} ({runner.completed_bookings_count || 0} jobs)</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-6 max-w-7xl mx-auto grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 text-center shadow-lg">
          <Award size={24} className="mx-auto mb-2 text-[#0D330E]" />
          <div className="font-bold text-[#0D330E] text-xl">{runner.completed_bookings_count || 0}</div>
          <div className="text-xs text-gray-500">Deliveries</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-lg">
          <Clock size={24} className="mx-auto mb-2 text-[#0D330E]" />
          <div className="font-bold text-[#0D330E] text-xl">15 min</div>
          <div className="text-xs text-gray-500">Avg. Response</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-lg">
          <Shield size={24} className="mx-auto mb-2 text-[#0D330E]" />
          <div className="font-bold text-[#0D330E] text-xl">{runner.id_verified ? 'Yes' : 'No'}</div>
          <div className="text-xs text-gray-500">ID Verified</div>
        </div>
      </div>

      {/* Products Section */}
      {products.length > 0 && (
        <div className="px-4 mt-6 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-[#0D330E] text-lg mb-4 flex items-center gap-2">
              <Package size={20} />
              Products & Services
              <span className="bg-[#2D531A] text-white text-xs px-2 py-1 rounded-full ml-2">{products.length}</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product.product_id} className="bg-gray-50 rounded-xl p-3 hover:shadow-md transition-shadow">
                  <div className="w-full h-32 mb-3 overflow-hidden rounded-lg bg-gray-200">
                    <img 
                      src={product.image_url || 'https://placehold.co/200x150?text=No+Image'} 
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://placehold.co/200x150?text=No+Image';
                      }}
                    />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#2D531A]">R{product.price}</span>
                    <span className="text-xs px-2 py-1 bg-[#2D531A]/10 text-[#2D531A] rounded-full">View</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/80 to-transparent z-40">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBookRunner}
          className="w-full max-w-lg mx-auto bg-gradient-to-r from-[#2D531A] to-[#1a3a0f] text-white rounded-2xl py-4 px-6 font-bold text-lg shadow-2xl flex items-center justify-center gap-3"
        >
          <Calendar size={24} />
          Book {runner.username} Now
          <ChevronRight size={24} />
        </motion.button>
      </div>
    </div>
  );
};