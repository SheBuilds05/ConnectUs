import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, ChevronRight, Upload, CheckCircle, Package, Clock, Shield, X, Info, CreditCard } from 'lucide-react';

const UserBookings = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [isPriority, setIsPriority] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [budget, setBudget] = useState(0);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const baseFee = 25;
  const priorityFee = isPriority ? 100 : 0;
  const total = Number(budget) + baseFee + priorityFee;

  const steps = [
    { number: 1, name: 'Details', icon: Package },
    { number: 2, name: 'Location', icon: MapPin },
    { number: 3, name: 'Payment', icon: Shield }
  ];

  const helpSteps = [
    {
      title: "Step 1: Details",
      desc: "Describe what you need and upload a photo so the runner buys the exact item.",
      icon: Package
    },
    {
      title: "Step 2: Logistics",
      desc: "Tell us where to deliver and set a budget for the items being purchased.",
      icon: MapPin
    },
    {
      title: "Step 3: Secure Pay",
      desc: "Confirm the service fee and pay. We hold the funds until delivery is complete.",
      icon: CreditCard
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsPaid(true);
  };

  if (isPaid) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh]"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl text-center border border-emerald-100 max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <div className="w-24 h-24 bg-[#477023]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={60} className="text-[#477023]" />
            </div>
          </motion.div>
          
          <motion.h2 className="text-3xl font-black text-[#0D330E] mb-2">Payment Successful!</motion.h2>
          <motion.p className="text-[#6E8649] mb-8">Your order has been placed and a runner is being assigned.</motion.p>
          
          <div className="space-y-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/track'} 
              className="w-full bg-[#477023] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#477023]/20"
            >
              Track My Order
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsPaid(false);
                setActiveTab(1);
                setImage(null);
                setDescription('');
                setLocation('');
                setBudget(0);
                setIsPriority(false);
              }}
              className="w-full bg-white text-[#0D330E] px-8 py-4 rounded-2xl font-bold border-2 border-[#D3D3D3]"
            >
              Create Another Booking
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto relative px-4"
    >
      {/* Header */}
      <div className="mb-8 text-center sm:text-left mt-10">
        <motion.h2 className="text-4xl sm:text-5xl font-black text-[#0D330E] mb-2">Create Booking</motion.h2>
        <motion.p className="text-[#6E8649] text-lg">Fill in the details to get your items delivered.</motion.p>
      </div>

      {/* Step Progress */}
      <div className="mb-8 overflow-x-auto pb-4">
        <div className="flex justify-between items-center min-w-[300px]">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeTab === step.number;
            const isCompleted = activeTab > step.number;
            return (
              <div key={step.number} className="flex flex-col items-center relative flex-1">
                {index < steps.length - 1 && (
                  <div className="absolute top-5 left-[60%] w-[80%] h-0.5 bg-[#D3D3D3]/30">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: activeTab > step.number ? "100%" : "0%" }}
                      className="h-full bg-[#477023]"
                    />
                  </div>
                )}
                <motion.div 
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted ? 'bg-[#477023] text-white' :
                    isActive ? 'bg-[#477023] text-white ring-4 ring-[#477023]/20' :
                    'bg-[#D3D3D3]/50 text-[#6E8649]'
                  }`}
                >
                  {isCompleted ? <CheckCircle size={18} /> : <Icon size={18} />}
                </motion.div>
                <span className={`text-xs sm:text-sm mt-2 font-medium ${isActive ? 'text-[#0D330E]' : 'text-[#6E8649]'}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Card */}
      <motion.div layout className="bg-white/80 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 shadow-2xl border border-white/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {activeTab === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold text-[#0D330E] mb-3">What do you need?</label>
                  <textarea 
                    className="w-full p-5 rounded-2xl bg-[#D3D3D3]/20 border-2 border-transparent focus:border-[#477023] outline-none transition-all resize-none"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the product (brand, quantity, etc.)"
                  />
                </div>
                <div className="relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer border-[#6E8649]/30">
                  {image ? (
                    <div className="relative">
                      <img src={image} className="max-h-64 mx-auto rounded-2xl object-cover" alt="Preview" />
                      <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">×</button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="text-[#477023] w-8 h-8 mb-2" />
                      <p className="font-bold text-[#0D330E]">Upload Product Image</p>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && setImage(URL.createObjectURL(e.target.files[0]))} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-[#0D330E] mb-2">Delivery Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#477023]" size={20} />
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-4 pl-12 rounded-2xl bg-[#D3D3D3]/20 outline-none" placeholder="Street address" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0D330E] mb-2">Item Budget (ZAR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold">R</span>
                    <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full p-4 pl-10 rounded-2xl bg-[#D3D3D3]/20 outline-none font-bold" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-6">
                <button 
                  onClick={() => setIsPriority(!isPriority)}
                  className={`w-full p-6 rounded-3xl border-2 transition-all flex justify-between items-center ${isPriority ? 'border-[#477023] bg-[#477023]/5' : 'border-[#D3D3D3]/50'}`}
                >
                  <div className="flex items-center gap-4">
                    <Clock size={24} className={isPriority ? 'text-[#477023]' : 'text-[#6E8649]'} />
                    <div className="text-left">
                      <p className="font-bold text-[#0D330E]">Priority Delivery</p>
                      <p className="text-sm text-[#6E8649]">Within 1 hour</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${isPriority ? 'bg-[#477023]' : ''}`} />
                </button>

                <div className="bg-[#D3D3D3]/10 p-6 rounded-3xl space-y-3">
                  <div className="flex justify-between"><span>Budget</span><span>R{budget.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Service Fee</span><span>R{baseFee.toFixed(2)}</span></div>
                  {isPriority && <div className="flex justify-between text-[#477023] font-bold"><span>Priority</span><span>R100.00</span></div>}
                  <div className="pt-3 border-t border-black/10 flex justify-between font-black text-xl"><span>Total</span><span>R{total.toFixed(2)}</span></div>
                </div>

                <button 
                  onClick={handlePayment} 
                  disabled={isProcessing}
                  className="w-full py-5 bg-[#0D330E] text-white rounded-2xl font-bold text-lg"
                >
                  {isProcessing ? "Processing..." : `Confirm & Pay R${total.toFixed(2)}`}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-10 pt-6 border-t border-[#D3D3D3]/30">
          <button disabled={activeTab === 1} onClick={() => setActiveTab(activeTab - 1)} className="px-6 py-3 text-[#6E8649] font-bold disabled:opacity-30">← Back</button>
          {activeTab < 3 && (
            <button onClick={() => setActiveTab(activeTab + 1)} className="bg-[#477023] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
              Next Step <ChevronRight size={18} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Floating Help Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowHelp(true)}
          className="w-14 h-14 bg-[#477023] text-white rounded-full shadow-2xl flex items-center justify-center font-bold text-xl border-4 border-white"
        >
          ?
        </motion.button>
      </motion.div>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="absolute inset-0 bg-[#0D330E]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl"
            >
              <button 
                onClick={() => setShowHelp(false)}
                className="absolute right-6 top-6 p-2 rounded-full bg-[#D3D3D3]/20 text-[#6E8649] hover:text-[#0D330E] transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#477023]/10 rounded-2xl flex items-center justify-center text-[#477023]">
                  <Info size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0D330E]">Booking Guide</h3>
                  <p className="text-[#6E8649] text-sm">How to place your first order</p>
                </div>
              </div>

              <div className="space-y-6">
                {helpSteps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#D3D3D3]/20 flex items-center justify-center text-[#477023]">
                      <step.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0D330E]">{step.title}</h4>
                      <p className="text-sm text-[#6E8649] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowHelp(false)}
                className="w-full mt-8 py-4 bg-[#0D330E] text-white rounded-2xl font-bold shadow-lg"
              >
                Got it, thanks!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserBookings;