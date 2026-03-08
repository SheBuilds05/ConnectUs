import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import UserSidebar from '../components/UserSidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Check if current route is settings
  const isSettingsPage = location.pathname.includes('/user/settings');

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
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-black/5">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-[#0D330E] bg-[#D3D3D3]/20 rounded-xl"
          >
            <Menu size={24} />
          </button>
          <span className="font-black text-[#0D330E] text-sm tracking-widest uppercase">
            {isSettingsPage ? 'Settings' : 'Runner'}
          </span>
          <div className="w-10" />
        </header>

        {/* Page Viewport - Conditional max-width */}
        <div className="p-4 md:p-8 lg:p-12">
          <div className={!isSettingsPage ? "max-w-5xl mx-auto" : ""}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;