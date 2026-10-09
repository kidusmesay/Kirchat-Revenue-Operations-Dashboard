/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/views/OverviewView';
import { TransactionsView } from './components/views/TransactionsView';
import { CustomersView } from './components/views/CustomersView';
import { SettingsView } from './components/views/SettingsView';
import { NewTransactionModal } from './components/NewTransactionModal';
import { TransactionDetailDrawer } from './components/TransactionDetailDrawer';
import { CommandPalette } from './components/CommandPalette';
import { AuthModal } from './components/auth/AuthModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import {
  ActiveView,
  Currency,
  DateRange,
  Transaction,
  CustomerAccount,
  TransactionStatus,
} from './types/dashboard';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_CUSTOMERS,
  getRevenueTimeSeries,
} from './data/mockData';
import { Check, X, LayoutDashboard, Receipt, Users, Settings } from 'lucide-react';

function DashboardContent() {
  const { user } = useAuth();

  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [currency, setCurrency] = useState<Currency>('ETB');
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('kirchat_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {
      // ignore
    }
    return false; // Default: Light view (Daylight Ethiopian Palette)
  });

  // App data state
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [customers, setCustomers] = useState<CustomerAccount[]>(INITIAL_CUSTOMERS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals & Panels state
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync dark mode class and data attribute on root HTML document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      try {
        localStorage.setItem('kirchat_theme', 'dark');
      } catch {
        // ignore
      }
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      try {
        localStorage.setItem('kirchat_theme', 'light');
      } catch {
        // ignore
      }
    }
  }, [isDarkMode]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if ((e.key === 'n' || e.key === 'N') && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsNewTxModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const timeSeriesData = getRevenueTimeSeries(dateRange);

  // Mutation handlers
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Invoice ${newTx.id} issued for ${newTx.customerName}`);
  };

  const handleUpdateTransactionStatus = (id: string, newStatus: TransactionStatus) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    showToast(`Invoice ${id} marked as ${newStatus}`);
  };

  const handleUpdateCustomerHealth = (id: string, newHealthScore: number) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              healthScore: newHealthScore,
              status: newHealthScore >= 70 ? 'healthy' : 'at-risk',
            }
          : c
      )
    );
    showToast(`Commercial account health updated to ${newHealthScore}/100`);
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Ethiopian banking and commercial feeds synchronized');
    }, 600);
  };

  const handleExportCSV = () => {
    const header = 'Invoice ID,Customer,City,TIN,Amount,WHT (2%),VAT (15%),Net Settlement,Payment Rail,Date,Status\r\n';

    // Safe CSV cell encoder mitigating CSV Formula Injection (CWE-1236)
    const sanitizeCell = (val: string | number | undefined | null): string => {
      if (val === undefined || val === null) return '""';
      let str = String(val);
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = transactions
      .map(
        (t) =>
          [
            sanitizeCell(t.id),
            sanitizeCell(t.customerName),
            sanitizeCell(t.customerCity),
            sanitizeCell(t.tinNumber),
            sanitizeCell(t.amount),
            sanitizeCell(t.withholdingTax),
            sanitizeCell(t.vatAmount),
            sanitizeCell(t.netAmount),
            sanitizeCell(t.method),
            sanitizeCell(t.date),
            sanitizeCell(t.status),
          ].join(',')
      )
      .join('\r\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kirchat-ethiopia-ledger-${dateRange}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Commercial ledger exported to CSV');
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAF8] dark:bg-slate-950 text-[#1F2937] dark:text-slate-100 font-sans antialiased selection:bg-[#07864B] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#05683A] text-white px-4 py-2.5 text-xs font-semibold shadow-xl border border-[#07864B] animate-in slide-in-from-bottom-2 duration-200">
          <Check className="h-4 w-4 text-[#D4A017]" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 opacity-70 hover:opacity-100">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpenMobile={isOpenMobileSidebar}
        setIsOpenMobile={setIsOpenMobileSidebar}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopBar
          activeView={activeView}
          dateRange={dateRange}
          setDateRange={setDateRange}
          currency={currency}
          setCurrency={setCurrency}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onOpenNewTransaction={() => setIsNewTxModalOpen(true)}
          onExportCSV={handleExportCSV}
          onRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
          onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-7 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          {/* Executive Cockpit Overview */}
          {activeView === 'overview' && (
            <OverviewView
              dateRange={dateRange}
              currency={currency}
              timeSeriesData={timeSeriesData}
              transactions={transactions}
              customers={customers}
              isDarkMode={isDarkMode}
              onSelectTransaction={(tx) => setSelectedTransaction(tx)}
              onNavigateToView={(view) => setActiveView(view)}
            />
          )}

          {/* Invoices & Settlements Ledger */}
          {activeView === 'transactions' && (
            <ProtectedRoute
              viewTitle="Invoices &amp; Settlements Ledger"
              requiredRoles={['admin', 'finance']}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            >
              <TransactionsView
                transactions={transactions}
                currency={currency}
                onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                onOpenNewTransaction={() => setIsNewTxModalOpen(true)}
                onUpdateTransactionStatus={handleUpdateTransactionStatus}
              />
            </ProtectedRoute>
          )}

          {/* Commercial Accounts Portfolio */}
          {activeView === 'customers' && (
            <ProtectedRoute
              viewTitle="Commercial Accounts Portfolio"
              requiredRoles={['admin', 'finance']}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            >
              <CustomersView
                customers={customers}
                currency={currency}
                onUpdateCustomerHealth={handleUpdateCustomerHealth}
              />
            </ProtectedRoute>
          )}

          {/* Ethiopian Localization Settings */}
          {activeView === 'settings' && (
            <ProtectedRoute
              viewTitle="Ethiopian Localization &amp; Regulatory Setup"
              requiredRoles={['admin']}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            >
              <SettingsView
                currency={currency}
                setCurrency={setCurrency}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </ProtectedRoute>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (md:hidden) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around bg-[#FFFFFF]/95 dark:bg-slate-950/95 border-t border-[#E5E9E5] dark:border-slate-800 px-2 py-1.5 backdrop-blur-md shadow-lg">
        {[
          { id: 'overview' as ActiveView, label: 'Cockpit', icon: LayoutDashboard },
          { id: 'transactions' as ActiveView, label: 'Ledger', icon: Receipt },
          { id: 'customers' as ActiveView, label: 'Accounts', icon: Users },
          { id: 'settings' as ActiveView, label: 'Settings', icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive
                  ? 'text-[#07864B] dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`h-5 w-5 mb-0.5 ${isActive ? 'text-[#07864B] dark:text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Transaction Details Slide-out Drawer */}
      <TransactionDetailDrawer
        transaction={selectedTransaction}
        currency={currency}
        onClose={() => setSelectedTransaction(null)}
        onUpdateStatus={handleUpdateTransactionStatus}
      />

      {/* Issue Commercial Invoice Modal */}
      <NewTransactionModal
        isOpen={isNewTxModalOpen}
        onClose={() => setIsNewTxModalOpen(false)}
        currency={currency}
        onAddTransaction={handleAddTransaction}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectView={(view) => setActiveView(view)}
        onOpenNewTransaction={() => setIsNewTxModalOpen(true)}
        onExportCSV={handleExportCSV}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
