import { useState, useEffect } from 'react';
import { ChevronDown, Info, Loader2, Search, User, Wallet, ShoppingBag, CreditCard, Send, List, Zap, Download } from 'lucide-react';
import { useAppContext } from '../store';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ServiceBoard } from '../components/ServiceBoard';
import { Category, Service } from '../types';

interface SMMService {
  service: string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
  refill: boolean;
  description?: string;
  average_time?: string;
}

export default function NewOrder() {
  const { placeOrder, currentUser, orders } = useAppContext();
  const [services, setServices] = useState<SMMService[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState<SMMService | null>(null);
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'order' | 'services'>('order');
  const [apiError, setApiError] = useState<any>(null);

  const usedBalance = orders.reduce((acc, order) => acc + order.charge, 0);

  useEffect(() => {
    const handleSelectService = (e: any) => {
      const { categoryId, serviceId } = e.detail;
      const service = services.find(s => s.service === serviceId.toString());
      if (service) {
        setSelectedCategory(service.category);
        setSelectedService(service);
        setActiveTab('order');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('selectService', handleSelectService);
    return () => window.removeEventListener('selectService', handleSelectService);
  }, [services]);

  const fetchServices = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await axios.get('/api/services');
      const data = response.data;
      if (Array.isArray(data)) {
        setServices(data);
        const cats = Array.from(new Set(data.map((s: SMMService) => s.category)));
        setCategories(cats);
        
        // Auto-select "Promote" category and "Facebook Follower 14 Taka" service
        const promoteCat = cats.find(c => c.toLowerCase().includes('promote'));
        if (promoteCat) {
          setSelectedCategory(promoteCat);
          const actionService = data.find(s => 
            s.category === promoteCat && 
            s.name.toLowerCase().includes('facebook follower') && 
            (s.name.includes('14') || Math.abs(((parseFloat(s.rate) * 120) + 5) - 14) < 1.5)
          );
          if (actionService) {
            setSelectedService(actionService);
          } else if (!selectedService) {
            // Fallback to first service in category if action service not found
            const firstInCat = data.find(s => s.category === promoteCat);
            if (firstInCat) setSelectedService(firstInCat);
          }
        } else if (cats.length > 0 && !selectedCategory) {
          setSelectedCategory(cats[0]);
        }
      } else {
        setApiError('Invalid data format from provider');
      }
    } catch (error: any) {
      console.error('Failed to fetch services:', error);
      const rawError = error.response?.data;
      let errorMsg = error.message;
      
      if (rawError) {
        if (typeof rawError === 'string') {
          errorMsg = rawError;
        } else if (rawError.message && typeof rawError.message === 'string') {
          errorMsg = rawError.message;
        } else if (rawError.error && typeof rawError.error === 'string') {
          errorMsg = rawError.error;
        } else if (rawError.details?.error && typeof rawError.details.error === 'string') {
          errorMsg = rawError.details.error;
        } else {
          errorMsg = JSON.stringify(rawError);
        }
      }
      
      setApiError(errorMsg);
      toast.error(`Failed to load services: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services
    .filter(s => 
      s.category === selectedCategory && 
      (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.service.includes(searchTerm))
    )
    .sort((a, b) => {
      // Sort the promotional service to the top
      const isAPromo = a.name.toLowerCase().includes('facebook follower') && (a.name.includes('14') || Math.abs(((parseFloat(a.rate) * 120) + 5) - 14) < 1.5);
      const isBPromo = b.name.toLowerCase().includes('facebook follower') && (b.name.includes('14') || Math.abs(((parseFloat(b.rate) * 120) + 5) - 14) < 1.5);
      if (isAPromo && !isBPromo) return -1;
      if (!isAPromo && isBPromo) return 1;
      return 0;
    });

  const charge = (selectedService && quantity) 
    ? (parseInt(quantity) / 1000) * ((parseFloat(selectedService.rate) * 120) + 5) // Added 5 BDT to the rate per 1000
    : 0;

  const handleSubmit = async () => {
    if (!selectedService || !link || !quantity) {
      toast.error('Please fill all fields.');
      return;
    }
    const qty = parseInt(quantity);
    const min = parseInt(selectedService.min);
    const max = parseInt(selectedService.max);

    if (qty < min || qty > max) {
      toast.error(`Quantity must be between ${min} and ${max}.`);
      return;
    }
    
    if (currentUser && currentUser.balance < charge) {
      toast.error('Insufficient balance. Please add funds.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Place order on SMM Panel via backend
      const response = await axios.post('/api/order', {
        service: selectedService.service,
        link,
        quantity: qty
      });

      if (response.data.order) {
        // 2. Record order in our local database (Firebase)
        const success = await placeOrder(
          selectedService.name,
          link,
          qty,
          charge,
          response.data.order.toString()
        );

        if (success) {
          toast.success('Order placed successfully!');
          setLink('');
          setQuantity('');
        }
      } else if (response.data.error) {
        toast.error(response.data.error);
      }
    } catch (error: any) {
      console.error('Order Error:', error);
      const rawError = error.response?.data;
      let errorMsg = error.message;
      
      if (rawError) {
        if (typeof rawError === 'string') {
          errorMsg = rawError;
        } else if (rawError.message && typeof rawError.message === 'string') {
          errorMsg = rawError.message;
        } else if (rawError.error && typeof rawError.error === 'string') {
          errorMsg = rawError.error;
        } else if (rawError.details?.error && typeof rawError.details.error === 'string') {
          errorMsg = rawError.details.error;
        } else {
          errorMsg = JSON.stringify(rawError);
        }
      }
      
      toast.error(`Failed to place order: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const boardCategories: Category[] = categories.map(catName => ({
    id: catName,
    name: catName,
    services: services
      .filter(s => s.category === catName)
      .map(s => ({
        id: s.service,
        name: s.name,
        ratePer1000: (parseFloat(s.rate) * 120) + 5,
        min: parseInt(s.min),
        max: parseInt(s.max),
        description: s.description ? [s.description] : [],
        category: s.category
      }))
  }));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading real services...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] pb-20 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* App Download Banner */}
        <a 
          href="https://drive.google.com/file/d/10KEwnLK_pDQ2giM6tsrdsyRyvAXZMj7y/view?usp=drivesdk"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-4 text-white shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-transform"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Download size={20} />
              </div>
              <div>
                <div className="font-black text-sm uppercase tracking-wider">Download Our App</div>
                <div className="text-[10px] font-medium opacity-80">Install for faster access & better experience</div>
              </div>
            </div>
            <div className="bg-white text-indigo-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase">
              Install
            </div>
          </div>
        </a>

        {/* Taraweeh Notice */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3 flex items-center gap-3 animate-pulse">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Zap size={14} />
          </div>
          <p className="text-[11px] font-bold text-indigo-900 leading-tight">
            এখন তারাবি নামাজ এর জন্য রাতে সার্ভার একটু স্লো থাকে, সার্ভিস পেতে একটু সময় লাগতে পারে।
          </p>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-600">Category</label>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className={!apiError ? "text-emerald-500" : "text-red-500"}>
                {!apiError ? "Connected" : `API Error: ${typeof apiError === 'string' ? apiError : JSON.stringify(apiError)}`}
                {apiError && typeof apiError === 'string' && apiError.toLowerCase().includes('key') && (
                  <span className="block text-[8px] text-red-400 mt-1">
                    Tip: Check your SMM_API_KEY in Vercel/Environment settings.
                  </span>
                )}
              </span>
              <button 
                onClick={fetchServices}
                className="text-indigo-600 flex items-center gap-1 hover:underline"
              >
                <Zap size={10} /> Load Real Services
              </button>
              <a 
                href="/api/health" 
                target="_blank" 
                className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
                title="Check Server Health & IP"
              >
                <Info size={10} /> IP
              </a>
            </div>
          </div>
          <div className="relative">
            <select 
              value={selectedCategory}
              onChange={(e) => {
                const newCat = e.target.value;
                setSelectedCategory(newCat);
                
                // Auto-select the promotional service if switching to Promote category
                if (newCat.toLowerCase().includes('promote')) {
                  const promoSvc = services.find(s => 
                    s.category === newCat && 
                    s.name.toLowerCase().includes('facebook follower') && 
                    (s.name.includes('14') || Math.abs(((parseFloat(s.rate) * 120) + 5) - 14) < 1.5)
                  );
                  if (promoSvc) {
                    setSelectedService(promoSvc);
                    return;
                  }
                }
                
                // Default fallback: select first service in the new category
                const firstInCat = services.find(s => s.category === newCat);
                setSelectedService(firstInCat || null);
              }}
              className="w-full appearance-none bg-white border border-slate-200 rounded-2xl p-4 pr-10 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>

        {/* Service */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600">Service</label>
          <div className="relative">
            <select 
              value={selectedService?.service || ''}
              onChange={(e) => {
                const s = services.find(srv => srv.service.toString() === e.target.value.toString());
                setSelectedService(s || null);
              }}
              className="w-full appearance-none bg-white border border-slate-200 rounded-2xl p-4 pr-10 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
            >
              <option value="">Select a service</option>
              {filteredServices.map(srv => (
                <option key={srv.service} value={srv.service}>
                  {srv.name} - ৳{((parseFloat(srv.rate) * 120) + 5).toFixed(2)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>

        {/* Description Box */}
        <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100 space-y-4">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <Info size={18} />
            <span>Description</span>
          </div>
          <div className="text-xs text-indigo-700/80 space-y-2 font-medium">
            {selectedService ? (
              selectedService.description ? (
                <div className="whitespace-pre-wrap">{selectedService.description}</div>
              ) : (
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    Type: Default
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    Refill: {selectedService.refill ? 'Yes' : 'No'}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    Cancel: No
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    Rate: ৳{((parseFloat(selectedService.rate) * 120) + 5).toFixed(2)} per 1000
                  </p>
                </div>
              )
            ) : (
              <p className="italic text-indigo-400">Please select a service to see details...</p>
            )}
          </div>
          <p className="text-[10px] text-indigo-600 font-bold italic pt-2">
            ★ Don't make multiple orders at the same time for the same link.
          </p>
        </div>

        {/* Link */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600">Link</label>
          <input 
            type="text" 
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://www.facebook.com/username"
            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          />
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600">Quantity</label>
          <input 
            type="number" 
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={selectedService ? `Min: ${selectedService.min} - Max: ${selectedService.max}` : "Enter quantity"}
            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          />
          {selectedService && (
            <p className="text-[10px] text-slate-400 font-medium px-1">
              Min: {selectedService.min} - Max: {selectedService.max}
            </p>
          )}
        </div>

        {/* Average Time */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-600">Average time</label>
            <Info size={14} className="text-slate-400" />
          </div>
          <div className="w-full bg-[#f1f5f9] border border-slate-200 rounded-2xl p-4 text-sm text-slate-500 font-medium">
            ~ {selectedService?.average_time || '1 hour 15 minutes'}
          </div>
        </div>

        {/* Charge */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600">Charge (BDT)</label>
          <div className="w-full bg-[#f1f5f9] border border-slate-200 rounded-2xl p-4 text-lg font-extrabold text-indigo-600">
            ৳ {charge.toFixed(2)}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit}
          disabled={!selectedService || !link || !quantity || submitting}
          className="w-full bg-indigo-600 text-white font-bold rounded-2xl p-5 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            'Submit Order'
          )}
        </button>

        {/* Important Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
            <span>⚠ গুরুত্বপূর্ণ নির্দেশনা :</span>
          </div>
          <div className="space-y-2 text-xs text-amber-900/80 font-bold leading-relaxed">
            <p>★ একই লিংকের জন্য এক সাথে একাধিক অর্ডার করবেন না। ডুপ্লিকেট অর্ডারের টাকা ফেরত দেওয়া হবে না।</p>
            <p>★ ভুল লিংক দিলে, অ্যাকাউন্ট ডেড থাকলে, বা ফলো বাটন না থাকলে সেই অর্ডারের টাকা ফেরত দেওয়া হবে না।</p>
            <p>★ বেশি অর্ডার থাকলে (High demand) অর্ডার শুরু হতে এবং স্পিডে কিছু সময় লাগতে পারে।</p>
            <p className="pt-1 text-indigo-600">পেমেন্ট বা অর্ডার সংক্রান্ত কোনো সমস্যা হলে Support বাটনে ক্লিক করুন।</p>
          </div>
        </div>
      </div>

    </div>
  );
}
