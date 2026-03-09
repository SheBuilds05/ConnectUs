import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  User, 
  ClipboardList, 
  Settings, 
  LogOut, 
  ShoppingCart 
} from 'lucide-react';
import { getCurrentUser, getUserProfile } from '../services/api';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔵 Sidebar mounted');
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    console.log('🔵 Fetching user data...');
    
    try {
      // Check localStorage first
      const token = localStorage.getItem('token');
      console.log('🔵 Token from localStorage:', token ? '✅ exists' : '❌ not found');
      
      // Get from localStorage
      const localUser = getCurrentUser();
      console.log('🔵 LocalStorage user:', localUser);
      
      if (localUser) {
        console.log('🔵 Setting user from localStorage:', localUser);
        setUser(localUser);
      }

      // Fetch fresh data from API
      console.log('🔵 Fetching user profile from API...');
      const response = await getUserProfile();
      console.log('🔵 API Response:', response);
      
      if (response && response.data) {
        console.log('🔵 Setting user from API:', response.data);
        setUser(response.data);
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log('🔵 Updated localStorage with API data');
      } else {
        console.log('🔵 No user data in API response');
      }
    } catch (error) {
      console.error('🔴 Error fetching user data:', error);
    } finally {
      setLoading(false);
      console.log('🔵 Loading finished, user state:', user);
    }
  };

  const handleLogout = () => {
    console.log('🔵 Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/runner/profile' },
    { name: 'Runner Dashboard', icon: <LayoutDashboard size={20} />, path: '/runnerdashboard' },
    { name: 'Profile', icon: <User size={20} />, path: '/runner/profile' },
    { name: 'Wallet', icon: <Wallet size={20} />, path: '/runner/wallet' },
    { name: 'View Requests', icon: <ClipboardList size={20} />, path: '/runner/requests' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/runner/settings' },
  ];

  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Log the current user state on every render
  console.log('🔵 Render - Current user state:', user);

  return (
    <div className="h-screen w-64 bg-runner-deep flex flex-col fixed left-0 top-0 shadow-2xl">
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
                  ? 'bg-runner-light text-white shadow-lg' 
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
          {loading ? (
            <div className="w-10 h-10 rounded-full border-2 border-runner-light bg-runner-light/50 animate-pulse"></div>
          ) : user?.avatar_url || user?.profile_photo ? (
            <img 
              src={user.avatar_url || user.profile_photo} 
              className="w-10 h-10 rounded-full border-2 border-runner-light object-cover"
              alt={user.name || 'User'}
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-runner-light bg-runner-light flex items-center justify-center text-white font-bold">
              {getUserInitials()}
            </div>
          )}
          
          <div className="overflow-hidden">
            {loading ? (
              <>
                <div className="h-4 bg-white/20 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-3 bg-white/10 rounded w-16 animate-pulse"></div>
              </>
            ) : (
              <>
                <p className="text-white font-bold text-sm truncate">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-white/50 text-xs">
                  {user?.role === 'runner' ? 'Verified Runner' : user?.role || 'User'}
                  {user?.rating && ` · ${user.rating.toFixed(1)} ⭐`}
                </p>
              </>
            )}
          </div>
        </div>
        
        <button 
          className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-2xl transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
