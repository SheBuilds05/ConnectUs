import React, { useState } from 'react';
import { 
  Moon, Sun, Bell, Lock, Truck, CreditCard, 
  ShieldCheck, Map, ChevronRight, User, 
  Smartphone, Globe, Menu 
} from 'lucide-react';
import RunnerSidebar from '../components/RunnerSidebar';

const SettingsPage = () => {
  // --- SIDEBAR STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form States
  const [notifications, setNotifications] = useState(true);
  const [heavyLifting, setHeavyLifting] = useState(false);

  return (
    <div className="min-h-screen bg-[#D3D3D3] font-sans text-[#0D330E] relative overflow-x-hidden pb-12">
      
      {/* SIDEBAR COMPONENT */}
      <RunnerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* OVERLAY DARKNESS: Dims the content when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[55] transition-opacity duration-300 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="w-full">
        
        {/* FLOATING OPEN MENU BUTTON */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-6 left-6 z-50 p-3 bg-[#0D330E] text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border border-white/20"
          >
            <Menu size={24} />
          </button>
        )}

        <div className="max-w-5xl mx-auto p-6 md:p-10">
          
          {/* Header Section with top padding to clear the floating button */}
          <div className="mb-10 pt-4">
            <h1 className="text-4xl font-black italic tracking-tight uppercase text-[#2D531A]">Runner Settings</h1>
            <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Configure your shopping & delivery parameters</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Main Settings Sections */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* 1. SERVICE & AVAILABILITY */}
              <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5">
                <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-[#477023]">
                  <ShieldCheck size={20} /> Availability & Experience
                </h2>
                <div className="space-y-6">
                  <ToggleOption 
                    label="Accepting New Requests" 
                    description="Enable to receive live shopping alerts in your current zone."
                    isActive={true}
                    onToggle={() => {}}
                  />
                  <div className="h-[1px] bg-[#D3D3D3]/50" />
                  <ToggleOption 
                    label="Heavy Lifting" 
                    description="I am capable of delivering items over 20kg (e.g. furniture, water crates)."
                    isActive={heavyLifting}
                    onToggle={() => setHeavyLifting(!heavyLifting)}
                  />
                </div>
              </section>

              {/* 2. VEHICLE & LOGISTICS */}
              <section className="bg-[#0D330E] p-8 rounded-[2.5rem] text-white shadow-2xl">
                <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3 opacity-70">
                  <Truck size={20} /> Logistics & Equipment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Current Vehicle</label>
                    <select className="w-full p-4 rounded-2xl bg-[#1a2c15] border border-white/10 text-white font-bold focus:outline-none focus:border-[#6E8649] transition">
                      <option>Bicycle (Small Items)</option>
                      <option>Motorbike (Fast Delivery)</option>
                      <option>Sedan (Standard Loads)</option>
                      <option>SUV/Van (Bulky Goods)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Max Travel Radius</label>
                    <select className="w-full p-4 rounded-2xl bg-[#1a2c15] border border-white/10 text-white font-bold focus:outline-none focus:border-[#6E8649] transition">
                      <option>Within 5km</option>
                      <option>Within 15km</option>
                      <option>Anywhere in City</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* 3. PAYOUTS */}
              <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5">
                <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-[#477023]">
                  <CreditCard size={20} /> Financial & Payouts
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-[#D3D3D3]/20 border-2 border-dashed border-[#D3D3D3]">
                  <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="bg-[#6E8649] p-3 rounded-2xl text-white shadow-md">
                      <Globe size={24} />
                    </div>
                    <div>
                      <p className="font-black text-[#0D330E]">Standard Bank •••• 8829</p>
                      <p className="text-xs font-bold opacity-40 uppercase">Primary Payout Method</p>
                    </div>
                  </div>
                  <button className="bg-[#477023] hover:bg-[#2D531A] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition shadow-lg">
                    Change Method
                  </button>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: Quick Actions */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#6E8649] p-8 rounded-[2.5rem] text-white shadow-xl text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-4 border-white/20 mb-4 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-black italic text-xl">Account Security</h3>
                <p className="text-xs opacity-80 mt-2 mb-6">Last password change: 2 months ago</p>
                <button className="w-full bg-[#0D330E] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition shadow-lg">
                  Update Password
                </button>
              </div>

              <div className="bg-white p-6 rounded-[2.5rem] shadow-xl space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#477023] mb-4">Notifications</h4>
                <ToggleOption 
                    label="Push Alerts" 
                    description="Order status updates."
                    isActive={notifications}
                    onToggle={() => setNotifications(!notifications)}
                />
                <ToggleOption 
                    label="Email Reports" 
                    description="Weekly earning summaries."
                    isActive={false}
                    onToggle={() => {}}
                />
              </div>

              <button className="w-full py-5 rounded-[2rem] border-2 border-[#0D330E]/10 font-black text-[10px] uppercase tracking-[0.2em] text-[#0D330E] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300">
                Deactivate Account
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Styled Toggle Component (Reusable)
const ToggleOption = ({ label, description, isActive, onToggle }: any) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="font-black text-sm uppercase tracking-tight">{label}</p>
      <p className="text-[11px] font-bold opacity-40 leading-tight">{description}</p>
    </div>
    <button 
      onClick={onToggle}
      className={`w-14 h-8 rounded-full transition-all duration-300 relative flex items-center ${isActive ? 'bg-[#477023]' : 'bg-[#D3D3D3]'}`}
    >
      <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 transform ${isActive ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  </div>
);

export default SettingsPage;