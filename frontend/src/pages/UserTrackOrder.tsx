import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CheckCircle2, Copy, X, Package, MapPin } from 'lucide-react';

interface Runner {
  name: string;
  phone: string;
  avatar: string;
}

const UserTrackOrder = () => {
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);

  // Background Image from our previous step
  const backgroundImage = "/Background2-track.png"; 

  const activeOrders = [
    {
      id: "#4913",
      eta: "15 mins",
      status: "IN TRANSIT",
      runner: { name: "Alex Johnson", phone: "082 123 4567", avatar: "Felix" },
      steps: [
        { t: 'Booking Created', d: '10:11 PM', active: true },
        { t: 'Purchasing Items', d: '10:25 PM', active: true },
        { t: 'On The Way', d: '10:40 PM', active: true },
        { t: 'Delivered', d: 'Pending', active: false },
      ]
    },
    {
      id: "#4915",
      eta: "35 mins",
      status: "PURCHASING",
      runner: { name: "Sarah Mbeki", phone: "071 987 6543", avatar: "Aneka" },
      steps: [
        { t: 'Booking Created', d: '11:05 PM', active: true },
        { t: 'Purchasing Items', d: '11:20 PM', active: true },
        { t: 'On The Way', d: 'Pending', active: false },
        { t: 'Delivered', d: 'Pending', active: false },
      ]
    }
  ];

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    // Using a subtle alert/toast is better for professional UI
  };

  return (
    <>
      {/* Full-screen background with darker overlay */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
        {/* Darker overlay - increased from 40% to 60% for less brightness */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-3xl space-y-6 pb-16">
          <header className="mb-6 text-center sm:text-left">
            <h2 className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg tracking-tight">Live Tracking</h2>
            <p className="text-white/90 font-bold text-lg sm:text-xl drop-shadow-md">
              You have {activeOrders.length} orders in progress
            </p>
          </header>

          {activeOrders.map((order) => (
            <motion.div 
              key={order.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Glassmorphic Order Card - Medium Size */}
              <div className="bg-white/70 backdrop-blur-2xl p-6 sm:p-7 rounded-[36px] shadow-2xl border border-white/40">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-7">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#477023]/20 p-3.5 rounded-xl">
                      <Package className="text-[#0D330E]" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#0D330E]">Order {order.id}</h2>
                      <p className="text-[#477023] font-bold text-base">Arriving in approx. {order.eta}</p>
                    </div>
                  </div>
                  <span className="bg-[#0D330E] text-white px-5 py-1.5 rounded-full text-xs font-black tracking-widest">
                    {order.status}
                  </span>
                </div>

                {/* Status Timeline */}
                <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#0D330E]/10 ml-1">
                  {order.steps.map((s, i) => (
                    <div key={i} className="flex gap-5 items-start relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-sm transition-all duration-500 ${s.active ? 'bg-[#477023] text-white scale-105' : 'bg-white text-gray-400 border border-gray-200'}`}>
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className={`text-lg font-black transition-colors ${s.active ? 'text-[#0D330E]' : 'text-gray-400'}`}>{s.t}</p>
                        <p className={`text-sm font-bold ${s.active ? 'text-[#477023]' : 'text-gray-400'}`}>{s.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Runner Card - Darker Theme - Medium Size */}
              <div className="bg-[#0D330E]/90 backdrop-blur-xl p-5 rounded-[32px] text-white flex items-center justify-between shadow-2xl border border-white/10 transition-transform hover:scale-[1.01]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-full border-2 border-white/30 p-0.5 overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.runner.avatar}`} 
                      className="w-full h-full rounded-full"
                      alt="Runner" 
                    />
                  </div>
                  <div>
                    <p className="font-black text-lg tracking-tight">{order.runner.name}</p>
                    <p className="text-xs font-bold text-white/60 flex items-center gap-1">
                      <MapPin size={11} /> Assigned Runner • {order.id}
                    </p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedRunner(order.runner)}
                  className="bg-[#477023] text-white p-4 rounded-xl shadow-lg hover:bg-white hover:text-[#0D330E] transition-all"
                >
                  <Phone size={22} fill="currentColor" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dynamic Call Modal */}
      <AnimatePresence>
        {selectedRunner && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRunner(null)} 
              className="absolute inset-0 bg-black/70 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-sm rounded-[45px] p-9 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#477023]" />
              <button 
                onClick={() => setSelectedRunner(null)} 
                className="absolute right-7 top-7 text-gray-400 hover:text-black transition-colors"
              >
                <X size={26} />
              </button>
              
              <div className="flex flex-col items-center mb-7">
                <div className="w-22 h-22 bg-[#477023]/10 rounded-full mb-4 p-1 border-2 border-[#477023]/20">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRunner.avatar}`} 
                    className="w-full h-full rounded-full"
                    alt="Runner" 
                  />
                </div>
                <h3 className="text-2xl font-black text-[#0D330E] text-center">Call Runner</h3>
                <p className="text-center font-bold text-[#477023] mt-1 text-base">{selectedRunner.name}</p>
              </div>
              
              <div className="bg-gray-100 p-5 rounded-3xl flex items-center justify-between mb-7">
                <span className="text-xl font-mono font-black text-[#0D330E]">{selectedRunner.phone}</span>
                <button 
                  onClick={() => copyNumber(selectedRunner.phone)} 
                  className="text-[#477023] hover:scale-110 transition-transform"
                >
                  <Copy size={22} />
                </button>
              </div>

              <a 
                href={`tel:${selectedRunner.phone}`}
                className="w-full block text-center py-4 bg-[#477023] text-white rounded-[22px] font-black text-xl shadow-xl shadow-[#477023]/30 hover:bg-[#0D330E] transition-all"
              >
                Start Call Now
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserTrackOrder;