// src/components/RunnerCard.jsx
import React from 'react';
// Corrected imports to fix the "Icons is not defined" error
import { Star, User, CheckCircle2, Briefcase, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const RunnerCard = ({ runner, onClick }) => (
  <motion.div
    whileHover={{ y: -6, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(runner)}
    className="bg-white rounded-[32px] border border-gray-100 p-5 cursor-pointer hover:border-green-100 transition-all duration-300 flex flex-col justify-between aspect-square relative group"
  >
    {/* 1. Status & Rating Row */}
    <div className="flex justify-between items-start w-full">
      <div className="flex items-center gap-1.5 bg-[#2D531A] px-2.5 py-1 rounded-full shadow-sm">
        <Star size={10} className="fill-white text-white" />
        <span className="text-[10px] font-black text-white">{runner.rating}</span>
      </div>
      
      {runner.verified && (
        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
          <CheckCircle2 size={12} className="text-[#2D531A]" />
          <span className="text-[8px] font-black text-[#2D531A] uppercase">Verified</span>
        </div>
      )}
    </div>

    {/* 2. Compact Profile Section */}
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <div className="w-20 h-20 bg-gray-50 rounded-[24px] flex items-center justify-center mb-3 border-2 border-white shadow-sm overflow-hidden group-hover:border-green-100 transition-colors">
          {runner.image ? (
            <img src={runner.image} alt={runner.name} className="w-full h-full object-cover" />
          ) : (
            <User size={32} className="text-gray-300" />
          )}
        </div>
        <div className="absolute -bottom-1 right-0 bg-white border border-gray-100 px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
          <MapPin size={8} className="text-[#2D531A]" />
          <span className="text-[8px] font-bold text-gray-500">{runner.distance}km</span>
        </div>
      </div>
      
      <h4 className="font-bold text-gray-900 text-lg leading-tight tracking-tight">{runner.name}</h4>
      
      <div className="flex items-center gap-1 mt-1 text-gray-400">
        <Briefcase size={10} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">
          {runner.jobsCompleted || 0} Jobs Completed
        </span>
      </div>
    </div>

    {/* 3. Specialties & Action CTA (Rate Removed) */}
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1 justify-center">
        {runner.specialties.slice(0, 2).map(spec => (
          <span key={spec} className="text-[9px] bg-green-50 text-[#2D531A] px-2 py-1 rounded-md font-black uppercase tracking-wider border border-green-100/50">
            {spec}
          </span>
        ))}
      </div>
      
      {/* Bottom Row: Replaced Hourly Rate with a 'View Profile' button style */}
      <div className="pt-3 border-t border-gray-50 flex items-center justify-between group-hover:border-green-100 transition-colors">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#2D531A] transition-colors">
          View Profile
        </span>
        
        <div className="bg-gray-50 text-gray-400 p-2 rounded-xl group-hover:bg-[#2D531A] group-hover:text-white transition-all duration-300">
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  </motion.div>
);