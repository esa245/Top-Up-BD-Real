import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [email, setEmail] = useState(() => localStorage.getItem('lastEmail') || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser, login } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refId = searchParams.get('ref') || '';

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lastEmail', currentUser.email);
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('অনুগ্রহ করে ইমেইল দিন');
      return;
    }
    
    setLoading(true);
    try {
      // Automatic login/signup with just email
      await login(email.trim(), '', '', '', '', '', refId);
      toast.success('সফলভাবে লগইন হয়েছে!');
      navigate('/');
    } catch (error) {
      toast.error('লগইন করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
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
                  অটোমেটিক লগইন
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed px-4">
                  আপনার ইমেইল দিয়ে মুহূর্তেই অ্যাকাউন্ট তৈরি বা লগইন করুন। কোনো পাসওয়ার্ডের ঝামেলা নেই!
                </p>
              </div>

              <form onSubmit={handleQuickLogin} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ইমেইল অ্যাড্রেস</label>
                    {localStorage.getItem('lastEmail') && (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1 animate-pulse">
                        <CheckCircle2 size={10} /> Remembered
                      </span>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-emerald-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="আপনার ইমেইল দিন (উদা: user@gmail.com)"
                      required
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-emerald-600 text-white font-black rounded-2xl py-4 shadow-xl shadow-emerald-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-700 hover:-translate-y-1'}`}
                >
                  {loading ? 'প্রসেসিং হচ্ছে...' : 'লগইন বা সাইন আপ করুন'}
                  {!loading && <ArrowRight size={20} />}
                </button>
                
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-gray-100"></div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">নিরাপদ লগইন</span>
                  <div className="flex-1 h-px bg-gray-100"></div>
                </div>
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

              <div className="mt-8 text-center bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200">
                <p className="text-gray-500 text-xs font-bold leading-relaxed uppercase tracking-wider">
                  অ্যাকাউন্ট তৈরি বা লগইন করতে শুধু আপনার সঠিক ইমেইলটি দিন। <br />
                  <span className="text-emerald-600">সবকিছু অটোমেটিকলি হয়ে যাবে!</span>
                </p>
              </div>

              {/* Bengali Marketing Content */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <div className="bg-emerald-50 rounded-2xl p-5 space-y-3">
                  <p className="font-bold text-emerald-800 text-center text-sm leading-relaxed">
                    বাংলাদেশের সবচেয়ে সাশ্রয়ী ও দ্রুতগতির সোশ্যাল মিডিয়া মার্কেটিং সার্ভিস এখন এক জায়গায়।
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
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
