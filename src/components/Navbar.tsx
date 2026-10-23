import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Instagram,
  Wallet,
  PlusCircle,
  ShieldCheck,
  Crown,
  User,
  LogOut,
  LogIn,
  Layers,
  ShoppingBag,
  ListOrdered,
  HelpCircle,
  Code,
  KeyRound,
  ChevronDown,
  HeartHandshake
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuthModal: () => void;
  openAddFundsModal: () => void;
  openSupportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openAuthModal,
  openAddFundsModal,
  openSupportModal
}) => {
  const { currentUser, role, isSuperAdmin, isAdmin, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0c1022]/90 backdrop-blur-xl border-b border-[#1e2746] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('new-order')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#35d6c0] via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-[#35d6c0]/20 text-[#090d1a]">
              <Instagram className="w-6 h-6 text-[#090d1a]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  InstaGrow
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Automated Growth Engine</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('new-order')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                currentTab === 'new-order'
                  ? 'bg-[#171d35] text-white border border-[#35d6c0]/50 shadow-md shadow-black/40'
                  : 'text-slate-300 hover:text-white hover:bg-[#171d35]/60'
              }`}
            >
              <ShoppingBag className={`w-3.5 h-3.5 ${currentTab === 'new-order' ? 'text-[#35d6c0]' : ''}`} />
              <span>New Order</span>
            </button>

            <button
              onClick={() => setCurrentTab('orders')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                currentTab === 'orders'
                  ? 'bg-[#171d35] text-white border border-[#35d6c0]/50 shadow-md shadow-black/40'
                  : 'text-slate-300 hover:text-white hover:bg-[#171d35]/60'
              }`}
            >
              <ListOrdered className={`w-3.5 h-3.5 ${currentTab === 'orders' ? 'text-[#35d6c0]' : ''}`} />
              <span>Orders</span>
            </button>

            <button
              onClick={() => setCurrentTab('services')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                currentTab === 'services'
                  ? 'bg-[#171d35] text-white border border-[#35d6c0]/50 shadow-md shadow-black/40'
                  : 'text-slate-300 hover:text-white hover:bg-[#171d35]/60'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${currentTab === 'services' ? 'text-[#35d6c0]' : ''}`} />
              <span>Services</span>
            </button>

            <button
              onClick={() => setCurrentTab('guide')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                currentTab === 'guide'
                  ? 'bg-[#171d35] text-white border border-[#35d6c0]/50 shadow-md shadow-black/40'
                  : 'text-slate-300 hover:text-white hover:bg-[#171d35]/60'
              }`}
            >
              <HeartHandshake className={`w-3.5 h-3.5 ${currentTab === 'guide' ? 'text-[#35d6c0]' : 'text-slate-400'}`} />
              <span>Warnings &amp; Guide</span>
            </button>

            <button
              onClick={() => setCurrentTab('api')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                currentTab === 'api'
                  ? 'bg-[#171d35] text-white border border-[#35d6c0]/50 shadow-md shadow-black/40'
                  : 'text-slate-300 hover:text-white hover:bg-[#171d35]/60'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>API</span>
            </button>

            {/* Single Unified Admin Panel for both Super Admin and Normal Admin */}
            {isAdmin && (
              <button
                onClick={() => setCurrentTab('admin-panel')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  currentTab === 'admin-panel'
                    ? isSuperAdmin
                      ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-500/25'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : isSuperAdmin
                    ? 'text-amber-300 hover:text-white hover:bg-amber-950/40 border border-amber-500/40'
                    : 'text-indigo-300 hover:text-white hover:bg-indigo-950/40 border border-indigo-500/30'
                }`}
              >
                {isSuperAdmin ? (
                  <>
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>Admin Panel</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Admin Panel</span>
                  </>
                )}
              </button>
            )}
          </nav>

          {/* Right section: Balance, Role Badge, Auth */}
          <div className="flex items-center space-x-3">
            {/* Wallet balance */}
            {currentUser && (
              <div className="flex items-center bg-[#171d35] border border-[#252f52] shadow-inner rounded-xl px-3 py-1.5">
                <Wallet className="w-4 h-4 text-[#35d6c0] mr-2" />
                <div className="text-right mr-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block leading-none font-bold">Balance</span>
                  <span className="text-sm font-extrabold text-[#35d6c0] leading-none">
                    ₹{(currentUser.balance || 0).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={openAddFundsModal}
                  className="bg-[#35d6c0]/15 hover:bg-[#35d6c0]/25 text-[#35d6c0] p-1 rounded-lg transition-colors border border-[#35d6c0]/30"
                  title="Add Funds"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Authenticated Role Status Badge (No toggling dropdown) */}
            {currentUser && (
              <div
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  isSuperAdmin
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : role === 'admin'
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
              >
                {isSuperAdmin ? (
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                ) : role === 'admin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>
                  {isSuperAdmin ? 'Super Admin' : role === 'admin' ? 'Normal Admin' : 'Customer'}
                </span>
              </div>
            )}

            {/* Profile / Auth Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-200 hover:border-zinc-500 transition-colors"
                >
                  {currentUser.displayName?.[0]?.toUpperCase() || 'U'}
                </button>

                {showProfileMenu && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 text-left"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                      <p className="text-xs font-bold text-white truncate">{currentUser.displayName}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {role}
                      </span>
                    </div>

                    <button
                      onClick={openSupportModal}
                      className="w-full px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-zinc-800 flex items-center space-x-2 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-zinc-400" />
                      <span>Support Ticket</span>
                    </button>

                    <button
                      onClick={openAuthModal}
                      className="w-full px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-zinc-800 flex items-center space-x-2 transition-colors"
                    >
                      <KeyRound className="w-4 h-4 text-zinc-400" />
                      <span>Admin Passcode / Login</span>
                    </button>

                    <div className="border-t border-zinc-800 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-rose-500/25 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile secondary tab bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 border-t border-zinc-800/80 no-scrollbar">
          <button
            onClick={() => setCurrentTab('new-order')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'new-order' ? 'bg-rose-500 text-white' : 'text-zinc-400'
            }`}
          >
            New Order
          </button>
          <button
            onClick={() => setCurrentTab('orders')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'orders' ? 'bg-rose-500 text-white' : 'text-zinc-400'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setCurrentTab('services')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'services' ? 'bg-rose-500 text-white' : 'text-zinc-400'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setCurrentTab('guide')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap flex items-center space-x-1 ${
              currentTab === 'guide' ? 'bg-rose-500 text-white' : 'text-zinc-400'
            }`}
          >
            <span>Warnings &amp; Guide</span>
          </button>
          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin-panel')}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                currentTab === 'admin-panel'
                  ? isSuperAdmin ? 'bg-amber-500 text-black' : 'bg-indigo-600 text-white'
                  : isSuperAdmin ? 'text-amber-300' : 'text-indigo-300'
              }`}
            >
              {isSuperAdmin ? '👑 Admin Panel' : '🛡️ Admin Panel'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
