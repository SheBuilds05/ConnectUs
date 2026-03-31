import React, { useState, useEffect } from 'react';
import { 
  Wallet, Star, CheckCircle2, Package, TrendingUp, 
  Menu, Zap, Shield, Clock, RefreshCw, ArrowRight, Bell, MapPin
} from 'lucide-react';
import RunnerSidebar from '../components/RunnerSidebar';

const RunnerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Khensani"); // Using your name from profile

  return (
    <div className="min-h-screen bg-[#D3D3D3] font-sans text-[#0D330E] flex relative overflow-x-hidden">
      
      {/* 1. STOLEN BACKGROUND EFFECTS (Grid & Glows) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(13,51,14,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(13,51,14,0.1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>
      <div className="fixed top-0 -right-20 w-96 h-96 bg-[#A3B18A]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 -left-20 w-96 h-96 bg-[#2D531A]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* SIDEBAR */}
      <RunnerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 2. STOLEN FLOATING HEADER PATTERN */}
      <div className={`fixed top-0 right-0 left-0 z-40 p-4 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-[#0D330E] text-white rounded-full shadow-lg hover:scale-105 transition-all"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <span className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter">Duty Status:</span>
              <h2 className="text-sm font-black text-[#0D330E] uppercase flex items-center gap-2">
                Active Now <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-2 bg-white/60 rounded-full border border-white/40 shadow-inner">
            <MapPin size={14} className="text-[#2D531A]" />
            <span className="text-xs font-black text-gray-700 uppercase tracking-tighter">Sandton, JHB</span>
          </div>

          <div className="relative">
            <button className="p-2.5 bg-white rounded-full shadow-sm">
              <Bell size={20} className="text-[#0D330E]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-500 pt-32 pb-20 px-8 lg:px-16 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="max-w-[1400px] mx-auto space-y-12">
          
          {/* 3. STOLEN BANNER STYLE (Runner Version) */}
          <div className="relative bg-gradient-to-br from-[#0D330E] to-[#1A4A1A] rounded-[2.5rem] p-10 overflow-hidden shadow-2xl border border-[#A3B18A]/30">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={200} className="text-white rotate-12" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-[2px] w-12 bg-[#A3B18A]"></div>
                  <span className="text-[#A3B18A] text-[10px] font-black uppercase tracking-[0.4em]">Runner Performance</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-light text-white leading-none">
                  Keep it up, <br />
                  <span className="font-black italic bg-gradient-to-r from-[#A3B18A] to-[#C5D3B0] text-transparent bg-clip-text">
                    {userName}.
                  </span>
                </h1>
                <p className="text-white/60 text-sm max-w-md font-medium">
                  You are in the top 5% of runners in Sandton today. Higher demand expected in 20 minutes.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 flex gap-10">
                <div className="text-center">
                  <p className="text-[9px] font-black text-[#A3B18A] uppercase tracking-widest mb-1">Success Rate</p>
                  <p className="text-3xl font-black text-white italic">98%</p>
                </div>
                <div className="w-[1px] bg-white/10"></div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-[#A3B18A] uppercase tracking-widest mb-1">Level</p>
                  <p className="text-3xl font-black text-white italic">PRO</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. UPGRADED BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
            
            {/* LARGE EARNINGS TILE */}
            <div className="md:col-span-2 lg:col-span-3 bg-white/60 backdrop-blur-xl rounded-[3rem] p-10 border border-white/50 shadow-xl group hover:scale-[1.02] transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-[#0D330E] rounded-2xl text-white">
                  <Wallet size={24} />
                </div>
                <div className="px-4 py-1.5 bg-[#6E8649]/20 rounded-full text-[#0D330E] text-[10px] font-black uppercase italic tracking-widest">
                  +12% vs last week
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0D330E]/40">Balance Available</p>
              <h3 className="text-7xl font-black italic tracking-tighter text-[#0D330E]">R 4,250</h3>
              <button className="mt-8 w-full py-4 bg-[#0D330E] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-[#2D531A] transition-colors">
                Withdraw Earnings
              </button>
            </div>

            {/* RATING TILE */}
            <div className="bg-[#6E8649] rounded-[3rem] p-10 text-white shadow-xl flex flex-col items-center justify-center text-center border border-white/10 relative group">
              <div className="absolute top-4 right-4 animate-pulse">
                <Shield size={20} className="text-white/30" />
              </div>
              <Star size={40} className="mb-4 fill-white" />
              <p className="text-5xl font-black italic">4.9</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Trust Score</p>
            </div>

            {/* QUICK STATS */}
            <div className="lg:col-span-2 grid grid-cols-1 gap-6">
               <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/50 flex items-center gap-6 shadow-sm">
                  <div className="p-3 bg-white rounded-xl text-[#0D330E] shadow-sm"><CheckCircle2 size={20}/></div>
                  <div>
                    <p className="text-2xl font-black italic text-[#0D330E]">124</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Total Trips</p>
                  </div>
               </div>
               <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/50 flex items-center gap-6 shadow-sm">
                  <div className="p-3 bg-white rounded-xl text-[#6E8649] shadow-sm"><Clock size={20}/></div>
                  <div>
                    <p className="text-2xl font-black italic text-[#0D330E]">06h 12m</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">Online Today</p>
                  </div>
               </div>
            </div>

            {/* LIVE MISSIONS - Grid Style stolen from User's Runner Cards */}
            <div className="md:col-span-4 lg:col-span-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-gray-400/20"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#0D330E] opacity-60">Live Missions</h3>
                <div className="h-[1px] flex-1 bg-gray-400/20"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="group relative bg-white/40 backdrop-blur-md border border-white/50 rounded-[2.5rem] p-8 flex items-center justify-between hover:bg-white transition-all duration-500 shadow-sm overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#A3B18A]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 bg-[#0D330E] rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
                        <Package size={28} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black px-2 py-0.5 bg-[#6E8649] text-white rounded-full uppercase italic">Pick n Pay</span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sandton Hub</span>
                        </div>
                        <h4 className="text-xl font-black italic uppercase text-[#0D330E]">Grocery Delivery</h4>
                        <p className="text-xs font-bold text-[#6E8649] flex items-center gap-1 mt-1">
                          <Zap size={12} fill="currentColor" /> R 85.00 Earning
                        </p>
                      </div>
                    </div>
                    <button className="relative z-10 h-14 w-14 rounded-full border-2 border-[#0D330E]/10 flex items-center justify-center text-[#0D330E] group-hover:bg-[#0D330E] group-hover:text-white transition-all shadow-md">
                      <ArrowRight size={24} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default RunnerDashboard;