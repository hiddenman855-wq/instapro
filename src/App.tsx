/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { CustomerDashboard } from './components/CustomerDashboard';
import { OrdersList } from './components/OrdersList';
import { ServicesCatalog } from './components/ServicesCatalog';
import { AdminPanel } from './components/AdminPanel';
import { RoleGuard } from './components/RoleGuard';
import { AuthModal } from './components/AuthModal';
import { AddFundsModal } from './components/AddFundsModal';
import { SupportModal } from './components/SupportModal';
import { ApiDocsTab } from './components/ApiDocsTab';
import { WarningsAndGuideTab } from './components/WarningsAndGuideTab';
import { BottomSettingBanner } from './components/BottomSettingBanner';
import {
  Instagram,
  HelpCircle,
  HeartHandshake
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { isSuperAdmin, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>(() => {
    return isSuperAdmin ? 'admin-panel' : 'new-order';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [addFundsOptions, setAddFundsOptions] = useState<{
    initialAmount?: number;
    serviceName?: string;
    purpose?: 'wallet_deposit' | 'direct_order';
    orderId?: string;
  }>({});
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleOpenAddFunds = (options?: {
    initialAmount?: number;
    serviceName?: string;
    purpose?: 'wallet_deposit' | 'direct_order';
    orderId?: string;
  }) => {
    setAddFundsOptions(options || {});
    setIsAddFundsModalOpen(true);
  };

  // When super admin logs in, ensure admin-panel can be shown
  useEffect(() => {
    if (isSuperAdmin && currentTab === 'super-admin') {
      setCurrentTab('admin-panel');
    }
  }, [isSuperAdmin]);

  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<string | undefined>(undefined);
  const [guideNotice, setGuideNotice] = useState<string | null>(null);
  const [guideTarget, setGuideTarget] = useState<'setting' | 'payment'>('setting');

  const handleSelectServiceToOrder = (serviceId: string) => {
    setSelectedServiceForOrder(serviceId);
    setCurrentTab('new-order');
  };

  // Redirect to Warnings & Guide tab right on the screenshot
  const handleNavigateToGuideScreenshot = (
    notice?: string,
    target: 'setting' | 'payment' = 'setting'
  ) => {
    setGuideNotice(notice || 'Please check your Instagram Setting in the screenshot below.');
    setGuideTarget(target);
    setCurrentTab('guide');
  };

  return (
    <div className="min-h-screen bg-[#090d1a] text-slate-100 flex flex-col font-sans selection:bg-[#35d6c0] selection:text-[#090d1a] relative overflow-x-hidden">
      {/* Premium SaaS Ambient Glow & Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(53,214,192,0.07),rgba(23,29,53,0.3)_45%,transparent_70%)] blur-3xl" />
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(23,29,53,0.5),transparent_65%)] blur-3xl" />
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(53,214,192,0.05),transparent_65%)] blur-3xl" />
      </div>

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab !== 'guide') {
            setGuideNotice(null);
          }
          setCurrentTab(tab);
        }}
        openAuthModal={() => setIsAuthModalOpen(true)}
        openAddFundsModal={() => handleOpenAddFunds({ initialAmount: 500, purpose: 'wallet_deposit' })}
        openSupportModal={() => setIsSupportModalOpen(true)}
      />

      {/* Main Tab Content with Role Protection */}
      <main className="flex-1">
        {currentTab === 'new-order' && (
          <CustomerDashboard
            onNavigateToOrders={() => setCurrentTab('orders')}
            openAddFundsModal={handleOpenAddFunds}
            initialServiceId={selectedServiceForOrder}
            onNavigateToGuideScreenshot={handleNavigateToGuideScreenshot}
          />
        )}

        {currentTab === 'orders' && <OrdersList />}

        {currentTab === 'services' && (
          <ServicesCatalog onSelectServiceToOrder={handleSelectServiceToOrder} />
        )}

        {currentTab === 'guide' && (
          <WarningsAndGuideTab
            onNavigateToNewOrder={() => setCurrentTab('new-order')}
            openAddFundsModal={() => handleOpenAddFunds({ initialAmount: 500, purpose: 'wallet_deposit' })}
            redirectNotice={guideNotice}
            initialTarget={guideTarget}
            onClearNotice={() => setGuideNotice(null)}
          />
        )}

        {currentTab === 'api' && <ApiDocsTab />}

        {/* Single Unified Admin Panel for both Super Admin and Normal Admin */}
        {currentTab === 'admin-panel' && (
          <RoleGuard
            requiredLevel="admin"
            fallbackTab={setCurrentTab}
            openAuthModal={() => setIsAuthModalOpen(true)}
          >
            <AdminPanel />
          </RoleGuard>
        )}

        {/* Bottom Website Setting Screenshot Card (Shown at the below of the website) */}
        {currentTab !== 'guide' && currentTab !== 'admin-panel' && (
          <BottomSettingBanner
            onNavigateToGuide={() => handleNavigateToGuideScreenshot(undefined, 'setting')}
          />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(role) => {
          if (role === 'superadmin' || role === 'admin') {
            setCurrentTab('admin-panel');
          }
        }}
      />

      <AddFundsModal
        isOpen={isAddFundsModalOpen}
        onClose={() => setIsAddFundsModalOpen(false)}
        initialAmount={addFundsOptions.initialAmount}
        serviceName={addFundsOptions.serviceName}
        purpose={addFundsOptions.purpose}
        orderId={addFundsOptions.orderId}
        onDoneRedirectToWarning={handleNavigateToGuideScreenshot}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Footer without toggle buttons */}
      <footer className="border-t border-[#1e2746] bg-[#0c1020]/90 py-8 px-4 text-xs text-slate-400 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#35d6c0] to-teal-600 flex items-center justify-center text-[#090d1a] font-black">
              <Instagram className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-200">InstaGrow Platform</span>
            <span>•</span>
            <span className="text-[#35d6c0]">Verified High-Speed Fulfillment</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="hover:text-white flex items-center space-x-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#35d6c0]" />
              <span>Support Desk</span>
            </button>

            <button
              onClick={() => setCurrentTab('guide')}
              className="hover:text-white flex items-center space-x-1 transition-colors"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#35d6c0]" />
              <span>Warnings &amp; Guide</span>
            </button>

            <button
              onClick={() => setCurrentTab('services')}
              className="hover:text-white transition-colors"
            >
              Services
            </button>

            <button
              onClick={() => setCurrentTab('api')}
              className="hover:text-white transition-colors"
            >
              API
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
