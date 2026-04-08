import React, { useState, useEffect } from 'react';
import { 
  Users, Truck, Activity, Ban, DollarSign, Trash2, 
  CheckCircle, AlertTriangle, RefreshCw, Shield, LogOut,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getUsers, getRunners, getAllActivity,
  blockEntity, fineEntity, removeEntity
} from '../services/adminService';

type Tab = 'users' | 'runners' | 'activity';

interface ConfirmModal {
  type: 'block' | 'unblock' | 'fine' | 'remove';
  entityType: 'user' | 'runner';
  id: string | number;
  name: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [runners, setRunners] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirm, setConfirm] = useState<ConfirmModal | null>(null);
  const [fineAmount, setFineAmount] = useState('');
  const [fineReason, setFineReason] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const showMsg = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [u, r, a] = await Promise.all([getUsers(), getRunners(), getAllActivity()]);
      setUsers(u);
      setRunners(r);
      setActivity(a);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleBlock = async (entityType: 'user' | 'runner', id: string | number, block: boolean) => {
    try {
      await blockEntity(entityType, id, block);
      showMsg(`${block ? 'Blocked' : 'Unblocked'} successfully`);
      fetchData();
    } catch { setError('Action failed'); }
    setConfirm(null);
  };

  const handleFine = async () => {
    if (!confirm || !fineAmount) return;
    try {
      await fineEntity(confirm.entityType, confirm.id, Number(fineAmount), fineReason);
      showMsg(`Fine of R${fineAmount} applied to ${confirm.name}`);
      setFineAmount('');
      setFineReason('');
      fetchData();
    } catch { setError('Fine failed'); }
    setConfirm(null);
  };

  const handleRemove = async () => {
    if (!confirm) return;
    try {
      await removeEntity(confirm.entityType, confirm.id);
      showMsg(`${confirm.name} removed`);
      fetchData();
    } catch { setError('Remove failed'); }
    setConfirm(null);
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'users',    label: 'Customers', icon: <Users size={16} />,    count: users.length },
    { key: 'runners',  label: 'Runners',   icon: <Truck size={16} />,    count: runners.length },
    { key: 'activity', label: 'Activity',  icon: <Activity size={16} />, count: activity.length },
  ];

  // Filter data based on search term
  const getFilteredData = () => {
    if (activeTab === 'users') {
      return users.filter(u => 
        (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeTab === 'runners') {
      return runners.filter(r => 
        (r.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return activity.filter(a => 
      (a.product_description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  const ActionButtons = ({ entityType, id, name, isBlocked }: {
    entityType: 'user' | 'runner';
    id: string | number;
    name: string;
    isBlocked: boolean;
  }) => (
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={() => setConfirm({ type: isBlocked ? 'unblock' : 'block', entityType, id, name })}
        title={isBlocked ? 'Unblock' : 'Block'}
        className={`p-2 rounded-lg transition-all hover:scale-105 ${
          isBlocked
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
        }`}
      >
        {isBlocked ? <CheckCircle size={15} /> : <Ban size={15} />}
      </button>
      <button
        onClick={() => setConfirm({ type: 'fine', entityType, id, name })}
        title="Issue fine"
        className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-all hover:scale-105"
      >
        <DollarSign size={15} />
      </button>
      <button
        onClick={() => setConfirm({ type: 'remove', entityType, id, name })}
        title="Remove account"
        className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all hover:scale-105"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );

  const StatusBadge = ({ status, blocked }: { status?: string; blocked?: boolean }) => {
    if (blocked) return (
      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase">Blocked</span>
    );
    if (!status) return (
      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Active</span>
    );
    const colors: Record<string, string> = {
      PENDING:  'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#D3D3D3] relative">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(13,51,14,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(13,51,14,0.1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <div className="fixed top-0 -right-20 w-96 h-96 bg-[#A3B18A]/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="sticky top-0 z-40 px-6 py-4 bg-white/60 backdrop-blur-md border-b border-white/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0D330E] rounded-xl">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-[#0D330E] uppercase tracking-tight">Admin Dashboard</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">ConnectUs Control Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchData} className="p-2 bg-white rounded-xl shadow-sm hover:scale-105 transition-all" title="Refresh">
              <RefreshCw size={16} className={`text-[#0D330E] ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => { localStorage.clear(); navigate('/login'); }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Customers', value: users.length, color: 'bg-[#0D330E]', icon: <Users size={20} className="text-white" /> },
            { label: 'Total Runners',   value: runners.length, color: 'bg-[#2D531A]', icon: <Truck size={20} className="text-white" /> },
            { label: 'Total Events',    value: activity.length, color: 'bg-[#6E8649]', icon: <Activity size={20} className="text-white" /> },
          ].map((s) => (
            <div key={s.label} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-white/50">
              <div className={`${s.color} p-3 rounded-xl`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-black text-[#0D330E]">{s.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback messages */}
        {actionMsg && (
          <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
            <CheckCircle size={16} /> {actionMsg}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-2 bg-white/50 p-1.5 rounded-2xl backdrop-blur-sm w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-[#0D330E] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/60'
              }`}
            >
              {tab.icon} {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Main Table Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 overflow-hidden">
          
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab === 'users' ? 'customers' : activeTab === 'runners' ? 'runners' : 'activity'}...`} 
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#0D330E] outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-xs text-gray-400">
              {filteredData.length} item{filteredData.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* CUSTOMERS TAB */}
          {activeTab === 'users' && (
            <div>
              {loading ? (
                <div className="flex justify-center py-12"><RefreshCw className="animate-spin text-[#2D531A]" size={28} /></div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      {['ID', 'Name', 'Email', 'Status', 'Role', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredData.map((u: any) => (
                      <tr key={u.user_id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 text-xs text-gray-400 font-mono">#{u.user_id}</td>
                        <td className="px-5 py-3 font-bold text-[#0D330E] text-sm">{u.full_name}</td>
                        <td className="px-5 py-3 text-xs text-gray-500">{u.email}</td>
                        <td className="px-5 py-3"><StatusBadge blocked={u.is_blocked} /></td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 bg-[#0D330E]/10 text-[#0D330E] rounded-full text-[10px] font-bold uppercase">{u.role}</span>
                        </td>
                        <td className="px-5 py-3">
                          <ActionButtons entityType="user" id={u.user_id} name={u.full_name} isBlocked={!!u.is_blocked} />
                        </td>
                      </tr>
                    ))}
                    {filteredData.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No customers found</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* RUNNERS TAB */}
          {activeTab === 'runners' && (
            <div>
              {loading ? (
                <div className="flex justify-center py-12"><RefreshCw className="animate-spin text-[#2D531A]" size={28} /></div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      {['ID', 'Username', 'Email', 'City', 'Verification', 'Bookings', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredData.map((r: any) => (
                      <tr key={r.runner_id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 text-xs text-gray-400 font-mono">#{r.runner_id}</td>
                        <td className="px-5 py-3 font-bold text-[#0D330E] text-sm">{r.username}</td>
                        <td className="px-5 py-3 text-xs text-gray-500">{r.email}</td>
                        <td className="px-5 py-3 text-xs text-gray-500">{r.city || '—'}</td>
                        <td className="px-5 py-3"><StatusBadge status={r.verification_status} blocked={r.is_blocked} /></td>
                        <td className="px-5 py-3 text-sm font-bold text-[#0D330E]">{r.completed_bookings_count ?? 0}</td>
                        <td className="px-5 py-3">
                          <ActionButtons entityType="runner" id={r.runner_id} name={r.username} isBlocked={!!r.is_blocked} />
                        </td>
                      </tr>
                    ))}
                    {filteredData.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No runners found</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <div>
              {loading ? (
                <div className="flex justify-center py-12"><RefreshCw className="animate-spin text-[#2D531A]" size={28} /></div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      {['Booking ID', 'Customer', 'Runner', 'Description', 'Status', 'Budget', 'Created'].map(h => (
                        <th key={h} className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredData.map((a: any) => (
                      <tr key={a.booking_id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 text-xs text-gray-400 font-mono">#{a.booking_id}</td>
                        <td className="px-5 py-3 text-sm text-[#0D330E] font-medium">{a.customer_name || a.customer_id}</td>
                        <td className="px-5 py-3 text-sm text-[#2D531A] font-medium">{a.runner_name || '—'}</td>
                        <td className="px-5 py-3 text-xs text-gray-500 max-w-[200px] truncate" title={a.product_description}>{a.product_description}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            a.status === 'DELIVERED' ? 'bg-green-100 text-green-700'
                            : a.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700'
                            : a.status === 'PURCHASING' ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                          }`}>{a.status?.replace('_', ' ')}</span>
                        </td>
                        <td className="px-5 py-3 text-sm font-bold text-[#0D330E]">R{a.budget?.toFixed(2) ?? '0.00'}</td>
                        <td className="px-5 py-3 text-xs text-gray-400">
                          {a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                    {filteredData.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No activity found</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-black text-[#0D330E] mb-2 capitalize">
              {confirm.type === 'block' ? '⛔ Block' : confirm.type === 'unblock' ? '✅ Unblock' : confirm.type === 'fine' ? '💰 Fine' : '🗑 Remove'} {confirm.name}
            </h3>

            {confirm.type === 'fine' && (
              <div className="space-y-3 my-5">
                <input
                  type="number"
                  placeholder="Fine amount (ZAR)"
                  value={fineAmount}
                  onChange={e => setFineAmount(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2D531A] outline-none text-sm"
                />
                <input
                  type="text"
                  placeholder="Reason (optional)"
                  value={fineReason}
                  onChange={e => setFineReason(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2D531A] outline-none text-sm"
                />
              </div>
            )}

            {confirm.type === 'remove' && (
              <p className="text-sm text-gray-500 my-4">This will permanently delete the account. This cannot be undone.</p>
            )}

            {(confirm.type === 'block' || confirm.type === 'unblock') && (
              <p className="text-sm text-gray-500 my-4">
                {confirm.type === 'block'
                  ? 'This user will be blocked from accessing the platform.'
                  : 'This user will regain access to the platform.'}
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirm(null)} className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 text-sm">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirm.type === 'block')   handleBlock(confirm.entityType, confirm.id, true);
                  if (confirm.type === 'unblock') handleBlock(confirm.entityType, confirm.id, false);
                  if (confirm.type === 'fine')    handleFine();
                  if (confirm.type === 'remove')  handleRemove();
                }}
                className={`flex-1 py-3 rounded-xl font-bold text-white text-sm ${
                  confirm.type === 'remove' ? 'bg-red-600 hover:bg-red-700'
                  : confirm.type === 'fine' ? 'bg-yellow-500 hover:bg-yellow-600'
                  : confirm.type === 'block' ? 'bg-orange-500 hover:bg-orange-600'
                  : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;