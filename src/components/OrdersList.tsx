import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { OrderStatus } from '../types';
import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Filter,
  Instagram,
  Layers
} from 'lucide-react';

export const OrdersList: React.FC = () => {
  const { orders, currentUser, isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [viewScope, setViewScope] = useState<'all' | 'my'>('all');

  // Count user's own orders (or current session orders)
  const myOrdersCount = orders.filter(o =>
    (currentUser && (o.userId === currentUser.uid || o.userEmail.toLowerCase() === currentUser.email.toLowerCase())) ||
    o.userId === 'guest' ||
    o.userId.startsWith('sample-user')
  ).length;

  const filteredOrders = orders.filter(order => {
    // If user explicitly chose "My Orders" tab
    if (viewScope === 'my') {
      const isMyOrder = (
        (currentUser && (order.userId === currentUser.uid || order.userEmail.toLowerCase() === currentUser.email.toLowerCase())) ||
        order.userId === 'guest' ||
        order.userId.startsWith('sample-user')
      );
      if (!isMyOrder) return false;
    }

    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.target.toLowerCase().includes(q) ||
        order.serviceName.toLowerCase().includes(q) ||
        order.userEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCount = orders.length;
  const inProgCount = orders.filter(o => o.status === 'in_progress').length;
  const compCount = orders.filter(o => o.status === 'completed').length;
  const procCount = orders.filter(o => o.status === 'processing' || o.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Overview Stat Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#171d35] border border-[#263158] rounded-2xl p-4 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#35d6c0]" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{totalCount}</p>
          <span className="text-[10px] text-slate-400">All live platform orders</span>
        </div>

        <div className="bg-[#171d35] border border-[#263158] rounded-2xl p-4 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between text-blue-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Progress</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-blue-400 font-mono">{inProgCount}</p>
          <span className="text-[10px] text-slate-400">Actively delivering</span>
        </div>

        <div className="bg-[#171d35] border border-[#263158] rounded-2xl p-4 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between text-[#35d6c0] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-[#35d6c0] font-mono">{compCount}</p>
          <span className="text-[10px] text-slate-400">100% Fulfilled</span>
        </div>

        <div className="bg-[#171d35] border border-[#263158] rounded-2xl p-4 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Processing</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">{procCount}</p>
          <span className="text-[10px] text-slate-400">Queued for start</span>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text flex items-center space-x-2">
            <span>Orders History</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30">
              {filteredOrders.length} showing
            </span>
          </h2>
          <p className="text-xs text-slate-400">Real-time delivery fulfillment logs and tracking</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Scope Toggle: All Orders vs My Orders */}
          <div className="flex items-center bg-[#0d1224] border border-[#252f52] p-1 rounded-xl">
            <button
              onClick={() => setViewScope('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewScope === 'all'
                  ? 'bg-[#35d6c0] text-[#09131d] shadow-sm font-black border-t border-white/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setViewScope('my')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewScope === 'my'
                  ? 'bg-[#35d6c0] text-[#09131d] shadow-sm font-black border-t border-white/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Orders ({myOrdersCount})
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search target, ID, service..."
              className="bg-[#0d1224] border border-[#252f52] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#35d6c0] transition-colors w-48 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center bg-[#0d1224] border border-[#252f52] p-1 rounded-xl overflow-x-auto">
            {(['all', 'in_progress', 'completed', 'processing', 'canceled'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-[#35d6c0] text-[#09131d] shadow-sm font-black border-t border-white/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'All' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List Table / Cards */}
      <div className="bg-[#171d35] border border-[#263158] rounded-3xl overflow-hidden shadow-2xl border-t-white/10">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0d1224] border border-[#202a4d] flex items-center justify-center mx-auto text-slate-500">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">No matching orders found</p>
            <p className="text-xs text-slate-400">
              {search || statusFilter !== 'all' || viewScope === 'my'
                ? 'Try resetting the search or filter options.'
                : 'No orders have been recorded yet.'}
            </p>
            {(search || statusFilter !== 'all' || viewScope === 'my') && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setViewScope('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#35d6c0] text-[#09131d] text-xs font-bold"
              >
                Show All Orders
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#202a4d]">
            {filteredOrders.map(order => {
              const delivered = order.quantity - order.remains;
              const percent = Math.min(100, Math.max(0, Math.round((delivered / order.quantity) * 100)));

              return (
                <div key={order.id} className="p-4 sm:p-5 hover:bg-[#1a213d] transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#35d6c0] bg-[#35d6c0]/15 px-2.5 py-0.5 rounded-lg border border-[#35d6c0]/30">
                          {order.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'completed'
                            ? 'bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30 font-black'
                            : order.status === 'in_progress'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : order.status === 'processing'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-[#0d1224] text-slate-400 border border-[#252f52]'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          ({order.userEmail})
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                        <Instagram className="w-3.5 h-3.5 text-[#35d6c0] shrink-0" />
                        <span>{order.serviceName}</span>
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="font-mono text-slate-200 font-semibold bg-[#0d1224] px-2 py-0.5 rounded border border-[#202a4d]">
                          {order.target}
                        </span>
                        <span>•</span>
                        <span>Quantity: <strong className="text-white">{order.quantity.toLocaleString()}</strong></span>
                        <span>•</span>
                        <span>Cost: <strong className="text-[#35d6c0]">{order.charge === 0 ? '₹0.00 (FREE TRIAL)' : `₹${order.charge.toFixed(2)}`}</strong></span>
                      </div>
                    </div>

                    {/* Right: Progress bar & stats */}
                    <div className="lg:w-72 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Progress</span>
                        <span className="font-bold text-slate-200">
                          {delivered.toLocaleString()} / {order.quantity.toLocaleString()} ({percent}%)
                        </span>
                      </div>

                      <div className="w-full bg-[#0a0e1c] h-2.5 rounded-full overflow-hidden border border-[#202a4d]">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#35d6c0] to-teal-400"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Start count: {order.startCount}</span>
                        <span>Remains: {order.remains.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
