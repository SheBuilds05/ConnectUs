import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, MapPin, ChevronRight, Upload, CheckCircle, 
  Package, Clock, Shield, X, Info, CreditCard, Loader2, LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import your Auth Hook
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const UserBookings = () => {
  const { user } = useAuth(); // Access the logged-in user
  const navigate = useNavigate();
const routerLocation = useLocation();

  // Form State
  const [activeTab, setActiveTab] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null); // For actual upload
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For UI preview
  const [isPriority, setIsPriority] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [budget, setBudget] = useState<string>(''); // Changed from number to string to allow empty
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
const preSelectedRunner = location.state?.selectedRunner || null;
  const [selectedRunner, setSelectedRunner] = useState(preSelectedRunner);
  
  // UI State
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseFee = 25;
  const priorityFee = isPriority ? 100 : 0;
  const total = (budget ? Number(budget) : 0) + baseFee + priorityFee; // Handle empty budget

  const handleExit = () => {
    navigate('/user'); // Navigate to user homepage
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

  /**
   * BACKEND INTEGRATION
   */
  const handlePayment = async () => {
    if (!user) {
      setError("You must be logged in to create a booking.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let uploadedImageUrl = null;

      // 1. OPTIONAL: Handle Image Upload here
      // If you have a separate /api/upload endpoint:
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
const uploadRes = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  body: formData,
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
        // const uploadRes = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData });
        // const uploadData = await uploadRes.json();
        // uploadedImageUrl = uploadData.url;
      }

      // 2. Create the Booking
      const bookingData = {
        product_description: description,
        delivery_location: location,
        budget: budget ? Number(budget) : 0, // Convert to number for API
        status: 'CREATED',
        image_url: uploadedImageUrl,
        is_priority: isPriority,
runner_id: selectedRunner?.runner_id || null 
      };

const token = localStorage.getItem('token');
console.log('Token being sent:', token ? 'EXISTS' : 'MISSING');
console.log('User ID:', user?.id);

      const response = await fetch('http://localhost:5000/api/users/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(bookingData),
});

      if (!response.ok) throw new Error('Failed to create booking.');

      setIsPaid(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPaid) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
        {/* Exit Button on success screen too */}
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
          <p className="text-[#6E8649] mb-6 text-sm">Your order has been placed and a runner is being assigned.</p>
          <div className="space-y-2">
            <button onClick={() => window.location.href = '/user/track'} className="w-full bg-[#477023] text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">Track My Order</button>
            <button onClick={() => { setIsPaid(false); setActiveTab(1); }} className="w-full bg-white text-[#0D330E] px-6 py-3 rounded-xl font-bold border-2 border-[#D3D3D3]">Create Another</button>
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

      {/* Exit Button - Fixed position on the right bottom */}
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
        
        {/* Header Section - Now Centered */}
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

        {/* Step Progress - Width Restricted for better look */}
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
                  {/* ← ADD THE RUNNER BLOCK HERE */}
    {selectedRunner && (
      <div className="flex items-center gap-3 p-3 bg-[#0D330E]/5 rounded-2xl border border-[#A3B18A]/30">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#A3B18A]">
          {selectedRunner.profile_photo ? (
            <img src={selectedRunner.profile_photo} className="w-full h-full object-cover" />
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

    {/* ← THEN THE TEXTAREA */}
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
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-4 rounded-xl border-2 border-[#D3D3D3]/30" placeholder="Street Address, Suburb" />
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
                  <button onClick={() => setIsPriority(!isPriority)} className={`w-full p-5 rounded-xl border-2 flex justify-between items-center ${isPriority ? 'border-[#477023] bg-[#477023]/10' : 'border-[#D3D3D3]/50'}`}>
                    <div className="flex items-center gap-3">
                      <Clock size={24} className="text-[#477023]" />
                      <div className="text-left"><p className="font-bold">Priority Delivery</p></div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 ${isPriority ? 'bg-[#477023]' : ''}`} />
                  </button>
                  <div className="bg-white p-5 rounded-xl border shadow-sm">
                    <div className="flex justify-between"><span>Budget</span><span>R{budget ? Number(budget).toFixed(2) : '0.00'}</span></div>
                    <div className="flex justify-between"><span>Service Fee</span><span>R{baseFee.toFixed(2)}</span></div>
                    {isPriority && <div className="flex justify-between text-[#477023]"><span>Priority</span><span>R100.00</span></div>}
                    <div className="pt-3 mt-3 border-t font-black text-xl flex justify-between"><span>Total</span><span>R{total.toFixed(2)}</span></div>
                  </div>
                  <button onClick={handlePayment} disabled={isProcessing} className="w-full py-4 bg-[#0D330E] text-white rounded-xl font-bold flex items-center justify-center gap-2">
                    {isProcessing ? <Loader2 className="animate-spin" /> : `Confirm & Pay R${total.toFixed(2)}`}
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
    </>
  );
};

export default UserBookings;