import React, { useState } from 'react';
import { Share2, Copy, Users, Wallet, CheckCircle2, ArrowLeft, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store';
import toast from 'react-hot-toast';

export default function Referral() {
  const navigate = useNavigate();
  const { currentUser, referralClaims, users } = useAppContext();
  const [copied, setCopied] = useState(false);

  if (!currentUser) return null;

  const referralLink = `${window.location.origin}/login?ref=${currentUser.id}`;
  
  // Count everyone who signed up using this user's link
  const referredUsers = users.filter(u => u.referredBy === currentUser.id);
  
  // Get all commission claims
  const myClaims = referralClaims.filter(c => c.referrerId === currentUser.id);
  
  const totalEarned = myClaims
    .filter(c => c.status === 'Approved')
    .reduce((sum, c) => sum + ((c as any).amount || 0), 0);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Top Up BD',
          text: 'Use my referral link to join Top Up BD and get started!',
          url: referralLink,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Referral Program</h2>
          <p className="text-sm text-gray-500">Earn 5% from every deposit of your referrals</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-indigo-50 shadow-sm">
          <div className="bg-indigo-50 w-10 h-10 rounded-xl flex items-center justify-center text-indigo-600 mb-3">
            <Users size={20} />
          </div>
          <div className="text-2xl font-black text-gray-900">{referredUsers.length}</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Referrals</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm">
          <div className="bg-emerald-50 w-10 h-10 rounded-xl flex items-center justify-center text-emerald-600 mb-3">
            <Wallet size={20} />
          </div>
          <div className="text-2xl font-black text-emerald-600">৳{totalEarned.toFixed(2)}</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Earned</div>
        </div>
      </div>

      {/* Bonus Offer Card */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg shadow-orange-100 overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="text-white" size={24} />
            <h3 className="text-xl font-black italic tracking-tight">SPECIAL REWARD!</h3>
          </div>
          <p className="text-orange-50 font-bold text-lg mb-4">১০ জন সফল রেফার করলে ১০০ টাকা বোনাস পান!</p>
          
          {/* Progress Bar */}
          <div className="bg-white/20 h-3 rounded-full mb-2 overflow-hidden border border-white/10">
            <div 
              className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000"
              style={{ width: `${Math.min((referredUsers.filter(u => myClaims.some(c => c.referredUserIdOrEmail === u.id || c.referredUserIdOrEmail === u.email)).length / 10) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-orange-50">
            <span>Progress: {Math.min(referredUsers.filter(u => myClaims.some(c => c.referredUserIdOrEmail === u.id || c.referredUserIdOrEmail === u.email)).length, 10)}/10 Complete</span>
            <span>Reward: ৳100.00</span>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-8 -bottom-8 bg-white/10 w-32 h-32 rounded-full blur-2xl" />
        <div className="absolute -left-4 -top-4 bg-black/5 w-24 h-24 rounded-full blur-xl" />
      </div>

      {/* Referral Link Box */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
        <h3 className="text-lg font-bold mb-2">Your Referral Link</h3>
        <p className="text-indigo-100 text-sm mb-6">Share this link with your friends and earn rewards automatically when they add funds.</p>
        
        <div className="flex gap-2">
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 text-sm font-mono truncate border border-white/20">
            {referralLink}
          </div>
          <button 
            onClick={copyToClipboard}
            className="bg-white text-indigo-600 p-3 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
          </button>
        </div>
        
        <button 
          onClick={handleShare}
          className="w-full mt-4 bg-white/20 border border-white/30 hover:bg-white/30 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <Share2 size={18} />
          Share Link
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">How it works?</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 shrink-0">1</div>
            <p className="text-sm text-gray-600">Copy your referral link and send it to your friends.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 shrink-0">2</div>
            <p className="text-sm text-gray-600">They sign up using your link and become your referral.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 shrink-0">3</div>
            <p className="text-sm text-gray-600">Whenever they add funds to their account, you get 5% commission instantly!</p>
          </div>
        </div>
      </div>

      {/* History */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Referral History</h3>
        {referredUsers.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
            <Users className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-sm text-gray-500">No referrals yet. Share your link to start earning!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {referredUsers.map((user) => {
              const commissions = myClaims.filter(c => c.referredUserIdOrEmail === user.email || c.referredUserIdOrEmail === user.id);
              const userEarned = commissions.reduce((sum, c) => sum + ((c as any).amount || 0), 0);
              
              return (
                <div key={user.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{user.name}</div>
                    <div className="text-[10px] text-indigo-600 font-bold mb-0.5">ID: {user.id}</div>
                    <div className="text-[10px] text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-600 text-sm">
                      +৳{userEarned.toFixed(2)}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {commissions.length > 0 ? 'Commission Earned' : 'No Deposit Yet'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
