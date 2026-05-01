import React, { useState } from 'react';
import { Share2, Copy, Users, Wallet, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store';
import toast from 'react-hot-toast';

export default function Referral() {
  const navigate = useNavigate();
  const { currentUser, referralClaims } = useAppContext();
  const [copied, setCopied] = useState(false);

  if (!currentUser) return null;

  const referralLink = `${window.location.origin}/login?ref=${currentUser.id}`;
  
  const myReferrals = referralClaims.filter(c => c.referrerId === currentUser.id);
  const totalEarned = myReferrals
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
          <div className="text-2xl font-black text-gray-900">{myReferrals.length}</div>
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
        {myReferrals.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
            <Users className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-sm text-gray-500">No referrals yet. Share your link to start earning!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myReferrals.map((claim) => (
              <div key={claim.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                <div>
                  <div className="font-bold text-gray-900 text-sm">{claim.referredUserIdOrEmail}</div>
                  <div className="text-[10px] text-gray-500">{new Date(claim.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-emerald-600 text-sm">
                    +৳{((claim as any).amount || 0).toFixed(2)}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{claim.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
