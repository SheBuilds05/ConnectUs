import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  MessageSquareCode, 
  ShieldCheck, 
  Search,
} from 'lucide-react';

const LandingPage = () => {
  return (
    // Main container with deep dark background
    <div className="min-h-screen bg-[#0D330E] text-white font-sans overflow-hidden">
      
      {/* Navigation - Dark Theme */}
      <nav className="border-b border-[#6E8649]/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
              <span className="text-[#0D330E] font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">Connect<span className="text-[#477023]">Us</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-white/70">
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Runners</a>
            <a href="#" className="hover:text-white">Pricing</a>
          </div>

          <Link to="/register" className="bg-[#477023] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#6E8649] transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section - Dark & Minimalist */}
      <header className="py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-6 relative z-10">
            <h1 className="text-6xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8">
              ConnectUs. <br />
              <span className="text-[#6E8649]">Your Local Items, Delivered</span>
            </h1>
            
            {/* Search Bar - Stylized as requested */}
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-[#0D330E] border border-white/20 rounded-full py-3 px-6 text-white placeholder:text-white/40 focus:outline-none focus:border-[#477023]"
              />
              <Search className="absolute right-5 top-3.5 text-white/40" size={20} />
            </div>

            <div className="flex gap-4">
              <button className="bg-white/10 text-white px-8 py-3 rounded-full font-bold hover:bg-white/20 transition-all border border-white/10">
                Find a Runner
              </button>
              <button className="text-white px-8 py-3 rounded-full font-bold hover:bg-white/5 transition-all">
                Become a Runner
              </button>
            </div>
          </div>

          {/* Graphical Element - Absolutely Positioned to match screenshot */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[600px] h-[600px] pointer-events-none">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full border border-[#477023]/30 animate-pulse"></div>
              <div className="absolute inset-16 rounded-full border border-[#6E8649]/20 animate-pulse delay-100"></div>
              <div className="absolute inset-32 rounded-full border border-[#6E8649]/10 animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Steps Section - Transparent Cards */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard 
              number="1"
              Icon={Camera}
              title="Upload Photos"
              desc="Take photos of exactly what you need. Our AI helps runners find the precise match."
            />
            <StepCard 
              number="2"
              Icon={MessageSquareCode}
              title="AI Assistant"
              desc="Our 24/7 AI coordinates availability and answers FAQs instantly."
            />
            <StepCard 
              number="3"
              Icon={ShieldCheck}
              title="Secure Payments"
              desc="Funds are held in escrow and only released once you confirm delivery."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Sub-component for clean, dark Step Cards
const StepCard = ({ number, Icon, title, desc }) => (
  <div className="group border border-white/10 p-8 rounded-3xl bg-white/5 hover:bg-white/10 transition-all">
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-[#6E8649]/20 rounded-2xl group-hover:bg-[#477023]/30 transition-colors">
        <Icon size={32} strokeWidth={1.5} className="text-white" />
      </div>
      <span className="text-5xl font-black text-white/10">{number}</span>
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
