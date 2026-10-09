import React from 'react';
import {
  Menu,
  Plus,
  Download,
  Calendar,
  Sun,
  Moon,
  RefreshCw,
  User as UserIcon,
  LogIn,
} from 'lucide-react';
import { ActiveView, Currency, DateRange } from '../types/dashboard';
import { useAuth } from '../context/AuthContext';

interface TopBarProps {
  activeView: ActiveView;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onOpenNewTransaction: () => void;
  onExportCSV: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  onOpenMobileSidebar: () => void;
  onOpenAuthModal: () => void;
}

const VIEW_TITLES: Record<ActiveView, { section: string; title: string }> = {
  overview: { section: 'Executive', title: 'Commercial Cockpit' },
  transactions: { section: 'Revenue', title: 'Invoices & Settlements' },
  customers: { section: 'Portfolio', title: 'Commercial Accounts' },
  settings: { section: 'Administration', title: 'Ethiopian Localization' },
};

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  dateRange,
  setDateRange,
  currency,
  setCurrency,
  isDarkMode,
  setIsDarkMode,
  onOpenNewTransaction,
  onExportCSV,
  onRefreshData,
  isRefreshing,
  onOpenMobileSidebar,
  onOpenAuthModal,
}) => {
  const currentViewMeta = VIEW_TITLES[activeView] || { section: 'Operations', title: 'Dashboard' };
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex flex-col w-full border-b border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF]/95 dark:bg-slate-950/95 backdrop-blur-md">
      {/* Primary Top Bar Row */}
      <div className="flex h-14 sm:h-16 w-full items-center justify-between px-3 sm:px-5 lg:px-6 gap-2">
        {/* Zone 1: Hamburger Menu + Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 min-w-0">
            <span className="font-bold text-slate-900 dark:text-white shrink-0 hidden sm:inline">
              Kirchat
            </span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="hidden md:inline shrink-0">{currentViewMeta.section}</span>
            <span className="text-slate-300 hidden md:inline">/</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px] sm:max-w-[220px] md:max-w-none">
              {currentViewMeta.title}
            </span>
          </div>
        </div>

        {/* Zone 2: Desktop Date Range & ETB Currency Selector (hidden on mobile/tablet) */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#F8FAF8] dark:bg-slate-900/60 p-1">
            <Calendar className="ml-1.5 h-3.5 w-3.5 text-slate-400" />
            {(['7d', '30d', '90d', '12m'] as DateRange[]).map((range) => {
              const isActive = dateRange === range;
              const labels: Record<DateRange, string> = {
                '7d': '7D',
                '30d': '30D',
                '90d': '90D',
                '12m': '12M (Annual)',
              };
              return (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`rounded-md px-2.5 py-1 text-xs font-mono font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white font-bold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  {labels[range]}
                </button>
              );
            })}
          </div>

          {/* Currency Switcher (ETB, USD, EUR) */}
          <div className="flex items-center rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#F8FAF8] dark:bg-slate-900/60 p-1">
            {(['ETB', 'USD', 'EUR'] as Currency[]).map((curr) => {
              const isActive = currency === curr;
              return (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`rounded-md px-2.5 py-1 text-xs font-mono font-bold transition-colors ${
                    isActive
                      ? 'bg-[#07864B] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  {curr}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zone 3: Actions (Responsive sizing & touch targets) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onRefreshData}
            title="Refresh Ethiopian Ledger Feed"
            aria-label="Refresh Data"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E9E5] dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#F3F6F3] dark:hover:bg-slate-900 transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-[#07864B]' : ''}`} />
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Switch to Daylight Light Theme' : 'Switch to Slate Dark Theme'}
            aria-label={isDarkMode ? 'Switch to Daylight Light Theme' : 'Switch to Slate Dark Theme'}
            className="flex h-8 items-center gap-1.5 px-2 sm:px-2.5 rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-[#F3F6F3] dark:hover:bg-slate-800 transition-colors text-xs font-semibold shadow-2xs"
          >
            {isDarkMode ? (
              <>
                <Sun className="h-3.5 w-3.5 text-[#D4A017]" />
                <span className="text-[11px] font-medium hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-slate-600" />
                <span className="text-[11px] font-medium hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <button
            onClick={onExportCSV}
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-[#E5E9E5] dark:border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenNewTransaction}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#07864B] hover:bg-[#05683A] px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white transition-colors shadow-xs whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Issue Invoice</span>
            <span className="sm:hidden">Invoice</span>
          </button>

          <button
            onClick={onOpenAuthModal}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E5E9E5] dark:border-slate-800 px-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <UserIcon className="h-3.5 w-3.5 text-[#07864B]" />
            <span className="hidden xl:inline truncate max-w-[90px]">{user?.name ? user.name.split(' ')[0] : 'Sign In'}</span>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Sub-bar: 1-Tap Date Horizon & Currency Selector */}
      <div className="lg:hidden flex items-center justify-between border-t border-[#E5E9E5] dark:border-slate-800 bg-[#F8FAF8] dark:bg-slate-900/90 px-3 py-1.5 gap-2 overflow-x-auto">
        <div className="flex items-center gap-1 shrink-0">
          <Calendar className="h-3 w-3 text-slate-400 mr-0.5" />
          {(['7d', '30d', '90d', '12m'] as DateRange[]).map((range) => {
            const isActive = dateRange === range;
            return (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`rounded-md px-2 py-0.5 text-[11px] font-mono font-medium transition-colors ${
                  isActive
                    ? 'bg-[#07864B] text-white shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-[#E5E9E5] dark:border-slate-700'
                }`}
              >
                {range.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {(['ETB', 'USD', 'EUR'] as Currency[]).map((curr) => {
            const isActive = currency === curr;
            return (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`rounded-md px-2 py-0.5 text-[11px] font-mono font-bold transition-colors ${
                  isActive
                    ? 'bg-[#07864B] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-[#E5E9E5] dark:border-slate-700'
                }`}
              >
                {curr}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
