import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { 
  Menu, Bell, MapPin, Calendar as CalIcon, 
  XCircle, ShoppingBag, Info, ImageIcon, Hash
} from 'lucide-react';
import RunnerSidebar from '../components/RunnerSidebar';
import { useAuth } from '../context/AuthContext'; 

const RunnerActivities = () => {
  const { user } = useAuth(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [bookingData, setBookingData] = useState({});
  const [showPlanner, setShowPlanner] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(null);

  // Form State for Planner
  const [dates, setDates] = useState({ purchase: '', delivery: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(':/https://connectus-tpyp.onrender.com/api/runners/available');
      setPendingOrders(res.data); 
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Reject this order?")) {
      try {
        await axios.put(`https://connectus-tpyp.onrender.com/api/runners/reject/${id}`);
        fetchOrders();
      } catch (err) {
        alert("Failed to reject order");
      }
    }
  };

  const handleFinalize = async () => {
    if (!dates.purchase || !dates.delivery) return alert("Please set both dates");

    try {
        const runnerId = user?.user_id; 

        if (!runnerId) {
            alert("You must be logged in to accept an order");
            return;
        }

        await axios.put(`https://connectus-tpyp.onrender.com/api/runners/accept/${selectedOrder.booking_id}`, {
            runnerId, 
            purchaseDate: dates.purchase,
            deliveryDate: dates.delivery
        });

        alert("Order accepted and scheduled!");
      setShowPlanner(false);
      setDates({ purchase: '', delivery: '' }); 
      fetchOrders(); 
    } catch (err: any) {
      alert(err.response?.data?.error || "Error scheduling order");
    }
  };

  return (
    <div className="min-h-screen bg-[#D3D3D3] font-sans text-[#0D330E] flex relative overflow-x-hidden">
      <RunnerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <nav className="w-full bg-white/40 backdrop-blur-md border-b border-white/40 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-[#0D330E] text-white rounded-full shadow-md"><Menu size={20} /></button>
                <h2 className="text-sm font-black italic uppercase tracking-widest">Operations Hub</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="px-4 py-1.5 bg-white/60 rounded-full border border-white/40 flex items-center gap-2 text-[10px] font-black uppercase">
                    <CalIcon size={14} className="text-[#477023]" /> April 2026
                </div>
                <span className="text-[10px] font-bold opacity-60">{user?.full_name}</span>
            </div>
        </nav>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT: PENDING REQUESTS */}
            <div className="lg:col-span-4 space-y-6">
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Pending <span className="text-[#477023]">Orders</span></h1>
                    </div>
                    <span className="text-[9px] font-black px-3 py-1 bg-white/50 rounded-full border border-[#6E8649]/20">{pendingOrders.length} New</span>
                </header>

                <div className="space-y-4">
                    {pendingOrders.length === 0 ? (
                      <p className="text-xs font-bold opacity-50 italic">No pending orders found.</p>
                    ) : (
                      pendingOrders.map((order: any) => (
                        <div key={order.booking_id} className="bg-white/70 backdrop-blur-sm p-6 rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all">
                            {/* UPDATED: Larger, Dark Green Order ID */}
                            <div className="flex items-center gap-1 mb-4 text-[11px] font-black text-[#0D330E] bg-[#0D330E]/5 w-fit px-3 py-1 rounded-lg border border-[#0D330E]/10 uppercase tracking-tighter">
                                Order #{order.booking_id}
                            </div>
                            
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <img src={order.user_profile_photo || '/api/placeholder/50/50'} className="w-12 h-12 rounded-full border-2 border-[#477023] object-cover" />
                                    <div>
                                        <h4 className="font-black text-sm">{order.username || 'Anonymous'}</h4>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">{order.city}</p>
                                    </div>
                                </div>
                                <button onClick={() => setViewingDetails(order)} className="p-2 bg-white rounded-full text-[#477023] shadow-sm hover:bg-[#477023] hover:text-white transition-all">
                                    <ShoppingBag size={16} />
                                </button>
                            </div>
                            
                            <div onClick={() => setViewingDetails(order)} className="bg-[#477023]/5 p-4 rounded-2xl mb-6 cursor-pointer border border-dashed border-[#477023]/20 hover:bg-[#477023]/10 transition-colors">
                                <p className="text-[10px] font-black text-[#477023] uppercase flex items-center gap-2"><ImageIcon size={12} /> View Items</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => { setSelectedOrder(order); setShowPlanner(true); }} className="py-4 bg-[#477023] text-white text-[9px] font-black uppercase rounded-xl tracking-widest shadow-lg">Accept</button>
                                <button onClick={() => handleReject(order.booking_id)} className="py-4 bg-white text-red-600 border border-red-100 text-[9px] font-black uppercase rounded-xl tracking-widest">Reject</button>
                            </div>
                        </div>
                      ))
                    )}
                </div>
            </div>

            {/* RIGHT: LOGISTICS TRACKER (CALENDAR) */}
            <div className="lg:col-span-8 bg-[#0D330E] rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">Schedule Tracker</h3>
                        <div className="px-4 py-2 bg-[#6E8649]/20 rounded-full border border-[#6E8649]/50 text-[9px] font-black uppercase text-[#A3B18A]">
                          Max 5/Day
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-3">
                        {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => (
                            <div key={d} className="text-center text-[9px] font-black text-[#6E8649] mb-4">{d}</div>
                        ))}
                        {Array.from({length: 31}).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `2026-04-${day < 10 ? '0'+day : day}`;
                            const count = bookingData[dateStr] || 0;
                            const isFull = count >= 5;

                            return (
                                <div key={i} className={`h-24 rounded-2xl border transition-all ${isFull ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 bg-white/5'} p-3 flex flex-col justify-between`}>
                                    <span className={`text-xs font-black italic ${isFull ? 'text-red-400' : 'text-[#6E8649]'}`}>{day}</span>
                                    <div className="flex gap-1 flex-wrap">
                                        {Array.from({length: count}).map((_, dot) => (
                                            <div key={dot} className="w-1.5 h-1.5 rounded-full bg-[#6E8649]"></div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* MODAL: ITEM DETAILS */}
      {viewingDetails && (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-[#0D330E]/60 backdrop-blur-sm" onClick={() => setViewingDetails(null)}></div>
            <div className="relative w-full max-w-md bg-[#D3D3D3] h-full shadow-2xl flex flex-col">
                <div className="p-8 bg-[#0D330E] text-white">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">Items Requested</h3>
                        <button onClick={() => setViewingDetails(null)} className="hover:rotate-90 transition-transform"><XCircle size={24}/></button>
                    </div>
                    {/* UPDATED: Formatting consistency */}
                    <p className="text-[12px] font-black text-[#6E8649] uppercase tracking-widest">Order #{viewingDetails.booking_id}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div className="bg-white rounded-3xl overflow-hidden p-6 border border-white">
                        <img src={viewingDetails.product_image_url || '/api/placeholder/400/300'} className="w-full h-48 object-cover rounded-xl mb-4" />
                        <h4 className="font-black text-lg text-[#0D330E] italic uppercase">{viewingDetails.product_name}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{viewingDetails.product_description}</p>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* MODAL: LOGISTICS PLANNER */}
      {showPlanner && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#0D330E]/90 backdrop-blur-xl" onClick={() => setShowPlanner(false)}></div>
          <div className="relative bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-8 bg-[#477023] text-white">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Logistics Setup</h3>
                    <button onClick={() => setShowPlanner(false)}><XCircle size={24}/></button>
                </div>
                {/* UPDATED: Consistency for Dark Green and Label */}
                <p className="text-[11px] font-black text-[#0D330E] bg-white/20 w-fit px-2 py-0.5 rounded uppercase">Order #{selectedOrder?.booking_id}</p>
            </div>
            <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[#477023]">Purchase Date</label>
                        <input type="date" value={dates.purchase} onChange={(e) => setDates({...dates, purchase: e.target.value})} className="w-full bg-[#D3D3D3]/50 p-5 rounded-2xl font-black text-xs outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-[#477023]">Delivery Date</label>
                        <input type="date" value={dates.delivery} onChange={(e) => setDates({...dates, delivery: e.target.value})} className="w-full bg-[#D3D3D3]/50 p-5 rounded-2xl font-black text-xs outline-none" />
                    </div>
                </div>
                <button onClick={handleFinalize} className="w-full py-5 bg-[#0D330E] text-white font-black uppercase tracking-widest text-xs rounded-[2rem] shadow-2xl hover:scale-[1.02] transition-transform">Finalize Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunnerActivities;
