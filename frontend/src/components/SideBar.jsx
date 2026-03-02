import React from 'react';
import { 
  LayoutDashboard, Calendar, ShoppingBag, MessageCircle, 
  Heart, User, ShieldCheck, X, LogOut 
} from 'lucide-react';

const SidebarLink = ({ icon, label, active = false, badge, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
      active ? 'bg-[#2D531A] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
    {badge && (
      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

export const Sidebar = ({ onClose }) => {
  return (
    // h-full ensures the sidebar stretches to the bottom of the screen
    <div className="h-full flex flex-col p-6">
      {/* Brand Logo Section */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#487313] p-2 rounded-xl shadow-sm">
            <ShoppingBag className="text-[#DAF59A]" size={24} />
          </div>
          <h1 className="text-2xl font-black text-[#0D330E] tracking-tighter">ConnectUs</h1>
        </div>
        
        <button 
          onClick={onClose} 
          className="p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 rounded-lg transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
        <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" active />
        <SidebarLink icon={<Calendar size={20} />} label="My Bookings" />
        <SidebarLink icon={<MessageCircle size={20} />} label="Messages" badge="3" />
        <SidebarLink icon={<Heart size={20} />} label="Favorites" />
        <SidebarLink icon={<User size={20} />} label="Account" />
      </nav>

      {/* Footer Area with Safety & Logout */}
      <div className="mt-auto pt-6 space-y-4">
        <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-[#2D531A]" size={18} />
            <span className="text-[10px] font-black uppercase text-[#2D531A]">Verified Safety</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            All runners undergo background checks for your safety.
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <SidebarLink 
            icon={<LogOut size={20} />} 
            label="Log Out" 
            onClick={() => console.log("Logout Clicked")}
          />
        </div>
      </div>
    </div>
  );
};