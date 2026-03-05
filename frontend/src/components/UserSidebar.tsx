import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { 
  LayoutDashboard, 
  PlusCircle, 
  MapPin, 
  Settings, 
  Trophy, 
  LogOut, 
  X 
} from 'lucide-react';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSidebar = ({ isOpen, onClose }: UserSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate

  const menuItems = [
    { name: 'Dashboard', path: '/user', icon: LayoutDashboard },
    { name: 'Best Runners', path: '/user/best-runners', icon: Trophy },
    { name: 'Create Booking', path: '/user/bookings', icon: PlusCircle },
    { name: 'Track Order', path: '/user/track', icon: MapPin },
    { name: 'Settings', path: '/user/settings', icon: Settings },
  ];

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    // 1. Clear the storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Close the sidebar (for mobile users)
    onClose();
    
    // 3. Redirect to login
    navigate('/login');
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2D531A] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="h-full flex flex-col p-6">
        {/* Branding Area */}
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <PlusCircle size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase">Runner</h1>
          </div>
          <button className="lg:hidden p-1 hover:bg-white/10 rounded-lg" onClick={onClose}>
            <X size={24} />
          </button>
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
                <span className="font-bold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <button 
            onClick={handleLogout} // Attached the logic here
            className="flex items-center gap-3 px-4 py-3 w-full text-red-300 hover:text-red-100 hover:bg-red-500/10 rounded-2xl transition-all font-bold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;