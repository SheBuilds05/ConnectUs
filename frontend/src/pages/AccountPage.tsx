// src/pages/AccountPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Shield, 
  CreditCard, Bell, ChevronRight, Camera, LogOut,
  ArrowLeft, Award, Clock, Calendar, Star,
  Package, Heart, MessageCircle, Settings,
  HelpCircle, FileText, Share2, Download,
  Wallet, Plus, Edit2, Check, X, Trash2,
  DollarSign, Banknote, RefreshCw, ArrowDown, ArrowUp
} from 'lucide-react';

// ─── Auth helpers ────────────────────────────────────────────────────────────
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getAuthToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token') || '';

const API = 'https://connectus-tpyp.onrender.com/api';

// ─── Wallet persistence helpers ──────────────────────────────────────────────
// Key is per-user so different accounts don't share wallets
const walletKey = (userId) => `wallet_${userId || 'guest'}`;

const loadWallet = (userId) => {
  try {
    const raw = localStorage.getItem(walletKey(userId));
    if (raw) return JSON.parse(raw);
  } catch {}
  // Default: 0 balance, empty history
  return { balanceCents: 0, currency: 'ZAR', transactions: [] };
};

const saveWallet = (userId, walletState) => {
  try {
    localStorage.setItem(walletKey(userId), JSON.stringify(walletState));
  } catch {}
};

// ─── Safe integer-cent math ──────────────────────────────────────────────────
// All balances are stored as integer cents to avoid floating-point drift.
const toCents = (rand) => Math.round(parseFloat(rand) * 100);
const toRand  = (cents) => (cents / 100).toFixed(2);

