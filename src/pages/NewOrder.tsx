import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { useAppContext } from '../store';
import toast from 'react-hot-toast';

export default function NewOrder() {
  const { placeOrder, currentUser } = useAppContext();
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');

  const ratePer1000 = 16.56;
  const charge = quantity ? (parseInt(quantity) / 1000) * ratePer1000 : 0;

  const handleSubmit = async () => {
    if (!link || !quantity) {
      toast.error('Please fill all fields.');
      return;
    }
    const qty = parseInt(quantity);
    if (qty < 100 || qty > 1000000) {
      toast.error('Quantity must be between 100 and 1,000,000.');
      return;
    }
    
    const success = await placeOrder(
      'Facebook - Followers [ Page/Profile ] ~ Hidd',
      link,
      qty,
      charge
    );

    if (success) {
      toast.success('Order placed successfully!');
      setLink('');
      setQuantity('');
    } else {
      toast.error('Insufficient balance. Please add funds.');
    }
  };

  return (
    <div className="p-4 space-y-6">
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
          <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl p-4 pr-10 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option>Promotional Offer</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Service */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Service</label>
        <div className="relative">
          <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl p-4 pr-10 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option>Facebook - Followers [ Page/Profile ] ~ Hidd</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Description */}
      <div className="bg-indigo-50/50 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 font-bold">
          <Info size={18} />
          <span>Description</span>
        </div>
        <ul className="space-y-2 text-sm text-indigo-600/80">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
            Type: Default
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
            Refill: No
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
            Cancel: No
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
            Rate: ৳16.56 per 1000
          </li>
        </ul>
        <p className="text-xs text-indigo-600 italic mt-4">
          ★ Don't make multiple orders at the same time for the same link.
        </p>
      </div>

      {/* Link */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Link</label>
        <input 
          type="text" 
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://www.facebook.com/username"
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
          placeholder="Min: 100 - Max: 1000000"
          className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="text-[10px] text-gray-400">Min: 100 - Max: 1,000,000</p>
      </div>

      {/* Average time */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-gray-700">Average time</label>
          <Info size={14} className="text-gray-400" />
        </div>
        <div className="w-full bg-gray-100/80 border border-transparent rounded-xl p-4 text-gray-600 font-medium">
          ~ 1 hour 15 minutes
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
        className="w-full bg-indigo-600 text-white font-bold rounded-xl p-4 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 active:scale-[0.98]"
      >
        Submit Order
      </button>
    </div>
  );
}
