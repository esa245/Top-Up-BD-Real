import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Zap, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Category, Service } from '../types';

interface ServiceBoardProps {
  categories: Category[];
  isLoading: boolean;
}

export const ServiceBoard: React.FC<ServiceBoardProps> = ({ categories, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading services...</p>
      </div>
    );
  }

  const filteredCategories = categories.map(cat => ({
    ...cat,
    services: cat.services.filter(svc => 
      svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.id.toString().includes(searchQuery)
    )
  })).filter(cat => cat.services.length > 0);

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search for services or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400">No services found matching your search.</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <button 
                onClick={() => toggleCategory(category.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{category.name}</h3>
                    <p className="text-xs text-slate-500">{category.services.length} services available</p>
                  </div>
                </div>
                {expandedCategory === category.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {expandedCategory === category.id && (
                <div className="border-t border-slate-100 divide-y divide-slate-50">
                  {category.services.map((service) => (
                    <div key={service.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                              ID: {service.id}
                            </span>
                            <h4 className="font-semibold text-slate-800">{service.name}</h4>
                          </div>
                          <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" /> Rate: ৳{service.ratePer1000.toFixed(2)} / 1k
                            </span>
                            <span className="flex items-center gap-1">
                              <Info className="w-3 h-3" /> Min: {service.min.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Info className="w-3 h-3" /> Max: {service.max.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => {
                            const event = new CustomEvent('selectService', { 
                              detail: { categoryId: category.id, serviceId: service.id } 
                            });
                            window.dispatchEvent(event);
                          }}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95 whitespace-nowrap"
                        >
                          Order Now
                        </button>
                      </div>
                      
                      {service.description.length > 0 && (
                        <div className="mt-3 bg-slate-50 rounded-xl p-3">
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            {service.description[0]}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
