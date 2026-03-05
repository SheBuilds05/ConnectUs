// src/pages/UserHomePage.jsx
import React, { useState } from 'react';
import * as Icons from 'lucide-react'; 
import { 
  Search, 
  MapPin, 
  Bell, 
  SlidersHorizontal, 
  ArrowRight, 
  ShieldCheck, 
  Menu,
  Package,
  ShoppingBag
} from 'lucide-react';
import { RunnerCard } from '../components/RunnerCard';
import { RunnerModal } from '../components/RunnerModal';
import { categories, runners } from '../data/mockData';

const UserHomePage = ({ onMenuClick, isSidebarOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedRunner, setSelectedRunner] = useState(null);

  // Function to scroll to runners section
  const scrollToRunners = () => {
    const runnersSection = document.getElementById('runners-section');
    if (runnersSection) {
      runnersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to navigate to about page
  const goToAboutPage = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    alert('Navigating to About page - implement your routing here');
  };

  return (
    <div className="min-h-screen w-full bg-[#D3D3D3]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 space-y-8">
        
        {/* Header Section - Logo Removed */}
        <div className="flex items-center justify-between pt-2 pb-2 border-b border-gray-200/50">
          {/* Left: Hamburger Menu + Page Title (No Logo) */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu */}
            <button 
              onClick={onMenuClick}
              className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors lg:flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <Menu size={20} className="text-[#0D330E]" />
            </button>

            {/* Page Title - Only text, no logo */}
            <h1 className="text-lg sm:text-xl md:text-2xl font-black text-[#0D330E] tracking-tight">
              Home
            </h1>
          </div>

          {/* Center: Location (Desktop only) */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100">
            <MapPin size={16} className="text-[#2D531A]" />
            <span className="text-sm font-medium text-gray-700">Sandton, Johannesburg</span>
          </div>

          {/* Right: Notifications */}
          <button className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>

        {/* Mobile Location Row */}
        <div className="md:hidden flex items-center justify-between -mt-2">
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin size={14} className="text-[#477023]" />
            <span className="text-xs font-medium">Sandton, Johannesburg</span>
          </div>
        </div>

        {/* Information Banner */}
        <div className="relative bg-[#0D330E] rounded-2xl overflow-hidden shadow-lg w-full">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white/80 text-xs font-bold uppercase tracking-wider mb-6 w-fit">
                <ShieldCheck size={14} />
                Trusted by 10,000+ users
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                Your personal assistant for{' '}
                <span className="text-[#A3B18A] relative inline-block">
                  everything
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <path d="M0,5 Q25,0 50,5 T100,5" stroke="#A3B18A" strokeWidth="2" fill="none" strokeOpacity="0.5"/>
                  </svg>
                </span>{' '}
                in the city.
              </h1>
              
              <p className="text-white/70 text-sm md:text-base mb-8 leading-relaxed max-w-md">
                Connect with trusted local runners who handle your shopping, pickups, and deliveries—so you don't have to.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={scrollToRunners}
                  className="flex items-center gap-2 bg-[#7EA00E] hover:bg-[#8eb510] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold transition-all group shadow-lg shadow-black/20 text-sm md:text-base"
                >
                  Book Runner
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={goToAboutPage}
                  className="text-white/80 hover:text-white px-4 py-3 md:px-6 md:py-4 font-medium transition-colors text-sm md:text-base"
                >
                  Learn more →
                </button>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-6 md:gap-8 mt-8 pt-8 border-t border-white/10">
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white">500+</div>
                  <div className="text-[10px] md:text-xs text-white/50 font-medium">Trusted Runners</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white">10k+</div>
                  <div className="text-[10px] md:text-xs text-white/50 font-medium">Deliveries</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white">4.9★</div>
                  <div className="text-[10px] md:text-xs text-white/50 font-medium">Rating</div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Visual Elements */}
            <div className="relative hidden md:block min-h-100 bg-linear-to-br from-[#2D531A]/30 to-[#0D330E] overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
                  <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.2"/>
                  </pattern>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              <div className="absolute bottom-10 left-10 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#7EA00E] rounded-full flex items-center justify-center">
                    <Package size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold">Package delivered</div>
                    <div className="text-white/50 text-xs">2 min ago</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-20 right-10 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#7EA00E] rounded-full flex items-center justify-center">
                    <ShoppingBag size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold">Shopping in progress</div>
                    <div className="text-white/50 text-xs">3 items found</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-10 -top-10 w-64 h-64 bg-[#7EA00E]/20 rounded-full blur-3xl"></div>
              <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-[#2D531A]/40 rounded-full blur-3xl"></div>
            </div>
          </div>
          
          <div className="md:hidden h-24 bg-linear-to-t from-[#2D531A]/30 to-transparent mt-4"></div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 w-full">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2D531A] transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search grocery, tech, or runners..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-md ring-1 ring-gray-200 focus:ring-2 focus:ring-[#2D531A] outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-4 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors shadow-md">
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Categories Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg md:text-xl tracking-tight">Categories</h3>
            {activeCategory && (
              <button 
                onClick={() => setActiveCategory(null)}
                className="text-xs font-medium text-[#2D531A] hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const IconComponent = Icons[cat.iconName] || Icons.HelpCircle;
              const isActive = activeCategory === cat.name;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? null : cat.name)}
                  className="flex flex-col items-center gap-2 group"
                >
                  {/* Circular Icon Container */}
                  <div className={`
                    w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center
                    transition-all duration-300 
                    ${isActive 
                      ? 'bg-[#2D531A] scale-105 shadow-lg border-2 border-white' 
                      : 'bg-[#97A97E] bg-opacity-20 group-hover:bg-opacity-30 group-hover:scale-105 group-hover:shadow-md'
                    }
                  `}>
                    <div className={`
                      p-2 sm:p-3 rounded-full transition-all duration-300
                      ${isActive ? 'text-white' : 'text-[#2D531A] group-hover:scale-110'}
                    `}>
                      <IconComponent size={24} />
                    </div>
                  </div>
                  
                  {/* Category Label */}
                  <span className={`
                    text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300
                    ${isActive 
                      ? 'text-[#2D531A]' 
                      : 'text-gray-600 group-hover:text-[#2D531A] group-hover:font-black'
                    }
                  `}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Runners Grid */}
        <div id="runners-section" className="space-y-5 pt-2 scroll-mt-20">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg md:text-xl">Available Runners</h3>
            <button className="text-[#2D531A] font-bold text-xs md:text-sm hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-all">
            {runners
              .filter(r => !activeCategory || r.specialties.includes(activeCategory))
              .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(runner => (
                <RunnerCard 
                  key={runner.id} 
                  runner={runner} 
                  onClick={() => setSelectedRunner(runner)} 
                />
            ))}
          </div>
        </div>

        {/* Runner Modal */}
        <RunnerModal 
          runner={selectedRunner} 
          isOpen={!!selectedRunner} 
          onClose={() => setSelectedRunner(null)} 
        />
      </div>
    </div>
  );
};

export default UserHomePage;