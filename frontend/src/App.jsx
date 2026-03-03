import React, { useState } from 'react';
import { Sidebar } from './components/SideBar';

// 1. Import all your new pages
import UserHomePage from './pages/UserHomePage';
import BookingsPage from './pages/BookingsPage';
import MessagesPage from './pages/MessagesPage';
import FavoritesPage from './pages/FavoritesPage';
import AccountPage from './pages/AccountPage';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 2. State to track the current active page
  const [currentPage, setCurrentPage] = useState('dashboard');

  // 3. Helper function to render the correct page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <UserHomePage 
            onMenuClick={() => setIsSidebarOpen(true)} 
            isSidebarOpen={isSidebarOpen} 
          />
        );
      case 'bookings':
        return <BookingsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'account':
        return <AccountPage />;
      default:
        return <UserHomePage onMenuClick={() => setIsSidebarOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FBFBFA] w-full overflow-hidden">
      
      {/* SIDEBAR CONTAINER */}
      <aside className={`
        bg-white border-r border-gray-100 transition-all duration-500 ease-in-out
        ${isSidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0'}
        shrink-0 overflow-hidden h-full
      `}>
        <div className="w-72 h-full">
          {/* 4. Pass navigation props to Sidebar */}
          <Sidebar 
            currentPage={currentPage}
            onNavigate={(page) => setCurrentPage(page)}
            onClose={() => setIsSidebarOpen(false)} 
          />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full transition-all duration-500 ease-in-out">
        <main className="flex-1 overflow-y-auto">
          {/* 5. Call the render function here */}
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;