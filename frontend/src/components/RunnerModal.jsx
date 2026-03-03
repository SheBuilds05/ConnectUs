// src/components/RunnerModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  X, 
  CheckCircle2, 
  Calendar, 
  Briefcase, 
  User, 
  ArrowRight,
  MapPin,
  Clock,
  Package,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Award,
  ShoppingBag,
  Image
} from 'lucide-react';

export const RunnerModal = ({ runner, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!runner) return null;

  // Mock availability data - in real app, this would come from the runner object
  const availability = {
    slots: [
      { date: '2026-03-05', times: ['09:00', '11:00', '14:00', '16:00'] },
      { date: '2026-03-06', times: ['10:00', '13:00', '15:00'] },
      { date: '2026-03-07', times: ['09:00', '12:00', '15:00', '17:00'] },
      { date: '2026-03-08', times: ['11:00', '14:00'] },
      { date: '2026-03-09', times: ['10:00', '13:00', '16:00'] },
    ]
  };

  // Mock past deliveries showcase
  const pastDeliveries = runner.pastProducts || [
    { id: 1, name: 'Organic Avocados', icon: '🥑', category: 'Grocery' },
    { id: 2, name: 'Fresh Bread', icon: '🍞', category: 'Grocery' },
    { id: 3, name: 'MacBook Charger', icon: '🔌', category: 'Tech' },
    { id: 4, name: 'Designer Dress', icon: '👗', category: 'Fashion' },
    { id: 5, name: 'Skincare Set', icon: '🧴', category: 'Beauty' },
    { id: 6, name: 'Birthday Gift', icon: '🎁', category: 'Gifts' },
  ];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${monthNames[d.getMonth()].substring(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const getDateString = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const isDateAvailable = (day) => {
    const dateStr = getDateString(day);
    return availability.slots.some(slot => slot.date === dateStr);
  };

  const getAvailableTimesForDate = (day) => {
    const dateStr = getDateString(day);
    const slot = availability.slots.find(s => s.date === dateStr);
    return slot ? slot.times : [];
  };

  const handleDateClick = (day) => {
    if (isDateAvailable(day)) {
      const dateStr = getDateString(day);
      setSelectedDate(dateStr);
      setSelectedSlot(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl z-120 max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2D531A] rounded-full flex items-center justify-center text-white font-bold">
                  {runner.name?.charAt(0) || 'R'}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Runner Profile</h2>
                  <p className="text-xs text-gray-500">View details and availability</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Runner Profile Header */}
              <div className="flex items-start gap-6">
                <div className="w-28 h-28 bg-gray-50 rounded-[30px] border-4 border-white shadow-lg overflow-hidden shrink-0">
                  {runner.image ? (
                    <img src={runner.image} alt={runner.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                      <User size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="pt-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">{runner.name}</h2>
                    {runner.verified && (
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                        <CheckCircle2 size={14} className="text-[#2D531A]" />
                        <span className="text-[10px] font-black text-[#2D531A] tracking-wider">VERIFIED</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-5 mt-4">
                    <div className="flex items-center gap-1">
                      <Star size={18} className="fill-[#2D531A] text-[#2D531A]" />
                      <span className="font-black text-gray-900">{runner.rating}</span>
                      <span className="text-gray-400 text-sm">({runner.reviews || 238} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase size={16} className="text-gray-400" />
                      <span className="font-bold text-gray-700">{runner.completed || 238} jobs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="font-bold text-gray-700">{runner.distance || 1.2} km away</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Bio */}
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                  <MessageCircle size={14} />
                  ABOUT ME
                </h4>
                <p className="text-gray-700 text-base leading-relaxed">
                  {runner.bio || `${runner.name} is a top-rated runner with ${runner.completed || 238} completed jobs. Specializing in ${runner.specialties?.join(', ') || 'various categories'}, they are known for efficiency, reliability, and excellent communication.`}
                </p>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                  <Award size={14} />
                  SPECIALTIES
                </h4>
                <div className="flex flex-wrap gap-2">
                  {runner.specialties?.map((spec) => (
                    <span key={spec} className="bg-green-50 text-[#2D531A] text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl border border-green-100">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Product Showcase - What they've delivered */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                  <Package size={14} />
                  RECENT DELIVERIES
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {pastDeliveries.slice(0, 6).map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100 hover:border-[#2D531A] transition-all group cursor-pointer">
                      <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</div>
                      <div className="text-[9px] font-bold text-gray-600 truncate">{item.name}</div>
                      <div className="text-[8px] text-gray-400 mt-1">{item.category}</div>
                    </div>
                  ))}
                </div>
                {pastDeliveries.length > 6 && (
                  <button className="text-[#2D531A] text-xs font-bold mt-3 flex items-center gap-1">
                    View all {pastDeliveries.length} deliveries
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>

              {/* Availability Calendar */}
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-[#2D531A]" />
                    <h4 className="text-sm font-black text-gray-900">AVAILABILITY</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={prevMonth}
                      className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <ChevronLeft size={16} className="text-gray-600" />
                    </button>
                    <span className="text-sm font-bold text-gray-700 min-w-35 text-center">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button 
                      onClick={nextMonth}
                      className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <ChevronRight size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="mb-6">
                  <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                      <span key={d} className="text-[10px] font-black text-gray-400">{d}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-10 rounded-lg bg-gray-100/50" />
                    ))}
                    
                    {/* Actual days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const isAvailable = isDateAvailable(day);
                      const isSelected = selectedDate === getDateString(day);
                      
                      return (
                        <button
                          key={day}
                          onClick={() => handleDateClick(day)}
                          disabled={!isAvailable}
                          className={`
                            h-10 rounded-lg text-sm font-bold transition-all
                            ${isAvailable 
                              ? isSelected
                                ? 'bg-[#2D531A] text-white shadow-md scale-105' 
                                : 'bg-white text-gray-700 hover:bg-[#2D531A] hover:text-white border border-gray-200'
                              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            }
                          `}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} className="text-[#2D531A]" />
                      <h5 className="text-xs font-black text-gray-700">AVAILABLE TIMES</h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getAvailableTimesForDate(parseInt(selectedDate.split('-')[2])).map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedSlot(time)}
                          className={`
                            px-4 py-2 rounded-xl text-xs font-bold transition-all
                            ${selectedSlot === time
                              ? 'bg-[#2D531A] text-white'
                              : 'bg-white border border-gray-200 text-gray-700 hover:border-[#2D531A] hover:bg-green-50'
                            }
                          `}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-200 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#2D531A] rounded-full"></div>
                    <span className="text-gray-500">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                    <span className="text-gray-500">Unavailable</span>
                  </div>
                </div>
              </div>

              {/* Optional: Runner Stats Badge */}
              <div className="bg-linear-to-r from-[#2D531A] to-[#1a3310] rounded-2xl p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award size={24} className="opacity-80" />
                  <div>
                    <p className="text-xs opacity-80 font-bold">MEMBER SINCE</p>
                    <p className="font-bold">March 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80 font-bold">RESPONSE TIME</p>
                  <p className="font-bold">&lt; 15 min</p>
                </div>
              </div>
            </div>

            {/* Footer with Book Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <button 
                disabled={!selectedDate || !selectedSlot}
                onClick={() => {
                  if (selectedDate && selectedSlot) {
                    alert(`Booking request sent to ${runner.name} for ${formatDate(selectedDate)} at ${selectedSlot}`);
                    onClose();
                  }
                }}
                className={`
                  w-full py-5 rounded-3xl font-black text-lg transition-all 
                  flex items-center justify-center gap-3
                  ${selectedDate && selectedSlot
                    ? 'bg-[#2D531A] hover:bg-[#1a3310] text-white cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {selectedDate && selectedSlot 
                  ? `Request ${runner.name} for ${formatDate(selectedDate)} at ${selectedSlot}`
                  : 'Select a date and time to request booking'
                }
                <ArrowRight size={20} />
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                You'll be able to add items and get price quote after runner accepts
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};