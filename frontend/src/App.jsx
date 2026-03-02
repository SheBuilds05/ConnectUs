import React, { useState } from 'react';
import UserHomePage from './pages/UserHomePage';
import { Sidebar } from './components/Sidebar';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // h-screen and overflow-hidden prevent the entire window from scrolling
    <div className="flex h-screen bg-[#FBFBFA] w-full overflow-hidden">
      
      {/* SIDEBAR CONTAINER 
          This remains static because it doesn't have an overflow property */}
      <aside className={`
        bg-white border-r border-gray-100 transition-all duration-500 ease-in-out
        ${isSidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0'}
        flex-shrink-0 overflow-hidden h-full
      `}>
        <div className="w-72 h-full">
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      </aside>

      {/* MAIN CONTENT AREA 
          'overflow-y-auto' allows this section—and ONLY this section—to scroll */}
      <div className="flex-1 flex flex-col min-w-0 h-full transition-all duration-500 ease-in-out">
        <main className="flex-1 overflow-y-auto">
          <UserHomePage 
            onMenuClick={() => setIsSidebarOpen(true)} 
            isSidebarOpen={isSidebarOpen} 
          />
        </main>
      </div>
    </div>
  );
}

export default App;