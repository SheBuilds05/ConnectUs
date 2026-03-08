import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MapPin, 
  Settings, 
  Trophy, 
  LogOut, 
  X,
  User,
  Bell
} from 'lucide-react';
import { getCurrentUser, getUserName, getUserEmail, logoutUser } from '../services/api';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  initials: string;
  name: string;
  email: string;
}

const UserSidebar = ({ isOpen, onClose }: UserSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    initials: 'JD',
    name: 'Loading...',
    email: 'loading@example.com'
  });

  useEffect(() => {
    // Load user data from localStorage
    const user = getCurrentUser();
    const name = getUserName();
    const email = getUserEmail();
    
    // Generate initials from name
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    setUserData({
      initials: initials || 'U',
      name: name,
      email: email
    });
  }, []);

  const menuItems = [
    { name: 'Home', path: '/user', icon: LayoutDashboard },
    { name: 'Create Booking', path: '/user/bookings', icon: PlusCircle },
    { name: 'Track Order', path: '/user/track', icon: MapPin },
    { name: 'Settings', path: '/user/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutUser(); // Using the API service function
    onClose();
    navigate('/login');
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#2D531A] to-[#1A3A1A] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="h-full flex flex-col p-6">
        {/* Branding Area - Logo and ConnectUs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {/* Logo Circle */}
            <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-[#A3B18A] flex items-center justify-center overflow-hidden">
              <img 
                src="https://raw.githubusercontent.com/SheBuilds05/ConnectUs/main/dir/lOGO.png" 
                alt="ConnectUs" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              Connect<span className="text-[#A3B18A]">Us</span>
            </h1>
          </div>
          
          {/* Close button for mobile */}
          <button 
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors" 
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* User Profile Section - Moved above menu */}
        <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4">
            {/* User Initials Circle */}
            <div className="w-14 h-14 rounded-full bg-[#A3B18A] flex items-center justify-center text-[#2D531A] font-bold text-xl border-2 border-white/30 shadow-lg">
              {userData.initials}
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0"> {/* Added min-w-0 for text truncation */}
              <h3 className="font-bold text-sm truncate">{userData.name}</h3>
              <p className="text-xs text-white/60 mt-1 truncate">{userData.email}</p>
              
              {/* Notification indicator */}
              <div className="flex items-center gap-2 mt-2">
                <Bell size={12} className="text-[#A3B18A]" />
                <span className="text-[8px] text-white/40">2 new notifications</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[#477023] text-white shadow-lg shadow-black/10' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={20} className={`${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
                <span className="font-bold text-sm">{item.name}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-[#A3B18A] rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Area with Logout */}
        <div className="mt-auto pt-6 border-t border-white/10">
          {/* Additional links if needed */}
          <div className="mb-3 px-4 py-2 text-xs text-white/40">
            <span>Version 1.0.0</span>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-300 hover:text-red-100 hover:bg-red-500/10 rounded-2xl transition-all font-bold group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm">Logout</span>
            
            {/* Logout hint */}
            <span className="ml-auto text-[8px] text-white/20 group-hover:text-white/40">
              → exit
            </span>
          </button>
          
          {/* Bottom decorative element */}
          <div className="mt-4 px-4 py-2 bg-black/20 rounded-xl">
            <p className="text-[8px] text-white/30 text-center">
              © 2026 ConnectUs. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;