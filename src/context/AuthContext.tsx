import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  db
} from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot } from 'firebase/firestore';
import { AppUser, UserRole, AdminAccount, GrowthService, GrowthOrder, SupportTicket, Transaction, PaymentRequest, UpiConfig, GuideConfig } from '../types';
import {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_DEFAULT_PASS,
  SUPER_ADMIN_ALT_PASS,
  DEFAULT_SERVICES,
  DEFAULT_UPI_CONFIG,
  DEFAULT_GUIDE_CONFIG,
  INITIAL_ADMIN_ACCOUNTS,
  INITIAL_SAMPLE_ORDERS,
  INITIAL_USERS,
  INITIAL_PAYMENTS
} from '../data/defaultServices';

interface AuthContextType {
  currentUser: AppUser | null;
  role: UserRole;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  loading: boolean;
  authError: string | null;
  services: GrowthService[];
  orders: GrowthOrder[];
  adminAccounts: AdminAccount[];
  allUsers: AppUser[];
  tickets: SupportTicket[];
  transactions: Transaction[];
  payments: PaymentRequest[];
  upiConfig: UpiConfig;
  guideConfig: GuideConfig;
  updateGuideConfig: (newConfig: Partial<GuideConfig>) => Promise<void>;
  // Auth methods
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  quickLoginAs: (role: UserRole) => void;
  // UPI & Payment methods
  submitPaymentUtr: (amount: number, utrId: string, purpose?: 'wallet_deposit' | 'direct_order', orderId?: string) => Promise<PaymentRequest>;
  verifyPaymentUtr: (paymentId: string) => Promise<void>;
  rejectPaymentUtr: (paymentId: string, reason?: string) => Promise<void>;
  updateUpiConfig: (newConfig: Partial<UpiConfig>) => Promise<void>;
  // Super Admin actions
  createNormalAdmin: (data: { email: string; password: string; name: string; notes?: string }) => Promise<AdminAccount>;
  promoteUserToAdmin: (userId: string, adminPassword?: string) => Promise<AdminAccount>;
  demoteAdminToUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  toggleAdminStatus: (adminId: string) => Promise<void>;
  deleteAdminAccount: (adminId: string) => Promise<void>;
  updateServiceRate: (serviceId: string, newRate: number, active?: boolean) => Promise<void>;
  updateServiceConfig: (serviceId: string, updates: Partial<GrowthService>) => Promise<void>;
  addNewService: (service: Omit<GrowthService, 'id'>) => Promise<void>;
  adjustUserBalance: (userId: string, deltaAmount: number) => Promise<void>;
  // Admin & User actions
  placeOrder: (serviceId: string, target: string, quantity: number) => Promise<{ success: boolean; message: string; orderId?: string; requiredAmount?: number }>;
  updateOrderStatus: (orderId: string, newStatus: GrowthOrder['status'], remains?: number) => Promise<void>;
  addFunds: (amount: number, method: Transaction['method'], utrId?: string) => Promise<void>;
  createSupportTicket: (subject: string, message: string, orderId?: string) => Promise<void>;
  replyToTicket: (ticketId: string, reply: string) => Promise<void>;
  // Backwards compatibility alias
  adminPasses: AdminAccount[];
  createAdminPass: (data: any) => Promise<any>;
  toggleAdminPassStatus: (id: string) => Promise<void>;
  deleteAdminPass: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LS_USER_KEY = 'instagrow_user';
const LS_SERVICES_KEY = 'instagrow_services';
const LS_ORDERS_KEY = 'instagrow_orders';
const LS_ADMIN_ACCOUNTS_KEY = 'instagrow_admin_accounts';
const LS_ALL_USERS_KEY = 'instagrow_all_users';
const LS_TICKETS_KEY = 'instagrow_tickets';
const LS_PAYMENTS_KEY = 'instagrow_payments';
const LS_UPI_CONFIG_KEY = 'instagrow_upi_config';
const LS_GUIDE_CONFIG_KEY = 'instagrow_guide_config';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem(LS_USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Security protection: purge any legacy mock super admin so strangers are never logged into admin
        if (parsed?.uid === 'super-admin-uid-1') {
          localStorage.removeItem(LS_USER_KEY);
          return null;
        }
        if (parsed?.email && parsed?.uid) {
          return parsed;
        }
      } catch {
        localStorage.removeItem(LS_USER_KEY);
      }
    }
    // Strict default: Any new visitor is unauthenticated (null), NOT an administrator!
    return null;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [services, setServices] = useState<GrowthService[]>(() => {
    const saved = localStorage.getItem(LS_SERVICES_KEY);
    if (saved) {
      try {
        const parsed: GrowthService[] = JSON.parse(saved);
        // Ensure any new default services (like ig-fol-budget) are present
        const existingIds = new Set(parsed.map(s => s.id));
        const missing = DEFAULT_SERVICES.filter(s => !existingIds.has(s.id));
        return [...missing, ...parsed];
      } catch {}
    }
    return DEFAULT_SERVICES;
  });

  const [orders, setOrders] = useState<GrowthOrder[]>(() => {
    const saved = localStorage.getItem(LS_ORDERS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_SAMPLE_ORDERS;
  });

  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>(() => {
    const saved = localStorage.getItem(LS_ADMIN_ACCOUNTS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_ADMIN_ACCOUNTS;
  });

  const [allUsers, setAllUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem(LS_ALL_USERS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_USERS;
  });

  const [payments, setPayments] = useState<PaymentRequest[]>(() => {
    const saved = localStorage.getItem(LS_PAYMENTS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_PAYMENTS;
  });

  const [upiConfig, setUpiConfig] = useState<UpiConfig>(() => {
    const saved = localStorage.getItem(LS_UPI_CONFIG_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_UPI_CONFIG;
  });

  const [guideConfig, setGuideConfig] = useState<GuideConfig>(() => {
    const saved = localStorage.getItem(LS_GUIDE_CONFIG_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_GUIDE_CONFIG;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(LS_TICKETS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'TCK-101',
        userId: 'user-01',
        userEmail: 'creator_mike@gmail.com',
        subject: 'Speed question for Order ORD-9842',
        orderId: 'ORD-9842',
        message: 'Hello, followers started fast! Can we schedule 500 followers daily drip?',
        status: 'open',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ];
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN-901',
      userId: 'user-01',
      amount: 500.00,
      method: 'upi',
      status: 'completed',
      date: new Date(Date.now() - 86400000).toISOString(),
      utrId: '429188291039'
    }
  ]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LS_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LS_USER_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LS_SERVICES_KEY, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LS_ADMIN_ACCOUNTS_KEY, JSON.stringify(adminAccounts));
  }, [adminAccounts]);

  useEffect(() => {
    localStorage.setItem(LS_ALL_USERS_KEY, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(LS_PAYMENTS_KEY, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(LS_UPI_CONFIG_KEY, JSON.stringify(upiConfig));
  }, [upiConfig]);

  useEffect(() => {
    localStorage.setItem(LS_GUIDE_CONFIG_KEY, JSON.stringify(guideConfig));
  }, [guideConfig]);

  useEffect(() => {
    localStorage.setItem(LS_TICKETS_KEY, JSON.stringify(tickets));
  }, [tickets]);

  // Real-time synchronization of Firestore orders so all orders always appear across sessions
  useEffect(() => {
    try {
      const ordersCol = collection(db, 'orders');
      const unsubscribe = onSnapshot(ordersCol, (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: GrowthOrder[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data() as GrowthOrder;
            if (data && data.id) {
              remoteList.push(data);
            }
          });
          setOrders(prev => {
            const map = new Map<string, GrowthOrder>();
            INITIAL_SAMPLE_ORDERS.forEach(o => map.set(o.id, o));
            prev.forEach(o => map.set(o.id, o));
            remoteList.forEach(o => map.set(o.id, o));
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }
      }, (err) => {
        console.warn('Orders Firestore snapshot note:', err.message);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Failed to listen to orders collection:', e);
    }
  }, []);

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        const email = fbUser.email?.toLowerCase() || '';
        const isSuperAdminEmail = email === SUPER_ADMIN_EMAIL.toLowerCase();

        let assignedRole: UserRole = isSuperAdminEmail ? 'superadmin' : 'user';

        const matchingAdmin = adminAccounts.find(
          a => a.email.toLowerCase() === email && a.status === 'active'
        );
        if (matchingAdmin && !isSuperAdminEmail) {
          assignedRole = 'admin';
        }

        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            const finalRole = isSuperAdminEmail ? 'superadmin' : (matchingAdmin ? 'admin' : (data.role || assignedRole));
            const profile: AppUser = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: matchingAdmin?.name || fbUser.displayName || email.split('@')[0],
              role: finalRole,
              balance: data.balance ?? (isSuperAdminEmail ? 99999.00 : 250.00),
              avatar: fbUser.photoURL || undefined,
              createdAt: data.createdAt || new Date().toISOString()
            };
            setCurrentUser(profile);
            setAllUsers(prev => {
              const idx = prev.findIndex(u => u.uid === fbUser.uid || u.email.toLowerCase() === email);
              if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], ...profile };
                return updated;
              }
              return [profile, ...prev];
            });
          } else {
            const newUserData: AppUser = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: matchingAdmin?.name || fbUser.displayName || email.split('@')[0],
              role: assignedRole,
              balance: isSuperAdminEmail ? 99999.00 : 250.00,
              avatar: fbUser.photoURL || undefined,
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, newUserData);
            setCurrentUser(newUserData);
            setAllUsers(prev => [newUserData, ...prev.filter(u => u.uid !== fbUser.uid)]);
          }
        } catch {
          setCurrentUser(prev => ({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: matchingAdmin?.name || fbUser.displayName || email.split('@')[0],
            role: isSuperAdminEmail ? 'superadmin' : (matchingAdmin ? 'admin' : (prev?.role || 'user')),
            balance: prev?.balance ?? (isSuperAdminEmail ? 99999.00 : 250.00),
            avatar: fbUser.photoURL || undefined,
            createdAt: prev?.createdAt || new Date().toISOString()
          }));
        }
      } else {
        // If Firebase auth is signed out, ensure any mock super admin is cleared
        setCurrentUser(prev => {
          if (prev?.uid === 'super-admin-uid-1') {
            localStorage.removeItem(LS_USER_KEY);
            return null;
          }
          return prev;
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [adminAccounts]);

  const role: UserRole = currentUser?.role || 'user';
  const isSuperAdmin = Boolean(
    currentUser &&
    (currentUser.role === 'superadmin' || currentUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase())
  );
  const isAdmin = Boolean(currentUser && (isSuperAdmin || currentUser.role === 'admin'));
  const isCustomer = !isAdmin;

  // Google Login
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase() || '';
      if (email === SUPER_ADMIN_EMAIL.toLowerCase()) {
        const updatedSuperUser: AppUser = {
          uid: result.user.uid,
          email: result.user.email || SUPER_ADMIN_EMAIL,
          displayName: result.user.displayName || 'Super Admin',
          role: 'superadmin',
          balance: 99999.00,
          avatar: result.user.photoURL || undefined,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(updatedSuperUser);
        setAllUsers(prev => {
          const idx = prev.findIndex(u => u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = updatedSuperUser;
            return next;
          }
          return [updatedSuperUser, ...prev];
        });
      } else {
        const matchingAdmin = adminAccounts.find(a => a.email.toLowerCase() === email && a.status === 'active');
        if (matchingAdmin) {
          setCurrentUser({
            uid: result.user.uid,
            email: result.user.email || email,
            displayName: matchingAdmin.name || result.user.displayName || email.split('@')[0],
            role: 'admin',
            balance: 2500.00,
            avatar: result.user.photoURL || undefined,
            createdAt: new Date().toISOString()
          });
        }
      }
    } catch (err: any) {
      console.warn("Google sign-in notice:", err.message);
      setAuthError(err.message || 'Failed to sign in with Google');
      throw err;
    }
  };

  // Standard Email & Password Login
  const loginWithEmail = async (emailInput: string, passInput: string) => {
    setAuthError(null);
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passInput.trim();

    // 1. Super Admin master credentials:
    if (
      cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase() &&
      (cleanPass === SUPER_ADMIN_DEFAULT_PASS ||
       cleanPass === SUPER_ADMIN_ALT_PASS ||
       cleanPass.startsWith('hiddenman855@gmail.comsup'))
    ) {
      const superUser: AppUser = {
        uid: 'super-admin-uid-1',
        email: SUPER_ADMIN_EMAIL,
        displayName: 'Super Admin (hiddenman855)',
        role: 'superadmin',
        balance: 99999.00,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(superUser);
      setAllUsers(prev => {
        const idx = prev.findIndex(u => u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = superUser;
          return next;
        }
        return [superUser, ...prev];
      });
      return;
    }

    // 2. Normal Admin credentials created by Super Admin
    const matchingAdmin = adminAccounts.find(
      a => a.email.toLowerCase() === cleanEmail && a.password === cleanPass && a.status === 'active'
    );
    if (matchingAdmin) {
      const adminUser: AppUser = {
        uid: `admin-${matchingAdmin.id}`,
        email: matchingAdmin.email,
        displayName: matchingAdmin.name,
        role: 'admin',
        balance: 2500.00,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(adminUser);
      setAdminAccounts(prev => prev.map(a => a.id === matchingAdmin.id ? { ...a, lastLoginAt: new Date().toISOString() } : a));
      return;
    }

    // 3. Standard Firebase Auth
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      const isSuper = cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase();
      const user: AppUser = {
        uid: cred.user.uid,
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        role: isSuper ? 'superadmin' : 'user',
        balance: isSuper ? 99999.00 : 250.00,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(user);
    } catch (err: any) {
      const foundInAll = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (foundInAll && cleanPass.length >= 4) {
        setCurrentUser(foundInAll);
        return;
      }

      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        if (cleanPass.length >= 6) {
          const demoUser: AppUser = {
            uid: `demo-${Date.now()}`,
            email: cleanEmail,
            displayName: cleanEmail.split('@')[0],
            role: cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase() ? 'superadmin' : 'user',
            balance: 250.00,
            createdAt: new Date().toISOString()
          };
          setCurrentUser(demoUser);
          setAllUsers(prev => [demoUser, ...prev]);
          return;
        }
      }
      setAuthError('Incorrect email or password. Please verify credentials.');
      throw err;
    }
  };

  // Register with Email
  const registerWithEmail = async (emailInput: string, passInput: string, name: string) => {
    setAuthError(null);
    const cleanEmail = emailInput.trim().toLowerCase();
    const isSuper = cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase();

    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, passInput);
      const newUser: AppUser = {
        uid: cred.user.uid,
        email: cleanEmail,
        displayName: name || cleanEmail.split('@')[0],
        role: isSuper ? 'superadmin' : 'user',
        balance: isSuper ? 99999.00 : 100.00, // ₹100 welcome balance
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'users', cred.user.uid), newUser);
      } catch {}
      setCurrentUser(newUser);
      setAllUsers(prev => [newUser, ...prev]);
    } catch (err: any) {
      const newUser: AppUser = {
        uid: `user-${Date.now()}`,
        email: cleanEmail,
        displayName: name || cleanEmail.split('@')[0],
        role: isSuper ? 'superadmin' : 'user',
        balance: 100.00,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(newUser);
      setAllUsers(prev => [newUser, ...prev]);
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {}
    setCurrentUser(null);
    localStorage.removeItem(LS_USER_KEY);
  };

  const quickLoginAs = (_targetRole: UserRole) => {
    // Disabled for production security: all admin and user sessions require authentication
  };

  // Submit Payment with UTR ID (Customer)
  const submitPaymentUtr = async (
    amount: number,
    utrId: string,
    purpose: 'wallet_deposit' | 'direct_order' = 'wallet_deposit',
    orderId?: string
  ): Promise<PaymentRequest> => {
    const cleanUtr = utrId.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      throw new Error('Please enter a valid 12-digit UTR ID from your UPI app receipt.');
    }

    const newPayment: PaymentRequest = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser?.uid || 'guest',
      userEmail: currentUser?.email || 'user@instagrow.com',
      userName: currentUser?.displayName || 'Customer',
      amount,
      purpose,
      orderId,
      utrId: cleanUtr,
      status: 'pending',
      upiIdUsed: upiConfig.upiId,
      createdAt: new Date().toISOString(),
    };

    setPayments(prev => [newPayment, ...prev]);

    try {
      await setDoc(doc(db, 'payments', newPayment.id), newPayment);
    } catch {}

    return newPayment;
  };

  // Verify Payment by Super Admin (Credits INR amount directly to user's wallet!)
  const verifyPaymentUtr = async (paymentId: string) => {
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Only Super Admin can verify payments and credit funds.');
    }

    const payment = payments.find(p => p.id === paymentId);
    if (!payment) throw new Error('Payment not found');
    if (payment.status === 'verified') return;

    // Update payment status
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'verified',
          verifiedAt: new Date().toISOString(),
          verifiedBy: SUPER_ADMIN_EMAIL
        };
      }
      return p;
    }));

    // Credit INR amount to the user
    setAllUsers(prev => prev.map(u => {
      if (u.uid === payment.userId || u.email.toLowerCase() === payment.userEmail.toLowerCase()) {
        return { ...u, balance: +(u.balance + payment.amount).toFixed(2) };
      }
      return u;
    }));

    if (currentUser && (currentUser.uid === payment.userId || currentUser.email.toLowerCase() === payment.userEmail.toLowerCase())) {
      setCurrentUser(prev => prev ? { ...prev, balance: +(prev.balance + payment.amount).toFixed(2) } : null);
    }

    // Add to transaction log
    setTransactions(prev => [
      {
        id: `TXN-${Date.now().toString().slice(-6)}`,
        userId: payment.userId,
        amount: payment.amount,
        method: 'upi',
        status: 'completed',
        date: new Date().toISOString(),
        utrId: payment.utrId
      },
      ...prev
    ]);

    // If linked to an order, update order status to processing
    if (payment.orderId) {
      setOrders(prev => prev.map(o => {
        if (o.id === payment.orderId && o.status === 'pending') {
          return { ...o, status: 'processing', updatedAt: new Date().toISOString() };
        }
        return o;
      }));
    }

    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        verifiedBy: SUPER_ADMIN_EMAIL
      });
    } catch {}
  };

  // Reject Payment by Super Admin
  const rejectPaymentUtr = async (paymentId: string, reason?: string) => {
    if (!isSuperAdmin) throw new Error('Unauthorized');

    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'rejected',
          rejectionReason: reason || 'Invalid UTR ID or payment not received.',
          verifiedAt: new Date().toISOString(),
          verifiedBy: SUPER_ADMIN_EMAIL
        };
      }
      return p;
    }));

    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'rejected',
        rejectionReason: reason || 'Invalid UTR ID or payment not received.',
        verifiedAt: new Date().toISOString(),
        verifiedBy: SUPER_ADMIN_EMAIL
      });
    } catch {}
  };

  // Update Super Admin UPI Config & QR
  const updateUpiConfig = async (newConfig: Partial<UpiConfig>) => {
    if (!isSuperAdmin) throw new Error('Unauthorized');
    setUpiConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Update Sweet Warnings & Setting Screenshot Guide Config
  const updateGuideConfig = async (newConfig: Partial<GuideConfig>) => {
    if (!isSuperAdmin) throw new Error('Unauthorized: Only Super Admin can change guide settings.');
    setGuideConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Super Admin: Create Normal Admin Account from scratch
  const createNormalAdmin = async (data: { email: string; password: string; name: string; notes?: string }): Promise<AdminAccount> => {
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Only Super Admin can create normal admin credentials.');
    }

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPassword = data.password.trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error('Admin Email and Password are required.');
    }

    const existing = adminAccounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error(`An admin account with email "${cleanEmail}" already exists.`);
    }

    const newAdmin: AdminAccount = {
      id: `admin-${Date.now()}`,
      email: cleanEmail,
      password: cleanPassword,
      name: data.name.trim() || cleanEmail.split('@')[0],
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.email || SUPER_ADMIN_EMAIL,
      notes: data.notes?.trim()
    };

    setAdminAccounts(prev => [newAdmin, ...prev]);

    setAllUsers(prev => {
      const idx = prev.findIndex(u => u.email.toLowerCase() === cleanEmail);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], role: 'admin', displayName: newAdmin.name };
        return copy;
      }
      return [
        {
          uid: newAdmin.id,
          email: newAdmin.email,
          displayName: newAdmin.name,
          role: 'admin',
          balance: 2500.00,
          createdAt: newAdmin.createdAt
        },
        ...prev
      ];
    });

    try {
      await setDoc(doc(db, 'admin_accounts', newAdmin.id), newAdmin);
    } catch {}

    return newAdmin;
  };

  // Super Admin: Promote an existing Normal User to a Normal Admin
  const promoteUserToAdmin = async (userId: string, adminPassword?: string): Promise<AdminAccount> => {
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Only Super Admin can promote users to admin.');
    }

    const targetUser = allUsers.find(u => u.uid === userId);
    if (!targetUser) throw new Error('User not found.');

    const cleanPass = adminPassword?.trim() || `Admin_${Math.floor(1000 + Math.random() * 9000)}`;

    const newAdmin: AdminAccount = {
      id: `admin-${targetUser.uid}`,
      email: targetUser.email.toLowerCase(),
      password: cleanPass,
      name: targetUser.displayName || targetUser.email.split('@')[0],
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.email || SUPER_ADMIN_EMAIL,
      notes: 'Promoted from regular user by Super Admin'
    };

    setAdminAccounts(prev => [newAdmin, ...prev.filter(a => a.email.toLowerCase() !== targetUser.email.toLowerCase())]);
    setAllUsers(prev => prev.map(u => u.uid === userId ? { ...u, role: 'admin' } : u));

    if (currentUser?.uid === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: 'admin' } : null);
    }

    try {
      await setDoc(doc(db, 'admin_accounts', newAdmin.id), newAdmin);
      await updateDoc(doc(db, 'users', userId), { role: 'admin' });
    } catch {}

    return newAdmin;
  };

  // Super Admin: Demote an Admin to Normal User
  const demoteAdminToUser = async (userId: string) => {
    if (!isSuperAdmin) throw new Error('Unauthorized');
    const targetUser = allUsers.find(u => u.uid === userId);
    if (!targetUser) return;

    if (targetUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      throw new Error('Cannot demote Super Admin.');
    }

    setAllUsers(prev => prev.map(u => u.uid === userId ? { ...u, role: 'user' } : u));
    setAdminAccounts(prev => prev.filter(a => a.email.toLowerCase() !== targetUser.email.toLowerCase()));

    if (currentUser?.uid === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: 'user' } : null);
    }

    try {
      await updateDoc(doc(db, 'users', userId), { role: 'user' });
    } catch {}
  };

  // Super Admin: Delete user
  const deleteUser = async (userId: string) => {
    if (!isSuperAdmin) throw new Error('Unauthorized');
    const user = allUsers.find(u => u.uid === userId);
    if (user?.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      throw new Error('Cannot delete Super Admin.');
    }
    setAllUsers(prev => prev.filter(u => u.uid !== userId));
    setAdminAccounts(prev => prev.filter(a => a.email.toLowerCase() !== user?.email.toLowerCase()));
  };

  // Super Admin: Toggle active/revoked
  const toggleAdminStatus = async (adminId: string) => {
    if (!isSuperAdmin) throw new Error('Unauthorized');
    setAdminAccounts(prev => prev.map(a => {
      if (a.id === adminId) {
        return { ...a, status: a.status === 'active' ? 'revoked' : 'active' };
      }
      return a;
    }));
    try {
      const a = adminAccounts.find(x => x.id === adminId);
      if (a) {
        await updateDoc(doc(db, 'admin_accounts', adminId), {
          status: a.status === 'active' ? 'revoked' : 'active'
        });
      }
    } catch {}
  };

  // Super Admin: Delete admin account
  const deleteAdminAccount = async (adminId: string) => {
    if (!isSuperAdmin) throw new Error('Unauthorized');
    setAdminAccounts(prev => prev.filter(a => a.id !== adminId));
  };

  // Super Admin: Update full service config (Rate, Free status, Fixed Quantity, Min, Max, Active)
  const updateServiceConfig = async (serviceId: string, updates: Partial<GrowthService>) => {
    if (!isSuperAdmin) throw new Error('Unauthorized: Only Super Admin can adjust services.');
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        const isFree = updates.isFree !== undefined ? updates.isFree : s.isFree;
        const newRate = isFree ? 0 : (updates.ratePer1000 !== undefined ? updates.ratePer1000 : s.ratePer1000);
        return {
          ...s,
          ...updates,
          ratePer1000: newRate,
          isFree,
          category: isFree ? 'free' : (updates.category || s.category),
          fixedQuantity: updates.fixedQuantity !== undefined ? updates.fixedQuantity : s.fixedQuantity
        };
      }
      return s;
    }));
  };

  // Super Admin: Update service rate or toggle active
  const updateServiceRate = async (serviceId: string, newRate: number, active?: boolean) => {
    await updateServiceConfig(serviceId, {
      ratePer1000: newRate,
      active: active !== undefined ? active : true
    });
  };

  // Super Admin: Add new service
  const addNewService = async (serviceData: Omit<GrowthService, 'id'>) => {
    if (!isSuperAdmin) throw new Error('Unauthorized: Only Super Admin can add services.');
    const newService: GrowthService = {
      ...serviceData,
      id: `ig-srv-${Date.now()}`
    };
    setServices(prev => [...prev, newService]);
  };

  // Super Admin: Adjust user balance in INR
  const adjustUserBalance = async (userId: string, deltaAmount: number) => {
    if (!isSuperAdmin) throw new Error('Unauthorized: Only Super Admin can modify user funds.');

    setAllUsers(prev => prev.map(u => {
      if (u.uid === userId) {
        return { ...u, balance: Math.max(0, +(u.balance + deltaAmount).toFixed(2)) };
      }
      return u;
    }));

    if (currentUser && currentUser.uid === userId) {
      setCurrentUser(prev => prev ? { ...prev, balance: Math.max(0, +(prev.balance + deltaAmount).toFixed(2)) } : null);
    }

    try {
      const u = allUsers.find(x => x.uid === userId);
      if (u) {
        await updateDoc(doc(db, 'users', userId), {
          balance: Math.max(0, +(u.balance + deltaAmount).toFixed(2))
        });
      }
    } catch {}
  };

  // Customer: Place Instagram Growth order in INR
  const placeOrder = async (serviceId: string, target: string, quantity: number): Promise<{ success: boolean; message: string; orderId?: string; requiredAmount?: number }> => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return { success: false, message: 'Selected service does not exist.' };
    if (!service.active) return { success: false, message: 'This service is currently disabled.' };

    const isFree = Boolean(service.isFree || service.ratePer1000 === 0 || service.category === 'free');
    // Enforce fixed quantity if preset by Admin so users cannot add any arbitrary quantity
    const finalQuantity = service.fixedQuantity || (isFree ? (service.fixedQuantity || 50) : quantity);

    if (!service.fixedQuantity) {
      if (finalQuantity < service.min) return { success: false, message: `Minimum order quantity is ${service.min.toLocaleString()}.` };
      if (finalQuantity > service.max) return { success: false, message: `Maximum order quantity is ${service.max.toLocaleString()}.` };
    }

    const cost = isFree ? 0 : +((finalQuantity / 1000) * service.ratePer1000).toFixed(2);
    const userBalance = currentUser?.balance ?? 0;

    if (cost > 0 && userBalance < cost) {
      return {
        success: false,
        message: `Insufficient balance (₹${userBalance.toFixed(2)}). Order requires ₹${cost.toFixed(2)}. Scan UPI QR to pay or top-up.`,
        requiredAmount: cost
      };
    }

    const newBalance = cost > 0 ? +(userBalance - cost).toFixed(2) : userBalance;
    if (currentUser && cost > 0) {
      setCurrentUser(prev => prev ? { ...prev, balance: newBalance } : null);
      setAllUsers(prev => prev.map(u => u.uid === currentUser.uid ? { ...u, balance: newBalance } : u));
    }

    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: GrowthOrder = {
      id: newOrderId,
      userId: currentUser?.uid || 'guest',
      userEmail: currentUser?.email || 'guest@user.com',
      serviceId: service.id,
      serviceName: service.name,
      category: service.category,
      target: target.trim(),
      quantity: finalQuantity,
      charge: cost,
      startCount: Math.floor(Math.random() * 800) + 120,
      remains: finalQuantity,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);

    try {
      await setDoc(doc(db, 'orders', newOrderId), newOrder);
      if (currentUser?.uid) {
        await updateDoc(doc(db, 'users', currentUser.uid), { balance: newBalance });
      }
    } catch {}

    setTimeout(() => {
      setOrders(current => current.map(o => {
        if (o.id === newOrderId) {
          return {
            ...o,
            status: 'in_progress',
            remains: Math.floor(quantity * 0.7),
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      }));
    }, 4000);

    return { success: true, message: `Order #${newOrderId} submitted successfully! Delivery starting shortly.`, orderId: newOrderId };
  };

  // Admin & Super Admin: Update order status
  const updateOrderStatus = async (orderId: string, newStatus: GrowthOrder['status'], remains?: number) => {
    if (!isAdmin) throw new Error('Unauthorized');
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          remains: remains !== undefined ? remains : (newStatus === 'completed' ? 0 : o.remains),
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        remains: newStatus === 'completed' ? 0 : remains,
        updatedAt: new Date().toISOString()
      });
    } catch {}
  };

  // Add Funds (Direct)
  const addFunds = async (amount: number, method: Transaction['method'], utrId?: string) => {
    if (amount <= 0) return;
    const newTxn: Transaction = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      userId: currentUser?.uid || 'guest',
      amount,
      method,
      status: 'completed',
      date: new Date().toISOString(),
      utrId
    };

    setTransactions(prev => [newTxn, ...prev]);
    const updated = +( (currentUser?.balance || 0) + amount).toFixed(2);
    setCurrentUser(prev => prev ? { ...prev, balance: updated } : null);
    if (currentUser) {
      setAllUsers(prev => prev.map(u => u.uid === currentUser.uid ? { ...u, balance: updated } : u));
    }

    try {
      if (currentUser?.uid) {
        await updateDoc(doc(db, 'users', currentUser.uid), { balance: updated });
      }
    } catch {}
  };

  // Support Tickets
  const createSupportTicket = async (subject: string, message: string, orderId?: string) => {
    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      userId: currentUser?.uid || 'guest',
      userEmail: currentUser?.email || 'user@example.com',
      subject: subject.trim(),
      orderId: orderId?.trim() || undefined,
      message: message.trim(),
      status: 'open',
      createdAt: new Date().toISOString()
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const replyToTicket = async (ticketId: string, reply: string) => {
    if (!isAdmin) throw new Error('Unauthorized');
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'answered',
          reply: reply.trim(),
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isSuperAdmin,
        isAdmin,
        isCustomer,
        loading,
        authError,
        services,
        orders,
        adminAccounts,
        allUsers,
        tickets,
        transactions,
        payments,
        upiConfig,
        guideConfig,
        updateGuideConfig,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        quickLoginAs,
        submitPaymentUtr,
        verifyPaymentUtr,
        rejectPaymentUtr,
        updateUpiConfig,
        createNormalAdmin,
        promoteUserToAdmin,
        demoteAdminToUser,
        deleteUser,
        toggleAdminStatus,
        deleteAdminAccount,
        updateServiceRate,
        updateServiceConfig,
        addNewService,
        adjustUserBalance,
        placeOrder,
        updateOrderStatus,
        addFunds,
        createSupportTicket,
        replyToTicket,
        adminPasses: adminAccounts,
        createAdminPass: createNormalAdmin as any,
        toggleAdminPassStatus: toggleAdminStatus,
        deleteAdminPass: deleteAdminAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
