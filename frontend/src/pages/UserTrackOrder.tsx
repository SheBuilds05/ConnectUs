import React, { useState } from 'react';
import { Phone, CheckCircle2, Copy, X, Package } from 'lucide-react';

const UserTrackOrder = () => {
  const [selectedRunner, setSelectedRunner] = useState<any | null>(null);

  // Mock data for multiple orders
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
    alert("Number copied to clipboard!");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-20">
      <div className="mb-2">
        <h2 className="text-3xl font-black text-[#0D330E]">Live Tracking</h2>
        <p className="text-[#6E8649]">You have {activeOrders.length} orders in progress</p>
      </div>

      {activeOrders.map((order) => (
        <div key={order.id} className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          {/* Order Status Card */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-black/5">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-3">
                <div className="bg-[#D3D3D3]/40 p-3 rounded-2xl">
                  <Package className="text-[#477023]" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#0D330E]">Order {order.id}</h2>
                  <p className="text-[#6E8649]">Arriving in approx. {order.eta}</p>
                </div>
              </div>
              <span className="bg-[#477023] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider">
                {order.status}
              </span>
            </div>

            {/* Status Timeline */}
            <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#D3D3D3] ml-1">
              {order.steps.map((s, i) => (
                <div key={i} className="flex gap-6 items-start relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${s.active ? 'bg-[#477023] text-white' : 'bg-[#D3D3D3] text-white'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className={`font-bold transition-colors ${s.active ? 'text-[#0D330E]' : 'text-[#6E8649]'}`}>{s.t}</p>
                    <p className="text-sm text-[#6E8649]">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Runner Card */}
          <div className="bg-[#2D531A] p-6 rounded-[32px] text-white flex items-center justify-between shadow-lg shadow-[#2D531A]/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full border-2 border-white/10 overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.runner.avatar}`} 
                  alt="Runner" 
                />
              </div>
              <div>
                <p className="font-bold text-lg">{order.runner.name}</p>
                <p className="text-xs text-white/70">Assigned Runner • {order.id}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedRunner(order.runner)}
              className="bg-white text-[#2D531A] p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <Phone size={24} fill="currentColor" />
            </button>
          </div>
        </div>
      ))}

      {/* Dynamic Call Modal */}
      {selectedRunner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0D330E]/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 animate-in zoom-in-95 duration-300 relative shadow-2xl">
            <button 
              onClick={() => setSelectedRunner(null)} 
              className="absolute right-8 top-8 text-[#6E8649] hover:text-[#0D330E] transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-[#D3D3D3]/30 rounded-full mb-4 overflow-hidden border-2 border-[#477023]/20">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRunner.avatar}`} alt="Runner" />
              </div>
              <h3 className="text-2xl font-black text-[#0D330E] text-center">Call {selectedRunner.name}</h3>
              <p className="text-center text-[#6E8649] text-sm mt-1">Direct line for your delivery</p>
            </div>
            
            <div className="bg-[#D3D3D3]/30 p-5 rounded-3xl flex items-center justify-between mb-8">
              <span className="text-xl font-mono font-bold text-[#0D330E]">{selectedRunner.phone}</span>
              <button 
                onClick={() => copyNumber(selectedRunner.phone)} 
                className="text-[#477023] hover:bg-[#477023]/10 p-2 rounded-xl transition-all"
              >
                <Copy size={22} />
              </button>
            </div>

            <a 
              href={`tel:${selectedRunner.phone}`}
              className="w-full block text-center py-5 bg-[#477023] text-white rounded-[24px] font-bold text-lg shadow-xl shadow-[#477023]/30 hover:bg-[#0D330E] transition-all"
            >
              Start Call
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTrackOrder;