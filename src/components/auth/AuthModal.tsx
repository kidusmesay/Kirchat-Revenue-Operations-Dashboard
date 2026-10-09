import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { Lock, Mail, User as UserIcon, Building, Shield, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<UserRole>('finance');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }
      const res = await login(email, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Failed to sign in.');
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid business email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      const res = await register({
        name,
        email,
        password,
        company: company || 'Acme Global',
        role,
      });

      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Registration failed.');
      }
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setError(null);
    setEmail(demoEmail);
    setPassword('password123');
    const res = await login(demoEmail, 'password123');
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto animate-in fade-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm p-1 rounded-md"
        >
          ✕
        </button>

        {/* Brand Lockup */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07864B] text-white font-bold shadow-xs">
            <span className="font-mono text-base">K</span>
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-[#1F2937] dark:text-white">
              Kirchat Identity
            </div>
            <div className="text-xs text-slate-500">
              {mode === 'login' ? 'Sign in to access your Ethiopian operations console' : 'Provision a new team member account'}
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#F3F6F3] dark:bg-slate-950 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Organization / Company
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Global Inc."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Access Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="admin">Administrator (Full Access)</option>
                    <option value="finance">Finance Manager (Ledger &amp; MRR)</option>
                    <option value="engineer">DevOps Engineer (Telemetry &amp; Nodes)</option>
                    <option value="viewer">Viewer (Read-Only Analytics)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              {mode === 'login' && (
                <span className="text-[11px] text-slate-400">Demo pwd: password123</span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-9 pr-9 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#07864B] hover:bg-[#05683A] py-2.5 text-xs font-semibold text-white transition-colors shadow-xs mt-2"
          >
            <span>{isLoading ? 'Processing...' : mode === 'login' ? 'Authenticate & Enter' : 'Complete Registration'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Quick Demo Credentials for Fast Evaluation */}
        <div className="mt-6 border-t border-[#E5E9E5] dark:border-slate-800 pt-4">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">
            One-Click Demo Profiles:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('kidusmesayt@gmail.com')}
              className="rounded-md border border-[#E5E9E5] dark:border-slate-800 bg-[#F8FAF8] dark:bg-slate-950 p-2 text-left hover:border-[#07864B] dark:hover:border-slate-600 transition-colors"
            >
              <div className="text-[11px] font-semibold text-[#1F2937] dark:text-slate-200 truncate">Kidus Mesay</div>
              <div className="text-[9px] text-[#07864B] dark:text-emerald-400 font-bold">Admin</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('abebe@kirchat.et')}
              className="rounded-md border border-[#E5E9E5] dark:border-slate-800 bg-[#F8FAF8] dark:bg-slate-950 p-2 text-left hover:border-[#07864B] dark:hover:border-slate-600 transition-colors"
            >
              <div className="text-[11px] font-semibold text-[#1F2937] dark:text-slate-200 truncate">Abebe K.</div>
              <div className="text-[9px] text-[#05683A] dark:text-emerald-500 font-bold">Finance</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('hana@kirchat.et')}
              className="rounded-md border border-[#E5E9E5] dark:border-slate-800 bg-[#F8FAF8] dark:bg-slate-950 p-2 text-left hover:border-[#07864B] dark:hover:border-slate-600 transition-colors"
            >
              <div className="text-[11px] font-semibold text-[#1F2937] dark:text-slate-200 truncate">Hana T.</div>
              <div className="text-[9px] text-[#D4A017] font-bold">Operations</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
