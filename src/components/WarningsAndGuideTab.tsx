import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SettingScreenshotCard } from './SettingScreenshotCard';
import {
  ShieldAlert,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Lock,
  Unlock,
  RefreshCw,
  HelpCircle,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Shield
} from 'lucide-react';

interface WarningsAndGuideTabProps {
  onNavigateToNewOrder: () => void;
  openAddFundsModal?: () => void;
  redirectNotice?: string | null;
  initialTarget?: 'setting' | 'payment';
  onClearNotice?: () => void;
}

export const WarningsAndGuideTab: React.FC<WarningsAndGuideTabProps> = ({
  onNavigateToNewOrder,
  openAddFundsModal,
  redirectNotice,
  initialTarget,
  onClearNotice
}) => {
  const { guideConfig, upiConfig } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'setting' | 'payment' | 'warnings'>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [highlightScreenshot, setHighlightScreenshot] = useState<boolean>(false);

  // Auto-scroll and highlight screenshot when redirected after clicking "Done"
  React.useEffect(() => {
    if (redirectNotice || initialTarget === 'setting') {
      setActiveSubTab('setting');
      setHighlightScreenshot(true);

      const timer = setTimeout(() => {
        const el = document.getElementById('instagram-setting-screenshot');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);

      const unhighlightTimer = setTimeout(() => {
        setHighlightScreenshot(false);
      }, 8000);

      return () => {
        clearTimeout(timer);
        clearTimeout(unhighlightTimer);
      };
    }
  }, [redirectNotice, initialTarget]);

  const faqs = [
    {
      q: 'Why must Instagram accounts remain Public during delivery?',
      a: 'Automated fulfillment nodes interface with public API endpoints. If an account is set to Private, Instagram blocks incoming engagement. Setting the account to Public guarantees 100% successful delivery.'
    },
    {
      q: 'How long does UPI UTR verification take?',
      a: 'Approvals take between 1 to 5 minutes. Our system reconciles the 12-digit UTR directly against bank settlement logs.'
    },
    {
      q: 'Can I change my username or delete the post during processing?',
      a: 'No. Modifying your username or archiving the target link while an order is In Progress breaks the routing destination.'
    },
    {
      q: 'What is the 30-day refill guarantee?',
      a: 'For services with lifetime non-drop or refill tags, any natural drop within 30 days is replenished at zero additional charge.'
    },
    {
      q: 'Do you require account login credentials?',
      a: 'Never. We will never ask for your Instagram password, two-factor code, or email login. All growth is delivered externally.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-[#171d35] border border-[#263158] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border-t-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#35d6c0]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#35d6c0]/15 border border-[#35d6c0]/30 text-[#35d6c0] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Operational Standards &amp; Payment Manual</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
            Security Warnings &amp; UPI Process
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Essential guidelines to guarantee maximum delivery speed, account safety, and immediate payment reconciliation.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-xl bg-[#0d1224] border border-[#252f52] text-slate-200 font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#35d6c0]" />
              <span>Public Profile Required</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-[#0d1224] border border-[#252f52] text-slate-200 font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#35d6c0]" />
              <span>12-Digit UTR Tracking</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-[#0d1224] border border-[#252f52] text-slate-200 font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#35d6c0]" />
              <span>No Password Required</span>
            </span>
          </div>
        </div>
      </div>

      {/* Redirect Notification Banner (shown when user clicked 'Done') */}
      {redirectNotice && (
        <div className="bg-[#171d35] border-2 border-[#35d6c0]/80 rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#35d6c0] to-[#1ea897] text-[#09131d] flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-[#35d6c0]/20 border-t border-white/40">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30">
                  Order Registered
                </span>
                <span className="text-xs text-[#35d6c0] font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Account Configuration Check</span>
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-1">
                {redirectNotice}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Review the screenshot below: verify that your Instagram account is set to <strong>PUBLIC</strong> for unblocked delivery.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('instagram-setting-screenshot');
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="px-4 py-2.5 bg-gradient-to-b from-[#35d6c0] to-[#1ea897] hover:brightness-105 text-[#09131d] font-black text-xs rounded-xl shadow-lg shadow-[#35d6c0]/20 flex items-center space-x-1.5 border-t border-white/40 active:translate-y-0.5 transition-all"
            >
              <span>View Screenshot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {onClearNotice && (
              <button
                type="button"
                onClick={onClearNotice}
                className="p-2 rounded-xl bg-[#0d1224] hover:bg-[#151c36] border border-[#252f52] text-slate-400 hover:text-white text-xs font-bold"
                title="Dismiss"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Category Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#252f52] pb-4">
        <button
          type="button"
          onClick={() => setActiveSubTab('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'all'
              ? 'bg-[#35d6c0] text-[#09131d] font-black shadow-lg shadow-[#35d6c0]/20 border-t border-white/40'
              : 'bg-[#171d35] border border-[#263158] text-slate-300 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>All Guidelines</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('setting')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'setting'
              ? 'bg-[#35d6c0] text-[#09131d] font-black shadow-lg shadow-[#35d6c0]/20 border-t border-white/40'
              : 'bg-[#171d35] border border-[#263158] text-slate-300 hover:text-white'
          }`}
        >
          <Unlock className="w-4 h-4" />
          <span>1. Required Account Setting</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('payment')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'payment'
              ? 'bg-[#35d6c0] text-[#09131d] font-black shadow-lg shadow-[#35d6c0]/20 border-t border-white/40'
              : 'bg-[#171d35] border border-[#263158] text-slate-300 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>2. Payment &amp; UTR Reconciliation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('warnings')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'warnings'
              ? 'bg-[#35d6c0] text-[#09131d] font-black shadow-lg shadow-[#35d6c0]/20 border-t border-white/40'
              : 'bg-[#171d35] border border-[#263158] text-slate-300 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>3. Safety Standards</span>
        </button>
      </div>

      {/* SECTION 1: SETTING SCREENSHOT */}
      {(activeSubTab === 'all' || activeSubTab === 'setting') && (
        <div id="setting-screenshot-section" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30 flex items-center justify-center font-black text-sm">
              1
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {guideConfig.accountSettingTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {guideConfig.accountSettingSubtitle}
              </p>
            </div>
          </div>

          <SettingScreenshotCard
            customImageUrl={guideConfig.screenshotUrl}
            isHighlighted={highlightScreenshot}
            id="instagram-setting-screenshot"
          />
        </div>
      )}

      {/* SECTION 2: PAYMENT TIMELINE */}
      {(activeSubTab === 'all' || activeSubTab === 'payment') && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30 flex items-center justify-center font-black text-sm">
              2
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                UPI Payment Execution (INR ₹)
              </h2>
              <p className="text-xs text-slate-400">
                Direct QR payment supported on PhonePe, Google Pay, Paytm, and BHIM
              </p>
            </div>
          </div>

          {/* 5-Step Process Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {guideConfig.paymentSteps.map(step => (
              <div
                key={step.step}
                className="bg-[#171d35] border border-[#263158] rounded-3xl p-4 flex flex-col justify-between space-y-3 relative group hover:border-[#35d6c0]/40 transition-all shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-7 h-7 rounded-xl bg-[#35d6c0]/15 text-[#35d6c0] font-black text-xs flex items-center justify-center border border-[#35d6c0]/30">
                      {step.step}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Phase {step.step}
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-white leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#252f52]">
                  <span className="text-[10px] font-extrabold text-[#35d6c0] bg-[#35d6c0]/10 px-2 py-0.5 rounded-md inline-block">
                    {step.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Pay Action Banner */}
          <div className="bg-[#171d35] border border-[#263158] rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <QrCode className="w-4 h-4 text-[#35d6c0]" />
                <span className="text-sm font-black text-white">Verified Merchant UPI Account</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                UPI ID: <strong className="text-[#35d6c0]">{upiConfig.upiId}</strong> ({upiConfig.merchantName})
              </p>
            </div>

            {openAddFundsModal && (
              <button
                type="button"
                onClick={openAddFundsModal}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-b from-[#35d6c0] to-[#1ea897] hover:brightness-105 text-[#09131d] font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-[#35d6c0]/20 border-t border-white/40 active:translate-y-0.5 transition-all"
              >
                <QrCode className="w-4 h-4 text-[#09131d]" />
                <span>Open Instant UPI QR</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: SAFETY STANDARDS */}
      {(activeSubTab === 'all' || activeSubTab === 'warnings') && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30 flex items-center justify-center font-black text-sm">
              3
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center space-x-2">
                <span>Account Protection &amp; Delivery Standards</span>
              </h2>
              <p className="text-xs text-slate-400">
                Operating rules designed to ensure 100% account integrity and zero drops
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guideConfig.sweetWarnings.map(warning => (
              <div
                key={warning.id}
                className="bg-[#171d35] border border-[#263158] rounded-3xl p-5 space-y-3 relative hover:border-[#35d6c0]/40 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-2xl bg-[#0d1224] border border-[#252f52] flex items-center justify-center text-[#35d6c0]">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30">
                    {warning.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-white leading-snug">
                    {warning.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {warning.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Accordion */}
      <div className="bg-[#171d35] border border-[#263158] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-[#35d6c0]" />
          <h2 className="text-lg font-black text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#252f52] bg-[#0d1224] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white hover:text-[#35d6c0] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 border-t border-[#1c2545] pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#252f52]">
          <span className="text-xs text-slate-400">
            Ready to configure your next growth order?
          </span>
          <button
            type="button"
            onClick={onNavigateToNewOrder}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#35d6c0] to-[#1ea897] hover:brightness-105 text-[#09131d] font-black text-xs shadow-lg shadow-[#35d6c0]/20 flex items-center justify-center space-x-1.5 border-t border-white/40 active:translate-y-0.5 transition-all"
          >
            <span>Proceed to Order Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
