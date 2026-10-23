import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SettingScreenshotCard } from './SettingScreenshotCard';
import {
  ChevronDown,
  ChevronUp,
  Unlock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Shield
} from 'lucide-react';

interface BottomSettingBannerProps {
  onNavigateToGuide: () => void;
}

export const BottomSettingBanner: React.FC<BottomSettingBannerProps> = ({ onNavigateToGuide }) => {
  const { guideConfig } = useAuth();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!guideConfig.bottomBannerEnabled) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 mt-8">
      <div className="bg-[#171d35] border border-[#263158] rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/40 relative overflow-hidden border-t-white/10">
        {/* Ambient glow accent */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#35d6c0]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header / Toggle Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#252f52]">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#35d6c0] to-[#1ea897] text-[#09131d] flex items-center justify-center font-bold shadow-lg shadow-[#35d6c0]/20 shrink-0 border-t border-white/40">
              <Unlock className="w-5 h-5 text-[#09131d]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30">
                  Required Setting
                </span>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  Account Configuration
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
                {guideConfig.accountSettingTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onNavigateToGuide}
              className="px-3.5 py-1.5 rounded-xl bg-[#0d1224] hover:bg-[#121933] border border-[#263158] text-[#35d6c0] hover:text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm active:translate-y-0.5"
            >
              <Shield className="w-3.5 h-3.5 text-[#35d6c0]" />
              <span>Safety &amp; Payment Guide</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 text-[#35d6c0]" />
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(prev => !prev)}
              className="p-1.5 rounded-xl bg-[#0d1224] hover:bg-[#121933] border border-[#263158] text-slate-300 hover:text-white transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Concise trust notice */}
        <div className="py-3 text-xs sm:text-sm text-slate-300 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#35d6c0] shrink-0" />
          <span className="text-white font-medium">{guideConfig.bottomBannerText}</span>
        </div>

        {/* Expanded Screenshot Walkthrough */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[#252f52] space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: 3 Clear Steps */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#0d1224] border border-[#252f52]">
                    <span className="w-6 h-6 rounded-full bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30 font-black text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">Open Instagram Settings</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Profile &gt; <strong>Menu (☰)</strong> &gt; <strong>Settings and privacy</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#0d1224] border border-[#252f52]">
                    <span className="w-6 h-6 rounded-full bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30 font-black text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">Select Account Privacy</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Scroll to <em>Who can see your content</em> &gt; Tap <strong>Account privacy</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#35d6c0]/10 border border-[#35d6c0]/30">
                    <span className="w-6 h-6 rounded-full bg-[#35d6c0] text-[#09131d] font-black text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#35d6c0]">Disable Private Account</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Turn toggle <strong>OFF</strong>. Profile is now public for automatic node delivery.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0d1224] border border-[#252f52] text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center space-x-1.5 text-white font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#35d6c0]" />
                    <span>Return to Private After Delivery</span>
                  </div>
                  <p className="text-slate-400">
                    Once your order is marked Completed, you can switch back to private at any time.
                  </p>
                </div>
              </div>

              {/* Right Column: Visual Screenshot Mockup */}
              <div className="lg:col-span-7">
                <SettingScreenshotCard
                  customImageUrl={guideConfig.screenshotUrl}
                  onExploreGuide={onNavigateToGuide}
                  id="bottom-setting-screenshot-card"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
