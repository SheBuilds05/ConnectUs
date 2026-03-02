import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, History, Gift, X, Landmark } from 'lucide-react';

const WalletPage = () => {
  const [balance, setBalance] = useState(2450.00);
  const [showModal, setShowModal] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountType: 'Savings'
  });

  const handleSaveDetails = (e) => {
    e.preventDefault();
    alert("Banking details saved successfully!");
    setShowModal(false);
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
              <button 
                onClick={() => setShowModal(true)}
                className="flex-1 bg-white/10 border border-white/20 text-white font-bold py-4 rounded-2xl hover:bg-white/20 transition-colors"
              >
                Payout Settings
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
              <div className="bg-runner-light h-full w-full shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            </div>
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100">
            <p className="text-green-700 font-bold text-xs uppercase tracking-wide">Status: Qualified</p>
            <p className="text-green-600 text-[10px] mt-1 font-medium">R500 scheduled for April 1st, 2026</p>
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
          <button className="text-runner-light text-sm font-bold hover:underline">Download PDF</button>
        </div>
        <div className="divide-y divide-gray-50">
          <TransactionItem type="earnings" title="Grocery Order #2104" date="March 2, 2026" amount="+ R120.00" />
          <TransactionItem type="withdrawal" title="Standard Bank Payout" date="Feb 28, 2026" amount="- R1,500.00" />
          <TransactionItem type="bonus" title="Feb Monthly Bonus" date="Feb 28, 2026" amount="+ R500.00" />
        </div>
      </div>

      {/* --- PAYOUT SETTINGS MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-runner-deep/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative z-10 overflow-hidden transition-all animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-runner-deep">Payout Details</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveDetails} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bank Name</label>
                <div className="relative">
                  <Landmark className="absolute left-4 top-3.5 text-gray-300" size={18} />
                  <input 
                    required
                    className="w-full bg-gray-50 border border-gray-100 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-runner-light outline-none transition-all"
                    placeholder="e.g. Standard Bank, FNB"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Number</label>
                <input 
                  required
                  type="number"
                  className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-runner-light outline-none transition-all"
                  placeholder="10 digits"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Type</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-runner-light outline-none transition-all appearance-none cursor-pointer"
                  value={bankDetails.accountType}
                  onChange={(e) => setBankDetails({...bankDetails, accountType: e.target.value})}
                >
                  <option>Savings</option>
                  <option>Cheque / Current</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-runner-deep text-white font-bold py-4 rounded-2xl hover:bg-black transition-colors shadow-lg mt-4"
              >
                Save Payout Method
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TransactionItem = ({ type, title, date, amount }) => {
  const isCredit = type === 'earnings' || type === 'bonus';
  return (
    <div className="flex items-center justify-between p-6 hover:bg-gray-50/80 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isCredit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        <div>
          <p className="font-bold text-runner-deep">{title}</p>
          <p className="text-xs text-gray-400 font-medium">{date}</p>
        </div>
      </div>
      <p className={`font-bold text-lg ${isCredit ? 'text-green-600' : 'text-runner-deep'}`}>{amount}</p>
    </div>
  );
};

export default WalletPage;