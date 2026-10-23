import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ServiceCategory } from '../types';
import { Search, ShoppingCart, ShieldCheck } from 'lucide-react';

interface ServicesCatalogProps {
  onSelectServiceToOrder: (serviceId: string) => void;
}

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({ onSelectServiceToOrder }) => {
  const { services } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'all' | ServiceCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = services.filter(srv => {
    if (activeCategory === 'free') {
      if (!srv.isFree && srv.ratePer1000 !== 0 && srv.category !== 'free') return false;
    } else if (activeCategory !== 'all' && srv.category !== activeCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        srv.name.toLowerCase().includes(q) ||
        srv.description.toLowerCase().includes(q) ||
        srv.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
            Service Catalog &amp; Rates
          </h2>
          <p className="text-xs text-slate-400">Standardized automated rates in Indian Rupees (INR ₹) &amp; Free Trials</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services..."
              className="bg-[#0d1224] border border-[#252f52] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#35d6c0] transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center bg-[#0d1224] border border-[#252f52] p-1 rounded-xl">
            {(['all', 'free', 'followers', 'likes', 'reels', 'views', 'comments'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  activeCategory === cat
                    ? 'bg-[#35d6c0] text-[#09131d] font-black shadow-sm border-t border-white/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'free' ? '🎁 Free' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(service => {
          const isFree = Boolean(service.isFree || service.ratePer1000 === 0 || service.category === 'free');
          return (
            <div
              key={service.id}
              className="bg-[#171d35] border border-[#263158] hover:border-[#35d6c0]/40 rounded-3xl p-5 space-y-4 shadow-xl transition-all flex flex-col justify-between border-t-white/10"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                    isFree
                      ? 'bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30 font-black'
                      : 'bg-[#0d1224] text-slate-300 border border-[#252f52]'
                  }`}>
                    {isFree ? '🎁 FREE TRIAL' : service.category}
                  </span>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Rate / 1,000</span>
                    <span className="text-lg font-black text-[#35d6c0]">
                      {isFree ? '₹0.00 (FREE)' : `₹${service.ratePer1000.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5">{service.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{service.description}</p>
              </div>

              <div className="pt-3 border-t border-[#222d4f] flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span>Min: <strong className="text-white">{service.min.toLocaleString()}</strong></span>
                  <span>•</span>
                  <span>Max: <strong className="text-white">{service.max.toLocaleString()}</strong></span>
                  {service.guarantee && (
                    <>
                      <span>•</span>
                      <span className="text-[#35d6c0] font-bold flex items-center space-x-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{service.guarantee}</span>
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectServiceToOrder(service.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-b from-[#35d6c0] to-[#1ea897] hover:brightness-105 text-[#09131d] text-xs font-black flex items-center space-x-1.5 shadow-md shadow-[#35d6c0]/20 border-t border-white/40 active:translate-y-0.5 transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{isFree ? 'Claim Free' : 'Select'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
