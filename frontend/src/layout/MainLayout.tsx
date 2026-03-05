import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import UserSidebar from '../components/UserSidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F0F2ED]">
      {/* Sidebar Component */}
      <UserSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#0D330E]/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Content Main Container */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header (Only visible on small/medium screens) */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-black/5">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-[#0D330E] bg-[#D3D3D3]/20 rounded-xl"
          >
            <Menu size={24} />
          </button>
          <span className="font-black text-[#0D330E] text-sm tracking-widest uppercase">Runner</span>
          <div className="w-10" /> {/* Balance spacer */}
        </header>

        {/* Page Viewport */}
        <div className="p-4 md:p-8 lg:p-12">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;