import React, { useState } from 'react';
import { ArrowLeft, Search, LogOut, Users, ShoppingBag, CreditCard, CheckCircle2, XCircle, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const { users, orders, transactions, referralClaims, approveTransaction, rejectTransaction, approveReferralClaim, rejectReferralClaim, restoreData } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const maskEmail = (email: string) => {
    if (!email) return 'N/A';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    return `${name.substring(0, 1)}***@${domain}`;
  };

  const handleExport = () => {
    const data = {
      users: users.reduce((acc: any, u) => ({ ...acc, [u.id]: u }), {}),
      transactions: transactions.reduce((acc: any, t) => ({ ...acc, [t.id]: t }), {}),
      orders: orders.reduce((acc: any, o) => ({ ...acc, [o.id]: o }), {}),
      referralClaims: referralClaims.reduce((acc: any, c) => ({ ...acc, [c.id]: c }), {}),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smm-panel-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Data exported successfully!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm('Are you sure you want to restore this data? This will overwrite current data.')) {
          await restoreData(data);
          toast.success('Data restored successfully!');
        }
      } catch (err) {
        toast.error('Invalid data file.');
      }
    };
    reader.readAsText(file);
  };

  const pendingTxs = transactions.filter(t => t.status === 'Pending');
  const pendingReferrals = referralClaims.filter(c => c.status === 'Pending');

  const handleApprove = async (id: string) => {
    await approveTransaction(id);
    toast.success('Transaction approved successfully!');
  };

  const handleReject = async (id: string) => {
    await rejectTransaction(id);
    toast.success('Transaction rejected!');
  };

  const tabs = [
    { id: 'pending', label: `Pending (${pendingTxs.length})` },
    { id: 'all', label: 'All Transactions' },
    { id: 'orders', label: 'Orders' },
    { id: 'users', label: 'Users' },
    { id: 'referrals', label: `Referrals (${referralClaims.length})` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 max-w-md mx-auto shadow-xl flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-gray-900">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search TrxID, UserID, Email..."
              className="w-full bg-gray-50 border border-transparent rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
          <button onClick={() => { toast.success('Logged out of admin'); navigate('/'); }} className="text-gray-500 hover:text-gray-900">
            <LogOut size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar px-4 pb-4 gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[#F97316] text-white' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Stats Cards */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500">Total Users</div>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-indigo-500 text-white rounded-xl flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500">Total Orders</div>
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500">Total Transactions</div>
            <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
          </div>
        </div>

        {/* Export/Import Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Download size={18} /> Export Data
          </button>
          <label className="flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-900 transition-colors cursor-pointer">
            <Upload size={18} /> Import Data
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mt-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-900">
              {activeTab === 'pending' && 'Pending Payments'}
              {activeTab === 'all' && 'All Transactions'}
              {activeTab === 'orders' && 'All Orders'}
              {activeTab === 'users' && 'All Users'}
              {activeTab === 'referrals' && 'Referral Claims'}
            </h3>
          </div>
          
          <div className="w-full text-left text-sm">
            {/* Pending Tab */}
            {activeTab === 'pending' && (
              <>
                <div className="grid grid-cols-[1fr_2fr_auto] gap-4 p-4 bg-gray-50/50 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                  <div>AMOUNT</div>
                  <div>USER / DATE</div>
                  <div className="text-right">ACTIONS</div>
                </div>
                {pendingTxs.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No pending transactions.</div>
                ) : (
                  pendingTxs.map(tx => (
                    <div key={tx.id} className="grid grid-cols-[1fr_2fr_auto] gap-4 p-4 items-center border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <div>
                        <span className="font-bold text-gray-900">৳{tx.amount}</span>
                        <div className="text-[10px] text-gray-400 uppercase">{tx.method}</div>
                      </div>
                      <div className="text-gray-500 text-xs">
                        <div className="font-bold text-gray-700">{maskEmail(tx.userEmail)}</div>
                        <div className="text-indigo-600 font-mono">TrxID: {tx.trxId || 'N/A'}</div>
                        {new Date(tx.createdAt).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => handleApprove(tx.id)} className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                          <CheckCircle2 size={18} />
                        </button>
                        <button onClick={() => handleReject(tx.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                          <XCircle size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* All Transactions Tab */}
            {activeTab === 'all' && (
              <>
                <div className="grid grid-cols-[1fr_2fr_auto] gap-4 p-4 bg-gray-50/50 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                  <div>AMOUNT</div>
                  <div>USER / DATE</div>
                  <div className="text-right">STATUS</div>
                </div>
                {transactions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No transactions yet.</div>
                ) : (
                  transactions.map(tx => (
                    <div key={tx.id} className="grid grid-cols-[1fr_2fr_auto] gap-4 p-4 items-center border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <div>
                        <span className="font-bold text-gray-900">৳{tx.amount}</span>
                        <div className="text-[10px] text-gray-400 uppercase">{tx.method}</div>
                      </div>
                      <div className="text-gray-500 text-xs">
                        <div className="font-bold text-gray-700">{maskEmail(tx.userEmail)}</div>
                        <div className="text-indigo-600 font-mono">TrxID: {tx.trxId || 'N/A'}</div>
                        {new Date(tx.createdAt).toLocaleString()}
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                          tx.status === 'Pending' ? 'text-orange-500 bg-orange-50' :
                          tx.status === 'Approved' ? 'text-emerald-500 bg-emerald-50' :
                          'text-red-500 bg-red-50'
                        }`}>
                          {tx.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <>
                <div className="grid grid-cols-[2fr_1fr_auto] gap-4 p-4 bg-gray-50/50 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                  <div>SERVICE / USER</div>
                  <div>QTY / CHARGE</div>
                  <div className="text-right">STATUS</div>
                </div>
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No orders yet.</div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="grid grid-cols-[2fr_1fr_auto] gap-4 p-4 items-center border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <div className="text-xs">
                        <div className="font-bold text-gray-900 line-clamp-1">{order.service}</div>
                        <div className="text-gray-500">{maskEmail(order.userEmail)}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <div className="font-bold text-gray-700">{order.quantity}</div>
                        ৳{order.charge.toFixed(2)}
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-md text-orange-500 bg-orange-50">
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <>
                <div className="grid grid-cols-[2fr_1fr] gap-4 p-4 bg-gray-50/50 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                  <div>USER INFO</div>
                  <div className="text-right">BALANCE</div>
                </div>
                {users.filter(u => u.email.includes(searchQuery) || u.id.includes(searchQuery)).length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No users found.</div>
                ) : (
                  users.filter(u => u.email.includes(searchQuery) || u.id.includes(searchQuery)).map(user => (
                    <div key={user.id} className="grid grid-cols-[2fr_1fr] gap-4 p-4 items-center border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <div className="text-xs">
                        <div className="font-bold text-gray-900">{user.name} (@{user.username})</div>
                        <div className="text-gray-500">{maskEmail(user.email)}</div>
                        <div className="text-gray-400">ID: {user.id} | WA: {user.whatsapp || 'N/A'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-500">৳{user.balance.toFixed(2)}</div>
                        <div className="text-[10px] text-gray-400">Spent: ৳{user.totalSpent.toFixed(2)}</div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* Referrals Tab */}
            {activeTab === 'referrals' && (
              <>
                <div className="grid grid-cols-[1fr_2fr_auto] gap-4 p-4 bg-gray-50/50 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                  <div>REFERRER</div>
                  <div>REFERRED ID</div>
                  <div className="text-right">STATUS / ACTIONS</div>
                </div>
                {referralClaims.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No referral claims yet.</div>
                ) : (
                  referralClaims.map(claim => {
                    const referredUserExists = users.some(u => u.id === claim.referredUserIdOrEmail || u.email === claim.referredUserIdOrEmail);
                    return (
                      <div key={claim.id} className="grid grid-cols-[1fr_2fr_auto] gap-4 p-4 items-center border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <div className="text-xs">
                          <div className="font-bold text-gray-900">{maskEmail(claim.referrerEmail)}</div>
                          <div className="text-gray-500">ID: {claim.referrerId}</div>
                        </div>
                        <div className="text-xs">
                          <div className="font-bold text-purple-600">{claim.referredUserIdOrEmail}</div>
                          <div className={`text-[10px] ${referredUserExists ? 'text-emerald-500' : 'text-red-500'}`}>
                            {referredUserExists ? '✓ User Exists' : '✗ User Not Found'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          {claim.status === 'Pending' ? (
                            <>
                              <button 
                                onClick={async () => {
                                  const amount = prompt('Enter reward amount for this referral:', '5');
                                  if (amount === null) return; // User cancelled
                                  
                                  const parsedAmount = parseFloat(amount);
                                  if (!isNaN(parsedAmount) && parsedAmount >= 0) {
                                    await approveReferralClaim(claim.id, parsedAmount);
                                    toast.success(`Referral approved! ৳${parsedAmount} added to ${claim.referrerEmail}`);
                                  } else {
                                    toast.error('Invalid amount entered.');
                                  }
                                }} 
                                className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                                title="Approve & Add Funds"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button 
                                onClick={async () => {
                                  await rejectReferralClaim(claim.id);
                                  toast.success('Referral claim rejected.');
                                }} 
                                className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                                title="Reject Claim"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          ) : (
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                              claim.status === 'Approved' ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'
                            }`}>
                              {claim.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
