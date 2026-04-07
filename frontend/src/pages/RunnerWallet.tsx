import React, { useState } from 'react';
import { 
  Wallet, ArrowUpRight, Landmark, TrendingUp, 
  Package, X, Menu, Bell, MapPin, CreditCard
} from 'lucide-react';
import RunnerSidebar from '../components/RunnerSidebar';

const RunnerWallet = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [step, setStep] = useState(1);

  const stats = [
    { label: 'Total Earned', value: 'R 12,450', icon: <TrendingUp size={18} />, color: 'bg-[#477023]' },
    { label: 'Withdrawn', value: 'R 8,200', icon: <ArrowUpRight size={18} />, color: 'bg-[#6E8649]' },
    { label: 'Net Profit', value: 'R 4,250', icon: <Wallet size={18} />, color: 'bg-[#0D330E]' },
    { label: 'Total Orders', value: '156', icon: <Package size={18} />, color: 'bg-[#2D531A]' },
  ];

  return (
    <div className="min-h-screen bg-[#D3D3D3] font-sans text-[#0D330E] flex relative overflow-x-hidden">
      <RunnerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        
        {/* RESTORED: CLEAN GLASS NAVIGATION BAR */}
        <nav className="w-full bg-white/40 backdrop-blur-md border-b border-white/40 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 bg-[#0D330E] text-white rounded-full hover:scale-105 transition-all shadow-md"
                >
                    <Menu size={20} />
                </button>
                <div className="hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6E8649]">Runner Hub</p>
                    <h2 className="text-sm font-black italic uppercase italic">Financials</h2>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-white/60 rounded-full border border-white/40 shadow-sm">
                    <MapPin size={14} className="text-[#477023]" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Sandton, JHB</span>
                </div>
                <button className="p-2 bg-white rounded-full shadow-sm border border-white/60">
                    <Bell size={20} className="text-[#0D330E]" />
                </button>
            </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
            
            <header className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#0D330E]">
                        My <span className="text-[#477023]">Wallet</span>
                    </h1>
                    <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#6E8649]">Revenue Tracking & Payouts</p>
                </div>
            </header>

            {/* CONDENSED STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm p-5 rounded-[1.5rem] shadow-sm border border-white/60 group hover:bg-white transition-all">
                        <div className={`${stat.color} text-white w-fit p-2 rounded-xl mb-3 shadow-md`}>
                            {stat.icon}
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                        <p className="text-xl font-black italic tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* BALANCE CARD - Compact & Sleek */}
                <div className="lg:col-span-5 bg-[#0D330E] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-8">
                            <CreditCard className="text-[#6E8649]" size={32} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-[#477023] px-3 py-1 rounded-full">Secure</span>
                        </div>
                        <p className="text-[10px] font-bold text-[#A3B18A] uppercase tracking-[0.3em] mb-1">Available to Withdraw</p>
                        <h2 className="text-5xl font-black italic tracking-tighter mb-8 text-[#D3D3D3]">R 4,250.00</h2>
                    </div>
                    
                    <button 
                        onClick={() => { setStep(1); setShowWithdrawModal(true); }}
                        className="relative z-10 w-full py-4 bg-[#6E8649] hover:bg-[#477023] text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        Withdraw Funds <ArrowUpRight size={16} />
                    </button>

                    {/* Design flourish */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#477023]/20 rounded-full blur-3xl"></div>
                </div>

                {/* GRAPH SECTION - Slimmed Down */}
                <div className="lg:col-span-7 bg-[#477023]/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-[#477023]/10 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black italic uppercase text-lg text-[#477023]">Earnings Progress</h3>
                        <div className="text-[9px] font-black uppercase text-[#6E8649] px-3 py-1 bg-white/50 rounded-full border border-white/80 italic">Last 7 Days</div>
                    </div>
                    
                    <div className="flex-1 flex items-end justify-between gap-2 px-2 min-h-[160px]">
                        {[40, 75, 50, 90, 60, 85, 100].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                <div className="w-full bg-[#0D330E]/5 rounded-xl relative h-full overflow-hidden border border-white/30 group">
                                    <div 
                                        className="absolute bottom-0 w-full bg-gradient-to-t from-[#0D330E] to-[#6E8649] group-hover:to-[#477023] transition-all duration-700 rounded-t-lg" 
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                                <span className="text-[8px] font-black uppercase text-gray-400">Day {i+1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* WITHDRAWAL MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#0D330E]/60 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)}></div>
          <div className="relative bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-300">
            <div className="p-8 bg-[#0D330E] text-white flex justify-between items-center">
              <h3 className="text-xl font-black italic uppercase tracking-tighter italic">Withdraw</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="bg-white/10 p-1.5 rounded-full hover:bg-white/20"><X size={20}/></button>
            </div>

            <div className="p-8">
              {step === 1 ? (
                <div className="space-y-6">
                   <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#477023] ml-1">Enter Amount</label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-2xl italic text-[#0D330E]">R</span>
                        <input 
                            type="number" 
                            className="w-full bg-[#D3D3D3]/40 p-4 pl-12 rounded-2xl outline-none font-black text-3xl italic text-[#0D330E] focus:ring-2 ring-[#6E8649]"
                            placeholder="0.00"
                        />
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-[#0D330E] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Next: Bank Details
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input type="text" placeholder="Bank Name" className="w-full bg-[#D3D3D3]/30 p-4 rounded-xl outline-none font-bold text-xs" />
                  <input type="text" placeholder="Account Holder" className="w-full bg-[#D3D3D3]/30 p-4 rounded-xl outline-none font-bold text-xs" />
                  <input type="text" placeholder="Account Number" className="w-full bg-[#D3D3D3]/30 p-4 rounded-xl outline-none font-bold text-xs" />
                  <input type="text" placeholder="Branch Code" className="w-full bg-[#D3D3D3]/30 p-4 rounded-xl outline-none font-bold text-xs" />
                  
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-200 text-gray-500 font-black text-[9px] uppercase rounded-xl">Back</button>
                    <button 
                        onClick={() => { alert("Requested!"); setShowWithdrawModal(false); }} 
                        className="flex-[2] py-4 bg-[#6E8649] text-white font-black uppercase tracking-widest text-[9px] rounded-xl shadow-lg"
                    >
                        Confirm Transfer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunnerWallet;