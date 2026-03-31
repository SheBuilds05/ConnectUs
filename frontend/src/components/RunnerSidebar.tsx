import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  X,
  Package,
  History,
  User,
  Wallet
} from 'lucide-react';
import { getUserName, getUserEmail, logoutUser } from '../services/api';

interface RunnerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const RunnerSidebar = ({ isOpen, onClose }: RunnerSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    initials: 'R',
    name: 'Runner',
    email: ''
  });

  useEffect(() => {
    const name = getUserName() || "Runner";
    const email = getUserEmail() || "";
    const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
    setUserData({ initials: initials || 'R', name, email });
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/runner', icon: LayoutDashboard },
    { name: 'Active Tasks', path: '/runner/tasks', icon: Package },
    { name: 'Wallet', path: '/runner/wallet', icon: Wallet },
    { name: 'Profile', path: '/runner/profile', icon: User },
    { name: 'Settings', path: '/runner/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutUser();
    onClose();
    navigate('/login');
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-[60] w-72 bg-gradient-to-b from-[#1A3A1A] to-[#0D1F0D] text-white transform transition-transform duration-300 ease-in-out 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-[#A3B18A] flex items-center justify-center p-1">
              <img src="https://raw.githubusercontent.com/SheBuilds05/ConnectUs/main/dir/lOGO.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-black">Runner<span className="text-[#A3B18A]">Hub</span></h1>
          </div>
          {/* Close Button - Now visible whenever sidebar is open */}
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#A3B18A] flex items-center justify-center text-[#1A3A1A] font-bold shadow-lg">
              {userData.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">{userData.name}</h3>
              <p className="text-[10px] text-white/50 truncate">Runner Tier: Pro</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => { if(window.innerWidth < 1024) onClose(); }}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
                location.pathname === item.path ? 'bg-[#A3B18A]/20 text-white border border-[#A3B18A]/30' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className={location.pathname === item.path ? 'text-[#A3B18A]' : 'text-white/40 group-hover:text-white'} />
              <span className="font-bold text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-4 w-full text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold mt-auto border-t border-white/10">
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default RunnerSidebar;