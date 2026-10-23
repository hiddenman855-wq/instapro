import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { OrderStatus } from '../types';
import { Search } from 'lucide-react';

export const OrdersList: React.FC = () => {
  const { orders, currentUser, isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

  const filteredOrders = orders.filter(order => {
    if (!isAdmin && order.userId !== currentUser?.uid && order.userEmail !== currentUser?.email) {
      if (!order.userId.startsWith('sample-user')) return false;
    }

    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.target.toLowerCase().includes(q) ||
        order.serviceName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
            Orders History
          </h2>
          <p className="text-xs text-slate-400">Real-time delivery logs and fulfillment progress</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search target or ID..."
              className="bg-[#0d1224] border border-[#252f52] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#35d6c0] transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center bg-[#0d1224] border border-[#252f52] p-1 rounded-xl">
            {(['all', 'in_progress', 'completed', 'processing', 'canceled'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-[#35d6c0] text-[#09131d] shadow-sm font-black border-t border-white/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List Table / Cards */}
      <div className="bg-[#171d35] border border-[#263158] rounded-3xl overflow-hidden shadow-2xl border-t-white/10">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No matching orders found.
          </div>
        ) : (
          <div className="divide-y divide-[#202a4d]">
            {filteredOrders.map(order => {
              const delivered = order.quantity - order.remains;
              const percent = Math.min(100, Math.round((delivered / order.quantity) * 100));

              return (
                <div key={order.id} className="p-4 sm:p-5 hover:bg-[#1a213d] transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#35d6c0] bg-[#35d6c0]/15 px-2 py-0.5 rounded-lg border border-[#35d6c0]/30">
                          {order.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'completed'
                            ? 'bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30'
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
                      </div>

                      <h4 className="text-sm font-bold text-white">{order.serviceName}</h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="font-mono text-slate-200 font-semibold">{order.target}</span>
                        <span>•</span>
                        <span>Quantity: <strong className="text-white">{order.quantity.toLocaleString()}</strong></span>
                        <span>•</span>
                        <span>Cost: <strong className="text-[#35d6c0]">₹{order.charge.toFixed(2)}</strong></span>
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