// ─── Component ───────────────────────────────────────────────────────────────
const AccountPage = () => {
  const [isEditing, setIsEditing]     = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedTab, setSelectedTab] = useState('profile');

  const storedUser = getStoredUser();
  const userId     = storedUser?.id || storedUser?._id;
  const token      = getAuthToken();

  const [userData, setUserData] = useState({
    name: storedUser?.name || '',
    email: storedUser?.email || '',
    phone: storedUser?.phone || '',
    address: storedUser?.address || '',
    memberSince: storedUser?.memberSince || '',
    membership: storedUser?.membership || 'Premium',
  });

  // Wallet state — loaded once from localStorage on mount
  const [walletData, setWalletData] = useState(() => loadWallet(userId));

  // Persist wallet whenever it changes
  useEffect(() => {
    saveWallet(userId, walletData);
  }, [walletData, userId]);

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'visa',       last4: '4242', expiry: '05/27', default: true  },
    { id: 2, type: 'mastercard', last4: '8888', expiry: '08/26', default: false },
  ]);

  const [newCard, setNewCard] = useState({ cardNumber: '', cardName: '', expiry: '', cvv: '' });

  // ─── Stats ────────────────────────────────────────────────────────────────
  const stats = [
    { icon: <Package size={20} />, label: 'Total Orders',    value: '—' },
    { icon: <Award   size={20} />, label: 'Runners Helped',  value: '—' },
    { icon: <Star    size={20} />, label: 'Average Rating',  value: '—' },
    { icon: <Clock   size={20} />, label: 'Member Since',    value: userData.memberSince || '—' },
  ];

  const recentActivities = [
    { action: 'Booked runner Lindiwe M.',   time: '2 hours ago', status: 'completed' },
    { action: 'Reviewed Sipho K.',           time: 'Yesterday',   status: 'completed' },
    { action: 'Added R500 to wallet',        time: '3 days ago',  status: 'completed' },
    { action: 'Favourite runner Thandi N.', time: '1 week ago',  status: 'completed' },
  ];

  // ─── Profile handlers ─────────────────────────────────────────────────────
  const handleEditToggle  = () => setIsEditing(!isEditing);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  const handleSaveProfile = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  // ─── Payment method handlers ──────────────────────────────────────────────
  const handleAddCard = () => {
    if (newCard.cardNumber && newCard.cardName && newCard.expiry && newCard.cvv) {
      setPaymentMethods(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'visa',
          last4: newCard.cardNumber.replace(/\s/g, '').slice(-4),
          expiry: newCard.expiry,
          default: false,
        },
      ]);
      setShowAddCard(false);
      setNewCard({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
      alert('Card added successfully!');
    } else {
      alert('Please fill in all card details.');
    }
  };

  const handleSetDefaultCard = (id) =>
    setPaymentMethods(prev => prev.map(c => ({ ...c, default: c.id === id })));

  const handleDeleteCard = (id) =>
    setPaymentMethods(prev => prev.filter(c => c.id !== id));

  // ─── Wallet: Top-up (local only, no API needed for adding money) ──────────
  const handleWalletTopUp = () => {
    const raw = prompt('Enter amount to add to wallet (ZAR):', '100');
    if (!raw) return;
    const cents = toCents(raw);
    if (isNaN(cents) || cents <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setWalletData(prev => ({
      ...prev,
      balanceCents: prev.balanceCents + cents,
      transactions: [
        {
          id: Date.now(),
          type: 'credit',
          amountCents: cents,
          description: 'Wallet top-up',
          date: new Date().toISOString().split('T')[0],
          status: 'completed',
        },
        ...prev.transactions,
      ],
    }));
    alert(`R${toRand(cents)} added to your wallet!`);
  };

  // ─── Wallet: Withdraw (calls backend, updates local state) ───────────────
  const handleWithdraw = async (method = 'Withdrawal') => {
    const raw = prompt(`Enter amount to ${method.toLowerCase()} (ZAR):`, '100');
    if (!raw) return;

    const cents = toCents(raw);
    if (isNaN(cents) || cents <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    if (cents > walletData.balanceCents) {
      alert(`Insufficient funds.\nAvailable: R${toRand(walletData.balanceCents)}\nRequested: R${toRand(cents)}`);
      return;
    }

    try {
      const res = await fetch(`${API}/users/${userId}/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: cents / 100 }), // send as rands to backend
      });

      if (!res.ok) throw new Error('Withdrawal failed');

      const data = await res.json();
      // Use server balance if available, otherwise subtract locally
      const newBalanceCents = data.newBalance != null
        ? toCents(data.newBalance)
        : walletData.balanceCents - cents;

      setWalletData(prev => ({
        ...prev,
        balanceCents: newBalanceCents,
        transactions: [
          {
            id: Date.now(),
            type: 'debit',
            amountCents: cents,
            description: method,
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
          },
          ...prev.transactions,
        ],
      }));

      alert(`R${toRand(cents)} has been successfully moved from your wallet.`);
    } catch (err) {
      console.error(err);
      // Fallback: update locally even if API is unreachable (remove if strict server-sync needed)
      setWalletData(prev => ({
        ...prev,
        balanceCents: prev.balanceCents - cents,
        transactions: [
          {
            id: Date.now(),
            type: 'debit',
            amountCents: cents,
            description: method,
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
          },
          ...prev.transactions,
        ],
      }));
      alert(`R${toRand(cents)} withdrawn (offline mode).`);
    }
  };

  // ─── Navigation ───────────────────────────────────────────────────────────
  const goToHome = () => { window.location.href = '/'; };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // NOTE: We intentionally do NOT clear wallet data from localStorage here
      // so it persists across sessions. Only auth tokens are cleared.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      alert('Logged out successfully!');
      window.location.href = '/login';
    }
  };

  // ─── Settings groups ──────────────────────────────────────────────────────
  const settingsGroups = [
    {
      title: 'Personal Information',
      items: [
        { icon: <User    size={18} />, label: 'Full Name',        value: userData.name,    field: 'name',    editable: true },
        { icon: <Mail    size={18} />, label: 'Email Address',    value: userData.email,   field: 'email',   editable: true },
        { icon: <Phone   size={18} />, label: 'Phone Number',     value: userData.phone,   field: 'phone',   editable: true },
        { icon: <MapPin  size={18} />, label: 'Default Address',  value: userData.address, field: 'address', editable: true },
      ],
    },
    {
      title: 'Security & Privacy',
      items: [
        { icon: <Shield size={18} />, label: 'Password',                    value: '••••••••',               badge: 'Update', action: 'password' },
        { icon: <Shield size={18} />, label: 'Two-Factor Authentication',   value: 'Disabled',               badge: 'Enable', action: '2fa' },
        { icon: <Bell   size={18} />, label: 'Notification Preferences',    value: 'Push: On, Email: On',    editable: true },
      ],
    },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="p-4 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-8 pb-20">

        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={goToHome}
              className="p-3 bg-white border border-gray-200 rounded-2xl text-[#0D330E] hover:bg-gray-50 hover:border-[#2D531A] transition-all shadow-sm active:scale-95"
              title="Go back to home"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Account</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your profile, wallet, and settings</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-colors shadow-sm"
            title="Logout"
          >
            <LogOut size={22} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm border border-gray-100">
          {['profile', 'wallet', 'payments', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                selectedTab === tab
                  ? 'bg-[#2D531A] text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── PROFILE TAB ───────────────────────────────────────────────────── */}
        {selectedTab === 'profile' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-50 text-[#2D531A] rounded-xl">{stat.icon}</div>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Profile Card */}
            <div className="relative bg-white rounded-[40px] p-8 border border-gray-100 shadow-md hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-[35px] border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                    <User size={56} className="text-gray-400" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-3 bg-[#2D531A] text-white rounded-xl shadow-lg hover:scale-110 transition-transform hover:bg-[#1a3a0f]">
                    <Camera size={18} />
                  </button>
                </div>

                <div className="text-center md:text-left flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text" name="name" value={userData.name}
                        onChange={handleInputChange}
                        className="text-2xl font-black text-gray-900 border-b border-gray-300 focus:border-[#2D531A] outline-none w-full"
                        placeholder="Your name"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-black text-gray-900">{userData.name || 'Your Name'}</h2>
                      <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                        <span className="bg-[#2D531A] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg">
                          {userData.membership} Member
                        </span>
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg">
                          Verified
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    {[
                      { icon: <Mail size={14} />, field: 'email', type: 'email', placeholder: 'your@email.com' },
                      { icon: <Phone size={14} />, field: 'phone', type: 'tel', placeholder: '+27 ...' },
                      { icon: <MapPin size={14} />, field: 'address', type: 'text', placeholder: 'Your address' },
                    ].map(({ icon, field, type, placeholder }) => (
                      <div key={field} className="flex items-center gap-1">
                        <span className="text-[#2D531A]">{icon}</span>
                        {isEditing ? (
                          <input
                            type={type} name={field} value={userData[field]}
                            onChange={handleInputChange} placeholder={placeholder}
                            className="text-sm border-b border-gray-300 focus:border-[#2D531A] outline-none"
                          />
                        ) : (
                          <span>{userData[field] || placeholder}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {isEditing ? (
                  <div className="flex gap-2">
                    <button onClick={handleSaveProfile} className="px-6 py-3 bg-[#2D531A] text-white font-bold rounded-2xl hover:bg-[#1a3a0f] flex items-center gap-2">
                      <Check size={16} /> Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 flex items-center gap-2">
                      <X size={16} /> Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={handleEditToggle} className="px-8 py-4 bg-[#2D531A] hover:bg-[#1a3a0f] text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                    <Edit2 size={16} /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <Clock size={16} /> Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivities.map((a, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${a.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className="text-sm font-medium text-gray-700">{a.action}</span>
                    </div>
                    <span className="text-xs text-gray-400">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── WALLET TAB ────────────────────────────────────────────────────── */}
        {selectedTab === 'wallet' && (
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-[#2D531A] to-[#0D330E] rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-2xl"><Wallet size={28} /></div>
                  <h3 className="text-xl font-black">Wallet Balance</h3>
                </div>
                <button
                  onClick={handleWalletTopUp}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                >
                  <Plus size={16} /> Top Up
                </button>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-black">R{toRand(walletData.balanceCents)}</span>
                <span className="text-white/60 ml-2">ZAR</span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleWithdraw('Withdrawal')}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors"
                >
                  Withdraw
                </button>
                <button
                  onClick={() => handleWithdraw('Transfer to Bank')}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors"
                >
                  Send to Bank
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4">
              <button className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-center">
                <RefreshCw size={24} className="mx-auto mb-2 text-[#2D531A]" />
                <span className="text-xs font-bold">Request Refund</span>
              </button>
              <button
                onClick={() => handleWithdraw('Withdrawal')}
                className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-center"
              >
                <Banknote size={24} className="mx-auto mb-2 text-[#2D531A]" />
                <span className="text-xs font-bold">Withdraw</span>
              </button>
              <button
                onClick={handleWalletTopUp}
                className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-center"
              >
                <DollarSign size={24} className="mx-auto mb-2 text-[#2D531A]" />
                <span className="text-xs font-bold">Add Money</span>
              </button>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <Clock size={16} /> Transaction History
              </h3>
              {walletData.transactions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No transactions yet.</p>
              ) : (
                <div className="space-y-3">
                  {walletData.transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${tx.type === 'credit' ? 'bg-green-50' : 'bg-red-50'}`}>
                          {tx.type === 'credit'
                            ? <ArrowDown size={16} className="text-green-600" />
                            : <ArrowUp   size={16} className="text-red-600" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{tx.description}</p>
                          <p className="text-xs text-gray-400">{tx.date}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'credit' ? '+' : '-'}R{toRand(tx.amountCents)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PAYMENTS TAB ──────────────────────────────────────────────────── */}
        {selectedTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <CreditCard size={16} /> Saved Payment Methods
                </h3>
                <button
                  onClick={() => setShowAddCard(true)}
                  className="text-[#2D531A] text-sm font-bold hover:underline flex items-center gap-1"
                >
                  <Plus size={16} /> Add New
                </button>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((card) => (
                  <div key={card.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl">
                        <CreditCard size={20} className="text-[#2D531A]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {card.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {card.last4}
                        </p>
                        <p className="text-xs text-gray-400">Expires {card.expiry}</p>
                      </div>
                      {card.default && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!card.default && (
                        <>
                          <button onClick={() => handleSetDefaultCard(card.id)} className="p-2 hover:bg-white rounded-lg transition-colors" title="Set as default">
                            <Check size={16} className="text-gray-400 hover:text-green-600" />
                          </button>
                          <button onClick={() => handleDeleteCard(card.id)} className="p-2 hover:bg-white rounded-lg transition-colors" title="Delete card">
                            <Trash2 size={16} className="text-gray-400 hover:text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Card Modal */}
            {showAddCard && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                  <h3 className="text-xl font-black text-gray-900 mb-6">Add New Card</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Card Number',      field: 'cardNumber', type: 'text',     placeholder: '1234 5678 9012 3456' },
                      { label: 'Cardholder Name',  field: 'cardName',   type: 'text',     placeholder: 'John Doe' },
                    ].map(({ label, field, type, placeholder }) => (
                      <div key={field}>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
                        <input
                          type={type} placeholder={placeholder}
                          className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2D531A] outline-none"
                          value={newCard[field]}
                          onChange={(e) => setNewCard({ ...newCard, [field]: e.target.value })}
                        />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Expiry', field: 'expiry', placeholder: 'MM/YY' },
                        { label: 'CVV',    field: 'cvv',    placeholder: '123' },
                      ].map(({ label, field, placeholder }) => (
                        <div key={field}>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
                          <input
                            type="text" placeholder={placeholder}
                            className="w-full mt-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2D531A] outline-none"
                            value={newCard[field]}
                            onChange={(e) => setNewCard({ ...newCard, [field]: e.target.value })}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setShowAddCard(false)} className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleAddCard} className="flex-1 px-6 py-4 bg-[#2D531A] text-white rounded-xl font-bold hover:bg-[#1a3a0f] transition-colors">
                        Add Card
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ──────────────────────────────────────────────────── */}
        {selectedTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {settingsGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">{group.title}</h3>
                <div className="space-y-3">
                  {group.items.map((item) => (
                    <button
                      key={item.label}
                      className="w-full bg-white p-5 rounded-3xl border border-gray-50 hover:border-green-100 hover:shadow-md transition-all flex items-center justify-between group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:text-[#2D531A] group-hover:bg-green-50 transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">{item.label}</p>
                          <p className="text-sm font-bold text-gray-700">{item.value}</p>
                        </div>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-black bg-[#2D531A] text-white px-2 py-1 rounded-lg">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AccountPage;