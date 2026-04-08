import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Bell, Lock, Truck, CreditCard, 
  ShieldCheck, Map, ChevronRight, User, 
  Smartphone, Globe, Menu, CheckCircle, X 
} from 'lucide-react';
import RunnerSidebar from '../components/RunnerSidebar';

const SettingsPage = () => {
  // --- SIDEBAR STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- TOAST NOTIFICATION STATE ---
  const [toast, setToast] = useState({ show: false, message: "" });

  // --- MODAL & DATA STATES ---
  const [activeModal, setActiveModal] = useState<null | 'deactivate' | 'password' | 'banking'>(null);
  const [emailInput, setEmailInput] = useState("");
  
  // NEW: State to store and display banking details
  const [currentBank, setCurrentBank] = useState({
    bank: "Standard Bank",
    account: "8829",
    branch: "250655"
  });

  // Temporary state for the input fields in the modal
  const [bankInputs, setBankInputs] = useState({ bank: "", account: "", branch: "" });

  // --- FORM STATES ---
  const [isAvailable, setIsAvailable] = useState(() => localStorage.getItem('runner_available') !== 'false');
  const [heavyLifting, setHeavyLifting] = useState(() => localStorage.getItem('runner_heavy_lifting') === 'true');
  const [notifications, setNotifications] = useState(true);
  const [emailReports, setEmailReports] = useState(false);

  const showNotification = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const handlePasswordReset = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      alert("Please enter a valid email address containing @");
      return;
    }
    showNotification("Email successfully sent! Please change your password using the link.");
    setActiveModal(null);
    setEmailInput("");
  };

  const handleDeactivate = () => {
    alert("Your message has been sent to the admin. Your account will be deactivated in 3 days.");
    setActiveModal(null);
  };

  // UPDATED: Stores the new details and reflects them on the UI
  const handleBankUpdate = () => {
    if(!bankInputs.bank || !bankInputs.account) {
        alert("Please fill in the bank name and account number");
        return;
    }
    
    // Set the display state to the last 4 digits of the new account for security/UI style
    const lastFour = bankInputs.account.slice(-4);
    
    setCurrentBank({
      bank: bankInputs.bank,
      account: lastFour,
      branch: bankInputs.branch
    });

    showNotification("Successfully added!");
    setActiveModal(null);
    setBankInputs({ bank: "", account: "", branch: "" }); // Reset inputs
  };

  return (
    <div className="min-h-screen bg-[#D3D3D3] font-sans text-[#0D330E] relative overflow-x-hidden pb-12">
      
      {toast.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-[#0D330E] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-[#A3B18A]">
            <CheckCircle size={18} className="text-[#A3B18A]" />
            <span className="font-black uppercase text-[10px] tracking-[0.2em]">{toast.message}</span>
          </div>
        </div>
      )}

      {activeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in duration-200">
            <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X size={24}/></button>
            
            {activeModal === 'password' && (
              <div className="space-y-6 text-center">
                <h3 className="text-xl font-black italic uppercase">Update Password</h3>
                <p className="text-xs font-bold opacity-60">Enter your email address to receive a reset link.</p>
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="runner@example.com"
                  className="w-full p-4 bg-[#D3D3D3]/30 rounded-2xl outline-none font-bold text-center border-2 border-transparent focus:border-[#477023]"
                />
                <button onClick={handlePasswordReset} className="w-full py-4 bg-[#0D330E] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Send Reset Link</button>
              </div>
            )}

            {activeModal === 'banking' && (
              <div className="space-y-4">
                <h3 className="text-xl font-black italic uppercase text-center mb-4">New Banking Details</h3>
                <input type="text" placeholder="Bank Name" className="w-full p-4 bg-[#D3D3D3]/30 rounded-2xl outline-none font-bold text-sm" value={bankInputs.bank} onChange={(e) => setBankInputs({...bankInputs, bank: e.target.value})}/>
                <input type="text" placeholder="Account Number" className="w-full p-4 bg-[#D3D3D3]/30 rounded-2xl outline-none font-bold text-sm" value={bankInputs.account} onChange={(e) => setBankInputs({...bankInputs, account: e.target.value})}/>
                <input type="text" placeholder="Branch Code" className="w-full p-4 bg-[#D3D3D3]/30 rounded-2xl outline-none font-bold text-sm" value={bankInputs.branch} onChange={(e) => setBankInputs({...bankInputs, branch: e.target.value})}/>
                <button onClick={handleBankUpdate} className="w-full py-4 bg-[#477023] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest mt-4">Save Details</button>
              </div>
            )}

            {activeModal === 'deactivate' && (
              <div className="text-center space-y-6">
                <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto"><ShieldCheck size={32}/></div>
                <h3 className="text-xl font-black italic uppercase">Deactivate?</h3>
                <p className="text-xs font-bold opacity-60">Are you sure you want to request account deactivation?</p>
                <div className="flex gap-4">
                  <button onClick={() => setActiveModal(null)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase">Cancel</button>
                  <button onClick={handleDeactivate} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase">Request</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <RunnerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="w-full">
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-6 left-6 z-50 p-3 bg-[#0D330E] text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border border-white/20"
          >
            <Menu size={24} />
          </button>
        )}

        <div className="max-w-5xl mx-auto p-6 md:p-10">
          <div className="mb-10 pt-4">
            <h1 className="text-4xl font-black italic tracking-tight uppercase text-[#2D531A]">Runner Settings</h1>
            <p className="font-bold opacity-60 uppercase text-xs tracking-widest mt-1">Configure your shopping & delivery parameters</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5">
                <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-[#477023]">
                  <ShieldCheck size={20} /> Availability & Experience
                </h2>
                <div className="space-y-6">
                  <ToggleOption label="Accepting New Requests" description="Enable to receive live shopping alerts." isActive={isAvailable} onToggle={() => {
                    const next = !isAvailable;
                    setIsAvailable(next);
                    localStorage.setItem('runner_available', String(next));
                    showNotification(next ? "You are now ONLINE" : "You are now OFFLINE");
                  }} />
                  <div className="h-[1px] bg-[#D3D3D3]/50" />
                  <ToggleOption label="Heavy Lifting" description="Deliver items over 20kg." isActive={heavyLifting} onToggle={() => {
                    const next = !heavyLifting;
                    setHeavyLifting(next);
                    localStorage.setItem('runner_heavy_lifting', String(next));
                    showNotification(next ? "Heavy Lifting Enabled" : "Heavy Lifting Disabled");
                  }} />
                </div>
              </section>

              <section className="bg-[#0D330E] p-8 rounded-[2.5rem] text-white shadow-2xl">
                <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3 opacity-70">
                  <Truck size={20} /> Logistics & Equipment
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Preferred Partner</label>
                    <select className="w-full p-4 rounded-2xl bg-[#1a2c15] border border-white/10 text-white font-bold focus:outline-none"><option>The Courier Guy</option><option>Pudo</option></select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Service Level</label>
                    <select className="w-full p-4 rounded-2xl bg-[#1a2c15] border border-white/10 text-white font-bold focus:outline-none"><option>Standard Door-to-Door</option><option>Counter-to-Counter</option></select>
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5">
                <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-[#477023]">
                  <CreditCard size={20} /> Financial & Payouts
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-[#D3D3D3]/20 border-2 border-dashed border-[#D3D3D3]">
                  <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="bg-[#6E8649] p-3 rounded-2xl text-white shadow-md"><Globe size={24} /></div>
                    <div>
                      {/* UPDATED: Displays the live state data */}
                      <p className="font-black text-[#0D330E]">{currentBank.bank} •••• {currentBank.account}</p>
                      <p className="text-xs font-bold opacity-40 uppercase">Primary Payout Method</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveModal('banking')} className="bg-[#477023] hover:bg-[#2D531A] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition shadow-lg">Change Method</button>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#6E8649] p-8 rounded-[2.5rem] text-white shadow-xl text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-4 border-white/20 mb-4 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-black italic text-xl">Account Security</h3>
                <p className="text-xs opacity-80 mt-2 mb-6">Last password change: 2 months ago</p>
                <button onClick={() => setActiveModal('password')} className="w-full bg-[#0D330E] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition shadow-lg">Update Password</button>
              </div>

              <div className="bg-white p-6 rounded-[2.5rem] shadow-xl space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#477023] mb-4">Notifications</h4>
                <ToggleOption label="Push Alerts" description="Order status updates." isActive={notifications} onToggle={() => { setNotifications(!notifications); showNotification("Push Alerts Updated"); }} />
                <ToggleOption label="Email Reports" description="Weekly summaries." isActive={emailReports} onToggle={() => { setEmailReports(!emailReports); showNotification("Email Preferences Updated"); }} />
              </div>

              <button onClick={() => setActiveModal('deactivate')} className="w-full py-5 rounded-[2rem] border-2 border-[#0D330E]/10 font-black text-[10px] uppercase tracking-[0.2em] text-[#0D330E] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300">Deactivate Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleOption = ({ label, description, isActive, onToggle }: any) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex-1">
      <p className="font-black text-sm uppercase tracking-tight text-[#0D330E]">{label}</p>
      <p className="text-[11px] font-bold opacity-40 leading-tight text-[#0D330E]">{description}</p>
    </div>
    <button onClick={onToggle} className={`relative h-8 w-14 shrink-0 cursor-pointer rounded-full transition-colors duration-300 ease-in-out shadow-inner ${isActive ? 'bg-[#477023]' : 'bg-[#D3D3D3]'}`}>
      <div className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out transform ${isActive ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

export default SettingsPage;