import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, History, Gift, X, Landmark, AlertCircle, CheckCircle2 } from 'lucide-react';

const WalletPage = () => {
  const [balance, setBalance] = useState(2450.00);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Details, 2: Confirm, 3: Success
  const [withdrawAmount, setWithdrawAmount] = useState(1000);
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountType: 'Savings'
  });

  const handleStartWithdrawal = (e) => {
    e.preventDefault();
    setModalStep(2); // Move to Confirmation
  };

  const handleFinalConfirm = () => {
    setBalance(prev => prev - withdrawAmount);
    setModalStep(3); // Move to Success
  };

  const closeModal = () => {
    setShowModal(false);
    setModalStep(1);
  };

  return (
    <div className="p-8 space-y-8 relative">
      <header>
        <h1 className="text-3xl font-bold text-runner-deep">My Wallet</h1>
        <p className="text-gray-500">Manage your earnings and secure withdrawals</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BALANCE CARD */}
        <div className="lg:col-span-2 bg-runner-deep p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-white/60 font-medium text-sm uppercase tracking-widest">Available Balance</p>
            <h2 className="text-5xl font-bold my-4 tracking-tight">R {balance.toLocaleString()}</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button 
                onClick={() => setShowModal(true)}
                className="flex-1 bg-runner-light text-runner-deep font-bold py-4 rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <ArrowUpRight size={20} /> Withdraw to Bank
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full" />
        </div>

        {/* BONUS TRACKER */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Gift className="text-runner-light" size={20} />
              <h3 className="font-bold text-runner-deep">Monthly Runner Bonus</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4 font-medium">Earn an extra R500 every month for staying active!</p>
            <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
              <div className="bg-runner-light h-full w-full" />
            </div>
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100 text-center">
            <p className="text-green-700 font-bold text-xs">R500 scheduled for April 1st</p>
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <History size={20} className="text-runner-deep" />
            <h3 className="font-bold text-runner-deep">Recent Transactions</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          <TransactionItem type="earnings" title="Grocery Order #2104" date="March 2, 2026" amount="+ R120.00" />
          <TransactionItem type="withdrawal" title="Standard Bank Payout" date="Feb 28, 2026" amount="- R1,500.00" />
        </div>
      </div>

      {/* --- WITHDRAWAL MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-runner-deep/60 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* STEP 1: ENTER DETAILS */}
            {modalStep === 1 && (
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-runner-deep">Withdrawal Amount</h3>
                  <button onClick={closeModal}><X size={20} className="text-gray-400" /></button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount to Withdraw</label>
                    <div className="flex items-center text-2xl font-bold text-runner-deep">
                      <span className="mr-2">R</span>
                      <input 
                        type="number" 
                        className="bg-transparent outline-none w-full"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bank Details</label>
                    <input className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl outline-none" placeholder="Bank Name" required onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})} />
                    <input className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl outline-none" placeholder="Account Number" required onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})} />
                  </div>
                </div>

                <button onClick={handleStartWithdrawal} className="w-full bg-runner-deep text-white font-bold py-4 rounded-2xl hover:bg-black transition-all">
                  Review Withdrawal
                </button>
              </div>
            )}

            {/* STEP 2: CONFIRMATION (The part you requested!) */}
            {modalStep === 2 && (
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-runner-deep">Confirm Withdrawal</h3>
                  <p className="text-gray-500 text-sm mt-2">Please review the transaction details below.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 space-y-3 text-left">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Amount:</span> <span className="font-bold">R {withdrawAmount}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Bank:</span> <span className="font-bold">{bankDetails.bankName || 'Not Set'}</span></div>
                  <div className="h-[1px] bg-gray-200 my-2" />
                  <div className="flex justify-between text-sm"><span className="text-gray-400">New Balance:</span> <span className="font-bold text-runner-deep">R {balance - withdrawAmount}</span></div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setModalStep(1)} className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600">Back</button>
                  <button onClick={handleFinalConfirm} className="flex-[2] bg-runner-light text-runner-deep font-bold py-4 rounded-2xl shadow-lg">Confirm & Pay</button>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS */}
            {modalStep === 3 && (
              <div className="p-10 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-runner-deep">Success!</h3>
                  <p className="text-gray-500 text-sm mt-2">Your funds are being processed and will arrive in 24-48 hours.</p>
                </div>
                <button onClick={closeModal} className="w-full bg-runner-deep text-white font-bold py-4 rounded-2xl">Back to Wallet</button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for transaction rows
const TransactionItem = ({ type, title, date, amount }) => {
  const isCredit = type === 'earnings' || type === 'bonus';
  return (
    <div className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isCredit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        <div><p className="font-bold text-gray-900">{title}</p><p className="text-xs text-gray-400">{date}</p></div>
      </div>
      <p className={`font-bold ${isCredit ? 'text-green-600' : 'text-gray-900'}`}>{amount}</p>
    </div>
  );
};

export default WalletPage;