import React from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { ShieldAlert, Lock, ArrowRight, UserCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  viewTitle: string;
  onOpenAuthModal: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  viewTitle,
  onOpenAuthModal,
}) => {
  const { user, isAuthenticated, canAccessRoute } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 mb-4 ring-8 ring-amber-500/5">
          <Lock className="h-6 w-6" />
        </div>
        <div className="text-base font-bold text-slate-900 dark:text-white">
          Protected Workspace Route: {viewTitle}
        </div>
        <div className="max-w-md text-xs text-slate-500 mt-1 mb-6">
          This operational ledger requires verified authentication to inspect sensitive financials and client records.
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 rounded-lg bg-[#07864B] hover:bg-[#05683A] px-4 py-2 text-xs font-semibold text-white transition-colors shadow-xs"
          >
            <span>Sign In to Access</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const hasAccess = canAccessRoute(requiredRoles);

  if (!hasAccess) {
    return (
      <div className="flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 dark:text-rose-400 mb-4 ring-8 ring-rose-500/5">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="text-base font-bold text-slate-900 dark:text-white">
          Access Restricted: Role Insufficient
        </div>
        <div className="max-w-md text-xs text-slate-500 mt-1 mb-6">
          Your current account role is <strong className="text-slate-800 dark:text-slate-200 capitalize">"{user?.role}"</strong>.
          Access to {viewTitle} requires one of the following permissions:{' '}
          <strong className="text-slate-800 dark:text-slate-200">{requiredRoles?.join(', ')}</strong>.
        </div>
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <UserCheck className="h-4 w-4" />
          <span>Switch Account</span>
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
