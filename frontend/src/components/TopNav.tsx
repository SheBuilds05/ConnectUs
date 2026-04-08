import React from 'react';

interface TopNavProps {
  title: string;
}

const TopNav: React.FC<TopNavProps> = ({ title }) => {
  return (
    <header className="dashboard-header">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-gray-500">Ready for your next delivery?</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search orders, customers..." 
            className="bg-gray-100 rounded-full px-4 py-2 text-sm w-64 outline-none"
          />
        </div>
        <div className="bg-gray-100 p-2 rounded-full relative">
          <span>🔔</span>
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </div>
      </div>
    </header>
  );
};

export default TopNav;