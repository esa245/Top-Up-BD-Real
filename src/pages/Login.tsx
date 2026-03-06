import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  HeadphonesIcon, 
  User, 
  Mail, 
  Lock, 
  Fingerprint, 
  MessageCircle,
  CheckCircle2,
  PlayCircle,
  ArrowRight,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState('');
  
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoginMode) {
      if (email.trim() && password.trim()) {
        await login(email.trim(), '', password.trim());
        toast.success('আপনাকে স্বাগতম!');
        navigate('/');
      } else {
        toast.error('অনুগ্রহ করে সব ঘর পূরণ করুন');
      }
    } else {
      if (email.trim() && name.trim() && password.trim() && username.trim()) {
        if (password !== confirmPassword) {
          toast.error('পাসওয়ার্ড মিলছে না');
          return;
        }
        await login(email.trim(), name.trim(), password.trim(), userId.trim(), username.trim());
        toast.success('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
        navigate('/');
      } else {
        toast.error('অনুগ্রহ করে সব ঘর পূরণ করুন');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] font-sans pb-20">
      {/* Top Banner */}
      <div className="bg-emerald-600 text-white py-2 px-4 text-center text-xs font-bold tracking-widest uppercase">
        বাংলাদেশের সেরা SMM প্যানেল - Top Up BD
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side - Content & Info */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp size={24} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">টপ আপ বিডি</h1>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                আপনার সোশ্যাল মিডিয়া <br />
                <span className="text-emerald-600">সাফল্যের চূড়ান্ত গন্তব্য!</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
                ডিজিটাল যুগে, যেকোনো ব্যবসার উন্নতির জন্য শক্তিশালী অনলাইন উপস্থিতি অপরিহার্য। 
                SMM সার্ভিসের গোপন রহস্য উন্মোচন করা মানে আপনার ব্র্যান্ডের জন্য সুযোগের ভাণ্ডার খুলে দেওয়া।
              </p>
            </div>

            {/* Video Placeholder */}
            <div className="relative aspect-video bg-gray-900 rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border-4 border-white">
              <img 
                src="https://picsum.photos/seed/smm/800/450" 
                alt="টিউটোরিয়াল" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4">
                <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <PlayCircle size={48} fill="currentColor" className="text-white" />
                </div>
                <p className="font-bold text-xl tracking-tight">কিভাবে টপ আপ বিডি-তে অর্ডার করবেন</p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <Zap className="text-yellow-500" />, title: "তাৎক্ষণিক ডেলিভারি", desc: "অর্ডার স্বয়ংক্রিয়ভাবে প্রসেস করা হয়" },
                { icon: <ShieldCheck className="text-emerald-500" />, title: "নিরাপদ সিস্টেম", desc: "১০০% নিরাপদ এবং এনক্রিপ্টেড" },
                { icon: <HeadphonesIcon className="text-blue-500" />, title: "২৪/৭ সাপোর্ট", desc: "আপনাকে সাহায্য করার জন্য আমরা সব সময় আছি" },
                { icon: <CheckCircle2 className="text-purple-500" />, title: "মানসম্মত সার্ভিস", desc: "আসল এবং সক্রিয় ফলাফল" }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg">{feature.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{feature.title}</h4>
                    <p className="text-gray-500 text-xs mt-1">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  {isLoginMode ? 'স্বাগতম' : 'অ্যাকাউন্ট তৈরি করুন'}
                </h2>
                <p className="text-gray-500 font-medium">
                  {isLoginMode ? 'আপনার প্যানেলে প্রবেশ করতে তথ্য দিন' : 'বাংলাদেশের সেরা SMM প্যানেলে যোগ দিন'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginMode && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">পুরো নাম</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="আপনার নাম লিখুন"
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ইউজারনেম</label>
                        <div className="relative">
                          <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ইউজারনেম দিন"
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ইমেইল অ্যাড্রেস</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="আপনার ইমেইল দিন"
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">পাসওয়ার্ড</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  {!isLoginMode && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">পাসওয়ার্ড নিশ্চিত করুন</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input 
                          type="password" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-black rounded-xl py-4 mt-4 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                >
                  {isLoginMode ? 'প্যানেলে লগইন করুন' : 'আমার অ্যাকাউন্ট তৈরি করুন'}
                  <ArrowRight size={18} />
                </button>
              </form>

              <div className="mt-6">
                <a 
                  href="https://drive.google.com/file/d/10KEwnLK_pDQ2giM6tsrdsyRyvAXZMj7y/view?usp=drivesdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-indigo-50 text-indigo-600 font-bold rounded-xl py-4 hover:bg-indigo-100 transition-all border border-indigo-100 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  <Download size={18} /> APK অ্যাপ ডাউনলোড করুন
                </a>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm font-medium">
                  {isLoginMode ? "অ্যাকাউন্ট নেই?" : "আগে থেকেই অ্যাকাউন্ট আছে?"}
                  <button 
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="ml-2 text-emerald-600 font-bold hover:underline"
                  >
                    {isLoginMode ? 'সাইন আপ' : 'লগইন'}
                  </button>
                </p>
              </div>

              {/* Bengali Marketing Content */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <div className="bg-emerald-50 rounded-2xl p-5 space-y-3">
                  <p className="font-bold text-emerald-800 text-center text-sm leading-relaxed">
                    বাংলাদেশের সবচেয়ে সাশ্রয়ী ও দ্রুতগতির সোশ্যাল মিডিয়া মার্কেটিং সার্ভিস এখন এক জায়গায়।
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-emerald-600 border border-emerald-100 shadow-sm">🎁 একাউন্ট করুন আর জিতুন ২ টাকা বোনাস</span>
                    <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-emerald-600 border border-emerald-100 shadow-sm">FB ফলোয়ার ১১৳</span>
                    <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-emerald-600 border border-emerald-100 shadow-sm">TikTok লাইক ৫৳</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/8801753567152" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 animate-bounce"
      >
        <MessageCircle size={32} fill="currentColor" />
      </a>
    </div>
  );
}
