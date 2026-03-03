import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, MapPin, Settings, Trophy, LogOut, Menu, X } from 'lucide-react';

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Best Runners', path: '/best-runners', icon: Trophy },
    { name: 'Create Booking', path: '/bookings', icon: PlusCircle },
    { name: 'Track Order', path: '/track', icon: MapPin },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#D3D3D3]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2D531A] text-white transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-xl font-bold tracking-tight">SMART BOOKING</h1>
            <button className="lg:hidden" onClick={() => setIsOpen(false)}><X /></button>
          </div>
          
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.path ? 'bg-[#477023] shadow-lg' : 'hover:bg-[#6E8649]/20'
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <button className="mt-auto flex items-center gap-3 px-4 py-3 text-red-200 hover:bg-red-900/20 rounded-xl">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <header className="lg:hidden mb-4 flex items-center justify-between bg-white/50 p-4 rounded-2xl">
          <button onClick={() => setIsOpen(true)} className="text-[#0D330E]"><Menu /></button>
          <span className="font-bold text-[#0D330E]">Smart Booking</span>
        </header>
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;