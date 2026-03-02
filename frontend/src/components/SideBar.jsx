// src/components/Sidebar.jsx
import React from 'react';
import { 
  LayoutDashboard, Calendar, ShoppingBag, MessageCircle, 
  Heart, User, ShieldCheck, X, LogOut 
} from 'lucide-react';

const SidebarLink = ({ icon, label, active = false, badge, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
      active 
        ? 'bg-[#2D531A] text-white shadow-lg shadow-green-900/20' 
        : 'text-gray-500 hover:bg-gray-100'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-[#2D531A]'} transition-colors`}>
        {icon}
      </div>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
    {badge && (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        active ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
      }`}>
        {badge}
      </span>
    )}
  </button>
);

export const Sidebar = ({ onClose, currentPage, onNavigate }) => {
  
  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    if (onClose) {
      onClose(); // Auto-close on mobile/tablet view
    }
  };

  const handleLogout = () => {
    // Simple logout simulation
    console.log("Logging out...");
    window.location.reload(); 
  };

  return (
    <div className="h-full flex flex-col p-6 bg-white">
      {/* Brand Logo Section */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#487313] p-2 rounded-xl shadow-sm">
            <ShoppingBag className="text-[#DAF59A]" size={24} />
          </div>
          <h1 className="text-2xl font-black text-[#0D330E] tracking-tighter">ConnectUs</h1>
        </div>
        
        {/* Close button for mobile */}
        <button 
          onClick={onClose} 
          className="p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 rounded-lg transition-colors lg:hidden"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
        <SidebarLink 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={currentPage === 'dashboard'}
          onClick={() => handleNavigation('dashboard')}
        />
        <SidebarLink 
          icon={<Calendar size={20} />} 
          label="My Bookings" 
          active={currentPage === 'bookings'}
          onClick={() => handleNavigation('bookings')}
        />
        <SidebarLink 
          icon={<MessageCircle size={20} />} 
          label="Messages" 
          badge="3" 
          active={currentPage === 'messages'}
          onClick={() => handleNavigation('messages')}
        />
        <SidebarLink 
          icon={<Heart size={20} />} 
          label="Favorites" 
          active={currentPage === 'favorites'}
          onClick={() => handleNavigation('favorites')}
        />
        <SidebarLink 
          icon={<User size={20} />} 
          label="Account" 
          active={currentPage === 'account'}
          onClick={() => handleNavigation('account')}
        />
      </nav>

      {/* Footer Area with Safety & Logout */}
      <div className="mt-auto pt-6 space-y-4">
        <div className="bg-green-50/50 p-5 rounded-3xl border border-green-100/50">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-[#2D531A]" size={18} />
            <span className="text-[10px] font-black uppercase text-[#2D531A] tracking-widest">Verified Safety</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
            All runners undergo background checks for your safety.
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <SidebarLink 
            icon={<LogOut size={20} />} 
            label="Log Out" 
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};