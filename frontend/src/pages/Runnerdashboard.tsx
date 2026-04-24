import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Wallet, Star, CheckCircle2, Menu, Zap, 
  Clock, Bell, MapPin
} from 'lucide-react';
import RunnerSidebar from '../components/RunnerSidebar';

const RunnerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [runnerName, setRunnerName] = useState("Runner");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setLoading(false);
          return;
        }
        const user = JSON.parse(storedUser);
        setRunnerName(user.full_name || user.name || "Runner");

        if (user.user_id) {
          const response = await axios.get(`https://connectus-tpyp.onrender.com/api/runners/dashboard/${user.user_id}`);
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // BACKGROUND STYLING
  const backgroundStyle = {
    backgroundColor: '#F0F4EF',
    backgroundImage: `
      linear-gradient(rgba(194, 209, 178, 0.2) 1px, transparent 1px),
      linear-gradient(90deg, rgba(194, 209, 178, 0.2) 1px, transparent 1px)
    `,
    backgroundSize: '100px 100px',
    backgroundAttachment: 'fixed' as const,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-[#0D330E]" style={backgroundStyle}>
        Synchronizing Systems...
      </div>
    );
  }

  const profile = dashboardData?.profile || {};
  const stats = dashboardData?.stats || { successRate: 0, level: "JUNIOR", totalTrips: 0, activeMissions: 0 };
  const notifications = dashboardData?.notifications || [];

  return (
    <div className="min-h-screen font-sans text-[#0D330E] flex relative overflow-x-hidden" style={backgroundStyle}>
      
      {/* DECORATIVE BUBBLES & SHAPES */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Large Sage Bubble */}
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[#C2D1B2]/30 rounded-full blur-[80px] animate-pulse"></div>
        {/* Medium Floating Orb */}
        <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-[#A3B18A]/20 rounded-full blur-[60px]"></div>
        {/* Glassmorphic Bubble */}
        <div className="absolute top-[40%] right-[15%] w-32 h-32 bg-white/20 rounded-full border border-white/30 backdrop-blur-md shadow-xl animate-bounce" style={{ animationDuration: '6s' }}></div>
        {/* Smaller accent shape */}
        <div className="absolute bottom-[20%] left-[10%] w-20 h-20 bg-[#0D330E]/5 rotate-45 rounded-2xl border border-[#0D330E]/10"></div>
      </div>

      <RunnerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* TOP NAV BAR */}
      <div className={`fixed top-0 right-0 left-0 z-40 p-4 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-[#0D330E] text-white rounded-full shadow-lg hover:scale-110 transition-transform">
              <Menu size={20} />
            </button>
            <h2 className="text-xs font-black text-[#0D330E] uppercase tracking-[0.2em] hidden sm:block">Operations Hub</h2>
          </div>

          <div className="flex items-center gap-2 px-5 py-2 bg-white/80 rounded-full border border-[#C2D1B2] shadow-sm">
            <MapPin size={14} className="text-[#477023]" />
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">
              {profile.city || "Johannesburg"}
            </span>
          </div>

          <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 bg-white rounded-full shadow-md relative hover:bg-gray-50">
            <Bell size={20} className="text-[#0D330E]" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-500 pt-32 pb-20 px-8 lg:px-16 z-10 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="max-w-[1400px] mx-auto space-y-12">
          
          {/* BANNER WITH GLASS OVERLAY */}
          <div className="relative bg-[#0D330E] rounded-[3rem] p-12 overflow-hidden shadow-2xl border border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-50"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-[2px] w-12 bg-[#A3B18A]"></div>
                  <span className="text-[#A3B18A] text-[10px] font-black uppercase tracking-[0.5em]">Live Performance</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-light text-white leading-none">
                  Keep it up, <br />
                  <span className="font-black italic text-[#C5D3B0] drop-shadow-sm">
                    {runnerName.split(' ')[0]}.
                  </span>
                </h1>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 flex gap-12 shadow-2xl">
                <div className="text-center">
                  <p className="text-[10px] font-black text-[#A3B18A] uppercase mb-1 tracking-widest">Success</p>
                  <p className="text-4xl font-black text-white italic">{stats.successRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-[#A3B18A] uppercase mb-1 tracking-widest">Rank</p>
                  <p className="text-4xl font-black text-white italic">{stats.level}</p>
                </div>
              </div>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {/* Wallet Card - Frosted Glass */}
            <div className="md:col-span-2 lg:col-span-3 bg-white/40 backdrop-blur-xl rounded-[3.5rem] p-12 border border-white shadow-xl hover:translate-y-[-5px] transition-all">
              <div className="p-4 bg-[#0D330E] w-fit rounded-2xl text-white mb-8 shadow-xl">
                <Wallet size={28} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0D330E]/40 mb-2">Wallet Balance</p>
              <h3 className="text-7xl md:text-8xl font-black italic tracking-tighter text-[#0D330E]">
                R {profile.wallet_balance || "0.00"}
              </h3>
            </div>

            {/* Trust Score Card */}
            <div className="bg-[#6E8649]/90 backdrop-blur-lg rounded-[3.5rem] p-10 text-white shadow-xl flex flex-col items-center justify-center text-center border border-white/20">
              <Star size={48} className="mb-4 fill-[#C5D3B0] text-[#C5D3B0]" />
              <p className="text-6xl font-black italic">4.9</p>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70 mt-2">Runner Score</p>
            </div>

            {/* Stats Column */}
            <div className="lg:col-span-2 grid grid-cols-1 gap-6">
               <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-8 border border-white flex items-center gap-6 shadow-md hover:bg-white/60 transition-colors">
                  <div className="p-4 bg-white rounded-2xl text-[#0D330E] shadow-sm"><CheckCircle2 size={24}/></div>
                  <div>
                    <p className="text-3xl font-black italic text-[#0D330E]">{stats.totalTrips}</p>
                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Trips Completed</p>
                  </div>
               </div>
               <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-8 border border-white flex items-center gap-6 shadow-md hover:bg-white/60 transition-colors">
                  <div className="p-4 bg-white rounded-2xl text-[#6E8649] shadow-sm"><Clock size={24}/></div>
                  <div>
                    <p className="text-2xl font-black italic text-[#0D330E] uppercase">{currentTime}</p>
                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Active Time</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RunnerDashboard;
