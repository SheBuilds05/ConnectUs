// src/components/RunnerCard.jsx - Enhanced Version
import React from 'react';
import { Star, User, CheckCircle2, Briefcase, MapPin, ArrowRight, Shield, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const RunnerCard = ({ runner, onClick }) => {
  // Safe defaults for all properties
  const username = runner?.username || 'Runner';
  const city = runner?.city || 'Location not set';
  const bio = runner?.bio || '';
  const completedBookings = runner?.completed_bookings_count || 0;
  const verificationStatus = runner?.verification_status || 'PENDING';
  const profilePhoto = runner?.profile_photo;
  const languages = runner?.languages || [];
  const idVerified = runner?.id_verified || false;

  // Calculate rating (using completed bookings as proxy)
  const rating = ((completedBookings / 100) % 5).toFixed(1);

  // Get specialties from bio or create some defaults
  const specialties = [];
  if (bio.toLowerCase().includes('food')) specialties.push('Food');
  if (bio.toLowerCase().includes('tech') || bio.toLowerCase().includes('electronic')) specialties.push('Tech');
  if (bio.toLowerCase().includes('fashion') || bio.toLowerCase().includes('cloth')) specialties.push('Fashion');
  if (bio.toLowerCase().includes('grocery')) specialties.push('Groceries');
  if (bio.toLowerCase().includes('document')) specialties.push('Documents');
  
  // If no specialties detected, add a default
  if (specialties.length === 0) specialties.push('Delivery');

  // Generate a consistent color based on username for placeholder
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
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = () => {
    return username.charAt(0).toUpperCase();
  };

  const getVerificationBadge = () => {
    switch(verificationStatus) {
      case 'VERIFIED':
        return <Shield size={12} className="text-green-600" />;
      case 'PENDING':
        return <Award size={12} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick && onClick(runner)} 
      className="bg-white rounded-xl border border-gray-200 p-3.5 cursor-pointer hover:border-[#2D531A] hover:shadow-xl transition-all duration-300 flex flex-col relative group"
    >
      {/* Top Row - Rating and Verification */}
      <div className="flex justify-between items-start w-full mb-3">
        <div className="flex items-center gap-1.5 bg-[#2D531A] px-2 py-1 rounded-full shadow-sm">
          <Star size={10} className="fill-white text-white" />
          <span className="text-[10px] font-bold text-white">{rating}</span>
        </div>
        {verificationStatus === 'VERIFIED' && (
          <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
            <CheckCircle2 size={10} className="text-green-600" />
            <span className="text-[8px] font-bold text-green-700">Verified</span>
          </div>
        )}
        {verificationStatus === 'PENDING' && (
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-200">
            {getVerificationBadge()}
            <span className="text-[8px] font-bold text-yellow-700">Pending</span>
          </div>
        )}
      </div>

      {/* Profile Section - Professional Placeholder */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          {/* Professional placeholder like WhatsApp */}
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getPlaceholderColor()} flex items-center justify-center shadow-md overflow-hidden`}>
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt={username} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.className = `w-14 h-14 rounded-xl bg-gradient-to-br ${getPlaceholderColor()} flex items-center justify-center`;
                    const fallback = document.createElement('span');
                    fallback.className = 'text-white text-xl font-bold';
                    fallback.textContent = getInitials();
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <span className="text-white text-xl font-bold">{getInitials()}</span>
            )}
          </div>
          
          {/* Online/Active indicator - optional */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-base truncate">{username}</h4>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <div className="flex items-center gap-1">
              <Briefcase size={10} />
              <span className="text-[10px] font-medium">{completedBookings} trips</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <span className="text-[10px] font-medium">2h ago</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1 text-gray-400">
            <MapPin size={10} />
            <span className="text-[9px] font-medium truncate">{city}</span>
          </div>
        </div>
      </div>

      {/* Specialties - Professional Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
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

      {/* Languages - Subtle */}
      {languages.length > 0 && (
        <div className="flex items-center gap-1 mb-3 text-[8px] text-gray-400">
          <span className="font-medium">Speaks:</span>
          <span>{languages.slice(0, 2).join(' • ')}</span>
          {languages.length > 2 && <span>+{languages.length - 2}</span>}
        </div>
      )}

      {/* Footer with Profile Link */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
        <span className="text-[9px] font-medium text-gray-500">View full profile</span>
        <div className="bg-gray-50 text-gray-500 p-1.5 rounded-lg group-hover:bg-[#2D531A] group-hover:text-white transition-all duration-300">
          <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};
