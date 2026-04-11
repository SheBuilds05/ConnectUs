import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, MapPin, ChevronRight, Upload, CheckCircle, 
  Package, Clock, Shield, X, Info, CreditCard, Loader2, LogOut,
  Wallet as WalletIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { createBooking, getUserId } from '../services/api';

// Wallet helper functions
const getWalletData = (userId: string | number) => {
  try {
    const walletKey = `wallet_${userId}`;
    const raw = localStorage.getItem(walletKey);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { balanceCents: 0, currency: 'ZAR', transactions: [] };
};

const saveWalletData = (userId: string | number, walletData: any) => {
  try {
    const walletKey = `wallet_${userId}`;
    localStorage.setItem(walletKey, JSON.stringify(walletData));
  } catch {}
};

const toCents = (rand: number) => Math.round(rand * 100);
const toRand = (cents: number) => (cents / 100).toFixed(2);

const UserBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const routerLocation = useLocation();

  // Form State
  const [activeTab, setActiveTab] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPriority, setIsPriority] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [budget, setBudget] = useState<string>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const preSelectedRunner = routerLocation.state?.selectedRunner || null;
  const [selectedRunner, setSelectedRunner] = useState(preSelectedRunner);
  
  // UI State
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Wallet State
  const [walletData, setWalletData] = useState(() => {
    const userId = user?.id;
    return userId ? getWalletData(userId) : { balanceCents: 0, currency: 'ZAR', transactions: [] };
  });

  const baseFee = 25;
  const priorityFee = isPriority ? 100 : 0;
  const total = (budget ? Number(budget) : 0) + baseFee + priorityFee;
  const totalCents = toCents(total);

  // Update wallet when user changes
  useEffect(() => {
    const userId = user?.id;
    if (userId) {
      setWalletData(getWalletData(userId));
    }
  }, [user]);

  const handleExit = () => {
    navigate('/user');
  };

  const steps = [
    { number: 1, name: 'Details', icon: Package },
    { number: 2, name: 'Location', icon: MapPin },
    { number: 3, name: 'Payment', icon: Shield }
  ];
  
  const helpSteps = [
    { title: "Step 1: Details", desc: "Describe what you need and upload a photo.", icon: Package },
    { title: "Step 2: Logistics", desc: "Tell us where to deliver and set a budget.", icon: MapPin },
    { title: "Step 3: Secure Pay", desc: "Confirm the service fee and pay.", icon: CreditCard }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Process payment with wallet
  const processWalletPayment = async () => {
    const userId = user?.id;
    
    if (!userId) {
      setError("User not found. Please log in again.");
      return false;
    }

    // Check if wallet has sufficient balance
    if (walletData.balanceCents < totalCents) {
      setError(`Insufficient wallet balance. Available: R${toRand(walletData.balanceCents)}, Required: R${total.toFixed(2)}`);
      return false;
    }

    // Deduct from wallet
    const newBalanceCents = walletData.balanceCents - totalCents;
    
    // Create transaction record
    const newTransaction = {
      id: Date.now(),
      type: 'debit',
      amountCents: totalCents,
      description: `Booking payment - ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      bookingDetails: {
        description,
        location,
        budget: budget ? Number(budget) : 0,
        isPriority,
        runnerId: selectedRunner?.runner_id
      }
    };

    const updatedWallet = {
      ...walletData,
      balanceCents: newBalanceCents,
      transactions: [newTransaction, ...walletData.transactions]
    };

    // Save updated wallet
    saveWalletData(userId, updatedWallet);
    setWalletData(updatedWallet);

    return true;
  };

  /**
   * BACKEND INTEGRATION with Wallet Payment
   */
  const handlePayment = async () => {
    if (!user) {
      setError("You must be logged in to create a booking.");
      return;
    }

    // Show wallet selection modal first
    setShowWalletModal(true);
  };

  const confirmPayment = async () => {
    setIsProcessing(true);
    setError(null);
    setShowWalletModal(false);

    try {
      // First, process wallet payment
      const paymentSuccess = await processWalletPayment();
      
      if (!paymentSuccess) {
        throw new Error("Wallet payment failed. Please check your balance.");
      }

      let uploadedImageUrl = null;

      // Optional: Upload image if exists (commented out as per previous code)
      /*
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('https://connectus-tpyp.onrender.com/api/upload', {
          method: 'POST',
          body: formData,
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrl = uploadData.url;
        }
      }
      */

      // Prepare booking data with correct field names
      const bookingData = {
        user_id: getUserId(),
        product_description: description,
        delivery_location: location,
        budget: budget ? Number(budget) : 0,
        status: 'CREATED',
        product_image_url: uploadedImageUrl,
        runner_id: selectedRunner?.runner_id || null,
        is_priority: isPriority,
        payment_method: 'wallet',
        payment_amount: total,
        payment_status: 'paid'
      };

      console.log("Sending booking:", bookingData);

      // Create booking in backend
      const result = await createBooking(bookingData);

      console.log("Booking success:", result);

      setIsPaid(true);

    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to create booking.");
      
      // Revert wallet transaction if booking fails
      const userId = user?.id;
      if (userId) {
        const currentWallet = getWalletData(userId);
        const revertedWallet = {
          ...currentWallet,
          balanceCents: currentWallet.balanceCents + totalCents,
          transactions: currentWallet.transactions.slice(1) // Remove the last transaction
        };
        saveWalletData(userId, revertedWallet);
        setWalletData(revertedWallet);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPaid) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
        <button
          onClick={handleExit}
          className="fixed bottom-8 right-8 z-50 bg-[#0D330E] text-white px-5 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group border-2 border-[#A3B18A]/30 hover:border-[#A3B18A]"
          title="Back to Home"
        >
          <LogOut size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />
          <span className="text-sm">Exit</span>
        </button>

        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl text-center border border-emerald-100 max-w-md">
          <div className="w-24 h-24 bg-[#477023]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={60} className="text-[#477023]" />
          </div>
          <h2 className="text-2xl font-black text-[#0D330E] mb-2">Payment Successful!</h2>
          <p className="text-[#6E8649] mb-6 text-sm">R{total.toFixed(2)} has been deducted from your wallet.</p>
          <p className="text-gray-500 mb-6 text-xs">Your order has been placed and a runner is being assigned.</p>
          <div className="space-y-2">
            <button onClick={() => window.location.href = '/user/track'} className="w-full bg-[#477023] text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">Track My Order</button>
            <button onClick={() => { setIsPaid(false); setActiveTab(1); setBudget(''); setDescription(''); setLocation(''); setImagePreview(null); setImageFile(null); setIsPriority(false); }} className="w-full bg-white text-[#0D330E] px-6 py-3 rounded-xl font-bold border-2 border-[#D3D3D3]">Create Another</button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url('/Background1-bookings.png')` }} 
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Exit Button */}
      <button
        onClick={handleExit}
        className="fixed bottom-8 right-8 z-50 bg-[#0D330E] text-white px-5 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group border-2 border-[#A3B18A]/30 hover:border-[#A3B18A]"
        title="Back to Home"
      >
        <LogOut size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />
        <span className="text-sm">Exit</span>
      </button>

      {/* Main Centered Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-5">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-10"
        >
          <h2 className="text-4xl sm:text-6xl font-black text-[#0D330E] mb-3">
            Create Booking
          </h2>
          <p className="text-[#0D330E] text-lg font-medium opacity-90">
            Fast, reliable, and secure delivery.
          </p>
        </motion.div>

        {/* Step Progress */}
        <div className="mb-10 flex justify-between items-center w-full max-w-md mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center relative flex-1">
              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 ${
                activeTab >= step.number ? 'bg-[#477023] text-white' : 'bg-white text-[#2D4A1E]'
              }`}>
                {activeTab > step.number ? <CheckCircle size={20} /> : <step.icon size={20} />}
              </div>
              <span className="text-xs mt-2 font-bold uppercase tracking-wider text-[#0D330E]">
                {step.name}
              </span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <motion.div 
          layout 
          className="bg-white/90 backdrop-blur-md rounded-[40px] p-8 sm:p-10 shadow-2xl border border-white/50 w-full max-w-xl"
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, x: 10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Tab Content (Step 1, 2, or 3) */}
              {activeTab === 1 && (
                <div className="space-y-6">
                  <label className="block text-xl font-black text-[#0D330E] text-center">
                    What do you need?
                  </label>
                  
                  {/* Selected Runner Display */}
                  {selectedRunner && (
                    <div className="flex items-center gap-3 p-3 bg-[#0D330E]/5 rounded-2xl border border-[#A3B18A]/30">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#A3B18A]">
                        {selectedRunner.profile_photo ? (
                          <img src={selectedRunner.profile_photo} className="w-full h-full object-cover" alt={selectedRunner.username} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-black">
                            {selectedRunner.full_name?.charAt(0) || selectedRunner.username?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-[#0D330E] text-sm">{selectedRunner.full_name || selectedRunner.username}</p>
                        <p className="text-xs text-gray-500">Assigned runner</p>
                      </div>
                      <button onClick={() => setSelectedRunner(null)} className="text-gray-400 hover:text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  <textarea 
                    className="w-full p-5 rounded-2xl border-2 border-gray-200 outline-none focus:border-[#477023]" 
                    rows={4} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="List the items you need..." 
                  />
                  
                  {/* Image Upload Area */}
                  <div className="relative border-2 border-dashed rounded-[24px] p-8 text-center border-[#477023]/30 bg-[#477023]/5 hover:bg-[#477023]/10 transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} className="max-h-52 mx-auto rounded-xl shadow-md" alt="Preview" />
                        <button 
                          onClick={() => {setImagePreview(null); setImageFile(null);}} 
                          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4">
                        <Upload size={32} className="text-[#477023] mb-3" />
                        <p className="font-bold text-[#0D330E]">Upload Product Image</p>
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={handleImageChange} 
                          accept="image/*" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="space-y-6">
                  <label className="block text-sm font-bold">Delivery Location</label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    className="w-full p-4 rounded-xl border-2 border-[#D3D3D3]/30" 
                    placeholder="Street Address, Suburb" 
                  />
                  <label className="block text-sm font-bold">Item Budget (ZAR)</label>
                  <input 
                    type="number" 
                    value={budget} 
                    onChange={(e) => setBudget(e.target.value)} 
                    className="w-full p-4 rounded-xl border-2 border-[#D3D3D3]/30 font-bold" 
                    placeholder="Enter amount" 
                  />
                </div>
              )}

              {activeTab === 3 && (
                <div className="space-y-5">
                  {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
                  
                  {/* Wallet Balance Display */}
                  <div className="bg-gradient-to-r from-[#2D531A]/10 to-[#0D330E]/10 p-4 rounded-xl border border-[#A3B18A]/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <WalletIcon size={20} className="text-[#2D531A]" />
                        <span className="text-sm font-bold text-[#0D330E]">Wallet Balance</span>
                      </div>
                      <span className="text-xl font-black text-[#2D531A]">R{toRand(walletData.balanceCents)}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsPriority(!isPriority)} 
                    className={`w-full p-5 rounded-xl border-2 flex justify-between items-center ${isPriority ? 'border-[#477023] bg-[#477023]/10' : 'border-[#D3D3D3]/50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock size={24} className="text-[#477023]" />
                      <div className="text-left">
                        <p className="font-bold">Priority Delivery</p>
                        <p className="text-xs text-gray-500">+R100.00</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 ${isPriority ? 'bg-[#477023] border-[#477023]' : 'border-gray-300'}`} />
                  </button>
                  
                  <div className="bg-white p-5 rounded-xl border shadow-sm">
                    <div className="flex justify-between">
                      <span>Budget</span>
                      <span>R{budget ? Number(budget).toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span>Service Fee</span>
                      <span>R{baseFee.toFixed(2)}</span>
                    </div>
                    {isPriority && (
                      <div className="flex justify-between mt-2 text-[#477023]">
                        <span>Priority Fee</span>
                        <span>R100.00</span>
                      </div>
                    )}
                    <div className="pt-3 mt-3 border-t font-black text-xl flex justify-between">
                      <span>Total</span>
                      <span className="text-[#2D531A]">R{total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handlePayment} 
                    disabled={isProcessing} 
                    className="w-full py-4 bg-[#0D330E] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1a4a1a] transition-colors"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <WalletIcon size={20} />}
                    {isProcessing ? "Processing..." : `Pay R${total.toFixed(2)} with Wallet`}
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Footer Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
            <button 
              disabled={activeTab === 1} 
              onClick={() => setActiveTab(activeTab - 1)} 
              className={`font-bold transition-opacity ${activeTab === 1 ? 'opacity-0' : 'text-[#6E8649] hover:text-[#477023]'}`}
            >
              ← Back
            </button>
            {activeTab < 3 && (
              <button 
                onClick={() => setActiveTab(activeTab + 1)} 
                className="bg-[#477023] hover:bg-[#3a5c1d] text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-transform active:scale-95"
              >
                Next <ChevronRight size={18} />
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Wallet Payment Confirmation Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[#2D531A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <WalletIcon size={40} className="text-[#2D531A]" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Confirm Payment</h3>
              <p className="text-gray-500 mt-2">Pay with your wallet balance</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Order Total</span>
                <span className="font-bold text-gray-900">R{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Wallet Balance</span>
                <span className={`font-bold ${walletData.balanceCents >= totalCents ? 'text-green-600' : 'text-red-600'}`}>
                  R{toRand(walletData.balanceCents)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Remaining Balance</span>
                <span className="font-bold text-[#2D531A]">
                  R{toRand(walletData.balanceCents - totalCents)}
                </span>
              </div>
            </div>

            {walletData.balanceCents < totalCents && (
              <div className="mb-4 p-3 bg-red-50 rounded-xl text-red-600 text-sm text-center">
                Insufficient balance. Please top up your wallet.
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowWalletModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                disabled={walletData.balanceCents < totalCents || isProcessing}
                className="flex-1 px-6 py-3 bg-[#2D531A] text-white rounded-xl font-bold hover:bg-[#1a3a0f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                Confirm Payment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default UserBookings;