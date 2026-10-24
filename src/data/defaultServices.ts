import { GrowthService, AdminAccount, AdminPass, GrowthOrder, AppUser, PaymentRequest, UpiConfig, GuideConfig } from '../types';

export const SUPER_ADMIN_EMAIL = 'hiddenman855@gmail.com';
export const SUPER_ADMIN_DEFAULT_PASS = 'hiddenman855@gmail.comsupp';
export const SUPER_ADMIN_ALT_PASS = 'hiddenman855@gmail.comsup';

// Default UPI Configuration for Super Admin
export const DEFAULT_UPI_CONFIG: UpiConfig = {
  upiId: 'hiddenman855@okhdfcbank',
  merchantName: 'InstaGrow Official',
  bankName: 'UPI India (GPay / PhonePe / Paytm)',
  noteTemplate: 'InstaGrow_Order',
  active: true,
};

// Rates converted to Indian Rupees (INR / ₹)
export const DEFAULT_SERVICES: GrowthService[] = [
  {
    id: 'ig-free-fol',
    name: 'Instagram Followers [Free Trial • 50 Active Profiles • Instant]',
    category: 'free',
    ratePer1000: 0.00,
    min: 20,
    max: 100,
    speed: 'Instant (1–2 Minutes)',
    guarantee: '100% Free Sample',
    description: 'Complimentary trial of our active Instagram delivery network. Test delivery at zero cost.',
    active: true,
    isFree: true,
    fixedQuantity: 50,
  },
  {
    id: 'ig-free-ree',
    name: 'Instagram Reels Views [Free Sample • 200 Instant Views]',
    category: 'free',
    ratePer1000: 0.00,
    min: 50,
    max: 500,
    speed: 'Instant (0–3 Minutes)',
    guarantee: 'Free Exploration Boost',
    description: 'Instant reels view boost at ₹0.00 to test our high-retention explore node algorithms.',
    active: true,
    isFree: true,
    fixedQuantity: 200,
  },
  {
    id: 'ig-free-lik',
    name: 'Instagram Likes [Free Sample • 30 Instant Likes]',
    category: 'free',
    ratePer1000: 0.00,
    min: 10,
    max: 100,
    speed: 'Instant (0–2 Minutes)',
    guarantee: 'Free Sample',
    description: 'Fast active post likes completely free. No wallet balance required.',
    active: true,
    isFree: true,
    fixedQuantity: 30,
  },
  {
    id: 'ig-fol-budget',
    name: 'Instagram Followers [Super Budget • Instant Start]',
    category: 'followers',
    ratePer1000: 29.00,
    min: 50,
    max: 50000,
    speed: '10K - 30K/Day',
    guarantee: '30 Days Refill Guarantee',
    description: 'Ultra affordable Instagram followers at just ₹29 per 1,000. Super quick start.',
    active: true,
  },
  {
    id: 'ig-fol-hq',
    name: 'Instagram Followers [High Quality • 30D Refill • Fast]',
    category: 'followers',
    ratePer1000: 149.00,
    min: 50,
    max: 50000,
    speed: '20K - 50K/Day',
    guarantee: '30 Days Guaranteed Refill',
    description: 'High quality active-looking profiles with posts and profile pictures. Drop rate < 2%.',
    active: true,
  },
  {
    id: 'ig-fol-real',
    name: 'Instagram Followers [Real Active • Non-Drop • Lifetime]',
    category: 'followers',
    ratePer1000: 289.00,
    min: 100,
    max: 20000,
    speed: '5K - 10K/Day (Gradual)',
    guarantee: 'Lifetime Refill Guarantee',
    description: 'Real engaging Instagram accounts from explore page ads. Safe for business and creator profiles.',
    active: true,
  },
  {
    id: 'ig-lik-inst',
    name: 'Instagram Likes [Instant Super Fast • Real Accounts]',
    category: 'likes',
    ratePer1000: 59.00,
    min: 50,
    max: 100000,
    speed: 'Instant (0 - 5 Minutes)',
    guarantee: 'Non-Drop',
    description: 'Delivers instantly after placing order. High engagement boost for post reach and ranking.',
    active: true,
  },
  {
    id: 'ig-lik-auto',
    name: 'Instagram Auto-Likes [High Quality • High Reach]',
    category: 'likes',
    ratePer1000: 99.00,
    min: 100,
    max: 25000,
    speed: '15 Minutes',
    guarantee: '30 Days Refill',
    description: 'Boost post impressions and discover algorithm reach with clean profiles.',
    active: true,
  },
  {
    id: 'ig-ree-views',
    name: 'Instagram Reels Views [Viral Boost • Max 1M/Day]',
    category: 'reels',
    ratePer1000: 29.00,
    min: 100,
    max: 1000000,
    speed: '500K/Day Ultra Fast',
    guarantee: 'Non-Drop Guaranteed',
    description: 'Triggers the Instagram Reels explore algorithm with high retention watch time.',
    active: true,
  },
  {
    id: 'ig-vid-views',
    name: 'Instagram Video Views + Story Impressions',
    category: 'views',
    ratePer1000: 39.00,
    min: 100,
    max: 500000,
    speed: '100K/Day',
    guarantee: 'Non-Drop',
    description: 'Boosts both video view counter and profile impressions metrics.',
    active: true,
  },
  {
    id: 'ig-com-custom',
    name: 'Instagram Custom Comments [Verified Profile Avatars]',
    category: 'comments',
    ratePer1000: 420.00,
    min: 5,
    max: 2000,
    speed: '1K/Day Natural Drip',
    guarantee: 'Non-Drop',
    description: 'Real-sounding positive feedback or custom text per line from active profiles.',
    active: true,
  },
  {
    id: 'ig-com-emojis',
    name: 'Instagram Emoji Comments [Fire & Hearts Mix]',
    category: 'comments',
    ratePer1000: 220.00,
    min: 10,
    max: 5000,
    speed: 'Instant Start',
    guarantee: 'Permanent',
    description: 'Engaging emoji reactions (🔥, ❤️, 👏, 💯) delivered naturally.',
    active: true,
  },
];

