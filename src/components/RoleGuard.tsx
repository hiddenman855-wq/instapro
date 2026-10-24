import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, Crown, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface RoleGuardProps {
  requiredLevel: 'superadmin' | 'admin' | 'user';
  children: React.ReactNode;
  fallbackTab?: (tab: string) => void;
  openAuthModal?: () => void;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  requiredLevel,
  children,
  fallbackTab,
  openAuthModal
}) => {
  const { currentUser, role, isSuperAdmin, isAdmin } = useAuth();

  let hasAccess = false;

  if (requiredLevel === 'user') {
    hasAccess = !!currentUser;
  } else if (requiredLevel === 'admin') {
    hasAccess = Boolean(currentUser && isAdmin); // strictly require authenticated admin or superadmin
  } else if (requiredLevel === 'superadmin') {
    hasAccess = Boolean(currentUser && isSuperAdmin);
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-3xl mx-auto my-12 px-4">
      <div className="bg-zinc-900/90 border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-400">
          {requiredLevel === 'superadmin' ? (
            <Crown className="w-8 h-8 text-amber-400" />
          ) : (
            <Lock className="w-8 h-8 text-red-400" />
          )}
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Hierarchy Route Protection Active</span>
        </div>

        <h2 className="text-2xl font-black text-white mb-2">
          {requiredLevel === 'superadmin'
            ? 'Super Admin Privilege Required'
            : 'Admin Access Level Required'}
        </h2>

        <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
          {requiredLevel === 'superadmin' ? (
            <>
              This route is strictly restricted to the Super Administrator (<span className="text-amber-300 font-semibold">hiddenman855@gmail.com</span>). Normal admins and customers cannot modify platform pricing, delete admin passes, or tamper with system wallets.
            </>
          ) : (
            <>
              This area is restricted to authenticated Administrators (Normal Admins with valid staff pass or Super Admin). Standard customer accounts cannot access internal fulfillment queues.
            </>
          )}
        </p>

        {/* Current user role info */}
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4 max-w-md mx-auto mb-6 text-left">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Your Current Identity:</span>
            <span className="font-semibold text-zinc-200">{currentUser ? currentUser.email : 'Guest'}</span>
          </div>
          <div className="flex justify-between items-center text-xs mt-2">
            <span className="text-zinc-400">Assigned Hierarchy Role:</span>
            <span className={`font-bold uppercase px-2 py-0.5 rounded text-[10px] ${
              role === 'superadmin' ? 'bg-amber-500/20 text-amber-300' :
              role === 'admin' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-zinc-800 text-zinc-300'
            }`}>
              {role}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs mt-2">
            <span className="text-zinc-400">Required Role:</span>
            <span className="font-bold uppercase px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300">
              {requiredLevel}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {openAuthModal && (
            <button
              onClick={openAuthModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-rose-500/20 transition-colors"
            >
              <span>Sign In with Admin Account</span>
            </button>
          )}

          {fallbackTab && (
            <button
              onClick={() => fallbackTab('new-order')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Return to Customer Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
