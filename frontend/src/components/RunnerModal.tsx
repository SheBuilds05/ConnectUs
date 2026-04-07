import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star, ShieldCheck, Languages, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RunnerModal = ({ runner, isOpen, onClose, userLocation }) => {
  const navigate = useNavigate();

  if (!isOpen || !runner) return null;

  const handleBooking = () => {
    navigate('/booking', { state: { runner } });
  };

  return (
    <AnimatePresence>
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
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl z-10"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors z-20"
          >
            <X size={20} />
          </button>

          {/* Header/Image Section */}
          <div className="relative h-48 bg-gradient-to-br from-[#2D531A] to-[#0D330E] flex items-end p-8">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck size={120} className="text-white" />
            </div>
            
            <div className="flex items-center gap-5 translate-y-12">
              <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
                <img 
                  src={runner.profile_image || `https://ui-avatars.com/api/?name=${runner.username}&background=A3B18A&color=fff`} 
                  alt={runner.username}
                  className="w-full h-full object-cover rounded-[1.4rem]"
                />
              </div>
              <div className="pb-2">
                <h2 className="text-2xl font-black text-white drop-shadow-md">
                  {runner.username || 'Anonymous Runner'}
                </h2>
                <div className="flex items-center gap-2 text-[#A3B18A] font-bold text-sm bg-white/10 backdrop-blur-md px-3 py-1 rounded-full mt-1 w-fit">
                  <Star size={14} fill="currentColor" />
                  <span>{runner.rating || 'New Runner'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body Section */}
          <div className="pt-16 px-8 pb-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                <MapPin className="text-[#2D531A]" size={18} />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Location</p>
                  <p className="text-sm font-bold text-gray-800">{runner.city || userLocation.city}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                <Clock className="text-[#2D531A]" size={18} />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Experience</p>
                  <p className="text-sm font-bold text-gray-800">{runner.completed_bookings || 0} tasks</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">About Runner</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {runner.bio || "This runner hasn't added a bio yet, but they are ready to help you with your tasks!"}
              </p>
            </div>

            {runner.languages && (
              <div className="flex items-center gap-2">
                <Languages size={16} className="text-gray-400" />
                <div className="flex gap-2">
                  {runner.languages.split(',').map(lang => (
                    <span key={lang} className="text-[10px] font-bold bg-[#D9E5D6] text-[#2D531A] px-2 py-0.5 rounded-md uppercase">
                      {lang.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <button 
              onClick={handleBooking}
              className="w-full py-5 bg-[#2D531A] hover:bg-[#0D330E] text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Book This Runner
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RunnerModal;