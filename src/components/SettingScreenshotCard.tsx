import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';

interface SettingScreenshotCardProps {
  customImageUrl?: string;
  onExploreGuide?: () => void;
  compact?: boolean;
  isHighlighted?: boolean;
  initialView?: 'instagram' | 'payment';
  id?: string;
}

export const SettingScreenshotCard: React.FC<SettingScreenshotCardProps> = ({
  customImageUrl,
  onExploreGuide,
  compact = false,
  isHighlighted = false,
  initialView = 'instagram',
  id = 'instagram-setting-screenshot'
}) => {
  const [activeView, setActiveView] = useState<'instagram' | 'payment'>(initialView);
  const [copiedUtr, setCopiedUtr] = useState(false);

  // Sync activeView if initialView changes
  React.useEffect(() => {
    setActiveView(initialView);
  }, [initialView]);

  const sampleUtr = '429188291039';

  const copySampleUtr = () => {
    navigator.clipboard.writeText(sampleUtr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  return (
    <div
      id={id}
      className={`bg-[#171d35] border rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 scroll-mt-24 ${
        isHighlighted
          ? 'border-[#35d6c0] ring-4 ring-[#35d6c0]/40 shadow-[#35d6c0]/20'
          : 'border-[#263158]'
      }`}
    >
      {/* Highlighted Notice Bar */}
      {isHighlighted && (
        <div className="bg-gradient-to-r from-[#171d35] via-[#20294d] to-[#171d35] border-b border-[#35d6c0]/40 px-4 py-2.5 text-white text-xs font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#35d6c0] animate-ping" />
            <span className="text-white font-extrabold tracking-wide">
              Verify Account Setting (Screenshot Below)
            </span>
          </div>
          <span className="text-[10px] bg-[#35d6c0]/20 text-[#35d6c0] border border-[#35d6c0]/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
            Ready for Delivery
          </span>
        </div>
      )}

      {/* Top Segmented Selector */}
      <div className="bg-[#0e1326] px-5 py-3.5 border-b border-[#252f52] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#35d6c0]" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Visual Guide
          </span>
        </div>

        <div className="flex items-center bg-[#090d1a] p-1 rounded-xl border border-[#252f52] text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveView('instagram')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeView === 'instagram'
                ? 'bg-[#35d6c0] text-[#09131d] font-black shadow-md border-t border-white/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>1. Instagram Setting (Public)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('payment')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeView === 'payment'
                ? 'bg-[#35d6c0] text-[#09131d] font-black shadow-md border-t border-white/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>2. 12-Digit UTR Screenshot</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-5 sm:p-6">
        {activeView === 'instagram' ? (
          <div>
            {/* Setting explanation header */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 text-[#35d6c0] font-bold text-xs uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Primary Requirement</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
                Turn OFF Private Account (Set to Public)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Path: <span className="text-slate-200 font-semibold">Profile &gt; Settings &amp; privacy &gt; Account privacy &gt; Private account: OFF</span>
              </p>
            </div>

            {/* Custom Image or Clean Smartphone Mockup */}
            {customImageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#252f52] bg-[#0d1224] max-w-lg mx-auto">
                <img
                  src={customImageUrl}
                  alt="Instagram Public Setting Screenshot"
                  className="w-full h-auto object-cover max-h-[460px]"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#090d1a]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-slate-200 flex items-center justify-between">
                  <span>Official Setting Guide</span>
                  <span className="text-[#35d6c0] font-bold">Public = Ready</span>
                </div>
              </div>
            ) : (
              /* Smartphone Interface Mockup in SaaS Colors */
              <div className="max-w-md mx-auto bg-[#070a14] rounded-[36px] border-[5px] border-[#252f52] p-3 shadow-2xl relative overflow-hidden font-sans">
                {/* Phone Speaker Notch */}
                <div className="w-28 h-4 bg-[#141b33] rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                  <div className="w-10 h-1 bg-[#090d1a] rounded-full" />
                </div>

                {/* Status Bar */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 px-3 pb-2 font-mono">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1.5">
                    <span>5G</span>
                    <div className="w-4 h-2 border border-slate-500 rounded-sm flex items-center p-0.5">
                      <div className="w-2.5 h-full bg-[#35d6c0] rounded-xs" />
                    </div>
                  </div>
                </div>

                {/* Instagram App Header Mockup */}
                <div className="bg-[#0c1022] rounded-2xl border border-[#202a4a] overflow-hidden">
                  <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#1c2542]">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 text-sm font-bold">‹</span>
                      <span className="text-xs font-bold text-white">Settings and privacy</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">Instagram</span>
                  </div>

                  {/* Settings Content Screen */}
                  <div className="p-3.5 space-y-3 text-xs">
                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Who can see your content
                    </div>

                    {/* Account Privacy Card */}
                    <div className="bg-[#121830] border-2 border-[#35d6c0]/70 rounded-2xl p-3 space-y-2 relative shadow-lg shadow-[#35d6c0]/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-xl bg-[#1d264a] flex items-center justify-center text-[#35d6c0]">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">Account privacy</div>
                            <div className="text-[10px] text-slate-300">Public</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-extrabold text-[#35d6c0] bg-[#35d6c0]/15 px-2 py-0.5 rounded-full border border-[#35d6c0]/30">
                            PUBLIC
                          </span>
                        </div>
                      </div>

                      {/* Inside toggle switch */}
                      <div className="mt-2 pt-2.5 border-t border-[#232f57] flex items-center justify-between bg-[#0a0e1c] p-2.5 rounded-xl border border-[#1e2746]">
                        <div>
                          <div className="font-bold text-white text-[11px]">Private account</div>
                          <div className="text-[9px] text-slate-400">Only approved followers can view</div>
                        </div>

                        {/* Toggle switch in OFF position */}
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-5 bg-[#1b233d] rounded-full p-0.5 border border-[#2b3861]">
                            <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">OFF</span>
                        </div>
                      </div>

                      {/* Clear confirmation tag */}
                      <div className="bg-[#35d6c0]/10 border border-[#35d6c0]/30 rounded-xl p-2 flex items-center space-x-2 text-[11px] text-[#35d6c0] font-bold">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-[#35d6c0]" />
                        <span>Keep toggle OFF for automated fulfillment.</span>
                      </div>
                    </div>

                    <div className="bg-[#121830]/40 border border-[#1d264a] rounded-xl p-2.5 flex items-center justify-between text-slate-400 opacity-60">
                      <span className="text-[11px]">Close Friends</span>
                      <span className="text-[10px]">0</span>
                    </div>

                    <div className="bg-[#121830]/40 border border-[#1d264a] rounded-xl p-2.5 flex items-center justify-between text-slate-400 opacity-60">
                      <span className="text-[11px]">Blocked Accounts</span>
                      <span className="text-[10px]">None</span>
                    </div>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="w-24 h-1 bg-[#202a4a] rounded-full mx-auto mt-2" />
              </div>
            )}

            {/* Why needed note */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#0d1224] border border-[#252f52] text-xs text-slate-300 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-[#35d6c0] text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Delivery Guarantee</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Instagram servers reject automated interaction on private accounts. Setting your profile to Public ensures instantaneous start and 100% completion. You may re-enable privacy once delivery finishes.
              </p>
            </div>
          </div>
        ) : (
          /* Payment Receipt & 12-Digit UTR Screenshot */
          <div>
            <div className="mb-4">
              <div className="flex items-center space-x-2 text-[#35d6c0] font-bold text-xs uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Payment Verification</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
                Locate Your 12-Digit UPI UTR Reference Number
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                After paying via PhonePe, Google Pay, or Paytm, copy the 12-digit transaction ID / UTR from your receipt.
              </p>
            </div>

            {/* Payment Receipt Mockup */}
            <div className="max-w-md mx-auto bg-[#0d1224] border border-[#252f52] rounded-3xl p-5 shadow-xl space-y-4 font-sans">
              <div className="flex items-center justify-between border-b border-[#202a4a] pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#35d6c0]/15 border border-[#35d6c0]/30 flex items-center justify-center text-[#35d6c0]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">Payment Successful</div>
                    <div className="text-[10px] text-slate-400">InstaGrow Official Merchant</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-[#35d6c0]">₹28.90</span>
                </div>
              </div>

              {/* UTR Highlight Card */}
              <div className="bg-[#121933] border-2 border-[#35d6c0]/60 rounded-2xl p-3.5 space-y-2 relative shadow-lg shadow-[#35d6c0]/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    UPI Reference / UTR Number
                  </span>
                  <span className="text-[10px] bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30 px-2 py-0.5 rounded-full font-extrabold">
                    12 DIGITS
                  </span>
                </div>

                <div className="bg-[#080c18] border border-[#232f57] rounded-xl p-2.5 flex items-center justify-between">
                  <span className="font-mono text-sm sm:text-base font-black text-white tracking-wider">
                    {sampleUtr}
                  </span>
                  <button
                    type="button"
                    onClick={copySampleUtr}
                    className="p-1.5 rounded-lg bg-[#171d35] hover:bg-[#20294d] border border-[#263158] text-slate-200 transition-colors flex items-center space-x-1 text-[10px]"
                    title="Copy sample"
                  >
                    {copiedUtr ? <Check className="w-3.5 h-3.5 text-[#35d6c0]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedUtr ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-300 font-semibold flex items-center space-x-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#35d6c0] shrink-0" />
                  <span>Submit this 12-digit code for instant balance credit.</span>
                </div>
              </div>

              {/* UPI Apps Legend */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
                <div className="bg-[#090d1a] p-2 rounded-xl border border-[#1e2746]">
                  <p className="font-bold text-white">Google Pay</p>
                  <p className="text-[9px] text-slate-400">UPI Transaction ID</p>
                </div>
                <div className="bg-[#090d1a] p-2 rounded-xl border border-[#1e2746]">
                  <p className="font-bold text-white">PhonePe</p>
                  <p className="text-[9px] text-slate-400">UTR: 4291...</p>
                </div>
                <div className="bg-[#090d1a] p-2 rounded-xl border border-[#1e2746]">
                  <p className="font-bold text-white">Paytm</p>
                  <p className="text-[9px] text-slate-400">UPI Ref No.</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-2xl bg-[#0d1224] border border-[#252f52] text-xs text-slate-300 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#35d6c0] shrink-0" />
              <span className="text-slate-300 text-xs">
                Verification time: Typically approved in 1 to 5 minutes by automated ledger reconciliation.
              </span>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {onExploreGuide && (
          <div className="mt-5 pt-4 border-t border-[#252f52] flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Need comprehensive guidelines?
            </span>
            <button
              type="button"
              onClick={onExploreGuide}
              className="text-xs font-bold text-[#35d6c0] hover:text-white flex items-center space-x-1.5 transition-colors"
            >
              <span>Open Safety &amp; Payment Tab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
