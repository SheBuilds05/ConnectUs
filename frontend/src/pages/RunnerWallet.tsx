import React, { useState, useEffect } from 'react';
import { 
  Wallet, ArrowUpRight, Landmark, TrendingUp, 
  Package, X, Menu, Bell, MapPin, CreditCard, Loader2
} from 'lucide-react';
import RunnerSidebar from '../components/RunnerSidebar';

const RunnerWallet = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [step, setStep] = useState(1);
  const [useSaved, setUseSaved] = useState(true);
  
  // NEW: State for withdrawal logic
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const token = localStorage.getItem('token'); 
      
      const res = await fetch('/api/earnings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) setWalletData(json.data);

      const historyRes = await fetch('/api/earnings/history?period=week', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const historyJson = await historyRes.json();
      if (historyJson.success) setHistoryData(historyJson.data);

    } catch (error) {
      console.error("Failed to fetch wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawSubmit = async () => {
    const amount = parseFloat(withdrawAmount);
    const availableBalance = walletData?.summary?.total || 0;

    // VALIDATION: Check if amount is valid and within balance
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (amount > availableBalance) {
      alert(`Insufficient funds. You only have ${formatZAR(availableBalance)} available.`);
      return;
    }

    // Logic to call your withdrawal backend would go here
    alert(`Success! Withdrawal of ${formatZAR(amount)} has been requested.`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setStep(1);
  };

  const formatZAR = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount || 0);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#D3D3D3] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#0D330E]" size={40} />
    </div>
  );

  const stats = [
    { label: 'Total Earned', value: formatZAR(walletData?.summary?.total), icon: <TrendingUp size={18} />, color: 'bg-[#477023]' },
    { label: 'This Month', value: formatZAR(walletData?.summary?.month), icon: <ArrowUpRight size={18} />, color: 'bg-[#6E8649]' },
    { label: 'This Week', value: formatZAR(walletData?.summary?.week), icon: <Wallet size={18} />, color: 'bg-[#0D330E]' },
    { label: 'Today', value: formatZAR(walletData?.summary?.today), icon: <Package size={18} />, color: 'bg-[#2D531A]' },
  ];

  return (
    <div className="min-h-screen bg-[#D3D3D3] font-sans text-[#0D330E] flex relative overflow-x-hidden">
      <RunnerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <nav className="w-full bg-white/40 backdrop-blur-md border-b border-white/40 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-[#0D330E] text-white rounded-full hover:scale-105 transition-all shadow-md">
                    <Menu size={20} />
                </button>
                <div className="hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6E8649]">Runner Hub</p>
                    <h2 className="text-sm font-black italic uppercase">Financials</h2>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-white/60 rounded-full border border-white/40 shadow-sm">
                    <MapPin size={14} className="text-[#477023]" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-black">Sandton, JHB</span>
                </div>
            </div>
        </nav>

        <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
            <header>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#0D330E]">
                    My <span className="text-[#477023]">Wallet</span>
                </h1>
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#6E8649]">Live Revenue Tracking</p>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm p-5 rounded-[1.5rem] shadow-sm border border-white/60 group hover:bg-white transition-all">
                        <div className={`${stat.color} text-white w-fit p-2 rounded-xl mb-3 shadow-md`}>{stat.icon}</div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                        <p className="text-xl font-black italic tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-[#0D330E] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <CreditCard className="text-[#6E8649] mb-4" size={32} />
                        <p className="text-[10px] font-bold text-[#A3B18A] uppercase tracking-[0.3em] mb-1">Available to Withdraw</p>
                        <h2 className="text-5xl font-black italic tracking-tighter mb-8 text-[#D3D3D3]">
                          {formatZAR(walletData?.summary?.total)}
                        </h2>
                    </div>
                    <button onClick={() => setShowWithdrawModal(true)} className="relative z-10 w-full py-4 bg-[#6E8649] hover:bg-[#477023] text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg flex items-center justify-center gap-2">
                        Withdraw Funds <ArrowUpRight size={16} />
                    </button>
                </div>

                <div className="lg:col-span-7 bg-[#477023]/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-[#477023]/10 shadow-sm flex flex-col">
                    <h3 className="font-black italic uppercase text-lg text-[#477023] mb-6">Earnings Progress</h3>
                    <div className="flex-1 flex items-end justify-between gap-2 px-2 min-h-[160px]">
                        {historyData.slice(0, 7).reverse().map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                <div className="w-full bg-[#0D330E]/5 rounded-xl relative h-full border border-white/30">
                                    <div 
                                        className="absolute bottom-0 w-full bg-gradient-to-t from-[#0D330E] to-[#6E8649] transition-all duration-700 rounded-t-lg" 
                                        style={{ height: `${Math.min((day.total / 1000) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-[7px] font-black uppercase text-gray-400">
                                  {new Date(day.date).toLocaleDateString('en-ZA', { weekday: 'short' })}
                                </span>
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
          <div className="relative bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-300">
            <div className="p-8 bg-[#0D330E] text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Withdraw</h3>
                <p className="text-[9px] opacity-60 uppercase tracking-widest">Step {step} of 2</p>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} className="bg-white/10 p-1.5 rounded-full hover:bg-white/20"><X size={20}/></button>
            </div>

            <div className="p-8">
              {step === 1 ? (
                <div className="space-y-6">
                   <div className="space-y-1">
                    <div className="flex justify-between items-end ml-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#477023]">Amount to Payout</label>
                        <span className="text-[10px] font-bold text-gray-400 italic">Max: {formatZAR(walletData?.summary?.total)}</span>
                    </div>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-2xl italic text-[#0D330E]">R</span>
                        <input 
                            type="number" 
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="w-full bg-[#D3D3D3]/40 p-5 pl-12 rounded-2xl outline-none font-black text-3xl italic text-[#0D330E] focus:ring-2 ring-[#6E8649]" 
                            placeholder="0.00" 
                        />
                    </div>
                  </div>
                  <button 
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) > walletData?.summary?.total}
                    onClick={() => setStep(2)} 
                    className="w-full py-4 bg-[#0D330E] disabled:bg-gray-300 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg transition-all"
                  >
                    Next: Bank Details
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2 p-1 bg-[#D3D3D3]/30 rounded-xl mb-4">
                    <button onClick={() => setUseSaved(true)} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${useSaved ? 'bg-white shadow-sm text-[#0D330E]' : 'text-gray-400'}`}>Saved Details</button>
                    <button onClick={() => setUseSaved(false)} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${!useSaved ? 'bg-white shadow-sm text-[#0D330E]' : 'text-gray-400'}`}>New Account</button>
                  </div>

                  {useSaved ? (
                    <div className="bg-[#477023]/5 border border-[#477023]/20 p-4 rounded-2xl">
                      <p className="text-[10px] font-black text-[#477023] uppercase mb-2">Verified Account</p>
                      <p className="text-sm font-bold text-[#0D330E]">Standard Bank</p>
                      <p className="text-xs text-gray-500 font-medium">**** **** 4590</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input type="text" placeholder="Bank Name" className="w-full bg-[#D3D3D3]/30 p-4 rounded-xl outline-none font-bold text-xs" />
                      <input type="text" placeholder="Account Number" className="w-full bg-[#D3D3D3]/30 p-4 rounded-xl outline-none font-bold text-xs" />
                      <input type="text" placeholder="Branch Code" className="w-full bg-[#D3D3D3]/30 p-4 rounded-xl outline-none font-bold text-xs" />
                    </div>
                  )}
                  
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-[9px] uppercase rounded-xl">Back</button>
                    <button onClick={handleWithdrawSubmit} className="flex-[2] py-4 bg-[#6E8649] text-white font-black uppercase tracking-widest text-[9px] rounded-xl shadow-lg">Confirm Payout</button>
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