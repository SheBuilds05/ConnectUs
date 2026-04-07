import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, ShoppingCart, Trophy, Menu } from 'lucide-react';
import RunnerSidebar from '../components/RunnerSidebar';

const RunnerProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Closed by default to show full layout

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const displayName = user?.name || "Runner";
  const displayLocation = user?.location || "South Africa";
  const displayId = user?.id || user?.uid || "477023";
  const profileImage = user?.avatar_url || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200";

  return (
    <div className="min-h-screen bg-[#D3D3D3] font-sans text-[#0D330E] relative overflow-x-hidden">
      
      {/* SIDEBAR COMPONENT 
          - Ensure your RunnerSidebar component has 'fixed' and a high 'z-index'
      */}
      <RunnerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* OVERLAY DARKNESS: Dims the profile when sidebar is open, making it look professional */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[55] transition-opacity duration-300 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA 
          - Removed 'lg:pl-72'. The content now stays full-width.
          - Added 'pointer-events-none' logic if you want to prevent clicking cards while sidebar is open.
      */}
      <div className="w-full">
        
        {/* OPEN MENU BUTTON: Floating on the left */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-6 left-6 z-50 p-3 bg-[#0D330E] text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border border-white/20"
          >
            <Menu size={24} />
          </button>
        )}

        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
          {/* Header to give some top space since menu button is floating */}
          <div className="mb-8 pt-4">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter opacity-20">Runner Profile</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* 1. PERFORMANCE STATS */}
            <div className="md:col-span-4 bg-[#0D330E] p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between">
              <h3 className="text-[10px] uppercase tracking-[0.2em] mb-6 font-bold opacity-60">Performance Snapshot</h3>
              <div className="grid grid-cols-2 gap-y-10">
                <div>
                  <p className="text-[10px] uppercase opacity-50 mb-1">Total Distance</p>
                  <p className="text-3xl font-bold tracking-tight">1,280 <span className="text-xs font-medium opacity-40">km</span></p>
                </div>
                <div>
                  <p className="text-[10px] uppercase opacity-50 mb-1">Jobs Done</p>
                  <p className="text-3xl font-bold tracking-tight">156</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase opacity-50 mb-1">Avg. Pace</p>
                  <p className="text-3xl font-bold tracking-tight text-white">5:30 <span className="text-xs font-medium opacity-40">min</span></p>
                </div>
                <div>
                  <p className="text-[10px] uppercase opacity-50 mb-1">Elevation</p>
                  <p className="text-3xl font-bold tracking-tight">18.5k <span className="text-xs font-medium opacity-40">m</span></p>
                </div>
              </div>
            </div>

            {/* 2. DYNAMIC IDENTITY CARD */}
            <div className="md:col-span-4 bg-[#6E8649] p-10 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden text-white shadow-2xl border-4 border-white/10">
               <CheckCircle className="absolute top-6 right-6 opacity-20" size={80} />
               <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden mb-6">
                  <img src={profileImage} alt={displayName} className="object-cover w-full h-full" />
               </div>
               <h2 className="text-4xl font-black tracking-tight mb-1 italic text-center leading-tight">
                  {displayName}
               </h2>
               <p className="text-sm font-semibold opacity-90 mb-6 tracking-wide uppercase">
                  {displayLocation}
               </p>
               <div className="bg-[#0D330E] text-white px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-lg">
                  Member ID: #{displayId}
               </div>
            </div>

            {/* 3. WEEKLY PROGRESS */}
            <div className="md:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-lg border border-black/5">
              <h3 className="text-[10px] uppercase tracking-[0.2em] mb-8 font-black text-[#477023]">Weekly Progress</h3>
              <div className="flex items-end justify-between h-36 gap-2 mb-6">
                 {[35, 60, 40, 85, 50, 95, 40].map((h, i) => (
                   <div key={i} className={`w-full rounded-t-xl transition-all duration-700 ${h > 80 ? 'bg-[#477023]' : 'bg-[#D3D3D3]'}`} style={{ height: `${h}%` }}></div>
                 ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#D3D3D3]">
                 <span className="text-[10px] font-bold opacity-40 uppercase">Goal: 25 Errands</span>
                 <span className="text-[10px] font-black text-[#2D531A] uppercase">On Track</span>
              </div>
            </div>

            {/* 4. PERSONAL BESTS */}
            <div className="md:col-span-4 bg-[#2D531A] p-8 rounded-[2.5rem] text-white shadow-xl">
               <h3 className="text-[10px] uppercase tracking-[0.2em] mb-6 font-bold opacity-60">Personal Bests</h3>
               <div className="space-y-5">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                     <span className="text-[11px] font-black uppercase">5K</span>
                     <span className="font-mono text-lg font-bold">24:02</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                     <span className="text-[11px] font-black uppercase">10K</span>
                     <span className="font-mono text-lg font-bold">48:30</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[11px] font-black uppercase">Half Marathon</span>
                     <span className="font-mono text-lg font-bold">1:50:00</span>
                  </div>
               </div>
            </div>

            {/* 5. RECENT ACTIVITY */}
            <div className="md:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-xl">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0D330E]">Recent Activity</h3>
                  <span className="text-[10px] font-black uppercase text-[#6E8649] underline cursor-pointer">View All</span>
               </div>
               <div className="bg-[#D3D3D3]/30 p-5 rounded-[2rem] flex items-center gap-5 border border-black/5">
                  <div className="bg-[#477023] p-4 rounded-2xl text-white shadow-md">
                     <ShoppingCart size={24} />
                  </div>
                  <div className="flex-1">
                     <h4 className="font-black text-sm text-[#0D330E]">Morning Groceries</h4>
                     <p className="text-[10px] font-bold opacity-40 uppercase">2 hours ago</p>
                  </div>
                  <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=80" className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="activity" />
               </div>
            </div>

            {/* 6. REPUTATION BADGES */}
            <div className="md:col-span-4 bg-[#477023] p-8 rounded-[2.5rem] text-white shadow-xl">
               <h3 className="text-[10px] uppercase tracking-[0.2em] mb-6 font-bold opacity-70">Reputation Badges</h3>
               <div className="flex gap-4">
                  <div className="flex-1 bg-[#0D330E]/30 p-5 rounded-[2rem] flex flex-col items-center border border-white/10 backdrop-blur-sm">
                     <Trophy className="text-yellow-400 mb-3" size={32} />
                     <span className="text-[9px] font-black uppercase text-center leading-tight">Consistency King</span>
                  </div>
                  <div className="flex-1 bg-[#0D330E]/30 p-5 rounded-[2rem] flex flex-col items-center border border-white/10 backdrop-blur-sm">
                     <CheckCircle className="text-white mb-3" size={32} />
                     <span className="text-[9px] font-black uppercase text-center leading-tight">100+ Deliveries</span>
                  </div>
               </div>
            </div>

            {/* 7. SHOWCASE */}
            <div className="md:col-span-12 mt-10">
               <h3 className="text-[12px] font-black uppercase tracking-[0.4em] mb-8 text-center text-[#2D531A]">Verified Delivered Showcase</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-white">
                  {[
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
                    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400",
                    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
                  ].map((url, i) => (
                    <div key={i} className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <img src={url} alt="Showcase" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D330E] via-transparent to-transparent opacity-90"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                         <p className="text-[9px] font-bold tracking-widest uppercase text-white/60 mb-1">Errand #{9200 + i}</p>
                         <p className="text-sm font-black italic text-white leading-tight">Verified Runner Delivery</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunnerProfile;