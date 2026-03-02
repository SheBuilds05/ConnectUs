import React from 'react';
import { Calendar, Clock, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';

const BookingsPage = () => {
  const statusTabs = ['Active', 'Pending', 'Completed'];

  return (
    <div className="p-4 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-8 pb-20">
      <div className="pt-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Track your errands in real-time</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 w-fit rounded-2xl">
        {statusTabs.map((tab, i) => (
          <button key={tab} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${i === 0 ? 'bg-white text-[#2D531A] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Booking Card Example */}
      <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Clock className="text-[#2D531A]" size={28} />
        </div>
        <div className="flex-1 space-y-1 text-center md:text-left">
          <h3 className="font-black text-lg text-gray-900">Grocery Run - Woolworths</h3>
          <div className="flex items-center justify-center md:justify-start gap-3 text-gray-400 text-xs font-bold">
            <span className="flex items-center gap-1"><Calendar size={12}/> Today, 14:00</span>
            <span className="flex items-center gap-1"><MapPin size={12}/> Sandton City</span>
          </div>
        </div>
        <div className="px-4 py-2 bg-[#2D531A]/10 rounded-xl">
            <span className="text-[#2D531A] font-black text-[10px] uppercase tracking-widest">Runner En Route</span>
        </div>
        <button className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default BookingsPage;