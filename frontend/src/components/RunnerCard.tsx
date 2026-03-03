// src/components/RunnerCard.jsx
import React from 'react';
import { Star, User, CheckCircle2, Briefcase, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const RunnerCard = ({ runner, onClick }) => (
  <motion.div
    whileHover={{ y: -6 }}
    whileTap={{ scale: 0.98 }}
    // Ensure onClick is called with the specific runner data
    onClick={() => onClick && onClick(runner)} 
    className="bg-white rounded-4xl border border-gray-100 p-5 cursor-pointer hover:border-green-100 transition-all duration-300 flex flex-col justify-between aspect-square relative group"
  >
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

    <div className="flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-3 border-2 border-white shadow-sm overflow-hidden">
        {runner.image ? (
          <img src={runner.image} alt={runner.name} className="w-full h-full object-cover" />
        ) : (
          <User size={32} className="text-gray-300" />
        )}
      </div>
      <h4 className="font-bold text-gray-900 text-lg leading-tight">{runner.name}</h4>
      <div className="flex items-center gap-1 mt-1 text-gray-400">
        <Briefcase size={10} />
        <span className="text-[10px] font-bold uppercase">{runner.jobsCompleted || 0} Jobs Completed</span>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex flex-wrap gap-1 justify-center">
        {runner.specialties.slice(0, 2).map(spec => (
          <span key={spec} className="text-[9px] bg-green-50 text-[#2D531A] px-2 py-1 rounded-md font-black uppercase tracking-wider border border-green-100/50">
            {spec}
          </span>
        ))}
      </div>
      <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
        <span className="text-[10px] font-black text-gray-400 uppercase">View Profile</span>
        <div className="bg-gray-50 text-gray-400 p-2 rounded-xl group-hover:bg-[#2D531A] group-hover:text-white transition-all">
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  </motion.div>
);