export const INITIAL_ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: 'admin-01',
    email: 'admin@instagrow.com',
    password: 'adminpass2026',
    name: 'Sarah Jenkins (Fulfillment Lead)',
    role: 'admin',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdBy: SUPER_ADMIN_EMAIL,
    lastLoginAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: 'Handles order fulfillment queue and customer support tickets.',
  },
  {
    id: 'admin-02',
    email: 'ops@instagrow.com',
    password: 'opsstaff2026',
    name: 'Alex Evans (Operations Staff)',
    role: 'admin',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdBy: SUPER_ADMIN_EMAIL,
    notes: 'Shift admin for order tracking.',
  },
];

export const INITIAL_ADMIN_PASSES = INITIAL_ADMIN_ACCOUNTS;

export const INITIAL_SAMPLE_ORDERS: GrowthOrder[] = [
  {
    id: 'ORD-9842',
    userId: 'user-01',
    userEmail: 'creator_mike@gmail.com',
    serviceId: 'ig-fol-hq',
    serviceName: 'Instagram Followers [High Quality • 30D Refill • Fast]',
    category: 'followers',
    target: '@mike_visuals',
    quantity: 2500,
    charge: 372.50, // in ₹
    startCount: 1240,
    remains: 450,
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'ORD-9841',
    userId: 'user-01',
    userEmail: 'creator_mike@gmail.com',
    serviceId: 'ig-ree-views',
    serviceName: 'Instagram Reels Views [Viral Boost • Max 1M/Day]',
    category: 'reels',
    target: 'https://instagram.com/reel/Cx98AbcKlm2',
    quantity: 10000,
    charge: 290.00, // in ₹
    startCount: 420,
    remains: 0,
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1 + 3600000).toISOString(),
  },
  {
    id: 'ORD-9840',
    userId: 'user-02',
    userEmail: 'fitness_queen@instagram.com',
    serviceId: 'ig-lik-inst',
    serviceName: 'Instagram Likes [Instant Super Fast • Real Accounts]',
    category: 'likes',
    target: 'https://instagram.com/p/DB11zZ78A',
    quantity: 1500,
    charge: 88.50, // in ₹
    startCount: 310,
    remains: 0,
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
  },
];

