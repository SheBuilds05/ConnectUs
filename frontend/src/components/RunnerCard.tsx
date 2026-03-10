// src/components/RunnerCard.tsx
import React from 'react';
import { Star, User, CheckCircle2, Briefcase, MapPin, Award, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

interface RunnerCardProps {
  runner: Runner;
  onClick?: (runner: Runner) => void;
}

const RunnerCard: React.FC<RunnerCardProps> = ({ runner, onClick }) => {
  const navigate = useNavigate();

  // Safe defaults for all properties
  const username = runner?.username || 'Runner';
  const city = runner?.city || 'Location not set';
  const bio = runner?.bio || '';
  const completedBookings = runner?.completed_bookings_count || 0;
  const verificationStatus = runner?.verification_status || 'PENDING';
  const profilePhoto = runner?.profile_photo;
  const languages = runner?.languages || [];
  const runnerId = runner?.runner_id;

  // Calculate rating (using completed bookings as proxy)
  const rating = ((completedBookings / 100) % 5).toFixed(1);

  // Get specialties from bio or create some defaults
  const specialties: string[] = [];
  if (bio.toLowerCase().includes('food')) specialties.push('Food');
  if (bio.toLowerCase().includes('tech') || bio.toLowerCase().includes('electronic')) specialties.push('Tech');
  if (bio.toLowerCase().includes('fashion') || bio.toLowerCase().includes('cloth')) specialties.push('Fashion');
  if (bio.toLowerCase().includes('grocery')) specialties.push('Groceries');
  if (bio.toLowerCase().includes('document')) specialties.push('Documents');
  
  // If no specialties detected, add a default
  if (specialties.length === 0) specialties.push('Delivery');

  // Generate a consistent color based on username for placeholder
  const getPlaceholderColor = (): string => {
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
    const index = (username?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  const getInitials = (): string => {
    return username.charAt(0).toUpperCase();
  };

  const getVerificationBadge = () => {
    switch(verificationStatus) {
      case 'VERIFIED':
        return (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-lg">
            <Shield size={12} className="text-white" />
          </div>
        );
      case 'PENDING':
        return (
          <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1 shadow-lg">
            <Award size={12} className="text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent any event bubbling issues
    e.stopPropagation();
    
    // Always navigate to the details page
    navigate(`/user/runner/${runnerId}`, { 
      state: { runner } // Pass the runner data to avoid extra API call
    });
    
    // If onClick prop is provided, call it as well (for any additional functionality)
    if (onClick) {
      onClick(runner);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer hover:border-[#2D531A] hover:shadow-xl transition-all duration-300 flex flex-col relative group"
    >
      {/* Verification Badge */}
      {getVerificationBadge()}

      {/* Rating Badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#2D531A] px-2 py-1 rounded-full shadow-sm z-10">
        <Star size={10} className="fill-white text-white" />
        <span className="text-[10px] font-bold text-white">{rating}</span>
      </div>

      {/* Profile Image */}
      <div className="flex justify-center mb-3">
        <div className="relative">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getPlaceholderColor()} flex items-center justify-center shadow-md overflow-hidden border-2 border-white`}>
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt={username} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.className = `w-20 h-20 rounded-2xl bg-gradient-to-br ${getPlaceholderColor()} flex items-center justify-center`;
                    const fallback = document.createElement('span');
                    fallback.className = 'text-white text-2xl font-bold';
                    fallback.textContent = getInitials();
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <span className="text-white text-2xl font-bold">{getInitials()}</span>
            )}
          </div>
          
          {/* Online Status Indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      </div>

      {/* Runner Info */}
      <div className="text-center mb-3">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{username}</h3>
        <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-2">
          <MapPin size={12} />
          <span>{city}</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Briefcase size={12} className="text-[#2D531A]" />
            <span>{completedBookings} trips</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-[#2D531A]" />
            <span>15 min</span>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1 justify-center mb-3">
        {specialties.slice(0, 3).map((spec, index) => (
          <span 
            key={index} 
            className="text-[9px] bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium border border-gray-200"
          >
            {spec}
          </span>
        ))}
        {specialties.length > 3 && (
          <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-medium">
            +{specialties.length - 3}
          </span>
        )}
      </div>

      {/* Languages */}
      {languages.length > 0 && (
        <div className="flex items-center justify-center gap-1 mb-3 text-[8px] text-gray-400">
          <span className="font-medium">Speaks:</span>
          <span>{languages.slice(0, 2).join(' • ')}</span>
          {languages.length > 2 && <span>+{languages.length - 2}</span>}
        </div>
      )}

      {/* Verification Status Text */}
      <div className="flex justify-center mb-2">
        <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold ${
          verificationStatus === 'VERIFIED' 
            ? 'bg-green-100 text-green-700'
            : verificationStatus === 'PENDING'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {verificationStatus}
        </span>
      </div>

      {/* View Profile Button */}
      <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[9px] font-medium text-gray-500">View full profile</span>
        <div className="bg-gray-50 text-gray-500 p-1.5 rounded-lg group-hover:bg-[#2D531A] group-hover:text-white transition-all duration-300">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default RunnerCard;