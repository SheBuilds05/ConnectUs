import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Heart, 
  MessageCircle, 
  User,
  PlusCircle
} from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/user', icon: Home, label: 'Home' },
    { path: '/user/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/user/favorites', icon: Heart, label: 'Favorites' },
    { path: '/user/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/user/account', icon: User, label: 'Account' },
  ];

  if (!location.pathname.startsWith('/user')) {
    return null;
  }

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      {/* Outer glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[#2D531A]/20 via-[#A3B18A]/20 to-[#2D531A]/20 rounded-3xl blur-xl opacity-70"></div>
      
      {/* Multiple shadow layers for depth */}
      <div className="relative bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Inner shadow for depth */}
        <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
        
        {/* Top highlight line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#A3B18A] to-transparent"></div>
        
        {/* Navigation items container */}
        <div className="flex justify-around items-center h-16 px-2 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path === '/user' && location.pathname === '/user');
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative flex flex-col items-center justify-center px-3 py-1 rounded-xl 
                  transition-all duration-300 group
                  ${isActive 
                    ? 'bg-[#2D531A] text-white shadow-lg scale-105' 
                    : 'text-gray-500 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5'
                  }
                `}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute -top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></span>
                )}
                
                <Icon size={20} className="transition-transform group-hover:scale-110" />
                <span className="text-[9px] font-medium mt-0.5">{item.label}</span>
                
                {/* Bottom glow for active item */}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/30 rounded-full blur-sm"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Bottom shadow for floating effect */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-black/10 rounded-full blur-md"></div>
    </nav>
  );
};

export default BottomNav;