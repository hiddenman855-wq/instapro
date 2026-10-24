import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ServiceCategory } from '../types';
import confetti from 'canvas-confetti';
import {
  Users,
  Heart,
  Eye,
  Film,
  MessageSquare,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Instagram,
  QrCode,
  Smartphone,
  Calculator,
  Plus,
  X,
  Lock,
  Shield,
  Gift
} from 'lucide-react';

interface CustomerDashboardProps {
  onNavigateToOrders: () => void;
  openAddFundsModal: (options?: { initialAmount?: number; serviceName?: string; purpose?: 'wallet_deposit' | 'direct_order' }) => void;
  initialServiceId?: string;
  onNavigateToGuideScreenshot?: (notice?: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onNavigateToOrders,
  openAddFundsModal,
  initialServiceId,
  onNavigateToGuideScreenshot
}) => {
  const { services, currentUser, placeOrder, orders } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<'all' | ServiceCategory>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    return initialServiceId || services[0]?.id || 'ig-fol-budget';
  });
  const [targetLink, setTargetLink] = useState<string>('@your_profile');
  // String state allows cutting/backspacing all the way to empty without jumping back
  const [quantityInput, setQuantityInput] = useState<string>('500');
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ success: boolean; message: string; orderId?: string } | null>(null);
  const [placedOrderModal, setPlacedOrderModal] = useState<{
    orderId: string;
    serviceName: string;
    target: string;
    quantity: number;
    charge: number;
  } | null>(null);

  // Sync if initialServiceId is passed or changed
  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
      const s = services.find(x => x.id === initialServiceId);
      if (s) {
        setSelectedCategory(s.category);
        if (s.fixedQuantity) {
          setQuantityInput(s.fixedQuantity.toString());
        }
      }
    }
  }, [initialServiceId, services]);

  // Filter services by category
  const filteredServices = selectedCategory === 'all'
    ? services.filter(s => s.active)
    : services.filter(s => s.category === selectedCategory && s.active);

  // Active chosen service
  const activeService = services.find(s => s.id === selectedServiceId)
    || filteredServices[0]
    || services[0];

  const isFreeService = Boolean(
    activeService && (
      activeService.isFree ||
      activeService.ratePer1000 === 0 ||
      activeService.category === 'free'
    )
  );

  // Determine if service has a fixed quantity configured from before by Admin
  const isFixedQuantity = Boolean(
    activeService && (
      Boolean(activeService.fixedQuantity) ||
      (isFreeService && Boolean(activeService.fixedQuantity))
    )
  );

  const fixedQtyValue = activeService?.fixedQuantity || (isFreeService ? 50 : 100);

  // Numerical quantity used for proportional calculation and ordering
  const parsedInput = parseInt(quantityInput, 10);
  const rawQuantity = isNaN(parsedInput) ? 0 : parsedInput;
  const quantity = isFixedQuantity ? fixedQtyValue : rawQuantity;

  // Automatic proportional cost calculation in INR (₹)
  // If free service, price is ₹0.00
  const calculatedCharge = isFreeService
    ? 0
    : activeService
    ? +((quantity / 1000) * activeService.ratePer1000).toFixed(2)
    : 0;

  const userBalance = currentUser?.balance || 0;
  const hasEnoughFunds = isFreeService || userBalance >= calculatedCharge;

  const handleCategoryChange = (cat: 'all' | ServiceCategory) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      return;
    }
    const firstInCategory = services.find(s => s.category === cat && s.active);
    if (firstInCategory) {
      setSelectedServiceId(firstInCategory.id);
      if (firstInCategory.fixedQuantity) {
        setQuantityInput(firstInCategory.fixedQuantity.toString());
      } else {
        const cur = parseInt(quantityInput, 10) || 0;
        if (cur < firstInCategory.min) {
          setQuantityInput(firstInCategory.min.toString());
        }
      }
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const s = services.find(x => x.id === serviceId);
    if (s) {
      if (s.fixedQuantity) {
        setQuantityInput(s.fixedQuantity.toString());
      } else if (s.isFree) {
        setQuantityInput((s.fixedQuantity || 50).toString());
      } else {
        const cur = parseInt(quantityInput, 10) || 0;
        if (cur < s.min) {
          setQuantityInput(s.min.toString());
        }
      }
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLink.trim()) {
      setOrderResult({ success: false, message: 'Please provide an Instagram username or post link.' });
      return;
    }

    setSubmitting(true);
    setOrderResult(null);

    try {
      const res = await placeOrder(activeService.id, targetLink, quantity);
      setOrderResult(res);
      if (res.success) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
        setPlacedOrderModal({
          orderId: res.orderId || ('ORD-' + Math.floor(1000 + Math.random() * 9000)),
          serviceName: activeService.name,
          target: targetLink,
          quantity,
          charge: calculatedCharge
        });
      }
    } catch (err: any) {
      setOrderResult({ success: false, message: err.message || 'Order execution failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Recent user orders
  const myRecentOrders = orders.slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* 3D Trust Highlights Bar (#35d6c0 Accents & Deep Surface) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#171d35] border border-[#252f52] shadow-xl shadow-black/40 rounded-2xl p-4 flex items-center space-x-3 transition-all hover:border-[#35d6c0]/40">
          <div className="w-10 h-10 rounded-xl bg-[#35d6c0]/10 border border-[#35d6c0]/30 flex items-center justify-center text-[#35d6c0] shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Fast Start</p>
            <p className="text-sm font-extrabold text-white">0–5 Minutes</p>
          </div>
        </div>

        <div className="bg-[#171d35] border border-[#252f52] shadow-xl shadow-black/40 rounded-2xl p-4 flex items-center space-x-3 transition-all hover:border-[#35d6c0]/40">
          <div className="w-10 h-10 rounded-xl bg-[#35d6c0]/10 border border-[#35d6c0]/30 flex items-center justify-center text-[#35d6c0] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Non-Drop Guarantee</p>
            <p className="text-sm font-extrabold text-white">30-Day Auto Refill</p>
          </div>
        </div>

        <div className="bg-[#171d35] border border-[#252f52] shadow-xl shadow-black/40 rounded-2xl p-4 flex items-center space-x-3 transition-all hover:border-[#35d6c0]/40">
          <div className="w-10 h-10 rounded-xl bg-[#35d6c0]/10 border border-[#35d6c0]/30 flex items-center justify-center text-[#35d6c0] shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Zero Passwords</p>
            <p className="text-sm font-extrabold text-white">100% Safe &amp; Public</p>
          </div>
        </div>

        <div className="bg-[#171d35] border border-[#252f52] shadow-xl shadow-black/40 rounded-2xl p-4 flex items-center space-x-3 transition-all hover:border-[#35d6c0]/40">
          <div className="w-10 h-10 rounded-xl bg-[#35d6c0]/10 border border-[#35d6c0]/30 flex items-center justify-center text-[#35d6c0] shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Verified UPI QR</p>
            <p className="text-sm font-extrabold text-white">Direct UTR Approval</p>
          </div>
        </div>
      </div>

      {/* Main Order Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Service Order Form Card with Color #171d35 and 3D Vibe */}
        <div className="lg:col-span-7 bg-[#171d35] border border-[#263158] rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/70 relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Top Specular 3D Highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#35d6c0]/40 to-transparent pointer-events-none" />

          <div className="mb-6">
            <h2 className="text-xl font-black flex items-center space-x-2">
              <Instagram className="w-5 h-5 text-[#35d6c0]" />
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Instagram Growth Order
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select package, enter target handle or link, and choose quantity.
            </p>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* 1. Category selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  1. Select Category
                </label>
                <span className="text-[11px] text-slate-400">
                  {services.filter(s => s.active).length} packages active
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('all')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all active:translate-y-0.5 ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-b from-[#263158] to-[#1a2240] border-[#35d6c0] text-white shadow-lg shadow-black/40'
                      : 'bg-[#0e1326] border-[#1e2646] text-slate-400 hover:text-white hover:border-[#2f3d6b]'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${selectedCategory === 'all' ? 'text-[#35d6c0]' : ''}`} />
                  <span>All</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange('free')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all active:translate-y-0.5 ${
                    selectedCategory === 'free'
                      ? 'bg-gradient-to-b from-[#263158] to-[#1a2240] border-[#35d6c0] text-white shadow-lg shadow-black/40 ring-1 ring-[#35d6c0]'
                      : 'bg-[#0e1326] border-[#1e2646] text-[#35d6c0] hover:text-white hover:border-[#35d6c0]/50'
                  }`}
                >
                  <Gift className="w-4 h-4 text-[#35d6c0]" />
                  <span>Free Trial</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange('followers')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all active:translate-y-0.5 ${
                    selectedCategory === 'followers'
                      ? 'bg-gradient-to-b from-[#263158] to-[#1a2240] border-[#35d6c0] text-white shadow-lg shadow-black/40'
                      : 'bg-[#0e1326] border-[#1e2646] text-slate-400 hover:text-white hover:border-[#2f3d6b]'
                  }`}
                >
                  <Users className={`w-4 h-4 ${selectedCategory === 'followers' ? 'text-[#35d6c0]' : ''}`} />
                  <span>Followers</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange('likes')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all active:translate-y-0.5 ${
                    selectedCategory === 'likes'
                      ? 'bg-gradient-to-b from-[#263158] to-[#1a2240] border-[#35d6c0] text-white shadow-lg shadow-black/40'
                      : 'bg-[#0e1326] border-[#1e2646] text-slate-400 hover:text-white hover:border-[#2f3d6b]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${selectedCategory === 'likes' ? 'text-[#35d6c0]' : ''}`} />
                  <span>Likes</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange('reels')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all active:translate-y-0.5 ${
                    selectedCategory === 'reels'
                      ? 'bg-gradient-to-b from-[#263158] to-[#1a2240] border-[#35d6c0] text-white shadow-lg shadow-black/40'
                      : 'bg-[#0e1326] border-[#1e2646] text-slate-400 hover:text-white hover:border-[#2f3d6b]'
                  }`}
                >
                  <Film className={`w-4 h-4 ${selectedCategory === 'reels' ? 'text-[#35d6c0]' : ''}`} />
                  <span>Reels</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange('views')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all active:translate-y-0.5 ${
                    selectedCategory === 'views'
                      ? 'bg-gradient-to-b from-[#263158] to-[#1a2240] border-[#35d6c0] text-white shadow-lg shadow-black/40'
                      : 'bg-[#0e1326] border-[#1e2646] text-slate-400 hover:text-white hover:border-[#2f3d6b]'
                  }`}
                >
                  <Eye className={`w-4 h-4 ${selectedCategory === 'views' ? 'text-[#35d6c0]' : ''}`} />
                  <span>Views</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange('comments')}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all active:translate-y-0.5 ${
                    selectedCategory === 'comments'
                      ? 'bg-gradient-to-b from-[#263158] to-[#1a2240] border-[#35d6c0] text-white shadow-lg shadow-black/40'
                      : 'bg-[#0e1326] border-[#1e2646] text-slate-400 hover:text-white hover:border-[#2f3d6b]'
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 ${selectedCategory === 'comments' ? 'text-[#35d6c0]' : ''}`} />
                  <span>Comments</span>
                </button>
              </div>
            </div>

            {/* 2. Service Dropdown & Specification Card */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  2. Choose Service Package
                </label>
                <span className="text-xs text-[#35d6c0] font-bold">
                  {isFreeService ? '🎁 100% Free Trial (₹0.00)' : `Rate: ₹${activeService?.ratePer1000.toFixed(2)} / 1,000`}
                </span>
              </div>

              <select
                value={activeService?.id}
                onChange={(e) => handleServiceSelect(e.target.value)}
                className="w-full bg-[#0d1224] border border-[#252f52] rounded-2xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-[#35d6c0] transition-colors shadow-inner"
              >
                {filteredServices.map(srv => (
                  <option key={srv.id} value={srv.id} className="bg-[#0d1224] text-white">
                    {srv.isFree || srv.ratePer1000 === 0
                      ? `🎁 [FREE TRIAL] ${srv.name} — ₹0.00`
                      : `[${srv.category.toUpperCase()}] ${srv.name} — ₹${srv.ratePer1000.toFixed(2)} / 1,000`}
                  </option>
                ))}
              </select>

              {/* Active Service Specs */}
              {activeService && (
                <div className="mt-2.5 p-3 rounded-2xl bg-[#0d1224] border border-[#1e2646] text-[11px] text-slate-300 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#35d6c0]/15 text-[#35d6c0] font-bold uppercase text-[10px] border border-[#35d6c0]/30">
                      {activeService.category}
                    </span>
                    <span className="text-slate-400">
                      Speed: <strong className="text-slate-200">{activeService.speed}</strong>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">
                      Guarantee: <strong className="text-[#35d6c0]">{activeService.guarantee}</strong>
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    {activeService.description}
                  </p>
                </div>
              )}
            </div>

            {/* 3. Target Link or Username */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                3. Instagram Username or Post Link
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={targetLink}
                  onChange={(e) => setTargetLink(e.target.value)}
                  placeholder="@your_profile or https://instagram.com/p/..."
                  className="w-full bg-[#0d1224] border border-[#252f52] rounded-2xl pl-11 pr-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-[#35d6c0] transition-colors shadow-inner"
                  required
                />
                <div className="absolute left-3.5 top-3.5 text-[#35d6c0]">
                  <Instagram className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 4. Quantity Selector & Automatic Proportional Math */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <span>4. Quantity</span>
                  {isFixedQuantity && (
                    <span className="text-[10px] font-black uppercase text-[#35d6c0] bg-[#35d6c0]/15 px-2 py-0.5 rounded-full border border-[#35d6c0]/30 flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Fixed by Admin</span>
                    </span>
                  )}
                </label>
                <span className="text-xs text-slate-400">
                  {isFixedQuantity
                    ? `Fixed Quota: ${fixedQtyValue.toLocaleString()} Units`
                    : `Min: ${activeService?.min?.toLocaleString()} • Max: ${activeService?.max?.toLocaleString()}`}
                </span>
              </div>

              {/* If service has fixed quantity (free or fixed package), lock it so user cannot type arbitrary quantity */}
              {isFixedQuantity ? (
                <div className="space-y-2">
                  <div className="w-full bg-[#0d1224] border border-[#35d6c0]/40 rounded-2xl p-4 flex items-center justify-between shadow-inner">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#35d6c0]/15 border border-[#35d6c0]/30 flex items-center justify-center text-[#35d6c0] shrink-0">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-3xl font-black text-white font-mono">
                            {fixedQtyValue.toLocaleString()}
                          </span>
                          <span className="text-xs font-black text-[#35d6c0] uppercase tracking-wider bg-[#35d6c0]/15 px-2.5 py-0.5 rounded-full border border-[#35d6c0]/30">
                            {isFreeService ? '🎁 100% Free Trial' : 'Preset Package'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Fixed order allocation configured by administrator.
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Package Cost</span>
                      <span className="text-lg font-black text-[#35d6c0] font-mono">
                        {isFreeService ? '₹0.00 FREE' : `₹${calculatedCharge.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#35d6c0] font-semibold flex items-center space-x-1.5 bg-[#0d1224]/80 p-2 rounded-xl border border-[#1e2646]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#35d6c0] shrink-0" />
                    <span>This promotional service only fulfills exactly <strong>{fixedQtyValue.toLocaleString()} units</strong>. Custom quantity entry is disabled.</span>
                  </p>
                </div>
              ) : (
                <div>
                  {/* Number Input with 3D Depth - 100% CUTABLE & BACKSPACEABLE */}
                  <div className="relative">
                    <input
                      type="number"
                      min={activeService?.min || 50}
                      max={activeService?.max || 1000000}
                      step={50}
                      value={quantityInput}
                      onChange={(e) => setQuantityInput(e.target.value)}
                      onBlur={() => {
                        if (!quantityInput.trim()) {
                          setQuantityInput(String(activeService?.min || 50));
                        } else {
                          const v = parseInt(quantityInput, 10);
                          if (isNaN(v) || v < (activeService?.min || 1)) {
                            setQuantityInput(String(activeService?.min || 50));
                          } else if (v > (activeService?.max || 1000000)) {
                            setQuantityInput(String(activeService?.max || 1000000));
                          }
                        }
                      }}
                      placeholder="Enter quantity..."
                      className="w-full bg-[#0d1224] border border-[#252f52] rounded-2xl px-4 py-3 text-2xl font-black text-white focus:outline-none focus:border-[#35d6c0] transition-colors shadow-inner font-mono"
                    />
                    <div className="absolute right-4 top-3.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Units
                    </div>
                  </div>

                  {/* Direct Preset Buttons with 3D Tactile Styling */}
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {[100, 500, 1000, 2500, 5000, 10000, 20000].map(amt => {
                        const isSelected = quantity === amt;
                        const isHalf = amt === 500;
                        return (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setQuantityInput(amt.toString())}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 active:translate-y-0.5 ${
                              isSelected
                                ? 'bg-gradient-to-b from-[#35d6c0] via-[#2cc3b0] to-[#1ea897] text-[#09131d] font-black shadow-md shadow-[#35d6c0]/25 border-t border-white/50'
                                : 'bg-[#0d1224] border border-[#1e2646] hover:border-[#35d6c0]/40 text-slate-300 hover:text-white'
                            }`}
                          >
                            <span>{amt.toLocaleString()}</span>
                            {isHalf && (
                              <span className={`text-[9px] px-1 py-0.2 rounded font-extrabold uppercase ${
                                isSelected ? 'bg-black/20 text-black' : 'bg-[#35d6c0]/20 text-[#35d6c0]'
                              }`}>
                                50% Base
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Increment Adders */}
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Add:</span>
                    {[500, 1000, 2500, 5000].map(inc => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setQuantityInput(prev => {
                          const cur = parseInt(prev, 10) || 0;
                          return Math.min(activeService?.max || 100000, cur + inc).toString();
                        })}
                        className="px-2 py-1 rounded-lg bg-[#0d1224] border border-[#1e2646] hover:border-[#35d6c0]/40 text-[11px] font-semibold text-slate-300 transition-colors flex items-center space-x-0.5 active:translate-y-0.5"
                      >
                        <Plus className="w-3 h-3 text-[#35d6c0]" />
                        <span>{inc.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ✨ LIVE AUTOMATIC CALCULATION CARD (#35d6c0 & 3D VIBE) ✨ */}
              <div className="mt-3.5 p-4 rounded-2xl bg-gradient-to-b from-[#141a33] to-[#0d1224] border border-[#252f52] shadow-inner text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-300">
                    {isFreeService ? (
                      <>
                        <Gift className="w-4 h-4 text-[#35d6c0]" />
                        <span>Free Trial Promotion</span>
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4 text-[#35d6c0]" />
                        <span>Live Total Price</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-black ${isFreeService ? 'text-[#35d6c0]' : 'text-white'}`}>
                      ₹{calculatedCharge.toFixed(2)}
                    </span>
                    {isFreeService && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#35d6c0]/20 text-[#35d6c0] border border-[#35d6c0]/30">
                        100% FREE
                      </span>
                    )}
                  </div>
                </div>

                <div className="font-mono text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-1 bg-[#090d1a] p-2.5 rounded-xl border border-[#1c2442]">
                  <span className="text-slate-400">
                    {isFreeService ? 'Status:' : 'Formula:'}
                  </span>
                  <span className="text-white font-bold">
                    {isFreeService ? (
                      <span className="text-[#35d6c0]">
                        {quantity.toLocaleString()} units trial • ₹0.00 (Zero Wallet Balance Required)
                      </span>
                    ) : (
                      <>
                        ({quantity.toLocaleString()} ÷ 1,000) × ₹{activeService?.ratePer1000.toFixed(2)} = <strong className="text-[#35d6c0]">₹{calculatedCharge.toFixed(2)}</strong>
                      </>
                    )}
                  </span>
                </div>

                {!isFreeService && quantity === 500 && (
                  <p className="text-[11px] text-[#35d6c0] font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#35d6c0]" />
                    <span>500 units selected: Exactly 50% of the 1,000 base rate (₹{calculatedCharge.toFixed(2)})</span>
                  </p>
                )}

                {!isFreeService && quantity === 100 && (
                  <p className="text-[11px] text-[#35d6c0] font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#35d6c0]" />
                    <span>100 units selected: 10% of base rate (₹{calculatedCharge.toFixed(2)})</span>
                  </p>
                )}
              </div>
            </div>

            {/* Result Message */}
            {orderResult && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  orderResult.success
                    ? 'bg-[#35d6c0]/10 border border-[#35d6c0]/30 text-[#35d6c0]'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {orderResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#35d6c0]" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span>{orderResult.message}</span>
                </div>

                {orderResult.success && onNavigateToGuideScreenshot && (
                  <button
                    type="button"
                    onClick={() => onNavigateToGuideScreenshot('Order placed! Please ensure your Instagram account is set to PUBLIC as shown in the screenshot below.')}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#35d6c0] to-[#20b8a4] text-[#09131d] font-black text-[11px] shadow-sm flex items-center justify-center space-x-1 shrink-0"
                  >
                    <span>Done — View Setting Screenshot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Order Action Buttons with 3D Depth */}
            <div className="space-y-2.5 pt-2">
              {isFreeService ? (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-xl bg-gradient-to-b from-[#35d6c0] via-[#2cc3b0] to-[#1ea897] hover:from-[#42ecd7] hover:to-[#23b7a5] text-[#09131d] shadow-[#35d6c0]/30 border-t border-white/50 active:translate-y-0.5 cursor-pointer ring-2 ring-[#35d6c0]/40"
                >
                  {submitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-[#09131d] border-t-transparent rounded-full animate-spin" />
                      <span>Activating Free Trial...</span>
                    </div>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 text-[#09131d]" />
                      <span>Claim Free Package (₹0.00)</span>
                      <ArrowRight className="w-4 h-4 text-[#09131d]" />
                    </>
                  )}
                </button>
              ) : hasEnoughFunds ? (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-xl bg-gradient-to-b from-[#35d6c0] via-[#2cc3b0] to-[#1ea897] hover:from-[#42ecd7] hover:to-[#23b7a5] text-[#09131d] shadow-[#35d6c0]/25 border-t border-white/50 active:translate-y-0.5 cursor-pointer"
                >
                  {submitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-[#09131d] border-t-transparent rounded-full animate-spin" />
                      <span>Processing Order...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#09131d]" />
                      <span>Place Order (₹{calculatedCharge.toFixed(2)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-2">
                  {/* Dynamic UPI QR Instant Pay button for this EXACT calculated price */}
                  <button
                    type="button"
                    onClick={() => openAddFundsModal({
                      initialAmount: calculatedCharge,
                      serviceName: `${activeService?.name} (${quantity.toLocaleString()} qty)`,
                      purpose: 'direct_order'
                    })}
                    className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all shadow-xl bg-gradient-to-b from-[#35d6c0] via-[#2cc3b0] to-[#1ea897] hover:from-[#42ecd7] hover:to-[#23b7a5] text-[#09131d] shadow-[#35d6c0]/25 border-t border-white/50 active:translate-y-0.5 cursor-pointer"
                  >
                    <QrCode className="w-5 h-5 text-[#09131d]" />
                    <span>Pay Exact ₹{calculatedCharge.toFixed(2)} with UPI QR Code</span>
                    <ArrowRight className="w-4 h-4 text-[#09131d]" />
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    Wallet balance: <strong className="text-white">₹{userBalance.toFixed(2)}</strong>. Click above to generate exact UPI QR &amp; submit UTR!
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Live Calculation Summary Sidebar with #171d35 and 3D Vibe */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#171d35] border border-[#252f52] rounded-3xl p-6 shadow-2xl shadow-black/70 relative overflow-hidden backdrop-blur-xl">
            {/* Top Specular Edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#35d6c0]/30 to-transparent pointer-events-none" />

            <h3 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider mb-4 flex items-center space-x-1.5">
              <Calculator className="w-4 h-4 text-[#35d6c0]" />
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Order Summary
              </span>
            </h3>

            <div className="space-y-3 divide-y divide-[#1e2646] text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Service</span>
                <span className="font-bold text-white text-right max-w-[210px] truncate">
                  {activeService?.name}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Category</span>
                <span className="font-bold uppercase text-[#35d6c0] text-[11px]">{activeService?.category}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Base Rate</span>
                <span className="font-bold text-white">₹{activeService?.ratePer1000.toFixed(2)} / 1k</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Quantity</span>
                <span className="font-extrabold text-white">{quantity.toLocaleString()} units</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Proportional Ratio</span>
                <span className="font-bold text-slate-200 font-mono">
                  {(quantity / 1000).toFixed(2)}x base
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Estimated Speed</span>
                <span className="font-bold text-slate-200">{activeService?.speed}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Guarantee</span>
                <span className="font-bold text-[#35d6c0]">{activeService?.guarantee}</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <div>
                  <span className="font-black text-white block">Total Cost</span>
                  <span className="text-[10px] text-slate-400">Auto calculated live</span>
                </div>
                <span className="font-black text-[#35d6c0] text-2xl font-mono">₹{calculatedCharge.toFixed(2)}</span>
              </div>
            </div>

            {/* Wallet Status & Quick Exact UPI Pay */}
            <div className="mt-4 pt-4 border-t border-[#1e2646] space-y-3">
              <div className="flex items-center justify-between bg-[#0d1224] p-3 rounded-2xl border border-[#1e2646]">
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">Wallet Balance</p>
                  <p className={`text-base font-black ${hasEnoughFunds ? 'text-[#35d6c0]' : 'text-rose-400'}`}>
                    ₹{userBalance.toFixed(2)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openAddFundsModal({
                    initialAmount: 500,
                    purpose: 'wallet_deposit'
                  })}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1e2646] hover:bg-[#28335c] text-xs font-bold text-slate-200 transition-colors border border-[#2d3a66] active:translate-y-0.5"
                >
                  + Add Funds
                </button>
              </div>

              {/* Exact QR pay trigger */}
              <button
                type="button"
                onClick={() => openAddFundsModal({
                  initialAmount: calculatedCharge,
                  serviceName: `${activeService?.name} (${quantity.toLocaleString()} units)`,
                  purpose: 'direct_order'
                })}
                className="w-full py-2.5 rounded-xl bg-[#0d1224] border border-[#35d6c0]/40 hover:border-[#35d6c0] text-[#35d6c0] text-xs font-bold flex items-center justify-center space-x-2 transition-all active:translate-y-0.5 shadow-md shadow-black/40"
              >
                <QrCode className="w-3.5 h-3.5 text-[#35d6c0]" />
                <span>UPI QR for Exact ₹{calculatedCharge.toFixed(2)}</span>
              </button>
            </div>
          </div>

          {/* Guarantee info card */}
          <div className="bg-[#171d35] border border-[#252f52] rounded-3xl p-5 text-xs text-slate-300 space-y-2 shadow-xl shadow-black/50">
            <div className="flex items-center space-x-2 text-[#35d6c0] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Safe Execution</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              No Instagram password required. Delivered externally via public exploration networks with 30-day auto refill.
            </p>
          </div>
        </div>
      </div>

      {/* Live Recent Orders Progress with #171d35 */}
      <div className="bg-[#171d35] border border-[#252f52] rounded-3xl p-6 shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#35d6c0]" />
            <h3 className="text-sm font-black text-white">Recent Orders Progress</h3>
          </div>
          <button
            onClick={onNavigateToOrders}
            className="text-xs font-bold text-[#35d6c0] hover:underline flex items-center space-x-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myRecentOrders.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs bg-[#0d1224] rounded-2xl border border-[#1e2646]">
            No orders placed yet. Select a service above to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {myRecentOrders.map(order => {
              const delivered = order.quantity - order.remains;
              const percent = Math.min(100, Math.round((delivered / order.quantity) * 100));

              return (
                <div
                  key={order.id}
                  className="bg-[#0d1224] border border-[#1e2646] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-400">{order.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'completed'
                          ? 'bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30'
                          : order.status === 'in_progress'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : order.status === 'processing'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white truncate max-w-md">{order.serviceName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Target: {order.target} • Cost: <strong className="text-[#35d6c0]">₹{order.charge.toFixed(2)}</strong>
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="sm:w-64 space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Delivered</span>
                      <span className="font-bold text-slate-200">
                        {delivered.toLocaleString()} / {order.quantity.toLocaleString()} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#171d35] h-2 rounded-full overflow-hidden border border-[#252f52]">
                      <div
                        className="bg-gradient-to-r from-[#35d6c0] to-teal-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-[#35d6c0]/30"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Placed Success Modal with #171d35 and #35d6c0 */}
      {placedOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#171d35] border border-[#263158] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-5 animate-scale-in">
            <button
              onClick={() => setPlacedOrderModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#0d1224] text-slate-400 hover:text-white hover:bg-[#1e2646] transition-colors border border-[#1e2646]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-b from-[#35d6c0] to-[#20b8a4] flex items-center justify-center mx-auto text-[#09131d] shadow-lg shadow-[#35d6c0]/25">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#35d6c0]/15 border border-[#35d6c0]/30 text-[#35d6c0] text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Execution Queued • 0-5 Mins Delivery</span>
              </div>
              <h2 className="text-xl font-black text-white">Order Placed Successfully</h2>
              <p className="text-xs text-slate-400">
                Order ID: <strong className="text-white font-mono">{placedOrderModal.orderId}</strong>
              </p>
            </div>

            {/* Order Summary Card */}
            <div className="bg-[#0d1224] border border-[#1e2646] rounded-2xl p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Service</span>
                <span className="font-bold text-white text-right max-w-[220px] truncate">{placedOrderModal.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target</span>
                <span className="font-mono font-bold text-[#35d6c0]">{placedOrderModal.target}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantity</span>
                <span className="font-black text-white">{placedOrderModal.quantity.toLocaleString()} units</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#1e2646]">
                <span className="text-slate-400">Amount Paid</span>
                <span className="font-black text-[#35d6c0] text-sm">₹{placedOrderModal.charge.toFixed(2)}</span>
              </div>
            </div>

            {/* Crucial Account Privacy Warning Alert Box */}
            <div className="bg-gradient-to-b from-[#141a33] to-[#0d1224] border border-[#35d6c0]/40 rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center space-x-2 text-[#35d6c0] font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Mandatory Privacy Check</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ensure your Instagram account is set to <strong>PUBLIC</strong> (Private account: OFF). If set to private, Instagram blocks delivery.
              </p>
            </div>

            {/* Modal Actions with 3D Tactile Styling */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  const notice = `Order ${placedOrderModal.orderId} placed! Please verify your Instagram Setting in the screenshot below.`;
                  setPlacedOrderModal(null);
                  if (onNavigateToGuideScreenshot) {
                    onNavigateToGuideScreenshot(notice);
                  }
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-b from-[#35d6c0] via-[#2cc3b0] to-[#1ea897] hover:from-[#42ecd7] hover:to-[#23b7a5] text-[#09131d] text-xs font-black shadow-lg shadow-[#35d6c0]/25 border-t border-white/50 flex items-center justify-center space-x-2 active:translate-y-0.5 cursor-pointer"
              >
                <span>Done — View Setting Screenshot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlacedOrderModal(null);
                  onNavigateToOrders();
                }}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#0d1224] hover:bg-[#1e2646] text-slate-300 text-xs font-bold transition-colors border border-[#1e2646] active:translate-y-0.5"
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
