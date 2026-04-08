// src/pages/RunnerDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, Phone, Mail, Shield, 
  Clock, Award, MessageCircle, Calendar, CheckCircle,
  Briefcase, ThumbsUp, Navigation, Heart, Share2,
  Flag, AlertCircle
} from 'lucide-react';
import { getRunnerById, Runner } from '../services/runnerService';
import { getCurrentUser } from '../services/api';

interface Location {
  lat: number;
  lng: number;
  city: string;
}

const RunnerDetailsPage = () => {
  const { runnerId } = useParams<{ runnerId: string }>();
  const navigate = useNavigate();
  const [runner, setRunner] = useState<Runner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    if (runnerId) {
      fetchRunnerDetails();
    }
    getUserLocation();
  }, [runnerId]);

  const fetchRunnerDetails = async () => {
    try {
      setLoading(true);
      const data = await getRunnerById(parseInt(runnerId!));
      setRunner(data);
    } catch (err: any) {
      console.error('Error fetching runner details:', err);
      setError(err.message || 'Failed to load runner details');
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const city = await getCityFromCoordinates(latitude, longitude);
          setUserLocation({
            lat: latitude,
            lng: longitude,
            city: city
          });
        } catch (error) {
          console.error('Error getting city name:', error);
          setUserLocation({
            lat: latitude,
            lng: longitude,
            city: 'Your Location'
          });
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Location error:', error);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  };

  const getCityFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
      );
      const data = await response.json();
      
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.suburb || data.address.county || 'Unknown';
        const country = data.address.country || '';
        return `${city}, ${country}`.substring(0, 30);
      }
      return 'Your Location';
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return 'Your Location';
    }
  };

  const handleBookRunner = () => {
    // Navigate to booking page with runner details
    navigate(`/book-runner/${runnerId}`, { state: { runner } });
  };

  const handleMessageRunner = () => {
    // Open chat or messaging
    alert(`Start chatting with ${runner?.username}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D531A] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading runner details...</p>
        </div>
      </div>
    );
  }

  if (error || !runner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error || 'Runner not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#2D531A] text-white px-6 py-2 rounded-full hover:bg-[#0D330E] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2D531A] to-[#0D330E] text-white">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          {/* Runner Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                {runner.avatar ? (
                  <img 
                    src={runner.avatar} 
                    alt={runner.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="text-5xl font-bold text-white">
                    {runner.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-2 border-white">
                <CheckCircle size={12} className="text-white" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{runner.username}</h1>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-3">
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold">{runner.rating || '4.9'}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <Award size={14} />
                  <span className="text-sm">{runner.completed_bookings_count || 0}+ deliveries</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <Clock size={14} />
                  <span className="text-sm">Member since {new Date().getFullYear()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start text-white/80">
                <MapPin size={16} />
                <span className="text-sm">{runner.city || 'Available in your area'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-[#2D531A]" />
                About {runner.username}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {runner.bio || `Professional runner dedicated to providing fast and reliable delivery services. 
                With ${runner.completed_bookings_count || 0}+ successful deliveries, I ensure your items reach 
                their destination safely and on time. Specializing in quick grocery runs, document delivery, 
                and package transport.`}
              </p>
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ThumbsUp size={20} className="text-[#2D531A]" />
                Performance Stats
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-[#2D531A]">
                    {runner.completed_bookings_count || 0}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Deliveries</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-[#2D531A]">
                    {runner.rating || '4.9'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Rating</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-[#2D531A]">
                    98%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">On-time Rate</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-[#2D531A]">
                    5min
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Avg Response</div>
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Services Offered</h2>
              <div className="flex flex-wrap gap-2">
                {['Grocery Shopping', 'Document Delivery', 'Package Transport', 'Food Delivery', 'Pharmacy Pickup'].map(service => (
                  <span key={service} className="px-3 py-1 bg-green-50 text-[#2D531A] rounded-full text-sm">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star size={20} className="text-[#2D531A]" />
                Customer Reviews
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <p className="font-semibold text-gray-800">Sarah Johnson</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} size={14} className="text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      "Amazing service! Very professional and quick delivery. Will definitely use again!"
                    </p>
                    <p className="text-xs text-gray-400 mt-2">2 days ago</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Action Buttons */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
              <button
                onClick={handleBookRunner}
                className="w-full bg-[#2D531A] text-white py-4 rounded-xl font-bold hover:bg-[#0D330E] transition-colors mb-3 flex items-center justify-center gap-2"
              >
                <Calendar size={20} />
                Book Now
              </button>
              
              <button
                onClick={handleMessageRunner}
                className="w-full border-2 border-[#2D531A] text-[#2D531A] py-4 rounded-xl font-bold hover:bg-[#2D531A] hover:text-white transition-colors mb-4 flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Send Message
              </button>

              <div className="border-t border-gray-100 pt-4 mt-2">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold text-[#2D531A]">&lt; 5 minutes</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-[#2D531A]">100%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Verification</span>
                  <div className="flex items-center gap-1">
                    <Shield size={14} className="text-green-600" />
                    <span className="font-semibold text-green-600">Verified</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button className="flex-1 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <Heart size={18} className="text-gray-600" />
                </button>
                <button className="flex-1 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <Share2 size={18} className="text-gray-600" />
                </button>
                <button className="flex-1 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <Flag size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunnerDetailsPage;