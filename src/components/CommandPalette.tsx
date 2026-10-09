import React, { useEffect, useState } from 'react';
import {
  Search,
  LayoutDashboard,
  Receipt,
  Users,
  Server,
  Settings,
  Plus,
  BarChart2,
  Download,
  LogOut,
  User,
} from 'lucide-react';
import { ActiveView } from '../types/dashboard';
import { useAuth } from '../context/AuthContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: ActiveView) => void;
  onOpenNewTransaction: () => void;
  onExportCSV: () => void;
  onOpenAuthModal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onOpenNewTransaction,
  onExportCSV,
  onOpenAuthModal,
}) => {
  const [query, setQuery] = useState('');
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or shortcut
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'nav-overview',
      label: 'Go to Executive Cockpit (Overview)',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => onSelectView('overview'),
    },
    {
      id: 'nav-ledger',
      label: 'Go to Invoices & Ledger (ETB Settlements)',
      category: 'Navigation',
      icon: Receipt,
      action: () => onSelectView('transactions'),
    },
    {
      id: 'nav-customers',
      label: 'Go to Ethiopian Commercial Accounts',
      category: 'Navigation',
      icon: Users,
      action: () => onSelectView('customers'),
    },
    {
      id: 'nav-settings',
      label: 'Go to Ethiopian Localization & Settings',
      category: 'Navigation',
      icon: Settings,
      action: () => onSelectView('settings'),
    },
    {
      id: 'action-new-tx',
      label: 'Issue New Commercial Invoice (CBE / Telebirr)',
      category: 'Quick Actions',
      icon: Plus,
      action: onOpenNewTransaction,
    },
    {
      id: 'action-export-csv',
      label: 'Export Commercial Ledger (CSV)',
      category: 'Quick Actions',
      icon: Download,
      action: onExportCSV,
    },
    ...(isAuthenticated
      ? [
          {
            id: 'action-logout',
            label: `Sign Out (${user?.name} · ${user?.role})`,
            category: 'Account',
            icon: LogOut,
            action: logout,
          },
        ]
      : [
          {
            id: 'action-login',
            label: 'Sign In / Register Account',
            category: 'Account',
            icon: User,
            action: onOpenAuthModal,
          },
        ]),
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3 border-b border-[#E5E9E5] dark:border-slate-800">
          <Search className="h-4 w-4 text-[#07864B] mr-2.5" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, views, or actions..."
            className="w-full bg-transparent text-xs text-[#1F2937] dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          <kbd className="rounded border border-[#E5E9E5] dark:border-slate-800 bg-[#F8FAF8] dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No actions match "{query}"
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-slate-700 dark:text-slate-300 hover:bg-[#F3F6F3] dark:hover:bg-slate-800/80 hover:text-[#1F2937] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
