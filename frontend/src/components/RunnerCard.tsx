// src/components/RunnerCard.jsx - Enhanced Version
import React from 'react';
import { Star, User, CheckCircle, Zap, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export const RunnerCard = ({ runner, onClick }) => (
  <motion.div
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick && onClick(runner)}
    className="bg-gradient-to-br from-white to-[#F8FAF5] rounded-2xl border border-gray-200/80 p-4 cursor-pointer hover:border-[#2D531A] hover:shadow-xl transition-all duration-300 w-full relative overflow-hidden group"
    style={{ aspectRatio: '1/1', maxWidth: '260px' }}
  >
    {/* Background decorative elements */}
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#A3B18A]/10 rounded-full blur-2xl group-hover:bg-[#2D531A]/5 transition-colors"></div>
    <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-[#D9E5D6] rounded-full blur-xl"></div>
    
    {/* Subtle pattern overlay */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
      backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(163,177,138,0.05) 0%, transparent 50%)'
    }}></div>
    
    <div className="h-full flex flex-col relative z-10">
      {/* Top row - Rating and verification badge */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1 bg-[#2D531A] px-2 py-1 rounded-full shadow-md">
          <Star size={10} className="fill-yellow-300 text-yellow-300" />
          <span className="text-[10px] font-bold text-white">{runner.rating}</span>
        </div>
        
        {/* Verification badge - conditionally shown */}
        {runner.verified && (
          <div className="bg-[#A3B18A]/20 px-2 py-1 rounded-full flex items-center gap-1 border border-[#A3B18A]/30">
            <CheckCircle size={8} className="text-[#2D531A]" />
            <span className="text-[6px] font-bold text-[#2D531A] uppercase tracking-wider">Verified</span>
          </div>
        )}
      </div>

      {/* Center content - with better spacing */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-2">
        {/* Avatar with enhanced styling */}
        <div className="relative mb-3">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A3B18A] to-[#2D531A] rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center shadow-md border-2 border-white group-hover:border-[#A3B18A] transition-colors">
            {runner.image ? (
              <img src={runner.image} alt={runner.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <User size={28} className="text-gray-400 group-hover:text-[#2D531A] transition-colors" />
            )}
          </div>
          
          {/* Online/active indicator */}
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
        
        {/* Name with better typography */}
        <h4 className="font-bold text-gray-800 text-base text-center mb-1 tracking-tight">{runner.name}</h4>
        
        {/* Location/distance indicator */}
        <div className="flex items-center gap-1 mb-2 text-gray-400">
          <MapPin size={8} />
          <span className="text-[7px] font-medium">{runner.distance || '1.2'} km away</span>
        </div>
        
        {/* Specialties with enhanced styling */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {runner.specialties.slice(0, 2).map(spec => (
            <span 
              key={spec} 
              className="text-[8px] font-medium bg-[#D9E5D6] text-[#2D531A] px-2 py-1 rounded-full border border-[#A3B18A]/20 shadow-sm"
            >
              {spec}
            </span>
          ))}
          {runner.specialties.length > 2 && (
            <span className="text-[8px] font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
              +{runner.specialties.length - 2}
            </span>
          )}
        </div>
        
        {/* Quick stats */}
        <div className="flex items-center gap-3 mt-2 text-[8px] text-gray-500">
          <div className="flex items-center gap-0.5">
            <Zap size={8} className="text-[#A3B18A]" />
            <span>{runner.completed || 0} jobs</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-0.5">
            <span>⭐ {runner.rating}</span>
          </div>
        </div>
      </div>

      {/* Bottom - Styled action button */}
      <div className="pt-2 border-t border-gray-200/60 mt-auto">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-medium text-gray-400 uppercase tracking-wider">Profile</span>
          <div className="bg-[#2D531A] text-white px-3 py-1 rounded-full text-[8px] font-bold hover:bg-[#1A3A1A] transition-colors flex items-center gap-1 group/btn">
            <span>View</span>
            <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Hover border glow */}
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" style={{
      boxShadow: 'inset 0 0 0 2px rgba(45,83,26,0.2)'
    }}></div>
  </motion.div>
);
