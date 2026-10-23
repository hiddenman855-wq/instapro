import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, HelpCircle, Send, CheckCircle2, MessageSquare } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const { createSupportTicket, tickets, currentUser, orders } = useAuth();
  const [subject, setSubject] = useState('');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    await createSupportTicket(subject, message, orderId || undefined);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubject('');
      setMessage('');
      setOrderId('');
      onClose();
    }, 1500);
  };

  const userTickets = tickets.filter(t => t.userId === currentUser?.uid || t.userEmail === currentUser?.email);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-3 text-rose-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white">24/7 Support Desk</h2>
          <p className="text-xs text-zinc-400 mt-1">Open an inquiry for order speed, refills, or assistance</p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-black text-white">Ticket Submitted Successfully!</h3>
            <p className="text-xs text-zinc-400">Our normal admin staff will answer in your ticket desk shortly.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Order speed inquiry, Refill request"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Related Order ID (Optional)
                </label>
                <select
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="">None / General Inquiry</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.id} — {o.serviceName.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Message Description *
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide any details about your Instagram link or issue..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-95 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-rose-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </form>

            {/* Past tickets by this user */}
            {userTickets.length > 0 && (
              <div className="pt-4 border-t border-zinc-800 space-y-2">
                <h4 className="text-xs font-bold text-zinc-300">Your Tickets</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {userTickets.map(t => (
                    <div key={t.id} className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{t.subject}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.status === 'answered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-[11px]">{t.message}</p>
                      {t.reply && (
                        <p className="text-indigo-300 bg-indigo-950/30 p-2 rounded-lg text-[11px]">
                          <strong>Admin Reply:</strong> {t.reply}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
