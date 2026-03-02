import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  MessageSquareCode, 
  ShieldCheck, 
  Users, 
  Clock, 
  ChevronRight 
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#D3D3D3] text-[#0D330E] font-sans">
      
      {/* Navigation */}
      <nav className="bg-white/95 sticky top-0 z-50 border-b border-[#6E8649]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#0D330E] flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-black tracking-tighter">Connect<span className="text-[#477023]">Us</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#2D531A]">
            <a href="#" className="hover:text-[#0D330E]">How it Works</a>
            <a href="#" className="hover:text-[#0D330E]">AI Assistant</a>
            <a href="#" className="hover:text-[#0D330E]">Runners</a>
            <a href="#" className="hover:text-[#0D330E]">Pricing</a>
          </div>

          <Link to="/register" className="bg-[#0D330E] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#2D531A] transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-7">
            <h1 className="text-6xl md:text-7xl font-black text-[#0D330E] leading-[0.9] tracking-tighter mb-8">
              Your Local <span className="text-[#477023]">Items</span>, <br />
              <span className="text-[#0D330E]">Delivered</span>
            </h1>
            <p className="text-lg text-[#2D531A] mb-10 max-w-md leading-relaxed border-l-2 border-[#477023] pl-6">
              The marketplace connecting you to local runners. Real-time tracking, 
              AI-powered support, and secure escrow payments.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#0D330E] text-white px-8 py-3 rounded font-bold hover:bg-[#2D531A] transition-all">
                Find a Runner
              </button>
              <button className="border border-[#0D330E] text-[#0D330E] px-8 py-3 rounded font-bold hover:bg-white/50 transition-all">
                Become a Runner
              </button>
            </div>
          </div>

          {/* Professional Info Banner (Replacing Feed Card) */}
          <div className="md:col-span-5">
            <div className="bg-[#6E8649]/20 border border-[#6E8649]/30 rounded-2xl p-8 backdrop-blur-sm">
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Users size={28} className="text-[#0D330E]" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-[#0D330E]">2,500+</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-[#2D531A] opacity-70">Active Runners</div>
                  </div>
                </div>
                
                <div className="h-px bg-[#6E8649]/20 w-full" />

                <div className="flex items-center gap-6">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Clock size={28} className="text-[#0D330E]" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-[#0D330E]">98%</div>
                    <div className="text-sm font-bold uppercase tracking-wider text-[#2D531A] opacity-70">On-Time Delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-3xl font-black text-[#0D330E] tracking-tighter">How ConnectUs Works</h2>
            <div className="h-px bg-[#D3D3D3] flex-1" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <StepCard 
              number="01"
              Icon={Camera}
              title="Upload Photos"
              desc="Take photos of exactly what you need. Our AI helps runners find the precise match."
            />
            <StepCard 
              number="02"
              Icon={MessageSquareCode}
              title="AI Assistant"
              desc="Our 24/7 AI coordinates availability and answers FAQs instantly."
            />
            <StepCard 
              number="03"
              Icon={ShieldCheck}
              title="Secure Payments"
              desc="Funds are held in escrow and only released once you confirm delivery."
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto bg-[#0D330E] rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">Ready to get started?</h2>
          <button className="bg-[#6E8649] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#477023] transition-all flex items-center gap-2 mx-auto">
            CREATE FREE ACCOUNT <ChevronRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

// Sub-component for clean Step Cards
const StepCard = ({ number, Icon, title, desc }) => (
  <div className="group border border-[#D3D3D3] p-8 rounded-xl hover:border-[#477023] transition-all">
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-[#D3D3D3]/30 rounded-lg group-hover:bg-[#477023]/10 transition-colors">
        <Icon size={32} strokeWidth={1.5} className="text-[#0D330E]" />
      </div>
      <span className="text-4xl font-black text-[#D3D3D3] group-hover:text-[#477023]/20 transition-colors">{number}</span>
    </div>
    <h3 className="text-xl font-black text-[#0D330E] mb-3">{title}</h3>
    <p className="text-[#2D531A] text-sm leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;