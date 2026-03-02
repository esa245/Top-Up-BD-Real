import { useState, useEffect } from 'react';
import { ChevronDown, Info, Loader2 } from 'lucide-react';
import { useAppContext } from '../store';
import toast from 'react-hot-toast';
import axios from 'axios';

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
  const { placeOrder, currentUser } = useAppContext();
  const [services, setServices] = useState<SMMService[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState<SMMService | null>(null);
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        const data = response.data;
        if (Array.isArray(data)) {
          setServices(data);
          const cats = Array.from(new Set(data.map((s: SMMService) => s.category)));
          setCategories(cats);
          if (cats.length > 0) setSelectedCategory(cats[0]);
        }
      } catch (error: any) {
        console.error('Failed to fetch services:', error);
        const errorMsg = error.response?.data?.details?.error || error.response?.data?.error || error.message;
        toast.error(`Failed to load services: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(s => 
    s.category === selectedCategory && 
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.service.includes(searchTerm))
  );

  const charge = (selectedService && quantity) 
    ? (parseInt(quantity) / 1000) * parseFloat(selectedService.rate) * 120 // Assuming 120 BDT per USD conversion
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
          charge
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
      const errorMsg = error.response?.data?.details?.error || error.response?.data?.error || error.message;
      toast.error(`Failed to place order: ${errorMsg}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading real services...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Search Bar */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Search</label>
        <div className="relative">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search service..."
            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-gray-700">Category</label>
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Real Services
          </span>
        </div>
        <div className="relative">
          <select 
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedService(null);
            }}
            className="w-full appearance-none bg-white border border-gray-200 rounded-xl p-4 pr-10 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Service */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Service</label>
        <div className="relative">
          <select 
            value={selectedService?.service || ''}
            onChange={(e) => {
              const s = filteredServices.find(srv => srv.service === e.target.value);
              setSelectedService(s || null);
            }}
            className="w-full appearance-none bg-white border border-gray-200 rounded-xl p-4 pr-10 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select a service</option>
            {filteredServices.map(srv => (
              <option key={srv.service} value={srv.service}>
                [{srv.service}] {srv.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Description */}
      {selectedService && (
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Description</label>
          <div className="bg-indigo-50/50 rounded-2xl p-5 space-y-3 border border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-900 font-bold">
              <Info size={18} />
              <span>Service Details</span>
            </div>
            <div className="text-sm text-indigo-600/80 space-y-2">
              {selectedService.description ? (
                <div className="whitespace-pre-wrap">{selectedService.description}</div>
              ) : (
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    Rate: ৳{(parseFloat(selectedService.rate) * 120).toFixed(2)} per 1000
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    Min: {selectedService.min} - Max: {selectedService.max}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    Refill: {selectedService.refill ? 'Yes' : 'No'}
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Link */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Link</label>
        <input 
          type="text" 
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://www.example.com/username"
          className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Quantity</label>
        <input 
          type="number" 
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder={selectedService ? `Min: ${selectedService.min} - Max: ${selectedService.max}` : "Enter quantity"}
          className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {selectedService && (
          <p className="text-[10px] text-gray-400 font-medium">
            Min: {selectedService.min} - Max: {selectedService.max}
          </p>
        )}
      </div>

      {/* Average Time */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Average time <Info size={12} className="inline text-gray-400" /></label>
        <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-gray-500 font-medium">
          {selectedService?.average_time || 'No data available'}
        </div>
      </div>

      {/* Charge */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Charge (BDT)</label>
        <div className="w-full bg-indigo-50/50 border border-transparent rounded-xl p-4 text-indigo-600 font-bold text-lg">
          ৳ {charge.toFixed(2)}
        </div>
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleSubmit}
        disabled={!selectedService || !link || !quantity}
        className="w-full bg-indigo-600 text-white font-bold rounded-xl p-4 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Order
      </button>

      {/* Support Section */}
      <div className="pt-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Important Notes :</h4>
          <ul className="text-[11px] text-gray-400 space-y-1 list-disc pl-4">
            <li>Don't make multiple order in same time same link.</li>
            <li>Wrong link, die or don't open follow button not refundable.</li>
            <li>During high demand, speed and start time may vary.</li>
          </ul>
          <button 
            onClick={() => window.open('https://t.me/your_telegram', '_blank')}
            className="mt-4 flex items-center gap-2 bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Support
          </button>
        </div>
      </div>
    </div>
  );
}
