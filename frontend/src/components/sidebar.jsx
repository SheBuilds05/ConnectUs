import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { 
  LayoutDashboard, 
  Wallet, 
  User, 
  ClipboardList, 
  Settings, 
  LogOut, 
  ShoppingCart 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigation
  const [isOpen, setIsOpen] = useState(true);

  // Updated path to /dashboard to match our new App.jsx routing
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' }, 
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
    { name: 'Wallet', icon: <Wallet size={20} />, path: '/wallet' },
    { name: 'View Requests', icon: <ClipboardList size={20} />, path: '/requests' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  const handleLogout = () => {
    // 1. Add any logout logic here (e.g., localStorage.clear() or auth.logout())
    console.log("Logging out...");
    
    // 2. Redirect to the login page
    navigate('/login');
  };

  return (
    <div className={`h-screen w-64 bg-runner-deep flex flex-col fixed left-0 top-0 shadow-2xl transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-runner-light p-2 rounded-xl">
            <ShoppingCart size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">ConnectUs</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-runner-light text-white shadow-lg shadow-runner-light/20' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-runner-light group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User & Logout Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <img 
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100" 
            className="w-10 h-10 rounded-full border-2 border-runner-light"
            alt="User"
          />
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm truncate">Sarah J.</p>
            <p className="text-white/50 text-xs">Verified Runner</p>
          </div>
        </div>
        
        {/* Updated Button with onClick handler */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-2xl transition-colors cursor-pointer"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;