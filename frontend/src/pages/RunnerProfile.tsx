import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, CheckCircle, ShoppingCart, Trophy, Menu, ShieldCheck, Camera, Plus, Edit3, Save 
} from 'lucide-react';
import RunnerSidebar from '../components/RunnerSidebar';

const RunnerProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showcaseInputRef = useRef<HTMLInputElement>(null);
  
  // States for new features
  const [isAvailable, setIsAvailable] = useState(true);
  const [heavyLifting, setHeavyLifting] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState("Professional Runner dedicated to fast and safe deliveries.");
  
  const [categories, setCategories] = useState({
    food: true, clothes: false, appliances: true, cleaning: false, beauty: true
  });

  const [showcaseImages, setShowcaseImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.bio) setBio(parsed.bio);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    setIsAvailable(localStorage.getItem('runner_available') !== 'false');
    setHeavyLifting(localStorage.getItem('runner_heavy_lifting') === 'true');
  }, []);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUser({ ...user, avatar_url: base64 });
        // In a real app, you'd send this base64 to your backend here
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddShowcase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShowcaseImages([reader.result as string, ...showcaseImages].slice(0, 5));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (key: keyof typeof categories) => {
    setCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const displayName = user?.full_name || user?.name || "Runner";
  const displayLocation = user?.location || "South Africa";
  const displayId = user?.user_id || user?.id || "477023";
  const profileImage = user?.avatar_url || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200";
  const jobsDone = user?.completed_bookings_count || 0;

  return (
    <div className="min-h-screen bg-[#D3D3D3] font-sans text-[#0D330E] relative overflow-x-hidden pb-20">
      <RunnerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="w-full">
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} className="fixed top-6 left-6 z-50 p-3 bg-[#0D330E] text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border border-white/20">
            <Menu size={24} />
          </button>
        )}

        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
          <div className="mb-8 pt-4">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter opacity-20">Runner Profile</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* 1. REDUCED PERFORMANCE SNAPSHOT */}
            <div className="md:col-span-4 bg-[#0D330E] p-10 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-center">
              <h3 className="text-[10px] uppercase tracking-[0.2em] mb-6 font-bold opacity-60">Performance Snapshot</h3>
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <p className="text-[10px] uppercase opacity-50 mb-1">Jobs Done</p>
                  <p className="text-5xl font-black tracking-tighter">{jobsDone}</p>
                </div>
                <div className="pt-4 border-t border-white/10 text-center">
                  <p className="text-[10px] uppercase opacity-50 mb-1">Status</p>
                  <p className={`text-2xl font-black uppercase italic ${isAvailable ? 'text-green-400' : 'text-red-400'}`}>
                    {isAvailable ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. IDENTITY CARD (With Change Profile Pic) */}
            <div className="md:col-span-4 bg-[#6E8649] p-10 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden text-white shadow-2xl border-4 border-white/10">
               <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden mb-6 relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={profileImage} alt={displayName} className="object-cover w-full h-full" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 text-white">
                    <Camera size={24} />
                  </div>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleProfileUpload} />
                  <div className={`absolute bottom-0 inset-x-0 py-1 text-[8px] font-black uppercase text-center text-white ${isAvailable ? 'bg-green-600' : 'bg-red-600'}`}>
                    {isAvailable ? "Available" : "Offline"}
                  </div>
               </div>
               <h2 className="text-4xl font-black tracking-tight mb-1 italic text-center leading-tight uppercase">{displayName}</h2>
               <p className="text-sm font-semibold opacity-90 mb-4 tracking-wide uppercase">{displayLocation}</p>
               {heavyLifting && (
                 <div className="flex items-center gap-2 mb-4 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                   <ShieldCheck size={12} className="text-[#A3B18A]" />
                   <span className="text-[8px] font-black uppercase tracking-widest">Heavy Lifting Pro</span>
                 </div>
               )}
               <div className="bg-[#0D330E] text-white px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-lg">
                  Member ID: #{displayId.toString().slice(-6)}
               </div>
            </div>

            {/* 3. WEEKLY PROGRESS (Based on database count) */}
            <div className="md:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-lg border border-black/5">
              <h3 className="text-[10px] uppercase tracking-[0.2em] mb-8 font-black text-[#477023]">Weekly Progress</h3>
              <div className="flex items-end justify-between h-36 gap-2 mb-6">
                  {/* Dynamic bars scaled to jobsDone */}
                  {[0.4, 0.6, 0.5, 0.9, 0.7, 0.8, 1].map((m, i) => (
                    <div key={i} className={`w-full rounded-t-xl transition-all duration-700 ${m > 0.8 ? 'bg-[#477023]' : 'bg-[#D3D3D3]'}`} 
                         style={{ height: `${Math.min(jobsDone * m, 100)}%` }}></div>
                  ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#D3D3D3]">
                 <span className="text-[10px] font-bold opacity-40 uppercase">Goal: 25 Errands</span>
                 <span className="text-[10px] font-black text-[#2D531A] uppercase">On Track</span>
              </div>
            </div>

            {/* 4. REDUCED RUNNER BIO & CATEGORY SWITCHES */}
            <div className="md:col-span-5 bg-white p-8 rounded-[2.5rem] shadow-xl relative min-h-[300px]">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#0D330E]">Runner Bio</h3>
                  <button onClick={() => setIsEditingBio(!isEditingBio)} className="text-[#477023] hover:scale-110 transition">
                    {isEditingBio ? <Save size={20} /> : <Edit3 size={20} />}
                  </button>
               </div>
               
               {isEditingBio ? (
                 <textarea 
                  autoFocus
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#D3D3D3]/20 p-4 rounded-2xl text-xs font-bold text-[#0D330E] resize-none focus:outline-none border-2 border-[#477023]/20"
                  rows={4}
                 />
               ) : (
                 <p className="text-xs font-bold opacity-60 leading-relaxed italic">
                   "{bio}"
                 </p>
               )}

               <div className="mt-8 pt-6 border-t border-black/5">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] mb-4 font-black text-[#0D330E]">Service Categories</h3>
                  <div className="space-y-3">
                    <CategorySwitch label="Food" active={categories.food} onToggle={() => toggleCategory('food')} />
                    <CategorySwitch label="Clothes" active={categories.clothes} onToggle={() => toggleCategory('clothes')} />
                    <CategorySwitch label="Home & Decor" active={categories.appliances} onToggle={() => toggleCategory('appliances')} />
                    <CategorySwitch label="Cleaning" active={categories.cleaning} onToggle={() => toggleCategory('cleaning')} />
                    <CategorySwitch label="Beauty" active={categories.beauty} onToggle={() => toggleCategory('beauty')} />
                  </div>
               </div>
            </div>

            {/* 5. RECENT ACTIVITY (Actual activities) */}
            <div className="md:col-span-7 bg-white p-8 rounded-[2.5rem] shadow-xl">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0D330E]">Recent Activity</h3>
                  <span className="text-[10px] font-black uppercase text-[#6E8649] underline cursor-pointer">View All</span>
               </div>
               <div className="space-y-4">
                  {[
                    { title: "Morning Groceries", time: "2 hours ago", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=80" },
                    { title: "Home Appliances", time: "Yesterday", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=80" }
                  ].map((act, i) => (
                    <div key={i} className="bg-[#D3D3D3]/30 p-5 rounded-[2rem] flex items-center gap-5 border border-black/5">
                      <div className="bg-[#477023] p-4 rounded-2xl text-white shadow-md">
                        <ShoppingCart size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-sm text-[#0D330E]">{act.title}</h4>
                        <p className="text-[10px] font-bold opacity-40 uppercase">{act.time}</p>
                      </div>
                      <img src={act.img} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="activity" />
                    </div>
                  ))}
               </div>
            </div>

            {/* 6. VERIFIED SHOWCASE (With Add Picture) */}
            <div className="md:col-span-12 mt-10">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#2D531A]">Verified Delivered Showcase</h3>
                  <button 
                    onClick={() => showcaseInputRef.current?.click()}
                    className="bg-[#2D531A] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#0D330E] transition"
                  >
                    <Plus size={14} /> Add Work
                  </button>
                  <input type="file" ref={showcaseInputRef} hidden accept="image/*" onChange={handleAddShowcase} />
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {showcaseImages.map((url, i) => (
                    <div key={i} className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <img src={url} alt="Showcase" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D330E] via-transparent to-transparent opacity-90"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                         <p className="text-[9px] font-bold tracking-widest uppercase text-white/60 mb-1">Errand #{9200 + i}</p>
                         <p className="text-sm font-black italic text-white leading-tight">Verified Delivery</p>
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

const CategorySwitch = ({ label, active, onToggle }: any) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] font-black uppercase text-[#0D330E]/70">{label}</span>
    <button 
      onClick={onToggle}
      className={`relative w-10 h-5 rounded-full transition-colors ${active ? 'bg-[#477023]' : 'bg-[#D3D3D3]'}`}
    >
      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${active ? 'left-6' : 'left-1'}`} />
    </button>
  </div>
);

export default RunnerProfile;