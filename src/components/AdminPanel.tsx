import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GrowthOrder, GrowthService, ServiceCategory, AdminAccount, AppUser, PaymentRequest } from '../types';
import { generateUpiQrDataUrl } from '../utils/qrHelper';
import { SettingScreenshotCard } from './SettingScreenshotCard';
import {
  ShieldCheck,
  Crown,
  KeyRound,
  ShoppingBag,
  MessageSquare,
  DollarSign,
  Users,
  PlusCircle,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Power,
  Lock,
  Unlock,
  Edit2,
  Send,
  AlertCircle,
  TrendingUp,
  Share2,
  Search,
  UserCheck,
  UserMinus,
  Sparkles,
  ArrowRight,
  QrCode,
  Upload,
  CheckCircle,
  XCircle,
  ExternalLink,
  Smartphone,
  RefreshCw,
  Heart,
  Gift
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    currentUser,
    isSuperAdmin,
    orders,
    updateOrderStatus,
    tickets,
    replyToTicket,
    services,
    updateServiceRate,
    updateServiceConfig,
    addNewService,
    adminAccounts,
    allUsers,
    createNormalAdmin,
    promoteUserToAdmin,
    demoteAdminToUser,
    deleteUser,
    toggleAdminStatus,
    deleteAdminAccount,
    adjustUserBalance,
    payments,
    verifyPaymentUtr,
    rejectPaymentUtr,
    upiConfig,
    updateUpiConfig,
    guideConfig,
    updateGuideConfig
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'payments' | 'users' | 'admins' | 'queue' | 'services' | 'support' | 'warnings_guide'>(
    isSuperAdmin ? 'payments' : 'queue'
  );

  // Super Admin Guide & Warnings Settings State
  const [guideTitleInput, setGuideTitleInput] = useState(guideConfig.accountSettingTitle);
  const [guideSubtitleInput, setGuideSubtitleInput] = useState(guideConfig.accountSettingSubtitle);
  const [guidePathInput, setGuidePathInput] = useState(guideConfig.settingPath);
  const [guideInstructionInput, setGuideInstructionInput] = useState(guideConfig.instruction);
  const [guideScreenshotUrlInput, setGuideScreenshotUrlInput] = useState(guideConfig.screenshotUrl);
  const [guideBottomBannerEnabled, setGuideBottomBannerEnabled] = useState(guideConfig.bottomBannerEnabled);
  const [guideBottomBannerText, setGuideBottomBannerText] = useState(guideConfig.bottomBannerText);
  const [guideSavedMsg, setGuideSavedMsg] = useState(false);
  const [newWarningTitle, setNewWarningTitle] = useState('');
  const [newWarningDesc, setNewWarningDesc] = useState('');
  const [newWarningBadge, setNewWarningBadge] = useState('Friendly Advice');

  // Super Admin UPI Settings Form
  const [upiIdInput, setUpiIdInput] = useState(upiConfig.upiId);
  const [merchantNameInput, setMerchantNameInput] = useState(upiConfig.merchantName);
  const [upiSettingsSaved, setUpiSettingsSaved] = useState(false);
  const [previewTestAmount, setPreviewTestAmount] = useState<number>(149);
  const [previewQrUrl, setPreviewQrUrl] = useState<string>('');
  const [uploadingQr, setUploadingQr] = useState(false);

  // Payment Verification Queue Filters
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [copiedUtrId, setCopiedUtrId] = useState<string | null>(null);
  const [rejectingPaymentId, setRejectingPaymentId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Create Normal Admin Form State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminNotes, setNewAdminNotes] = useState('');
  const [showPasswordMap, setShowPasswordMap] = useState<{ [id: string]: boolean }>({});
  const [copiedAdminId, setCopiedAdminId] = useState<string | null>(null);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string | null>(null);

  // Promote User State
  const [promotingUser, setPromotingUser] = useState<AppUser | null>(null);
  const [assignedAdminPass, setAssignedAdminPass] = useState('');

  // User Filter & Search
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'user' | 'admin'>('all');

  // Ticket reply states
  const [ticketReplies, setTicketReplies] = useState<{ [id: string]: string }>({});

  // Add Service Form State
  const [showAddService, setShowAddService] = useState(false);
  const [newSrvName, setNewSrvName] = useState('');
  const [newSrvCategory, setNewSrvCategory] = useState<ServiceCategory>('followers');
  const [newSrvRate, setNewSrvRate] = useState<number>(149.00);
  const [newSrvMin, setNewSrvMin] = useState<number>(100);
  const [newSrvMax, setNewSrvMax] = useState<number>(50000);
  const [newSrvSpeed, setNewSrvSpeed] = useState('20K/Day');
  const [newSrvGuarantee, setNewSrvGuarantee] = useState('30 Days Refill');
  const [newSrvIsFree, setNewSrvIsFree] = useState(false);
  const [newSrvFixedQtyEnabled, setNewSrvFixedQtyEnabled] = useState(false);
  const [newSrvFixedQtyStr, setNewSrvFixedQtyStr] = useState('50');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<'all' | ServiceCategory>('all');

  // Service Edit State with cutable string inputs
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editRateStr, setEditRateStr] = useState<string>('149.00');
  const [editIsFree, setEditIsFree] = useState<boolean>(false);
  const [editFixedQtyEnabled, setEditFixedQtyEnabled] = useState<boolean>(false);
  const [editFixedQtyStr, setEditFixedQtyStr] = useState<string>('50');
  const [editMinStr, setEditMinStr] = useState<string>('50');
  const [editMaxStr, setEditMaxStr] = useState<string>('50000');

  // Orders Queue Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | GrowthOrder['status']>('all');

  // Generate dynamic QR preview for Super Admin
  React.useEffect(() => {
    let active = true;
    generateUpiQrDataUrl(upiIdInput, merchantNameInput, previewTestAmount, 'SuperAdmin_Preview').then(url => {
      if (active) setPreviewQrUrl(url);
    });
    return () => {
      active = false;
    };
  }, [upiIdInput, merchantNameInput, previewTestAmount]);

  // Handle Save UPI Config
  const handleSaveUpiConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiIdInput.trim()) return;

    try {
      await updateUpiConfig({
        upiId: upiIdInput.trim(),
        merchantName: merchantNameInput.trim() || 'InstaGrow Services'
      });
      setUpiSettingsSaved(true);
      setTimeout(() => setUpiSettingsSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update UPI settings');
    }
  };

  // Handle QR Image Upload
  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG/JPEG/WEBP).');
      return;
    }

    setUploadingQr(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        await updateUpiConfig({ qrImageUrl: base64 });
        setUpiSettingsSaved(true);
        setTimeout(() => setUpiSettingsSaved(false), 3000);
      } catch (err: any) {
        alert(err.message || 'Failed to save QR code');
      } finally {
        setUploadingQr(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomQr = async () => {
    if (confirm('Remove custom QR code image and fallback to dynamic exact-amount QR generation?')) {
      await updateUpiConfig({ qrImageUrl: undefined });
    }
  };

  // Payment Verification Handlers
  const handleVerifyPayment = async (paymentId: string) => {
    setActionInProgress(paymentId);
    try {
      await verifyPaymentUtr(paymentId);
      setAdminSuccessMsg(`Payment ${paymentId} verified! Balance credited to customer.`);
      setTimeout(() => setAdminSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleOpenReject = (paymentId: string) => {
    setRejectingPaymentId(paymentId);
    setRejectionReasonInput('UTR number not found in bank statement or invalid transaction.');
  };

  const handleConfirmReject = async () => {
    if (!rejectingPaymentId) return;
    setActionInProgress(rejectingPaymentId);
    try {
      await rejectPaymentUtr(rejectingPaymentId, rejectionReasonInput);
      setRejectingPaymentId(null);
      setAdminSuccessMsg('Payment marked as rejected.');
      setTimeout(() => setAdminSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Rejection failed');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtrId(utr);
    setTimeout(() => setCopiedUtrId(null), 2000);
  };

  // Handle Create Normal Admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminPassword.trim()) return;

    try {
      const created = await createNormalAdmin({
        email: newAdminEmail,
        password: newAdminPassword,
        name: newAdminName,
        notes: newAdminNotes
      });
      setAdminSuccessMsg(`Normal Admin created! Give email "${created.email}" and password to them to log in.`);
      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminName('');
      setNewAdminNotes('');
      setTimeout(() => setAdminSuccessMsg(null), 6000);
    } catch (err: any) {
      alert(err.message || 'Failed to create normal admin');
    }
  };

  // Handle Promoting existing Normal User to Normal Admin
  const handleConfirmPromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promotingUser) return;

    try {
      const created = await promoteUserToAdmin(promotingUser.uid, assignedAdminPass || undefined);
      setAdminSuccessMsg(`Promoted "${promotingUser.email}" to Normal Admin! Password: ${created.password}`);
      setPromotingUser(null);
      setAssignedAdminPass('');
      setTimeout(() => setAdminSuccessMsg(null), 6000);
    } catch (err: any) {
      alert(err.message || 'Failed to promote user');
    }
  };

  const handleCopyCredentials = (admin: AdminAccount) => {
    const credText = `InstaGrow Admin Credentials:\nEmail: ${admin.email}\nPassword: ${admin.password}\nLogin URL: ${window.location.origin}`;
    navigator.clipboard.writeText(credText);
    setCopiedAdminId(admin.id);
    setTimeout(() => setCopiedAdminId(null), 2500);
  };

  const handleSendTicketReply = (ticketId: string) => {
    const text = ticketReplies[ticketId];
    if (!text?.trim()) return;
    replyToTicket(ticketId, text);
    setTicketReplies(prev => ({ ...prev, [ticketId]: '' }));
  };

  // Handle Add Service
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrvName.trim()) return;

    const fixedQty = (newSrvFixedQtyEnabled || newSrvIsFree) ? (parseInt(newSrvFixedQtyStr, 10) || 50) : undefined;

    await addNewService({
      name: newSrvName.trim(),
      category: newSrvIsFree ? 'free' : newSrvCategory,
      ratePer1000: newSrvIsFree ? 0 : newSrvRate,
      min: fixedQty ? Math.min(newSrvMin, fixedQty) : newSrvMin,
      max: fixedQty ? Math.max(newSrvMax, fixedQty) : newSrvMax,
      speed: newSrvSpeed || (newSrvIsFree ? 'Instant 1–2 Min' : '20K/Day'),
      guarantee: newSrvGuarantee || (newSrvIsFree ? '100% Free Sample' : '30 Days Refill'),
      description: newSrvIsFree
        ? 'Complimentary trial package configured by Super Admin (₹0.00).'
        : 'Custom Instagram service configured by Super Admin.',
      active: true,
      isFree: newSrvIsFree,
      fixedQuantity: fixedQty
    });

    setShowAddService(false);
    setNewSrvName('');
    setNewSrvIsFree(false);
    setNewSrvFixedQtyEnabled(false);
  };

  const handleStartEditService = (srv: GrowthService) => {
    setEditingServiceId(srv.id);
    setEditRateStr(srv.ratePer1000.toString());
    setEditIsFree(Boolean(srv.isFree || srv.ratePer1000 === 0));
    setEditFixedQtyEnabled(Boolean(srv.fixedQuantity || srv.isFree));
    setEditFixedQtyStr(String(srv.fixedQuantity || (srv.isFree ? 50 : 100)));
    setEditMinStr(String(srv.min));
    setEditMaxStr(String(srv.max));
  };

  const handleSaveServiceConfig = async (srvId: string) => {
    const rate = editIsFree ? 0 : parseFloat(editRateStr) || 0;
    const fixedQty = (editFixedQtyEnabled || editIsFree) ? (parseInt(editFixedQtyStr, 10) || 50) : undefined;
    const min = parseInt(editMinStr, 10) || 10;
    const max = parseInt(editMaxStr, 10) || 50000;

    await updateServiceConfig(srvId, {
      ratePer1000: rate,
      isFree: editIsFree,
      category: editIsFree ? 'free' : undefined,
      fixedQuantity: fixedQty,
      min: fixedQty ? Math.min(min, fixedQty) : min,
      max: fixedQty ? Math.max(max, fixedQty) : max,
    });
    setEditingServiceId(null);
  };

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');
  const openTickets = tickets.filter(t => t.status === 'open');

  // Filtered orders for Admin Queue
  const filteredOrders = orders.filter(order => {
    if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.target.toLowerCase().includes(q) ||
        order.serviceName.toLowerCase().includes(q) ||
        order.userEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered payments for Super Admin
  const filteredPayments = payments.filter(p => {
    if (paymentStatusFilter !== 'all' && p.status !== paymentStatusFilter) return false;
    if (paymentSearch.trim()) {
      const q = paymentSearch.toLowerCase();
      return (
        p.utrId.toLowerCase().includes(q) ||
        p.userEmail.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.amount.toString().includes(q)
      );
    }
    return true;
  });

  // Filtered users for Super Admin
  const filteredUsers = allUsers.filter(u => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      return (
        u.email.toLowerCase().includes(q) ||
        (u.displayName && u.displayName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className={`rounded-3xl p-6 border shadow-xl relative overflow-hidden ${
        isSuperAdmin
          ? 'bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-600/15 border-amber-500/30'
          : 'bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-purple-950/30 border-indigo-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${
              isSuperAdmin
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
            }`}>
              {isSuperAdmin ? <Crown className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-white">
                  {isSuperAdmin ? 'Super Admin Command Workspace' : 'Admin Operations Desk'}
                </h1>
                <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded border ${
                  isSuperAdmin
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}>
                  {isSuperAdmin ? 'Master Super Admin' : 'Normal Admin'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Authenticated: <strong className={isSuperAdmin ? 'text-amber-300' : 'text-indigo-300'}>
                  {currentUser?.email}
                </strong>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {isSuperAdmin && (
              <div className="bg-zinc-900/90 px-3.5 py-2 rounded-xl border border-amber-500/30 shadow-md">
                <span className="text-amber-300/80 block text-[10px] uppercase font-bold">Pending UPI UTRs</span>
                <span className="text-sm font-black text-amber-300">{pendingPayments.length} to verify</span>
              </div>
            )}
            <div className="bg-zinc-900/80 px-3 py-2 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Total Users</span>
              <span className="text-sm font-black text-white">{allUsers.length}</span>
            </div>
            <div className="bg-zinc-900/80 px-3 py-2 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Orders Queue</span>
              <span className="text-sm font-black text-emerald-400">{pendingOrders.length} pending</span>
            </div>
            <div className="bg-zinc-900/80 px-3 py-2 rounded-xl border border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Open Tickets</span>
              <span className="text-sm font-black text-rose-400">{openTickets.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Alert Notification */}
      {adminSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{adminSuccessMsg}</span>
        </div>
      )}

      {/* Unified Tab Navigation */}
      <div className="flex overflow-x-auto space-x-2 border-b border-zinc-800 pb-2 no-scrollbar">
        {/* TAB 1: Super Admin Only - UPI QR & Payments Verification */}
        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors whitespace-nowrap ${
              activeTab === 'payments'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-amber-300 hover:text-white hover:bg-amber-950/40 border border-amber-500/30'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>UPI Payments &amp; UTR Verification</span>
            {pendingPayments.length > 0 && (
              <span className="bg-red-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-black animate-pulse">
                {pendingPayments.length}
              </span>
            )}
            <span className="text-[10px] bg-black text-amber-300 px-1 py-0.5 rounded font-black">
              SUPER
            </span>
          </button>
        )}

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-amber-300 hover:text-white hover:bg-amber-950/40 border border-amber-500/30'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Users &amp; Roles ({allUsers.length})</span>
            <span className="text-[10px] bg-black text-amber-300 px-1.5 py-0.5 rounded font-black">
              SUPER
            </span>
          </button>
        )}

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('warnings_guide')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors whitespace-nowrap ${
              activeTab === 'warnings_guide'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-amber-300 hover:text-white hover:bg-amber-950/40 border border-amber-500/30'
            }`}
          >
            <Unlock className="w-4 h-4 text-amber-400" />
            <span>Setting Screenshot &amp; Warnings</span>
            <span className="text-[10px] bg-black text-amber-300 px-1.5 py-0.5 rounded font-black">
              SUPER
            </span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors whitespace-nowrap ${
            activeTab === 'admins'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Staff Admin Passwords ({adminAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors whitespace-nowrap ${
            activeTab === 'queue'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders Queue ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors whitespace-nowrap ${
            activeTab === 'support'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Support Desk ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors whitespace-nowrap ${
            activeTab === 'services'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Services &amp; Pricing (INR ₹)</span>
        </button>
      </div>

      {/* =========================================================================
          TAB: UPI PAYMENTS & UTR VERIFICATION (SUPER ADMIN ONLY)
         ========================================================================= */}
      {activeTab === 'payments' && isSuperAdmin && (
        <div className="space-y-6">
          {/* Top UPI QR Settings Card for Super Admin */}
          <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-base font-black text-white flex items-center space-x-2">
                  <QrCode className="w-5 h-5 text-amber-400" />
                  <span>Super Admin UPI &amp; QR Code Configuration</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Set your receiving UPI ID and optionally upload a custom QR code. The app automatically creates a dynamic QR code for the exact INR service price!
                </p>
              </div>

              {upiSettingsSaved && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>UPI Settings Saved!</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Inputs & Upload */}
              <form onSubmit={handleSaveUpiConfig} className="lg:col-span-7 space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                    Super Admin UPI ID (VPA) *
                  </label>
                  <input
                    type="text"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    placeholder="e.g. hiddenman855@okaxis, instagrow@okhdfcbank"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    All customer payments and QR codes will route directly to this UPI address.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                    Merchant / Business Name on UPI *
                  </label>
                  <input
                    type="text"
                    value={merchantNameInput}
                    onChange={(e) => setMerchantNameInput(e.target.value)}
                    placeholder="e.g. InstaGrow Services"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {/* Upload QR Image */}
                <div className="pt-2 border-t border-zinc-800/80">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                    Upload Custom Super Admin QR Code Image (Optional)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center space-x-2 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>{uploadingQr ? 'Uploading...' : 'Choose QR Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleQrImageUpload}
                        className="hidden"
                      />
                    </label>

                    {upiConfig.qrImageUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveCustomQr}
                        className="px-3 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/40 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Custom QR</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1.5">
                    If uploaded, customers can view your merchant QR code in addition to the dynamic exact-amount QR code.
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save UPI Details</span>
                  </button>
                </div>
              </form>

              {/* Right: Live Preview of QR Generator */}
              <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-center space-y-3">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Customer Live QR Preview
                </span>

                <div className="bg-white p-2.5 rounded-xl inline-block mx-auto shadow-md">
                  {previewQrUrl ? (
                    <img src={previewQrUrl} alt="Preview QR" className="w-36 h-36 object-contain" />
                  ) : (
                    <div className="w-36 h-36 flex items-center justify-center text-zinc-400 text-xs">
                      Loading...
                    </div>
                  )}
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-mono text-zinc-300 font-bold">{upiIdInput || 'instagrow@okhdfcbank'}</p>
                  <p className="text-zinc-400 text-[11px]">
                    Exact Amount: <strong className="text-emerald-400">₹{previewTestAmount}</strong> (Scannable on GPay, PhonePe, Paytm)
                  </p>
                </div>

                {upiConfig.qrImageUrl && (
                  <div className="pt-2 border-t border-zinc-900 text-left flex items-center space-x-2">
                    <img src={upiConfig.qrImageUrl} alt="Custom QR" className="w-8 h-8 rounded border object-contain bg-white" />
                    <span className="text-[11px] text-emerald-400 font-bold">Custom QR active in customer modal</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Incoming Payments & UTR Verification Queue */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Incoming UPI Payments &amp; UTR Verification Queue</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Verify the customer's 12-digit UTR against your bank/UPI app statement. Click "Verify &amp; Credit" to automatically deposit the funds into their wallet.
                </p>
              </div>

              {/* Status Filters & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    placeholder="Search UTR, email, or amount..."
                    className="bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center bg-zinc-950 border border-zinc-800 p-1 rounded-xl">
                  {(['all', 'pending', 'verified', 'rejected'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setPaymentStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                        paymentStatusFilter === st
                          ? 'bg-amber-500 text-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st} {st === 'pending' && pendingPayments.length > 0 && `(${pendingPayments.length})`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payments Table / List */}
            {filteredPayments.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs bg-zinc-950/60 rounded-2xl border border-zinc-800">
                No payment requests found matching the selected filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPayments.map(p => (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      p.status === 'pending'
                        ? 'bg-zinc-950/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                        : p.status === 'verified'
                        ? 'bg-zinc-950/60 border-zinc-800'
                        : 'bg-zinc-950/40 border-zinc-900 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Payment Info */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                            {p.id}
                          </span>
                          <span className="text-base font-black text-emerald-400">
                            ₹{p.amount.toFixed(2)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              p.status === 'verified'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : p.status === 'rejected'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                            }`}
                          >
                            {p.status === 'verified'
                              ? '✓ Verified & Credited'
                              : p.status === 'rejected'
                              ? '✗ Rejected'
                              : '⏳ Pending Verification'}
                          </span>
                          <span className="text-[11px] text-zinc-500">
                            {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Customer & UTR Details */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300 pt-1">
                          <div>
                            <span className="text-zinc-500">Customer: </span>
                            <strong className="text-white">{p.userEmail}</strong> ({p.userName})
                          </div>
                          <span>•</span>
                          <div className="flex items-center space-x-1.5 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                            <span className="text-zinc-500 text-[11px]">12-Digit UTR:</span>
                            <span className="font-mono font-bold text-amber-300 text-xs">{p.utrId}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyUtr(p.utrId)}
                              className="text-zinc-400 hover:text-white p-0.5"
                              title="Copy UTR ID"
                            >
                              {copiedUtrId === p.utrId ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <span>•</span>
                          <div>
                            <span className="text-zinc-500">Purpose: </span>
                            <span className="text-zinc-400">
                              {p.purpose === 'direct_order' ? `Direct Order (${p.orderId || 'Direct'})` : 'Wallet Deposit'}
                            </span>
                          </div>
                        </div>

                        {p.status === 'verified' && p.verifiedAt && (
                          <p className="text-[11px] text-emerald-400/90 pt-1">
                            Credited by {p.verifiedBy} on {new Date(p.verifiedAt).toLocaleString()}
                          </p>
                        )}

                        {p.status === 'rejected' && (
                          <p className="text-[11px] text-rose-400/90 pt-1">
                            Rejection Reason: {p.rejectionReason}
                          </p>
                        )}
                      </div>

                      {/* Right: Actions for Super Admin */}
                      {p.status === 'pending' && (
                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            type="button"
                            disabled={actionInProgress === p.id}
                            onClick={() => handleVerifyPayment(p.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all"
                          >
                            <CheckCircle className="w-4 h-4 text-black" />
                            <span>Verify &amp; Credit ₹{p.amount.toFixed(0)}</span>
                          </button>

                          <button
                            type="button"
                            disabled={actionInProgress === p.id}
                            onClick={() => handleOpenReject(p.id)}
                            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-300 hover:text-red-300 font-bold text-xs flex items-center space-x-1 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rejection Reason Modal */}
          {rejectingPaymentId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
                <div className="flex items-center space-x-2 text-rose-400">
                  <XCircle className="w-5 h-5" />
                  <h3 className="text-base font-black text-white">Reject UPI Payment</h3>
                </div>

                <p className="text-xs text-zinc-400">
                  Specify the reason for rejecting payment reference{' '}
                  <strong className="text-white font-mono">{rejectingPaymentId}</strong>. The customer will see this message.
                </p>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Rejection Reason
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionReasonInput}
                    onChange={(e) => setRejectionReasonInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectingPaymentId(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReject}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB: ALL USERS & ROLES (SUPER ADMIN ONLY)
         ========================================================================= */}
      {activeTab === 'users' && isSuperAdmin && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>All Registered Platform Users</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Super Admin can view all users, manage balances in INR (₹), and promote normal users to normal admins.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user email or name..."
                  className="bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                {(['all', 'user', 'admin'] as const).map(rf => (
                  <button
                    key={rf}
                    onClick={() => setUserRoleFilter(rf)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                      userRoleFilter === rf ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {rf === 'all' ? 'All Roles' : rf === 'user' ? 'Customers' : 'Admins'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User List Table */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="divide-y divide-zinc-800">
              {filteredUsers.map(user => {
                const isSuper = user.email.toLowerCase() === 'hiddenman855@gmail.com' || user.role === 'superadmin';
                return (
                  <div key={user.uid} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-800/20 transition-colors">
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                        isSuper
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : user.role === 'admin'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}>
                        {user.displayName?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-white">{user.displayName || 'Unnamed User'}</span>
                          <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded border ${
                            isSuper
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : user.role === 'admin'
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono">{user.email}</p>
                        <p className="text-[11px] text-zinc-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Balance & Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 text-right">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block">Balance</span>
                        <span className="text-sm font-black text-emerald-400">₹{user.balance.toFixed(2)}</span>
                      </div>

                      {/* Balance adjustment buttons */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => adjustUserBalance(user.uid, 100)}
                          className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-zinc-300 text-[11px] font-bold transition-colors"
                          title="Add ₹100 funds"
                        >
                          +₹100
                        </button>
                        <button
                          onClick={() => adjustUserBalance(user.uid, 500)}
                          className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-zinc-300 text-[11px] font-bold transition-colors"
                          title="Add ₹500 funds"
                        >
                          +₹500
                        </button>
                      </div>

                      {/* Role Promotion / Demotion Actions */}
                      {!isSuper && (
                        <div className="flex items-center space-x-2">
                          {user.role === 'user' ? (
                            <button
                              onClick={() => {
                                setPromotingUser(user);
                                setAssignedAdminPass(`Admin_${Math.floor(1000 + Math.random() * 9000)}`);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Promote to Admin</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (confirm(`Demote ${user.email} back to Normal User?`)) {
                                  demoteAdminToUser(user.uid);
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex items-center space-x-1.5 transition-colors"
                            >
                              <UserMinus className="w-3.5 h-3.5" />
                              <span>Demote to User</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`Delete user ${user.email}?`)) {
                                deleteUser(user.uid);
                              }
                            }}
                            className="p-1.5 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal for Promoting User to Admin with Password */}
          {promotingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-black text-white">Promote to Normal Admin</h3>
                </div>

                <p className="text-xs text-zinc-400">
                  Promoting <strong className="text-white">{promotingUser.email}</strong> to Normal Admin. Assign their admin login password below:
                </p>

                <form onSubmit={handleConfirmPromote} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                      Admin Password for this user *
                    </label>
                    <input
                      type="text"
                      value={assignedAdminPass}
                      onChange={(e) => setAssignedAdminPass(e.target.value)}
                      placeholder="e.g. AdminPass123"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      The user will use their email and this password to log in as Normal Admin.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPromotingUser(null)}
                      className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20"
                    >
                      Confirm Promotion
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB: NORMAL ADMIN ACCOUNTS / PASSWORDS
         ========================================================================= */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          {/* Create New Normal Admin Form (Super Admin Only) */}
          {isSuperAdmin && (
            <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">
                  Create Normal Admin Email &amp; Password
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                Super Admin can provision custom credentials for normal admin staff. You can copy and send them their login credentials directly.
              </p>

              <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1">Admin Email *</label>
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="support_admin@instagrow.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1">Admin Password *</label>
                  <input
                    type="text"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="CustomAdminPass_2026"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1">Staff Name</label>
                  <input
                    type="text"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="e.g. Alex Support Lead"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create &amp; Generate Credentials</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of Normal Admins */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white">Active Normal Admin Accounts</h3>
                <p className="text-xs text-zinc-400">Normal admins can manage order queues and answer support tickets.</p>
              </div>
              <span className="text-xs text-zinc-500">{adminAccounts.length} accounts</span>
            </div>

            <div className="space-y-3">
              {adminAccounts.map(admin => {
                const isPassVisible = showPasswordMap[admin.id];
                return (
                  <div
                    key={admin.id}
                    className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white">{admin.name}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          admin.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {admin.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 font-mono">{admin.email}</p>

                      {/* Password reveal & copy button */}
                      {isSuperAdmin && (
                        <div className="flex items-center space-x-2 pt-1">
                          <span className="text-[11px] text-zinc-500">Password:</span>
                          <span className="font-mono text-xs text-amber-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                            {isPassVisible ? admin.password : '••••••••••••'}
                          </span>
                          <button
                            onClick={() => setShowPasswordMap({ ...showPasswordMap, [admin.id]: !isPassVisible })}
                            className="text-zinc-400 hover:text-white p-1"
                          >
                            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleCopyCredentials(admin)}
                            className="px-2 py-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold flex items-center space-x-1"
                            title="Copy Email & Password to give to Normal Admin"
                          >
                            {copiedAdminId === admin.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3 h-3" />
                                <span>Copy to Give to Admin</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Status Toggle & Delete (Super Admin only) */}
                    {isSuperAdmin && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleAdminStatus(admin.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                            admin.status === 'active'
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{admin.status === 'active' ? 'Revoke Access' : 'Reactivate'}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete admin access for ${admin.email}?`)) {
                              deleteAdminAccount(admin.id);
                            }
                          }}
                          className="p-1.5 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Delete Admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: ORDER QUEUE & FULFILLMENT
         ========================================================================= */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-white flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-rose-400" />
                <span>All Orders Fulfillment Queue</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  {filteredOrders.length} of {orders.length} orders
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Update order status and track fulfillment in Indian Rupees (₹)</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search box */}
              <div className="relative">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search target, ID, email..."
                  className="bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors w-44 sm:w-56"
                />
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
              </div>

              {/* Status filter buttons */}
              <div className="flex items-center bg-zinc-950 border border-zinc-800 p-1 rounded-xl overflow-x-auto">
                {(['all', 'in_progress', 'completed', 'processing', 'pending', 'canceled'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                      orderStatusFilter === st
                        ? 'bg-rose-500 text-white font-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'All' : st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl divide-y divide-zinc-800">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-sm font-bold text-white">No orders matching the current criteria</p>
                <p className="text-xs text-zinc-400">
                  {orderSearch || orderStatusFilter !== 'all'
                    ? 'Try clearing the search or status filter to see all orders.'
                    : 'No orders have been recorded in the platform.'}
                </p>
                {(orderSearch || orderStatusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setOrderSearch('');
                      setOrderStatusFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold"
                  >
                    Reset Order Filters
                  </button>
                )}
              </div>
            ) : (
              filteredOrders.map(order => {
                const delivered = order.quantity - order.remains;
                const percent = Math.min(100, Math.max(0, Math.round((delivered / order.quantity) * 100)));

                return (
                  <div key={order.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-zinc-800/20 transition-colors">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                          {order.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-black' :
                          order.status === 'in_progress' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                          order.status === 'processing' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-zinc-400">{order.userEmail}</span>
                        <span className="text-[11px] text-zinc-500">
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{order.serviceName}</h4>
                      <p className="text-xs text-rose-300 font-mono flex flex-wrap items-center gap-2">
                        <span className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 text-zinc-200">
                          {order.target}
                        </span>
                        <span>•</span>
                        <span>Quantity: <strong className="text-white">{order.quantity.toLocaleString()}</strong></span>
                        <span>•</span>
                        <span>Charge: <strong className="text-emerald-400">{order.charge === 0 ? '₹0.00 (FREE)' : `₹${order.charge.toFixed(2)}`}</strong></span>
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Progress bar */}
                      <div className="w-48 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-500">Progress</span>
                          <span className="font-bold text-zinc-300">{percent}% ({delivered.toLocaleString()}/{order.quantity.toLocaleString()})</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-zinc-500">
                          <span>Start: {order.startCount}</span>
                          <span>Remains: {order.remains.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Status select */}
                      <div className="flex items-center space-x-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as GrowthOrder['status'])}
                          className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-rose-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: SUPPORT DESK
         ========================================================================= */}
      {activeTab === 'support' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-black text-white">Customer Support Inquiry Tickets</h2>
            <p className="text-xs text-zinc-400">Normal Admins and Super Admin can directly reply to tickets</p>
          </div>

          <div className="space-y-3">
            {tickets.map(ticket => (
              <div key={ticket.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{ticket.subject}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ticket.status === 'open' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">{ticket.userEmail}</span>
                </div>

                <p className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                  {ticket.message}
                </p>

                {ticket.reply && (
                  <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200">
                    <strong>Current Answer:</strong> {ticket.reply}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type admin response to customer..."
                    value={ticketReplies[ticket.id] || ''}
                    onChange={(e) => setTicketReplies({ ...ticketReplies, [ticket.id]: e.target.value })}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  <button
                    onClick={() => handleSendTicketReply(ticket.id)}
                    className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: SERVICES & PRICING (INR ₹)
         ========================================================================= */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-white">Instagram Services Catalog (INR ₹)</h2>
              <p className="text-xs text-zinc-400">
                {isSuperAdmin
                  ? 'Super Admin Mode: Edit rates (₹/1k), toggle availability, or create new services.'
                  : 'Normal Admin Mode: View service packages and fulfillment speeds.'}
              </p>
            </div>
            {isSuperAdmin && (
              <button
                onClick={() => {
                  setShowAddService(!showAddService);
                  if (!showAddService) {
                    setNewSrvIsFree(false);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-b from-[#35d6c0] to-[#1ea897] hover:brightness-105 text-[#09131d] font-black text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-[#35d6c0]/20 border-t border-white/40 active:translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4 text-[#09131d]" />
                <span>Add New Service</span>
              </button>
            )}
          </div>

          {showAddService && isSuperAdmin && (
            <div className="bg-[#171d35] border border-[#35d6c0]/40 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#35d6c0]" />
                  <span>Create New Instagram Service Package</span>
                </h3>

                {/* Quick 100% Free Service Toggle */}
                <label className="flex items-center space-x-2 bg-[#0d1224] border border-[#252f52] px-3 py-1.5 rounded-xl cursor-pointer hover:border-[#35d6c0]/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={newSrvIsFree}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setNewSrvIsFree(checked);
                      if (checked) {
                        setNewSrvRate(0);
                        setNewSrvCategory('free');
                        setNewSrvMin(10);
                        setNewSrvMax(200);
                        setNewSrvGuarantee('100% Free Trial');
                        setNewSrvSpeed('Instant (0–3 Min)');
                      } else {
                        setNewSrvRate(149);
                        setNewSrvCategory('followers');
                      }
                    }}
                    className="accent-[#35d6c0] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#35d6c0] flex items-center space-x-1">
                    <Gift className="w-3.5 h-3.5" />
                    <span>Make this a Free Trial Service (₹0.00)</span>
                  </span>
                </label>
              </div>

              <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Service Title</label>
                  <input
                    type="text"
                    value={newSrvName}
                    onChange={(e) => setNewSrvName(e.target.value)}
                    placeholder={newSrvIsFree ? 'Instagram Followers [Free Trial • 50 Fast Profiles]' : 'Instagram Reels Views [Viral Exploration]'}
                    className="w-full bg-[#0d1224] border border-[#252f52] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#35d6c0]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={newSrvCategory}
                    onChange={(e) => setNewSrvCategory(e.target.value as ServiceCategory)}
                    className="w-full bg-[#0d1224] border border-[#252f52] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#35d6c0]"
                  >
                    <option value="free">🎁 Free Trial / Sample</option>
                    <option value="followers">Followers</option>
                    <option value="likes">Likes</option>
                    <option value="reels">Reels</option>
                    <option value="views">Views</option>
                    <option value="comments">Comments</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Rate per 1,000 (₹) {newSrvIsFree && <span className="text-[#35d6c0] font-black">— FREE (₹0.00)</span>}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newSrvRate}
                    disabled={newSrvIsFree}
                    onChange={(e) => setNewSrvRate(Number(e.target.value))}
                    className="w-full bg-[#0d1224] border border-[#252f52] rounded-xl px-3 py-2 text-xs text-white disabled:opacity-50 focus:outline-none focus:border-[#35d6c0]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Min / Max Quantity</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newSrvMin}
                      onChange={(e) => setNewSrvMin(Number(e.target.value))}
                      placeholder="Min"
                      className="w-1/2 bg-[#0d1224] border border-[#252f52] rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-[#35d6c0]"
                    />
                    <input
                      type="number"
                      value={newSrvMax}
                      onChange={(e) => setNewSrvMax(Number(e.target.value))}
                      placeholder="Max"
                      className="w-1/2 bg-[#0d1224] border border-[#252f52] rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-[#35d6c0]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Speed</label>
                  <input
                    type="text"
                    value={newSrvSpeed}
                    onChange={(e) => setNewSrvSpeed(e.target.value)}
                    placeholder="e.g. Instant 1–2 Min"
                    className="w-full bg-[#0d1224] border border-[#252f52] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#35d6c0]"
                  />
                </div>
                <div className="md:col-span-3 flex justify-end gap-2 pt-2 border-t border-[#20294d]">
                  <button
                    type="button"
                    onClick={() => setShowAddService(false)}
                    className="px-4 py-2 rounded-xl bg-[#0d1224] hover:bg-[#131a33] text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-b from-[#35d6c0] to-[#1ea897] text-[#09131d] text-xs font-black shadow-lg shadow-[#35d6c0]/20 border-t border-white/40 active:translate-y-0.5"
                  >
                    {newSrvIsFree ? 'Save Free Trial Service' : 'Save Paid Service'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Category Filter Pills in Admin Services List */}
          <div className="flex items-center flex-wrap gap-2">
            {(['all', 'free', 'followers', 'likes', 'reels', 'views', 'comments'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setAdminCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  adminCategoryFilter === cat
                    ? 'bg-[#35d6c0] text-[#09131d] font-black shadow-sm border-t border-white/40'
                    : 'bg-[#171d35] border border-[#252f52] text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'free' ? '🎁 Free Services' : cat}
              </button>
            ))}
          </div>

          <div className="bg-[#171d35] border border-[#263158] rounded-3xl overflow-hidden shadow-2xl divide-y divide-[#202a4d]">
            {services
              .filter(s => adminCategoryFilter === 'all' || s.category === adminCategoryFilter || (adminCategoryFilter === 'free' && (s.isFree || s.ratePer1000 === 0)))
              .map(srv => {
                const isFree = Boolean(srv.isFree || srv.ratePer1000 === 0 || srv.category === 'free');
                const isEditing = editingServiceId === srv.id;

                if (isEditing && isSuperAdmin) {
                  return (
                    <div key={srv.id} className="p-5 bg-[#12172b] border-2 border-[#35d6c0] rounded-2xl space-y-4 my-2 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-[#20294d] pb-3">
                        <div>
                          <span className="text-[10px] font-black uppercase text-[#35d6c0] tracking-wider block">
                            Service Pricing &amp; Free Package Settings
                          </span>
                          <h4 className="text-sm font-bold text-white">{srv.name}</h4>
                        </div>
                        <span className="text-xs font-mono text-slate-400">ID: {srv.id}</span>
                      </div>

                      {/* Price Input - CUTABLE */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">
                            Price / Rate per 1,000 (INR ₹)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              disabled={editIsFree}
                              value={editRateStr}
                              onChange={(e) => setEditRateStr(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-[#0d1224] border border-[#252f52] rounded-xl pl-7 pr-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-[#35d6c0] disabled:opacity-40"
                            />
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {editIsFree ? 'Free trial mode active (₹0.00)' : 'Cutable number input for live pricing'}
                          </p>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">
                            Minimum Order Quantity
                          </label>
                          <input
                            type="number"
                            value={editMinStr}
                            onChange={(e) => setEditMinStr(e.target.value)}
                            placeholder="Min"
                            className="w-full bg-[#0d1224] border border-[#252f52] rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-[#35d6c0]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">
                            Maximum Order Quantity
                          </label>
                          <input
                            type="number"
                            value={editMaxStr}
                            onChange={(e) => setEditMaxStr(e.target.value)}
                            placeholder="Max"
                            className="w-full bg-[#0d1224] border border-[#252f52] rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-[#35d6c0]"
                          />
                        </div>
                      </div>

                      {/* ✨ AT THE DOWN: OPTION FOR FREE & FIXED QUANTITY ✨ */}
                      <div className="pt-3 border-t border-[#20294d] bg-[#0d1224] p-4 rounded-xl border border-[#252f52] space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="flex items-center space-x-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editIsFree}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setEditIsFree(checked);
                                if (checked) {
                                  setEditRateStr('0');
                                  setEditFixedQtyEnabled(true);
                                  if (!editFixedQtyStr || editFixedQtyStr === '0') {
                                    setEditFixedQtyStr('50');
                                  }
                                }
                              }}
                              className="w-4 h-4 accent-[#35d6c0] rounded cursor-pointer"
                            />
                            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                              <Gift className="w-4 h-4 text-[#35d6c0]" />
                              <span>Make this service 100% FREE (₹0.00 Trial)</span>
                            </span>
                          </label>

                          {editIsFree && (
                            <span className="text-[10px] font-black uppercase text-[#35d6c0] bg-[#35d6c0]/15 px-2.5 py-0.5 rounded-full border border-[#35d6c0]/30">
                              Free Promotion
                            </span>
                          )}
                        </div>

                        {/* Fixed Quantity: "there they cant add any number of quantity which they want, they just can order the quantity I can set from before" */}
                        <div className="pt-2 border-t border-[#1e2646] space-y-2">
                          <label className="flex items-center space-x-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editFixedQtyEnabled || editIsFree}
                              onChange={(e) => {
                                if (editIsFree) return;
                                setEditFixedQtyEnabled(e.target.checked);
                              }}
                              disabled={editIsFree}
                              className="w-4 h-4 accent-[#35d6c0] rounded cursor-pointer"
                            />
                            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                              <Lock className="w-3.5 h-3.5 text-[#35d6c0]" />
                              <span>Lock Order Quantity (Users cannot add arbitrary custom quantities)</span>
                            </span>
                          </label>

                          {(editFixedQtyEnabled || editIsFree) && (
                            <div className="bg-[#141a33] p-3 rounded-xl border border-[#35d6c0]/30 space-y-1.5">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="text-[11px] font-bold text-[#35d6c0] uppercase tracking-wider">
                                  Preset Fixed Quantity Allowed:
                                </label>
                                <div className="relative w-44">
                                  <input
                                    type="number"
                                    min="1"
                                    value={editFixedQtyStr}
                                    onChange={(e) => setEditFixedQtyStr(e.target.value)}
                                    placeholder="e.g. 50"
                                    className="w-full bg-[#0d1224] border border-[#35d6c0] rounded-xl px-3 py-1.5 text-sm font-black text-white focus:outline-none"
                                  />
                                  <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold uppercase">
                                    Units
                                  </span>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-300">
                                Users on the order panel <strong>will only be able to order this exact quantity</strong> ({editFixedQtyStr || 50} units). The custom quantity input will be locked to prevent users from adding any number they want.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Save & Cancel Buttons */}
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingServiceId(null)}
                          className="px-4 py-2 rounded-xl bg-[#0d1224] hover:bg-[#1a2240] text-slate-300 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveServiceConfig(srv.id)}
                          className="px-5 py-2 rounded-xl bg-gradient-to-b from-[#35d6c0] to-[#1ea897] text-[#09131d] text-xs font-black shadow-lg shadow-[#35d6c0]/25 border-t border-white/50 active:translate-y-0.5"
                        >
                          Save Service Settings
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={srv.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#1a213d] transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                          isFree
                            ? 'bg-[#35d6c0]/15 text-[#35d6c0] border border-[#35d6c0]/30 font-black'
                            : 'bg-[#0d1224] text-slate-300 border border-[#252f52]'
                        }`}>
                          {isFree ? '🎁 FREE TRIAL' : srv.category}
                        </span>
                        {srv.fixedQuantity && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>Fixed: {srv.fixedQuantity.toLocaleString()} Qty</span>
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          srv.active ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}>
                          {srv.active ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                        <span>{srv.name}</span>
                        {isFree && <span className="text-[10px] text-[#35d6c0] font-black">(₹0.00)</span>}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {srv.speed} • Min: {srv.min.toLocaleString()} • Max: {srv.max.toLocaleString()}
                        {srv.fixedQuantity && <strong className="text-[#35d6c0]"> • Fixed Order Qty: {srv.fixedQuantity.toLocaleString()}</strong>}
                      </p>
                    </div>

                    {isSuperAdmin ? (
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase block font-bold">Rate/1K</span>
                          <span className={`text-base font-black ${isFree ? 'text-[#35d6c0]' : 'text-white'}`}>
                            {isFree ? '₹0.00 (FREE)' : `₹${srv.ratePer1000.toFixed(2)}`}
                          </span>
                        </div>
                        <button
                          onClick={() => handleStartEditService(srv)}
                          className="px-3 py-1.5 rounded-xl bg-[#0d1224] hover:bg-[#141b33] border border-[#252f52] hover:border-[#35d6c0] text-[#35d6c0] text-xs font-bold flex items-center space-x-1.5 transition-colors"
                          title="Change Price & Free / Fixed Quantity Settings"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Pricing &amp; Free</span>
                        </button>
                        <button
                          onClick={() => updateServiceRate(srv.id, srv.ratePer1000, !srv.active)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            srv.active ? 'bg-[#0d1224] text-slate-400 border border-[#252f52]' : 'bg-[#35d6c0]/20 text-[#35d6c0] border border-[#35d6c0]/40'
                          }`}
                        >
                          {srv.active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">Rate/1K</span>
                        <span className={`text-base font-black ${isFree ? 'text-[#35d6c0]' : 'text-white'}`}>
                          {isFree ? '₹0.00 (FREE)' : `₹${srv.ratePer1000.toFixed(2)}`}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: SETTING SCREENSHOT & SWEET WARNINGS (SUPER ADMIN ONLY)
         ========================================================================= */}
      {activeTab === 'warnings_guide' && isSuperAdmin && (
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-zinc-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Super Admin Exclusive Configuration</span>
            </div>
            <h2 className="text-xl font-black text-white">
              Instagram Setting Screenshot &amp; Sweet Warnings Manager
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Control the setting notification and visual screenshot shown at the bottom of the website and in the dedicated Warnings &amp; Payment Guide category.
            </p>
          </div>

          {guideSavedMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Setting screenshot and sweet warnings saved and live on website!</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Setting & Bottom Banner Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: 1 Crucial Setting & Screenshot Setup */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-sm font-black text-white flex items-center space-x-2">
                    <Unlock className="w-4 h-4 text-rose-400" />
                    <span>1. The Mandatory Instagram Setting Configuration</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    This setting instructs users to make their Instagram account Public before ordering.
                  </p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await updateGuideConfig({
                      accountSettingTitle: guideTitleInput.trim() || '1 Mandatory Instagram Setting Before Ordering',
                      accountSettingSubtitle: guideSubtitleInput.trim() || 'Ensure your Instagram Account is set to PUBLIC',
                      settingPath: guidePathInput.trim(),
                      instruction: guideInstructionInput.trim(),
                      screenshotUrl: guideScreenshotUrlInput.trim(),
                      bottomBannerEnabled: guideBottomBannerEnabled,
                      bottomBannerText: guideBottomBannerText.trim()
                    });
                    setGuideSavedMsg(true);
                    setTimeout(() => setGuideSavedMsg(false), 3000);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                      Setting Card Title
                    </label>
                    <input
                      type="text"
                      value={guideTitleInput}
                      onChange={(e) => setGuideTitleInput(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                      Subtitle / Action Requirement
                    </label>
                    <input
                      type="text"
                      value={guideSubtitleInput}
                      onChange={(e) => setGuideSubtitleInput(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                      Settings Path Navigation Guide
                    </label>
                    <input
                      type="text"
                      value={guidePathInput}
                      onChange={(e) => setGuidePathInput(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                      Why This Setting is Required (Detailed Note)
                    </label>
                    <textarea
                      rows={3}
                      value={guideInstructionInput}
                      onChange={(e) => setGuideInstructionInput(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Screenshot Selection / Upload */}
                  <div className="pt-2 border-t border-zinc-800">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1.5">
                      Setting Screenshot Image (Shown at Bottom of Site)
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste direct image URL or leave empty for interactive mobile mockup"
                        value={guideScreenshotUrlInput}
                        onChange={(e) => setGuideScreenshotUrlInput(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      {guideScreenshotUrlInput && (
                        <button
                          type="button"
                          onClick={() => setGuideScreenshotUrlInput('')}
                          className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold"
                          title="Reset to default interactive mockup"
                        >
                          Reset Mockup
                        </button>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>Upload Custom Screenshot File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async () => {
                              const b64 = reader.result as string;
                              setGuideScreenshotUrlInput(b64);
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-zinc-500">
                        Default: Realistic smartphone Instagram UI mockup
                      </span>
                    </div>
                  </div>

                  {/* Bottom of Website Banner Switch */}
                  <div className="pt-2 border-t border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Show Setting Screenshot at the Bottom of the Website
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Displays the visual screenshot banner below the dashboard on customer screens.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={guideBottomBannerEnabled}
                        onChange={(e) => setGuideBottomBannerEnabled(e.target.checked)}
                        className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-1">
                        Sweet Bottom Banner Message
                      </label>
                      <input
                        type="text"
                        value={guideBottomBannerText}
                        onChange={(e) => setGuideBottomBannerText(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-95 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-1.5"
                  >
                    <Check className="w-4 h-4 text-black" />
                    <span>Save Setting &amp; Screenshot Configuration</span>
                  </button>
                </form>
              </div>

              {/* Card 2: Sweet Warnings Manager */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="border-b border-zinc-800 pb-3">
                  <h3 className="text-sm font-black text-white flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>2. Sweet Warnings &amp; Friendly Reminders List ({guideConfig.sweetWarnings.length})</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Polite, sweet notices given to customers to prevent issues like private accounts and duplicate orders.
                  </p>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {guideConfig.sweetWarnings.map(w => (
                    <div
                      key={w.id}
                      className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white">{w.title}</span>
                          <span className="px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                            {w.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">{w.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          const updated = guideConfig.sweetWarnings.filter(x => x.id !== w.id);
                          await updateGuideConfig({ sweetWarnings: updated });
                        }}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                        title="Remove warning"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new sweet warning form */}
                <div className="pt-3 border-t border-zinc-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                    + Add New Sweet Warning
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Title (e.g. Do Not Change Bio)"
                      value={newWarningTitle}
                      onChange={(e) => setNewWarningTitle(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Badge label (e.g. Friendly Reminder)"
                      value={newWarningBadge}
                      onChange={(e) => setNewWarningBadge(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Sweet and polite explanation for customer..."
                    value={newWarningDesc}
                    onChange={(e) => setNewWarningDesc(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!newWarningTitle.trim() || !newWarningDesc.trim()) {
                        alert('Please fill in warning title and description');
                        return;
                      }
                      const newItem = {
                        id: `warn-${Date.now()}`,
                        icon: 'heart',
                        title: newWarningTitle.trim(),
                        description: newWarningDesc.trim(),
                        badge: newWarningBadge.trim() || 'Friendly Reminder'
                      };
                      await updateGuideConfig({
                        sweetWarnings: [...guideConfig.sweetWarnings, newItem]
                      });
                      setNewWarningTitle('');
                      setNewWarningDesc('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors"
                  >
                    + Add to Sweet Warnings List
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Live Preview on Site */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Live Customer Preview
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    How it renders on the website
                  </span>
                </div>

                <div className="transform scale-95 origin-top">
                  <SettingScreenshotCard
                    customImageUrl={guideScreenshotUrlInput}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
