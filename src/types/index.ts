export type UserRole = 'superadmin' | 'admin' | 'user';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  balance: number; // In INR (₹)
  avatar?: string;
  createdAt: string;
}

export interface AdminAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin';
  status: 'active' | 'revoked';
  createdAt: string;
  createdBy: string;
  lastLoginAt?: string;
  notes?: string;
}

export type AdminPass = AdminAccount;

export type ServiceCategory = 'followers' | 'likes' | 'views' | 'comments' | 'reels' | 'free';

export interface GrowthService {
  id: string;
  name: string;
  category: ServiceCategory;
  ratePer1000: number; // In INR (₹) e.g. 149.00 (0.00 for FREE)
  min: number;
  max: number;
  speed: string;
  guarantee: string;
  description: string;
  active: boolean;
  isFree?: boolean; // explicitly marks 100% free / trial service
  fixedQuantity?: number; // When set (e.g. for free or promo services), customers can only order this exact preset quantity
}

export type OrderStatus = 'pending' | 'processing' | 'in_progress' | 'completed' | 'canceled';

export interface GrowthOrder {
  id: string;
  userId: string;
  userEmail: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  target: string;
  quantity: number;
  charge: number; // In INR (₹)
  startCount: number;
  remains: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  orderId?: string;
  message: string;
  status: 'open' | 'answered' | 'closed';
  reply?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentRequest {
  id: string; // e.g. PAY-1001
  userId: string;
  userEmail: string;
  userName: string;
  amount: number; // In INR (₹)
  purpose: 'wallet_deposit' | 'direct_order';
  orderId?: string;
  utrId: string; // 12-digit UPI UTR ID entered by customer
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  upiIdUsed: string;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface UpiConfig {
  upiId: string; // e.g. "instagrow@okhdfcbank"
  merchantName: string; // e.g. "InstaGrow Services"
  qrImageUrl?: string; // Optional custom QR uploaded by Super Admin
  bankName?: string;
  noteTemplate?: string;
  active: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number; // In INR (₹)
  method: 'upi' | 'card' | 'admin_bonus';
  status: 'completed' | 'pending';
  date: string;
  utrId?: string;
}

export interface SweetWarning {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
  badgeColor?: string;
}

export interface PaymentStep {
  step: number;
  title: string;
  description: string;
  highlight: string;
}

export interface GuideConfig {
  accountSettingTitle: string;
  accountSettingSubtitle: string;
  settingName: string;
  settingPath: string;
  instruction: string;
  screenshotUrl: string;
  bottomBannerEnabled: boolean;
  bottomBannerText: string;
  sweetWarnings: SweetWarning[];
  paymentSteps: PaymentStep[];
  utrScreenshotUrl?: string;
}
