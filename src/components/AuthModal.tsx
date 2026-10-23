import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SUPER_ADMIN_EMAIL } from '../data/defaultServices';
import {
  X,
  LogIn,
  Crown,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (role: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const {
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    authError,
    adminAccounts
  } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      onLoginSuccess?.('superadmin');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in encountered an issue.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      if (authMode === 'login') {
        await loginWithEmail(email, password);
        const cleanEmail = email.trim().toLowerCase();
        if (cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
          onLoginSuccess?.('superadmin');
        } else if (adminAccounts.some(a => a.email.toLowerCase() === cleanEmail)) {
          onLoginSuccess?.('admin');
        } else {
          onLoginSuccess?.('user');
        }
      } else {
        await registerWithEmail(email, password, name);
        onLoginSuccess?.('user');
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-500/25">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black text-white">InstaGrow Account Login</h2>
          <p className="text-xs text-zinc-400 mt-1">Sign in with Google, or email and password</p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 bg-zinc-950 p-1 rounded-xl mb-5 text-xs font-bold border border-zinc-800">
          <button
            onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
            className={`py-1.5 rounded-lg transition-colors ${
              authMode === 'login' ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthMode('register'); setErrorMessage(null); }}
            className={`py-1.5 rounded-lg transition-colors ${
              authMode === 'register' ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Google Sign-in button */}
        <div className="mb-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
          <p className="text-[10px] text-zinc-500 text-center mt-1.5 flex items-center justify-center space-x-1">
            <Crown className="w-3 h-3 text-amber-400" />
            <span>Signing in with <strong>{SUPER_ADMIN_EMAIL}</strong> opens Super Admin panel.</span>
          </p>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500 font-bold">Or Email &amp; Password</span>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {(errorMessage || authError) && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage || authError}</span>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          {authMode === 'register' && (
            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivers"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                required
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div className="bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
            <strong className="text-zinc-300">Staff &amp; Admin Login:</strong> Enter your assigned admin email and password.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-95 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-500/20 transition-all"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
