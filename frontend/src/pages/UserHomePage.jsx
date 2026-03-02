// src/pages/UserHomePage.jsx
import React, { useState } from 'react';
import * as Icons from 'lucide-react'; 
import { Search, MapPin, Bell, SlidersHorizontal, ArrowRight, ShieldCheck, Menu } from 'lucide-react';
import { RunnerCard } from '../components/RunnerCard';
import { categories, runners } from '../data/mockData';

const UserHomePage = ({ onMenuClick, isSidebarOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="p-4 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-10">
      
      {/* 1. Header Section */}
      <div className="flex justify-between items-center pt-4">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu - Only visible when Sidebar is closed */}
          {!isSidebarOpen && (
            <button 
              onClick={onMenuClick}
              className="p-3 bg-white border border-gray-200 rounded-2xl text-[#0D330E] hover:bg-gray-50 hover:border-[#2D531A] transition-all shadow-sm active:scale-95"
            >
              <Menu size={24} />
            </button>
          )}
          
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Welcome back, <span className="text-[#2D531A]">User</span>
            </h2>
            <div className="flex items-center gap-1 text-gray-500 mt-1">
              <Icons.MapPin size={16} className="text-[#477023]" />
              <span className="text-sm font-medium">Sandton, Johannesburg</span>
            </div>
          </div>
        </div>

        <button className="p-3 bg-white border border-gray-200 rounded-2xl relative hover:bg-gray-50 transition-colors shadow-sm">
          <Bell size={22} className="text-gray-600" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* 2. Information Banner */}
      <div className="relative overflow-hidden bg-[#0D330E] rounded-[40px] p-8 md:p-14 text-white shadow-xl shadow-green-100/20 transition-all duration-500">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-6 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/20">
            <ShieldCheck size={16} className="text-[#A3B18A]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A3B18A]">Safe & Verified</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Your personal assistant for <br />
            <span className="text-[#A3B18A]">everything</span> in the city.
          </h1>
          <p className="text-white/70 text-base mb-8 leading-relaxed max-w-lg">
            Connect with trusted local runners who handle your shopping—so you don't have to.
          </p>
          <button className="flex items-center gap-2 bg-[#7EA00E] hover:bg-[#8eb510] text-white px-8 py-4 rounded-2xl font-bold transition-all group shadow-lg shadow-black/20">
            Get Started 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#7EA00E]/20 rounded-full blur-3xl"></div>
      </div>

      {/* 3. Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2D531A] transition-colors" size={22} />
          <input
            type="text"
            placeholder="Search grocery, tech, or runners..."
            className="w-full pl-14 pr-6 py-5 bg-white rounded-3xl border-none shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-[#2D531A] outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-5 bg-white border border-gray-200 rounded-3xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
          <SlidersHorizontal size={22} />
        </button>
      </div>

      {/* 4. Categories Section */}
      <div className="space-y-6">
        <h3 className="font-bold text-gray-900 text-xl tracking-tight">Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const IconComponent = Icons[cat.iconName] || Icons.HelpCircle;
            const isActive = activeCategory === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(isActive ? null : cat.name)}
                className={`flex flex-col items-center justify-center p-6 rounded-[32px] transition-all border-2 ${
                  isActive 
                    ? 'bg-[#2D531A] text-white border-[#2D531A] shadow-lg scale-105' 
                    : 'bg-[#2D531A]/10 text-[#2D531A] border-transparent hover:bg-[#2D531A]/20'
                }`}
              >
                <div className={`p-3 rounded-2xl mb-3 ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                    <IconComponent size={24} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Runners Grid */}
      <div className="space-y-6 pt-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900 text-xl">Available Runners</h3>
          <button className="text-[#2D531A] font-bold text-sm hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-all">
          {runners
            .filter(r => !activeCategory || r.specialties.includes(activeCategory))
            .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(runner => (
              <RunnerCard key={runner.id} runner={runner} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;