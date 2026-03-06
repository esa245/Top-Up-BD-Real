import { useState } from 'react';
import { Share2, FileText, Settings, LogOut, MessageCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout, addReferralClaim } = useAppContext();
  const [referralId, setReferralId] = useState('');
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleCopyId = () => {
    if (currentUser) {
      navigator.clipboard.writeText(currentUser.id);
      toast.success('ID copied to clipboard!');
    }
  };

  const handleReferralSubmit = async () => {
    if (!referralId.trim()) {
      toast.error('অনুগ্রহ করে বন্ধুর ইউজার আইডি দিন।');
      return;
    }
    if (referralId.trim() === currentUser?.id) {
      toast.error('আপনি নিজের আইডি ব্যবহার করতে পারবেন না।');
      return;
    }
    
    const result = await addReferralClaim(referralId.trim());
    
    if (result.success) {
      toast.success(result.message);
      setReferralId('');
    } else {
      toast.error(result.message);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="p-4 space-y-6 pt-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 border-4 border-white shadow-sm">
            <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
          <p className="text-gray-500 text-sm">@{currentUser.username}</p>
          <p className="text-gray-400 text-xs mt-1">{currentUser.email}</p>
          {currentUser.whatsapp && (
            <p className="text-emerald-600 text-xs font-bold mt-1 flex items-center justify-center gap-1">
              <MessageCircle size={12} fill="currentColor" />
              {currentUser.whatsapp}
            </p>
          )}
        </div>

        <div 
          onClick={handleCopyId}
          className="flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-indigo-100 transition-colors"
        >
          <span>ID: {currentUser.id}</span>
          <Share2 size={14} />
        </div>
        
        <p className="text-xs text-gray-400">Member since {new Date(currentUser.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-3xl p-5 text-center space-y-1 border border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CURRENT BALANCE</div>
          <div className="text-xl font-bold text-emerald-500">৳{currentUser.balance.toFixed(2)}</div>
        </div>
        <div className="bg-slate-50 rounded-3xl p-5 text-center space-y-1 border border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL SPENT</div>
          <div className="text-xl font-bold text-indigo-600">৳{currentUser.totalSpent.toFixed(2)}</div>
        </div>
      </div>

      {/* Refer a Friend */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="8" width="18" height="12" rx="2" ry="2"></rect>
                <path d="M12 8v12"></path>
                <path d="M11.5 3a2.5 2.5 0 0 0-5 5h5V3z"></path>
                <path d="M12.5 3a2.5 2.5 0 0 1 5 5h-5V3z"></path>
              </svg>
            </div>
            <h3 className="font-bold text-slate-900">Refer a Friend</h3>
          </div>
          <button className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-100 transition-colors">
            <Share2 size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          আপনার বন্ধুকে শেয়ার করুন ও তার ৬ সংখ্যার ইউজার আইডি এখানে লিখুন এবং জিতে নিন ৫ টাকা
        </p>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={referralId}
            onChange={(e) => setReferralId(e.target.value)}
            placeholder="বন্ধুর ইউজার আইডি"
            className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
          <button 
            onClick={handleReferralSubmit}
            className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Menu List */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <FileText size={20} />
            </div>
            <span className="font-bold text-slate-900">Payment History</span>
          </div>
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center">
              <Settings size={20} />
            </div>
            <span className="font-bold text-slate-900">Settings</span>
          </div>
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
              <LogOut size={20} />
            </div>
            <span className="font-bold text-red-500">Logout</span>
          </div>
        </button>
      </div>

      {/* App Download Link */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <Download size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Official Android App</h3>
            <p className="text-slate-400 text-xs">Install our APK for the best experience</p>
          </div>
        </div>
        <a 
          href="https://drive.google.com/file/d/10KEwnLK_pDQ2giM6tsrdsyRyvAXZMj7y/view?usp=drivesdk"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-emerald-500 text-white font-bold text-center py-4 rounded-2xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-900/20"
        >
          Download APK Now
        </a>
      </div>
    </div>
  );
}
