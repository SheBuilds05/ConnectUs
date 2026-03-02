import React from 'react';
import { MessageCircle, Search, User } from 'lucide-react';

const MessagesPage = () => {
  return (
    <div className="p-4 px-6 md:px-12 max-w-7xl mx-auto w-full h-full flex flex-col space-y-6">
      <h1 className="text-3xl font-black text-gray-900 pt-4">Messages</h1>

      <div className="flex-1 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex mb-10">
        {/* Chat List */}
        <div className="w-full md:w-80 border-r border-gray-50 flex flex-col">
          <div className="p-6 border-b border-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#2D531A]" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
             {[1, 2].map((i) => (
                <div key={i} className={`p-4 rounded-[24px] flex gap-3 cursor-pointer transition-colors ${i === 1 ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm truncate">Runner John</h4>
                      <span className="text-[10px] text-gray-400">12:45</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">I've picked up the items!</p>
                  </div>
                </div>
             ))}
          </div>
        </div>

        {/* Desktop Placeholder */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50/50">
          <div className="text-center space-y-3">
             <div className="bg-white p-4 rounded-3xl shadow-sm w-fit mx-auto">
                <MessageCircle size={32} className="text-[#2D531A]" />
             </div>
             <p className="text-gray-400 font-bold text-sm">Select a chat to start messaging</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;