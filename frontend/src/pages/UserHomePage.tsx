// src/pages/UserHomePage.jsx
import React, { useState } from 'react';
import * as Icons from 'lucide-react'; 
import { Search, MapPin, Bell, SlidersHorizontal, Menu, Star, Zap, Shield, Clock } from 'lucide-react';
import { RunnerCard } from '../components/RunnerCard';
import { RunnerModal } from '../components/RunnerModal';
import { categories, runners } from '../data/mockData';
import UserSidebar from '../components/UserSidebar';
import BottomNav from '../components/BottomNav';

const UserHomePage = ({ onMenuClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedRunner, setSelectedRunner] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logoUrl = "https://raw.githubusercontent.com/SheBuilds05/ConnectUs/main/dir/lOGO.png";
  
  const scrollToRunners = () => {
    document.getElementById('runners-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen w-full bg-[#D3D3D3] relative overflow-x-hidden">
      
      {/* Sidebar Component - fixed position */}
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #0D330E 0px, #0D330E 2px, transparent 2px, transparent 8px)`
      }}></div>
      
      <div className="fixed inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-[#0D330E]/5"></div>
      
      <div className="fixed top-0 -right-20 w-96 h-96 bg-[#A3B18A]/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 -left-20 w-96 h-96 bg-[#2D531A]/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-[#6E8649]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-1/3 right-1/3 w-80 h-80 bg-[#A3B18A]/15 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(13,51,14,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(13,51,14,0.1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.1)]"></div>
      
      {/* Main content - shrinks when sidebar opens */}
      <div 
        className={`relative z-10 w-full px-4 sm:px-6 lg:px-8 py-4 space-y-8 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:max-w-[calc(100%-16rem)] lg:ml-auto lg:mr-0' : 'max-w-full mx-auto'
        }`}
        style={{
          transform: isSidebarOpen ? 'scale(0.98)' : 'scale(1)',
          transformOrigin: 'center right'
        }}
      >
        
        {/* HEADER - Removed logo next to hamburger menu */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-gray-400/20 bg-white/5 backdrop-blur-sm px-4 rounded-2xl">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar} 
              className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 hover:scale-105 transition-all"
              aria-label="Toggle menu"
            >
              <Menu size={20} className="text-[#0D330E]" />
            </button>
            
            {/* Logo removed - only hamburger menu remains */}
          </div>

          <div className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md rounded-full border border-white/40 shadow-sm">
            <MapPin size={14} className="text-[#2D531A]" />
            <span className="text-xs font-bold text-gray-700 uppercase">Sandton, JHB</span>
          </div>

          <button className="p-2.5 bg-white rounded-full shadow-sm relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* BANNER */}
        <div className="relative bg-gradient-to-br from-[#0D330E] to-[#1A4A1A] rounded-[2rem] overflow-hidden shadow-2xl w-full border border-[#A3B18A]/30 group">
          {/* ... banner content remains the same ... */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-[#A3B18A] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(163,177,138,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
          
          <div className="flex flex-col md:flex-row min-h-[350px] md:min-h-[400px] relative">
            
            {/* Left Content */}
            <div className="flex-[1.5] p-8 md:p-12 flex flex-col justify-center z-20 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[3px] w-12 bg-[#A3B18A]"></div>
                <span className="text-[#A3B18A] text-xs font-black uppercase tracking-[0.3em] flex items-center gap-1">
                  <Zap size={14} className="text-[#A3B18A]" /> PREMIUM SERVICE
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-light text-white mb-3 leading-tight tracking-tight">
                Your personal assistant for <br />
                <span className="font-black italic bg-gradient-to-r from-[#A3B18A] to-[#C5D3B0] text-transparent bg-clip-text text-5xl md:text-7xl">
                  everything,
                </span>
              </h1>
              
              <h2 className="text-2xl md:text-3xl font-light text-white/90 mb-4 flex items-center gap-3">
                whenever you <span className="font-bold">need them.</span>
                <Clock size={22} className="text-[#A3B18A] animate-pulse" />
              </h2>
              
              <p className="text-white/80 text-sm md:text-base max-w-lg mb-6 leading-relaxed flex items-start gap-3">
                <Shield size={18} className="text-[#A3B18A] mt-0.5 flex-shrink-0" />
                <span>Connect with trusted local runners who handle your shopping, pickups, and deliveries—so you don't have to.</span>
              </p>
              
              <div className="flex gap-8 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#A3B18A]/20 flex items-center justify-center">
                    <Star size={14} className="text-[#A3B18A]" />
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-[#A3B18A]">500+</div>
                    <div className="text-white/50 text-[9px] uppercase tracking-wider">Active Runners</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#A3B18A]/20 flex items-center justify-center">
                    <Zap size={14} className="text-[#A3B18A]" />
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-[#A3B18A]">15min</div>
                    <div className="text-white/50 text-[9px] uppercase tracking-wider">Avg. Response</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#A3B18A]/20 flex items-center justify-center">
                    <Star size={14} className="text-[#A3B18A]" />
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-[#A3B18A]">4.9</div>
                    <div className="text-white/50 text-[9px] uppercase tracking-wider">Rating</div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={scrollToRunners}
                className="w-fit bg-white text-[#0D330E] px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#A3B18A] hover:text-white transition-all shadow-xl group/btn flex items-center gap-3"
              >
                Find Available Runners Now
                <span className="group-hover/btn:translate-x-2 transition-transform text-lg">→</span>
              </button>
              
              <div className="absolute bottom-6 left-6 md:left-auto md:bottom-8 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <span className="text-white/60 text-[9px] flex items-center gap-1">
                  <Shield size={12} className="text-[#A3B18A]" /> Verified & Fully Insured
                </span>
              </div>
            </div>
            
            {/* Right: Logo */}
            <div className="flex-1 relative flex items-center justify-center md:justify-end p-6 md:pr-16">
              <div className="absolute top-1/2 left-1/2 md:left-auto md:right-20 -translate-x-1/2 -translate-y-1/2 md:translate-x-0">
                <div className="relative w-56 h-56 md:w-64 md:h-64">
                  <div className="absolute inset-0 border border-[#A3B18A]/20 rounded-full animate-[spin_8s_linear_infinite]"></div>
                  <div className="absolute inset-3 border border-white/10 rounded-full animate-[spin_12s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-6 border border-[#A3B18A]/10 rounded-full animate-[spin_6s_linear_infinite]"></div>
                  
                  <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-[#A3B18A] rounded-full animate-ping"></div>
                  <div className="absolute bottom-0 right-1/2 w-1.5 h-1.5 bg-white rounded-full animate-ping delay-300"></div>
                </div>
              </div>
              
              <div className="relative z-10 group/logo">
                <div className="absolute inset-0 bg-[#A3B18A]/20 rounded-full blur-xl group-hover/logo:blur-2xl transition-all scale-125"></div>
                
                <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-white to-gray-100 p-3 shadow-[0_0_50px_rgba(163,177,138,0.6)] border-4 border-[#A3B18A]/30 group-hover/logo:scale-105 transition-all duration-700">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                    <img src={logoUrl} alt="ConnectUs Logo" className="w-full h-full object-cover scale-110 group-hover/logo:scale-125 transition-transform duration-700" />
                  </div>
                </div>
                
                <div className="absolute -top-3 -right-3 bg-[#A3B18A] text-[#0D330E] text-[10px] font-bold px-3 py-1.5 rounded-full animate-bounce shadow-lg">
                  24/7 AVAILABLE
                </div>
                <div className="absolute -bottom-3 -left-3 bg-white/20 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 rounded-full border border-white/30">
                  ⚡ FAST RESPONSE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="w-full relative group/search z-20">
          {/* ... search bar content remains the same ... */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#A3B18A] via-[#2D531A] to-[#0D330E] rounded-[2rem] blur-xl opacity-20 group-hover/search:opacity-30 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="relative flex gap-3 w-full">
            <div className="relative flex-1">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#A3B18A] to-transparent rounded-full opacity-0 group-hover/search:opacity-100 transition-opacity pointer-events-none"></div>
              
              <div className="relative overflow-hidden rounded-[1.8rem] bg-white/90 backdrop-blur-xl shadow-2xl border border-white/50 focus-within:border-[#A3B18A] transition-all duration-300">
                <div className="absolute inset-0 opacity-0 focus-within:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#A3B18A]/20 via-transparent to-[#2D531A]/20 animate-pulse"></div>
                </div>
                
                <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <Search size={22} className="text-gray-400 group-focus-within/search:text-[#2D531A] transition-colors" />
                </div>
                
                <input
                  type="text"
                  placeholder="Search for groceries, electronics, fashion, or specific runners..."
                  className="w-full pl-16 pr-32 py-6 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-base relative z-30"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                />
                
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 z-30">
                  <div className="hidden md:flex items-center gap-1 mr-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1 pointer-events-none">Quick:</span>
                    {['Food', 'Tech', 'Fashion'].map(cat => (
                      <button 
                        key={cat}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveCategory(cat);
                        }}
                        className={`text-[9px] font-bold px-2 py-1 rounded-full transition-all ${activeCategory === cat ? 'bg-[#2D531A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} cursor-pointer`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    type="button"
                    className="p-2.5 bg-gray-100 rounded-full hover:bg-[#2D531A] hover:text-white transition-all group/voice cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      alert('Voice search coming soon!');
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
                    </svg>
                  </button>
                </div>
                
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 focus-within:w-full h-0.5 bg-gradient-to-r from-transparent via-[#A3B18A] to-transparent transition-all duration-500 pointer-events-none"></div>
              </div>
            </div>
            
            <button 
              type="button"
              className="relative group/filter cursor-pointer z-30"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Filter clicked');
              }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#2D531A] to-[#0D330E] rounded-[1.8rem] blur-md opacity-0 group-hover/filter:opacity-50 transition-opacity pointer-events-none"></div>
              
              <div className="relative p-6 bg-gradient-to-br from-[#0D330E] to-[#1A4A1A] text-white rounded-[1.8rem] shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center border border-[#A3B18A]/30">
                <SlidersHorizontal size={24} className="group-hover/filter:rotate-180 transition-transform duration-500" />
                
                {activeCategory && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#A3B18A] rounded-full border-2 border-white flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </span>
                )}
              </div>
              
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-500 uppercase tracking-wider opacity-0 group-hover/filter:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Filters {activeCategory ? `(Active: ${activeCategory})` : ''}
              </span>
            </button>
          </div>
        </div>

        {/* CATEGORIES SECTION */}
        <div className="space-y-8 py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#A3B18A] to-transparent"></div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#0D330E] opacity-60">EXPLORE SERVICES</h3>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#A3B18A] to-transparent"></div>
            </div>
            <p className="text-xs text-gray-500 italic">Find the perfect runner for your needs</p>
          </div>
          
          <div className="flex justify-center w-full px-4">
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10">
              {categories.map((cat) => {
                const IconComponent = Icons[cat.iconName] || Icons.HelpCircle;
                const isActive = activeCategory === cat.name;
                
                const inactiveBg = 'bg-[#D9E5D6]';
                
                return (
                  <button 
                    key={cat.id} 
                    onClick={() => setActiveCategory(isActive ? null : cat.name)} 
                    className="group relative flex flex-col items-center gap-4"
                  >
                    <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-b from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    
                    <div className={`
                      relative w-24 h-24 md:w-28 md:h-28 rounded-[2.5rem] 
                      flex items-center justify-center 
                      transition-all duration-500 ease-out
                      ${isActive 
                        ? 'bg-[#2D531A] shadow-2xl scale-110 -translate-y-2' 
                        : `${inactiveBg} shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1`
                      }
                    `}>
                      {isActive && (
                        <>
                          <div className="absolute inset-0 rounded-[2.5rem] bg-white/20 blur-sm"></div>
                          <div className="absolute -inset-1 rounded-[2.8rem] bg-[#A3B18A]/30 blur-md animate-pulse"></div>
                        </>
                      )}
                      
                      <IconComponent 
                        size={36} 
                        className={`
                          relative z-10 transition-all duration-300
                          ${isActive ? 'text-white scale-110' : 'text-[#2D531A] group-hover:scale-110'}
                        `} 
                        strokeWidth={1.2} 
                      />
                      
                      {!isActive && (
                        <>
                          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#A3B18A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-[#A3B18A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </>
                      )}
                    </div>
                    
                    <div className="relative">
                      <span className={`
                        text-[11px] font-extrabold uppercase tracking-widest 
                        transition-all duration-300 px-3 py-1 rounded-full
                        ${isActive 
                          ? 'text-[#2D531A] bg-white/80 shadow-md' 
                          : 'text-gray-500 group-hover:text-[#2D531A]'
                        }
                      `}>
                        {cat.name}
                      </span>
                      
                      {isActive && (
                        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#2D531A] rounded-full"></span>
                      )}
                    </div>
                    
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-4 bg-black/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {activeCategory && (
            <div className="flex justify-center mt-4">
              <div className="bg-white/70 backdrop-blur-sm px-5 py-2 rounded-full shadow-md border border-[#A3B18A]/30 flex items-center gap-3">
                <span className="text-xs text-[#2D531A]">
                  Showing <span className="font-bold">{activeCategory}</span> runners
                </span>
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="text-[10px] font-bold text-gray-500 hover:text-[#2D531A] transition-colors uppercase tracking-wider"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Runners Grid */}
        <div id="runners-section" className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-[#0D330E] text-lg md:text-xl tracking-tight uppercase tracking-widest">Available Runners</h3>
            <button className="text-[#2D531A] font-bold text-xs hover:underline tracking-widest">View All</button>
          </div>
          <div className="grid !grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full">
            {runners
              .filter(r => !activeCategory || r.specialties.includes(activeCategory))
              .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(runner => (
                <div key={runner.id} className="w-full min-w-0">
                  <RunnerCard runner={runner} onClick={() => setSelectedRunner(runner)} />
                </div>
            ))}
          </div>
        </div>

        <RunnerModal runner={selectedRunner} isOpen={!!selectedRunner} onClose={() => setSelectedRunner(null)} />
      </div>

      {/* Bottom Navigation - Conditionally sized based on sidebar state */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64 lg:w-[calc(100%-16rem)]' : 'ml-0 w-full'
        }`}
      >
        <BottomNav />
      </div>
    </div>
  );
};

export default UserHomePage;