export const INITIAL_USERS: AppUser[] = [
  {
    uid: 'super-admin-uid-1',
    email: SUPER_ADMIN_EMAIL,
    displayName: 'Super Admin (hiddenman855)',
    role: 'superadmin',
    balance: 99999.00, // in ₹
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    uid: 'admin-01',
    email: 'admin@instagrow.com',
    displayName: 'Sarah Jenkins (Fulfillment Lead)',
    role: 'admin',
    balance: 2500.00, // in ₹
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    uid: 'user-01',
    email: 'creator_mike@gmail.com',
    displayName: 'Mike Visuals',
    role: 'user',
    balance: 480.00, // in ₹
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    uid: 'user-02',
    email: 'fitness_queen@instagram.com',
    displayName: 'Chloe Fitness',
    role: 'user',
    balance: 1200.00, // in ₹
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    uid: 'user-03',
    email: 'david_agency@gmail.com',
    displayName: 'David Growth Agency',
    role: 'user',
    balance: 3400.00, // in ₹
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    uid: 'user-04',
    email: 'sophia_brand@outlook.com',
    displayName: 'Sophia Luxury Apparel',
    role: 'user',
    balance: 650.00, // in ₹
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const INITIAL_PAYMENTS: PaymentRequest[] = [
  {
    id: 'PAY-8921',
    userId: 'user-01',
    userEmail: 'creator_mike@gmail.com',
    userName: 'Mike Visuals',
    amount: 500,
    purpose: 'wallet_deposit',
    utrId: '429188291039',
    status: 'pending',
    upiIdUsed: 'hiddenman855@okhdfcbank',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'PAY-8920',
    userId: 'user-02',
    userEmail: 'fitness_queen@instagram.com',
    userName: 'Chloe Fitness',
    amount: 1000,
    purpose: 'wallet_deposit',
    utrId: '429177123984',
    status: 'verified',
    upiIdUsed: 'hiddenman855@okhdfcbank',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    verifiedAt: new Date(Date.now() - 82800000).toISOString(),
    verifiedBy: SUPER_ADMIN_EMAIL,
  }
];

export const DEFAULT_GUIDE_CONFIG: GuideConfig = {
  accountSettingTitle: '1 Mandatory Instagram Setting Before Ordering',
  accountSettingSubtitle: 'Ensure your Instagram Account is set to PUBLIC (Turn OFF Private Account)',
  settingName: 'Account Privacy: Make Account Public',
  settingPath: 'Instagram Profile > ☰ Menu > Settings and privacy > Account privacy > Private account (Toggle OFF)',
  instruction: 'Our automated servers and exploration networks need your profile to be Public to deliver followers, likes, views, and comments. If your account is Private, Instagram blocks external deliveries. You can turn it back to private after delivery is completed!',
  screenshotUrl: '', // empty means render our pixel-perfect interactive mockup
  bottomBannerEnabled: true,
  bottomBannerText: '🌸 Gentle Reminder: Please keep your Instagram account PUBLIC (not private) while your order is being delivered!',
  sweetWarnings: [
    {
      id: 'warn-public',
      icon: 'shield',
      title: 'Keep Account Public (Not Private)',
      description: 'Your profile and post link must remain public during the entire delivery. If private, our delivery nodes cannot access the post.',
      badge: 'Mandatory',
      badgeColor: 'rose'
    },
    {
      id: 'warn-username',
      icon: 'lock',
      title: 'Do Not Change Username or Delete Post',
      description: 'Please do not change your Instagram username (@handle) or archive/delete your post while an order is processing.',
      badge: 'Important',
      badgeColor: 'amber'
    },
    {
      id: 'warn-duplicate',
      icon: 'refresh',
      title: 'Avoid Simultaneous Duplicate Orders',
      description: 'Wait for your current order for a post/profile to complete before placing a second one for the exact same target link.',
      badge: 'Best Results',
      badgeColor: 'blue'
    },
    {
      id: 'warn-utr',
      icon: 'sparkles',
      title: 'Submit Accurate 12-Digit UTR ID',
      description: 'After scanning the UPI QR code on Google Pay, PhonePe, or Paytm, copy the 12-digit UTR/UPI Ref number from your receipt. Super Admin verifies within minutes!',
      badge: 'Instant QR',
      badgeColor: 'emerald'
    },
    {
      id: 'warn-password',
      icon: 'heart',
      title: 'No Password Ever Required',
      description: 'We will never ask for your Instagram password. Your credentials stay 100% private and secure with you.',
      badge: '100% Safe',
      badgeColor: 'purple'
    },
    {
      id: 'warn-refill',
      icon: 'heart',
      title: '30-Day Guaranteed Refill with Love',
      description: 'All services include non-drop protection. In case of any drop, open a support ticket or click refill for free top-up.',
      badge: 'Guaranteed',
      badgeColor: 'pink'
    }
  ],
  paymentSteps: [
    {
      step: 1,
      title: 'Select Service & Enter Quantity',
      description: 'Choose your desired service package and quantity. The exact price in Indian Rupees (INR ₹) is calculated automatically (e.g. ₹14.50 for 500 followers).',
      highlight: 'Proportional Live Pricing'
    },
    {
      step: 2,
      title: 'Scan Super Admin UPI QR Code',
      description: 'Click "Pay with UPI QR Code" or "Add Funds" to generate the dynamic QR code pre-filled with the exact amount.',
      highlight: 'GPay / PhonePe / Paytm / BHIM'
    },
    {
      step: 3,
      title: 'Complete Payment in Your UPI App',
      description: 'Authorize the payment in your UPI app. The payment is transferred directly to Super Admin\'s verified UPI account.',
      highlight: 'Zero Processing Fees'
    },
    {
      step: 4,
      title: 'Copy 12-Digit UTR / UPI Ref ID',
      description: 'Open the transaction receipt in PhonePe, Google Pay, or Paytm and copy the 12-digit UTR or UPI Reference Number.',
      highlight: 'Look for "UTR" or "UPI Ref No."'
    },
    {
      step: 5,
      title: 'Submit UTR for Instant Verification',
      description: 'Paste the 12-digit UTR in our verification box. Super Admin verifies and activates your order/balance immediately!',
      highlight: '1–5 Min Rapid Approval'
    }
  ],
  utrScreenshotUrl: ''
};

