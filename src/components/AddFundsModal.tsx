import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateUpiQrDataUrl } from '../utils/qrHelper';
import confetti from 'canvas-confetti';
import {
  X,
  QrCode,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  CreditCard,
  Smartphone
} from 'lucide-react';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  purpose?: 'wallet_deposit' | 'direct_order';
  orderId?: string;
  serviceName?: string;
  onDoneRedirectToWarning?: (notice?: string) => void;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({
  isOpen,
  onClose,
  initialAmount = 500,
  purpose = 'wallet_deposit',
  orderId,
  serviceName,
  onDoneRedirectToWarning
}) => {
  const { upiConfig, submitPaymentUtr, payments, currentUser } = useAuth();
  const [amount, setAmount] = useState<number>(initialAmount);
  const [customAmountStr, setCustomAmountStr] = useState<string>(initialAmount.toString());
  const [utrId, setUtrId] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrLoading, setQrLoading] = useState<boolean>(true);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successPaymentId, setSuccessPaymentId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'pay' | 'history'>('pay');
  const [qrType, setQrType] = useState<'dynamic' | 'custom'>('dynamic');

  // Reset or initialize state when opened
  useEffect(() => {
    if (isOpen) {
      const startAmt = initialAmount > 0 ? initialAmount : 500;
      setAmount(startAmt);
      setCustomAmountStr(startAmt.toString());
      setUtrId('');
      setErrorMsg(null);
      setSuccessPaymentId(null);
      setActiveView('pay');
    }
  }, [isOpen, initialAmount]);

  // Generate dynamic QR code whenever amount or upiConfig changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const updateQr = async () => {
      setQrLoading(true);
      const validAmount = amount > 0 ? amount : 100;
      const note = `InstaGrow_${currentUser?.email?.split('@')[0] || 'Order'}`;
      const url = await generateUpiQrDataUrl(upiConfig.upiId, upiConfig.merchantName, validAmount, note);
      if (isMounted) {
        setQrDataUrl(url);
        setQrLoading(false);
      }
    };

    updateQr();
    return () => {
      isMounted = false;
    };
  }, [amount, upiConfig.upiId, upiConfig.merchantName, isOpen, currentUser?.email]);

  if (!isOpen) return null;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiConfig.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmountStr(val.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCustomAmountStr(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUtr = utrId.trim();
    if (!cleanUtr) {
      setErrorMsg('Please enter the 12-digit UTR ID / Reference No from your UPI payment receipt.');
      return;
    }

    if (cleanUtr.length < 6) {
      setErrorMsg('Please enter a valid UPI transaction reference (usually 12 digits).');
      return;
    }

    if (amount <= 0) {
      setErrorMsg('Invalid payment amount.');
      return;
    }

    setSubmitting(true);
    try {
      const payment = await submitPaymentUtr(amount, cleanUtr, purpose, orderId);
      setSuccessPaymentId(payment.id);
      confetti({ particleCount: 50, spread: 60 });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // User's own payment submissions
  const userPayments = payments.filter(
    p => p.userId === currentUser?.uid || p.userEmail.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#171d35] border border-[#263158] rounded-3xl w-full max-w-xl p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#0d1224] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#35d6c0]/15 border border-[#35d6c0]/30 flex items-center justify-center mx-auto mb-2.5 text-[#35d6c0] shadow-lg shadow-[#35d6c0]/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white">Instant UPI Payment (INR ₹)</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pay exact amount using GPay, PhonePe, Paytm, or BHIM & enter 12-digit UTR
          </p>

          {/* Toggle between Payment and User's UTR History */}
          <div className="flex justify-center mt-3">
            <div className="inline-flex bg-[#0d1224] p-1 rounded-xl border border-[#1e2646] text-xs">
              <button
                type="button"
                onClick={() => setActiveView('pay')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeView === 'pay' ? 'bg-[#35d6c0] text-[#09131d] shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Scan &amp; Pay UPI
              </button>
              <button
                type="button"
                onClick={() => setActiveView('history')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeView === 'history' ? 'bg-[#35d6c0] text-[#09131d] shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                My Payment UTRs ({userPayments.length})
              </button>
            </div>
          </div>
        </div>

        {activeView === 'history' ? (
          /* View Past Submitted Payments & Status */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider">
                Submitted Payments &amp; Status
              </h3>
              <span className="text-[11px] text-slate-400">Verified within 2–15 mins</span>
            </div>

            {userPayments.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs bg-[#0d1224] rounded-2xl border border-[#1e2646]">
                You haven't submitted any UPI payments yet.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto">
                {userPayments.map(p => (
                  <div key={p.id} className="p-3.5 bg-[#0d1224] border border-[#1e2646] rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-black text-[#35d6c0]">{p.id}</span>
                        <span className="text-xs font-black text-white">₹{p.amount.toFixed(2)}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.status === 'verified'
                            ? 'bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30'
                            : p.status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {p.status === 'verified'
                          ? '✓ Verified & Credited'
                          : p.status === 'rejected'
                          ? '✗ Rejected'
                          : '⏳ Pending Verification'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-1 pt-1 border-t border-[#171d35]">
                      <div>
                        <span>UTR: </span>
                        <strong className="font-mono text-slate-200">{p.utrId}</strong>
                      </div>
                      <span>{new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {p.status === 'verified' && (
                      <p className="text-[11px] text-[#35d6c0] bg-[#35d6c0]/10 px-2.5 py-1 rounded-lg border border-[#35d6c0]/20">
                        Funds credited to wallet. Verified by Super Admin.
                      </p>
                    )}

                    {p.status === 'rejected' && p.rejectionReason && (
                      <p className="text-[11px] text-rose-300 bg-rose-950/20 px-2.5 py-1 rounded-lg border border-rose-500/20">
                        Reason: {p.rejectionReason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveView('pay')}
              className="w-full py-2.5 rounded-xl bg-[#0d1224] hover:bg-[#1e2646] text-xs font-bold text-white transition-colors border border-[#1e2646]"
            >
              Back to Pay
            </button>
          </div>
        ) : successPaymentId ? (
          /* Payment Submission Success Card */
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#35d6c0]/20 border border-[#35d6c0]/40 flex items-center justify-center mx-auto text-[#35d6c0]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Payment Submitted for Verification</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Payment of <strong className="text-[#35d6c0] font-bold">₹{amount.toFixed(2)}</strong> with UTR ID{' '}
                <strong className="text-white font-mono">{utrId}</strong> recorded.
              </p>
            </div>

            <div className="bg-[#0d1224] p-4 rounded-2xl border border-[#1e2646] text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Reference</span>
                <span className="font-mono font-bold text-slate-200">{successPaymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount to Credit</span>
                <span className="font-bold text-[#35d6c0]">₹{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="text-amber-400 font-bold">Pending Verification</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Super Admin verifies UTRs promptly. You can track status in "My Payment UTRs".
            </p>

            <div className="flex gap-2 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setActiveView('history')}
                className="w-1/2 py-2.5 rounded-xl bg-[#0d1224] hover:bg-[#1e2646] text-xs font-bold text-slate-200 border border-[#1e2646]"
              >
                View Status
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onDoneRedirectToWarning) {
                    onDoneRedirectToWarning(`Payment of ₹${amount.toFixed(2)} (UTR: ${utrId}) submitted! Super Admin is verifying it. Please verify your Instagram Setting below.`);
                  }
                }}
                className="w-1/2 py-2.5 rounded-xl bg-gradient-to-b from-[#35d6c0] via-[#2cc3b0] to-[#1ea897] hover:from-[#42ecd7] hover:to-[#23b7a5] text-[#09131d] text-xs font-black shadow-lg shadow-[#35d6c0]/25 border-t border-white/50 flex items-center justify-center space-x-1.5 active:translate-y-0.5 cursor-pointer"
              >
                <span>Done</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Main Payment Flow */
          <div className="space-y-5">
            {/* Context Note if Paying directly for a service order */}
            {serviceName && (
              <div className="p-3 rounded-2xl bg-[#0d1224] border border-[#35d6c0]/30 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#35d6c0] block">Service Order</span>
                  <span className="font-bold text-white">{serviceName}</span>
                </div>
                <span className="text-base font-black text-[#35d6c0]">₹{amount.toFixed(2)}</span>
              </div>
            )}

            {/* 1. Amount Selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                1. Select or Enter Amount (INR ₹)
              </label>

              {/* Quick INR presets */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-2.5">
                {[100, 250, 500, 1000, 2000, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleAmountSelect(val)}
                    className={`py-2 rounded-xl text-xs font-black transition-all active:translate-y-0.5 ${
                      amount === val
                        ? 'bg-gradient-to-b from-[#35d6c0] to-[#20b8a4] text-[#09131d] shadow-md shadow-[#35d6c0]/20 border-t border-white/40'
                        : 'bg-[#0d1224] border border-[#1e2646] text-slate-300 hover:text-white hover:border-[#35d6c0]/40'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              {/* Custom amount input */}
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-base font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="10"
                  step="1"
                  value={customAmountStr}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter custom amount"
                  className="w-full bg-[#0d1224] border border-[#252f52] rounded-2xl pl-8 pr-4 py-2.5 text-sm font-black text-white focus:outline-none focus:border-[#35d6c0]"
                />
              </div>
            </div>

            {/* 2. Dynamic QR Code Display */}
            <div className="bg-[#0d1224] border border-[#1e2646] rounded-2xl p-4 sm:p-5 text-center space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#171d35]">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pay Exact Amount</span>
                  <span className="text-base font-black text-[#35d6c0]">₹{amount.toFixed(2)}</span>
                </div>

                {upiConfig.qrImageUrl && (
                  <div className="flex bg-[#171d35] p-0.5 rounded-lg border border-[#252f52] text-[10px]">
                    <button
                      type="button"
                      onClick={() => setQrType('dynamic')}
                      className={`px-2 py-0.5 rounded font-bold ${
                        qrType === 'dynamic' ? 'bg-[#35d6c0] text-[#09131d]' : 'text-slate-400'
                      }`}
                    >
                      Dynamic ₹{amount.toFixed(0)} QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrType('custom')}
                      className={`px-2 py-0.5 rounded font-bold ${
                        qrType === 'custom' ? 'bg-[#35d6c0] text-[#09131d]' : 'text-slate-400'
                      }`}
                    >
                      Admin QR
                    </button>
                  </div>
                )}
              </div>

              {/* QR Image Box */}
              <div className="relative inline-block mx-auto bg-white p-3 rounded-2xl shadow-xl">
                {qrLoading ? (
                  <div className="w-52 h-52 flex flex-col items-center justify-center text-slate-400 text-xs">
                    <RefreshCw className="w-6 h-6 animate-spin text-teal-600 mb-2" />
                    <span>Generating QR...</span>
                  </div>
                ) : qrType === 'custom' && upiConfig.qrImageUrl ? (
                  <img
                    src={upiConfig.qrImageUrl}
                    alt="Super Admin UPI QR"
                    className="w-52 h-52 object-contain rounded-lg"
                  />
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`UPI QR code for ₹${amount}`}
                    className="w-52 h-52 object-contain"
                  />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
                    Failed to generate QR
                  </div>
                )}
              </div>

              {/* UPI ID with One-Click Copy */}
              <div className="pt-1">
                <p className="text-[11px] text-slate-400 mb-1.5 font-medium">
                  Scan via PhonePe, Google Pay, Paytm, or BHIM. Or copy UPI ID:
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="bg-[#171d35] border border-[#252f52] px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-slate-200">
                    {upiConfig.upiId}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpiId}
                    className="px-3 py-1.5 rounded-xl bg-[#1e2646] hover:bg-[#28335c] text-slate-200 text-xs font-bold flex items-center space-x-1 transition-colors border border-[#2d3a66] active:translate-y-0.5"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-[#35d6c0]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. UTR Input Form */}
            <form onSubmit={handleSubmitUtr} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  2. Enter 12-digit UTR ID / Reference No *
                </label>
                <input
                  type="text"
                  value={utrId}
                  onChange={(e) => setUtrId(e.target.value)}
                  placeholder="e.g. 402918239012"
                  className="w-full bg-[#0d1224] border border-[#252f52] rounded-2xl px-4 py-2.5 text-sm font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#35d6c0]"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  After payment, enter the 12-digit <strong>UPI Ref No / UTR</strong> from your receipt.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !utrId.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-[#35d6c0] via-[#2cc3b0] to-[#1ea897] hover:from-[#42ecd7] hover:to-[#23b7a5] disabled:opacity-50 text-[#09131d] font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-[#35d6c0]/20 border-t border-white/50 active:translate-y-0.5 transition-all cursor-pointer"
              >
                {submitting ? (
                  <span>Submitting UTR...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#09131d]" />
                    <span>Submit ₹{amount.toFixed(2)} UTR for Verification</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
