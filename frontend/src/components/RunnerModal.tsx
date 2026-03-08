// src/components/RunnerModal.jsx
import React from 'react';
import { 
  X, Star, MapPin, Briefcase, Award, Shield, Clock, User, 
  CheckCircle2, MessageCircle, Phone, Calendar, Package, ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const RunnerModal = ({ runner, isOpen, onClose, userLocation, onBook }) => {
  const navigate = useNavigate();

  if (!runner) return null;

  // Get placeholder color based on username
  const getPlaceholderColor = () => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600',
      'from-indigo-500 to-indigo-600',
      'from-red-500 to-red-600'
    ];
    const index = (runner.username?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  const getInitials = () => {
    return runner.username?.charAt(0).toUpperCase() || 'R';
  };

  const getVerificationBadge = () => {
    switch(runner.verification_status) {
      case 'VERIFIED':
        return (
          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100">
            <CheckCircle2 size={14} className="text-green-600" />
            <span className="text-[10px] font-black text-green-700">VERIFIED</span>
          </div>
        );
      case 'PENDING':
        return (
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
            <Award size={14} className="text-yellow-600" />
            <span className="text-[10px] font-black text-yellow-700">PENDING</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Calculate rating
  const rating = ((runner.completed_bookings_count || 0) / 100).toFixed(1);

  const handleBookClick = () => {
    if (onBook) {
      // Use the onBook prop passed from parent
      onBook(runner);
    } else {
      // Fallback navigation if no onBook prop
      navigate('/user/bookings', { 
        state: { 
          selectedRunner: runner,
          from: 'modal'
        } 
      });
    }
    onClose(); // Close the modal after booking
  };

  const handleMessageClick = () => {
    navigate('/user/messages', { 
      state: { 
        selectedRunner: runner,
        from: 'modal'
      } 
    });
    onClose();
  };

  const handleCallClick = () => {
    if (runner.phone) {
      window.location.href = `tel:${runner.phone}`;
    } else {
      alert('Phone number not available');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-gray-100 transition-colors z-20"
            >
              <X size={20} />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[90vh]">
              
              {/* Header with Runner Info */}
              <div className="bg-gradient-to-br from-[#0D330E] to-[#1A4A1A] p-6 text-white">
                <div className="flex items-center gap-4">
                  {/* Runner Avatar */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getPlaceholderColor()} flex items-center justify-center shadow-xl border-4 border-white/30 flex-shrink-0`}>
                    <span className="text-white text-3xl font-bold">{getInitials()}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="text-2xl font-bold truncate">{runner.username}</h2>
                      {getVerificationBadge()}
                    </div>
                    
                    <div className="flex items-center gap-4 text-white/80 text-sm flex-wrap">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span className="truncate max-w-[150px]">{runner.city || 'Location not set'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span>{rating}</span>
                        <span className="text-white/60">({runner.completed_bookings_count || 0} jobs)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 border-b border-gray-100">
                <div className="text-center">
                  <div className="bg-[#D9E5D6] rounded-xl p-3">
                    <Award size={18} className="mx-auto mb-1 text-[#0D330E]" />
                    <div className="font-bold text-[#0D330E] text-sm">{runner.completed_bookings_count || 0}</div>
                    <div className="text-[10px] text-gray-600">Deliveries</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-[#D9E5D6] rounded-xl p-3">
                    <Clock size={18} className="mx-auto mb-1 text-[#0D330E]" />
                    <div className="font-bold text-[#0D330E] text-sm">15 min</div>
                    <div className="text-[10px] text-gray-600">Avg. Response</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-[#D9E5D6] rounded-xl p-3">
                    <Shield size={18} className="mx-auto mb-1 text-[#0D330E]" />
                    <div className="font-bold text-[#0D330E] text-sm">
                      {runner.id_verified ? 'Yes' : 'No'}
                    </div>
                    <div className="text-[10px] text-gray-600">ID Verified</div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {runner.bio && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-[#0D330E] text-sm mb-2 flex items-center gap-2">
                    <User size={16} />
                    About
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{runner.bio}</p>
                </div>
              )}

              {/* Languages */}
              {runner.languages && runner.languages.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-[#0D330E] text-sm mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {runner.languages.map((lang, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Member since badge */}
              <div className="p-4 border-b border-gray-100">
                <div className="bg-gradient-to-r from-[#2D531A] to-[#1a3310] rounded-2xl p-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award size={24} className="opacity-80" />
                    <div>
                      <p className="text-xs opacity-80 font-bold">MEMBER SINCE</p>
                      <p className="font-bold">
                        {runner.created_at ? new Date(runner.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'March 2024'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80 font-bold">RESPONSE TIME</p>
                    <p className="font-bold">&lt; 15 min</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button 
                    onClick={handleMessageClick}
                    className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <MessageCircle size={18} />
                    <span>Message</span>
                  </button>
                  <button 
                    onClick={handleCallClick}
                    className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <Phone size={18} />
                    <span>Call</span>
                  </button>
                </div>
                
                {/* Book Runner Button */}
                <button 
                  onClick={handleBookClick}
                  className="w-full py-4 bg-[#2D531A] text-white rounded-xl font-bold hover:bg-[#1a3a0f] transition-colors flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Calendar size={20} />
                  <span>Book This Runner</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Location info */}
                {userLocation && (
                  <p className="text-[10px] text-gray-400 text-center mt-3">
                    Serving your area in {userLocation.city}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};