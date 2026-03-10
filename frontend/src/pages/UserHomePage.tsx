// src/pages/UserHomePage.tsx
import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react'; 
import { 
  Search, MapPin, Bell, Menu, Star, 
  Zap, Shield, Clock, RefreshCw, Users, X, MessageCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RunnerCard from '../components/RunnerCard';
import { RunnerModal } from '../components/RunnerModal';
import { categories } from '../data/mockData';
import UserSidebar from '../components/UserSidebar';
import BottomNav from '../components/BottomNav';
import { getCurrentUser, getUserName } from '../services/api';
import { getRunners, Runner } from '../services/runnerService';
import { useNavigate } from 'react-router-dom';

interface Location {
  lat: number;
  lng: number;
  city: string;
  error?: string;
}

const UserHomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [location, setLocation] = useState<Location>({
    lat: -26.1076,
    lng: 28.0547,
    city: 'Sandton, JHB'
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState('');
  const [runners, setRunners] = useState<Runner[]>([]);
  const [filteredRunners, setFilteredRunners] = useState<Runner[]>([]);
  const [isLoadingRunners, setIsLoadingRunners] = useState(false);
  const [runnersError, setRunnersError] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: "Hi! How can I help you today?", isUser: false }
  ]);
  const [chatInput, setChatInput] = useState('');

  const logoUrl = "https://raw.githubusercontent.com/SheBuilds05/ConnectUs/main/dir/lOGO.png";

  useEffect(() => {
    const user = getCurrentUser();
    const name = getUserName();
    setUserName(name);
    setUserEmail(user?.email || '');
    getUserLocation();
    fetchAllRunners();

    // Handle window resize for responsive grid
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (location.lat && location.lng) {
      fetchAllRunners();
    }
  }, [location, activeCategory, searchTerm]);

  useEffect(() => {
    // Filter runners based on active category and search term
    let filtered = [...runners];
    
    if (activeCategory) {
      filtered = filtered.filter(r => 
        r.bio?.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.username.toLowerCase().includes(term) ||
        r.bio?.toLowerCase().includes(term) ||
        r.city?.toLowerCase().includes(term)
      );
    }
    
    setFilteredRunners(filtered);
  }, [runners, activeCategory, searchTerm]);

  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const city = await getCityFromCoordinates(latitude, longitude);
          
          setLocation({
            lat: latitude,
            lng: longitude,
            city: city
          });
        } catch (error) {
          console.error('Error getting city name:', error);
          setLocation({
            lat: latitude,
            lng: longitude,
            city: 'Your Location'
          });
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const getCityFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
      );
      const data = await response.json();
      
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.suburb || data.address.county || 'Unknown';
        return city;
      }
      return 'Your Location';
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return 'Your Location';
    }
  };

  const fetchAllRunners = async () => {
    setIsLoadingRunners(true);
    setRunnersError('');
    
    try {
      const fetchedRunners = await getRunners({
        lat: location.lat,
        lng: location.lng,
        category: activeCategory || undefined,
        search: searchTerm || undefined
      });
      setRunners(fetchedRunners);
      setFilteredRunners(fetchedRunners);
    } catch (error: any) {
      console.error('Error fetching runners:', error);
      setRunnersError(error.message || 'Failed to fetch runners');
    } finally {
      setIsLoadingRunners(false);
    }
  };

  const scrollToRunners = () => {
    document.getElementById('runners-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const refreshLocation = () => {
    getUserLocation();
  };

  // Chat functions
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, { text: chatInput, isUser: true }]);
    
    // Generate bot response based on input
    const botResponse = generateBotResponse(chatInput.toLowerCase());
    
    // Add bot response after a short delay
    setTimeout(() => {
      setChatMessages(prev => [...prev, { text: botResponse, isUser: false }]);
    }, 500);

    setChatInput('');
  };

  const generateBotResponse = (message: string): string => {
    if (message.includes('hello') || message.includes('hi')) {
      return `Hello ${userName}! How can I help you today?`;
    }
    if (message.includes('runner') || message.includes('delivery')) {
      const count = filteredRunners.length;
      if (count > 0) {
        return `We have ${count} runners available! The top ones are ${filteredRunners.slice(0, 3).map(r => r.username).join(', ')}. You can click on any runner to see their profile.`;
      } else {
        return "I don't see any runners available right now. Please check back later.";
      }
    }
    if (message.includes('food') || message.includes('grocery')) {
      const foodRunners = filteredRunners.filter(r => 
        r.bio?.toLowerCase().includes('food') || r.bio?.toLowerCase().includes('grocery')
      );
      if (foodRunners.length > 0) {
        return `🍔 I found ${foodRunners.length} runners for food delivery! Check out ${foodRunners[0]?.username}.`;
      }
      return "No food delivery runners at the moment. Try another category?";
    }
    if (message.includes('tech') || message.includes('electronic')) {
      return "💻 For electronics, check out our tech specialists above!";
    }
    if (message.includes('book') || message.includes('how to')) {
      return "📅 To book a runner: 1) Find a runner you like 2) Click their card 3) Hit 'View full profile' 4) Click 'Book Now'!";
    }
    if (message.includes('price') || message.includes('cost')) {
      return "💰 Prices vary by runner. Most range from R50 to R500. You'll see exact prices when you book!";
    }
    if (message.includes('thank')) {
      return "You're welcome! 😊 Let me know if you need anything else.";
    }
    
    return "I'm here to help! You can ask me about finding runners, prices, or how to book.";
  };

  // Responsive grid columns based on screen width
  const getGridColumns = () => {
    if (windowWidth < 640) return 1;      // mobile: 1 card
    if (windowWidth < 1024) return 2;     // tablet: 2 cards
    return 4;                              // desktop: 4 cards
  };

  return (
    <div className="min-h-screen w-full bg-[#D3D3D3] relative overflow-x-hidden">
      
      {/* Sidebar Component */}
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
      
      {/* Main content */}
      <div 
        className={`relative z-10 w-full px-4 sm:px-6 lg:px-8 py-4 space-y-8 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:max-w-[calc(100%-16rem)] lg:ml-auto lg:mr-0' : 'max-w-full mx-auto'
        }`}
        style={{
          transform: isSidebarOpen ? 'scale(0.98)' : 'scale(1)',
          transformOrigin: 'center right'
        }}
      >
        
        {/* HEADER */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-gray-400/20 bg-white/5 backdrop-blur-sm px-4 rounded-2xl">
          {/* Left side - Hamburger menu and user greeting */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar} 
              className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 hover:scale-105 transition-all"
              aria-label="Toggle menu"
            >
              <Menu size={20} className="text-[#0D330E]" />
            </button>
            
            <div className="hidden sm:block">
              <span className="text-sm text-gray-600">Welcome back,</span>
              <h2 className="text-lg font-bold text-[#0D330E]">{userName}</h2>
            </div>
          </div>

          {/* MIDDLE - Location Display */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md rounded-full border border-white/40 shadow-sm">
              {isLoadingLocation ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-[#2D531A]" />
                  <span className="text-xs font-bold text-gray-700">Getting location...</span>
                </>
              ) : (
                <>
                  <MapPin size={14} className="text-[#2D531A]" />
                  <span className="text-xs font-bold text-gray-700">{location.city}</span>
                  <button 
                    onClick={refreshLocation}
                    className="ml-2 p-1 hover:bg-[#2D531A]/10 rounded-full transition-colors"
                    title="Refresh location"
                  >
                    <RefreshCw size={12} className="text-[#2D531A]" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right side - Notification Bell AND Chat Button */}
          <div className="flex items-center gap-2">
            {/* Chat Button */}
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-2.5 bg-white rounded-full shadow-sm relative hover:bg-gray-50 transition-colors"
              title="Assistant"
            >
              <MessageCircle size={20} className="text-gray-600" />
            </button>

            {/* Notification Bell */}
            <div className="relative group">
              <button className="p-2.5 bg-white rounded-full shadow-sm relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 px-3 text-xs text-gray-600 hidden group-hover:block">
                {userEmail}
              </div>
            </div>
          </div>
        </div>

        {/* Location error banner */}
        {locationError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{locationError}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={refreshLocation}
                  className="text-sm text-yellow-700 hover:text-yellow-900 font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BANNER - KEPT EXACTLY AS IS */}
        <div className="relative bg-gradient-to-br from-[#0D330E] to-[#1A4A1A] rounded-[2rem] overflow-hidden shadow-2xl w-full border border-[#A3B18A]/30 group">
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
                Hey {userName.split(' ')[0]}, your personal assistant for <br />
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
                <span>Connect with trusted local runners near {location.city} who handle your shopping, pickups, and deliveries—so you don't have to.</span>
              </p>
              
              <div className="flex gap-8 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#A3B18A]/20 flex items-center justify-center">
                    <Star size={14} className="text-[#A3B18A]" />
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-[#A3B18A]">{runners.length}+</div>
                    <div className="text-white/50 text-[9px] uppercase tracking-wider">Available Runners</div>
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
          {/* ... (keep your existing search bar code) ... */}
        </div>

        {/* CATEGORIES SECTION */}
        <div className="space-y-8 py-8">
          {/* ... (keep your existing categories code) ... */}
        </div>

        {/* RUNNERS GRID */}
        <div id="runners-section" className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-[#0D330E] text-lg md:text-xl tracking-tight uppercase tracking-widest">
              Available Runners Near You
              {!isLoadingLocation && !locationError && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  within 5km of {location.city}
                </span>
              )}
            </h3>
            <button 
              onClick={fetchAllRunners}
              className="text-[#2D531A] font-bold text-xs hover:underline tracking-widest flex items-center gap-1"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {/* Loading State */}
          {isLoadingRunners && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D531A]"></div>
            </div>
          )}

          {/* Error State */}
          {runnersError && !isLoadingRunners && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{runnersError}</p>
              <button 
                onClick={fetchAllRunners}
                className="bg-[#2D531A] text-white px-6 py-2 rounded-full text-sm hover:bg-[#0D330E] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Runners Grid */}
          {!isLoadingRunners && !runnersError && (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
                gap: '1.5rem',
                width: '100%'
              }}
            >
              {filteredRunners.length > 0 ? (
                filteredRunners.map(runner => (
                  <div key={runner.runner_id} style={{ width: '100%' }}>
                    <RunnerCard 
                      runner={runner} 
                      onClick={() => setSelectedRunner(runner)} 
                    />
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1' }} className="text-center py-12">
                  <p className="text-gray-500">No runners found in your area</p>
                  <button 
                    onClick={fetchAllRunners}
                    className="mt-4 text-[#2D531A] hover:text-[#0D330E] font-medium"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Simple Custom Chat */}
        {showChat && (
          <div className="fixed bottom-20 right-4 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200">
            <div className="bg-[#2D531A] text-white p-3 flex justify-between items-center rounded-t-2xl">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                <span className="font-bold">ConnectUs Assistant</span>
              </div>
              <button 
                onClick={() => setShowChat(false)} 
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="h-96 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-2">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.isUser 
                      ? 'bg-[#2D531A] text-white ml-auto' 
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t bg-white rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:border-[#2D531A]"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-[#2D531A] text-white rounded-lg text-sm hover:bg-[#1a3a0f] transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Chat Button (when chat is closed) */}
        {!showChat && (
          <button
            onClick={() => setShowChat(true)}
            className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-[#2D531A] text-white rounded-full shadow-lg hover:bg-[#1a3a0f] transition-colors flex items-center justify-center hover:scale-110 transform transition-all"
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>

      {/* Bottom Navigation */}
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
