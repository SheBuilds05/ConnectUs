import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MapPin, 
  Settings, 
  LogOut, 
  X,
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
    initials: 'U',
    name: 'Loading...',
    email: 'loading@example.com'
  });

  useEffect(() => {
    const name = getUserName() || "User";
    const email = getUserEmail() || "user@example.com";
    
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
    logoutUser();
    onClose();
    navigate('/login');
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#2D531A] to-[#1A3A1A] text-white transform transition-all duration-300 ease-in-out shadow-2xl
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="h-full flex flex-col p-6">
        {/* Branding Area */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
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
          
          {/* Close Button - Now functional for all screen sizes */}
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#A3B18A] flex items-center justify-center text-[#2D531A] font-bold text-xl border-2 border-white/30 shadow-lg shrink-0">
              {userData.initials}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">{userData.name}</h3>
              <p className="text-xs text-white/60 mt-1 truncate">{userData.email}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <Bell size={12} className="text-[#A3B18A]" />
                <span className="text-[8px] text-white/40 uppercase tracking-wider font-semibold">2 Notifications</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose} // Optional: close on navigation
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[#477023] text-white shadow-lg shadow-black/10' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={20} className={`${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
                <span className="font-bold text-sm">{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-[#A3B18A] rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-300 hover:text-red-100 hover:bg-red-500/10 rounded-2xl transition-all font-bold group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-sm">Logout</span>
          </button>
          
          <div className="mt-4 px-4 py-2 bg-black/20 rounded-xl">
            <p className="text-[10px] text-white/30 text-center">
              © 2026 ConnectUs • v1.0.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;
