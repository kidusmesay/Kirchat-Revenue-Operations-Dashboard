import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Users,
  Settings,
  Command,
  ChevronDown,
  Building2,
  X,
  LogOut,
  LogIn,
  Shield,
} from 'lucide-react';
import { ActiveView } from '../types/dashboard';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onOpenCommandPalette: () => void;
  onOpenAuthModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isOpenMobile,
  setIsOpenMobile,
  onOpenCommandPalette,
  onOpenAuthModal,
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { id: 'overview' as ActiveView, label: 'Executive Cockpit', icon: LayoutDashboard },
    { id: 'transactions' as ActiveView, label: 'Invoices & Ledger', icon: Receipt },
    { id: 'customers' as ActiveView, label: 'Commercial Accounts', icon: Users },
    { id: 'settings' as ActiveView, label: 'Ethiopian Localization', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#07864B] text-white font-bold tracking-wider shadow-xs">
              <span className="font-mono text-base">K</span>
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>KIRCHAT</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4A017]" title="Ethiopian Operations" />
              </div>
              <div className="text-[11px] font-medium text-slate-500">
                Ethiopian Operations
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsOpenMobile(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Organization Badge */}
        <div className="px-4 py-3">
          <button
            onClick={onOpenCommandPalette}
            className="group flex w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F8FAF8] dark:bg-slate-900/60 px-3 py-2 text-left hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Building2 className="h-4 w-4 shrink-0 text-[#07864B]" />
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                  {user?.company || 'Kirchat Ethiopia PLC'}
                </div>
                <div className="text-[10px] text-slate-500">Addis Ababa Headquarters</div>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
          </button>
        </div>

        {/* Command shortcut */}
        <div className="px-4 pb-2">
          <button
            onClick={onOpenCommandPalette}
            className="flex w-full items-center justify-between rounded-md bg-[#F8FAF8] dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Command className="h-3.5 w-3.5" />
              <span>Search &amp; Actions</span>
            </span>
            <kbd className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1 px-3 py-3 overflow-y-auto">
          <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setIsOpenMobile(false);
                }}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#07864B] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-[#F8FAF8] hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-100'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
              Timezone: EAT (Addis Ababa)
            </span>
            <span className="font-mono text-[11px] font-bold text-[#07864B]">UTC+3</span>
          </div>

          {isAuthenticated && user ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAF8] dark:bg-slate-900/60 p-2.5">
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-slate-700 bg-slate-200 dark:bg-slate-800">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = '<div class="flex h-full w-full items-center justify-center font-bold text-xs bg-[#07864B] text-white">KM</div>';
                        }
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-bold text-xs bg-[#07864B] text-white">
                      KM
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 capitalize">
                    <Shield className="h-3 w-3 text-[#07864B]" />
                    <span>{user.role} · Admin</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-md"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#07864B] hover:bg-[#05683A] py-2 text-xs font-semibold text-white transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
