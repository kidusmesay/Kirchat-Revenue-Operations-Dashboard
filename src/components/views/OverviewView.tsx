import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Building2,
  Receipt,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Currency, DateRange, RevenueDataPoint, Transaction, CustomerAccount } from '../../types/dashboard';
import { formatCurrency, formatCurrencyDetailed, formatCompactCurrency, ETHIOPIAN_REGIONAL_PERFORMANCE } from '../../data/mockData';

interface TrendBadgeProps {
  trend: number;
  label?: string;
  invert?: boolean;
}

const TrendBadge: React.FC<TrendBadgeProps> = ({
  trend,
  label = 'MoM',
  invert = false,
}) => {
  const isPositive = trend >= 0;
  // If invert is true (e.g. For pending receivables / uncollected backlog),
  // an increase is an operational risk / delayed cash collection (red),
  // whereas a decrease is favorable resolution (green).
  const isFavorable = invert ? !isPositive : isPositive;
  const absTrend = Math.abs(trend).toFixed(1);

  if (isFavorable) {
    return (
      <span
        className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold font-mono text-[#07864B] bg-[#EAEFEA] border border-[#D1D9D1] dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800/60 shadow-2xs"
        title={`${isPositive ? '+' : '-'}${absTrend}% ${label} trend`}
      >
        {isPositive ? (
          <ArrowUp className="h-3 w-3 stroke-[2.5] shrink-0 text-[#07864B] dark:text-emerald-400" />
        ) : (
          <ArrowDown className="h-3 w-3 stroke-[2.5] shrink-0 text-[#07864B] dark:text-emerald-400" />
        )}
        <span>{isPositive ? `+${absTrend}%` : `-${absTrend}%`} {label}</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold font-mono text-rose-600 bg-rose-50 border border-rose-200 dark:text-rose-400 dark:bg-rose-950/50 dark:border-rose-900/60 shadow-2xs"
      title={`${isPositive ? '+' : '-'}${absTrend}% ${label} trend`}
    >
      {isPositive ? (
        <ArrowUp className="h-3 w-3 stroke-[2.5] shrink-0 text-rose-600 dark:text-rose-400" />
      ) : (
        <ArrowDown className="h-3 w-3 stroke-[2.5] shrink-0 text-rose-600 dark:text-rose-400" />
      )}
      <span>{isPositive ? `+${absTrend}%` : `-${absTrend}%`} {label}</span>
    </span>
  );
};

interface OverviewViewProps {
  dateRange: DateRange;
  currency: Currency;
  timeSeriesData: RevenueDataPoint[];
  transactions: Transaction[];
  customers: CustomerAccount[];
  isDarkMode?: boolean;
  onSelectTransaction: (tx: Transaction) => void;
  onNavigateToView: (view: 'transactions' | 'customers' | 'settings') => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  currency,
  timeSeriesData,
  transactions,
  customers,
  isDarkMode = false,
  onSelectTransaction,
  onNavigateToView,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'revenue' | 'regions' | 'sectors'>('revenue');

  // Core KPI Calculations & MoM Growth Trends
  const latestData = timeSeriesData[timeSeriesData.length - 1] || {
    revenue: 5465000,
    netMargin: 4075000,
    expenses: 1390000,
    targetBudget: 4800000,
  };

  const previousData = timeSeriesData.length >= 2 ? timeSeriesData[timeSeriesData.length - 2] : null;

  const totalMonthlyRevenue = latestData.revenue;
  const netMargin = latestData.netMargin;
  const marginPercentage = Math.round((netMargin / (totalMonthlyRevenue || 1)) * 100);
  const targetVariance = Math.round(((totalMonthlyRevenue - latestData.targetBudget) / latestData.targetBudget) * 100);

  // Dynamic MoM growth calculations
  const revenueMoM = previousData && previousData.revenue > 0
    ? ((latestData.revenue - previousData.revenue) / previousData.revenue) * 100
    : 18.4;

  const netMarginMoM = previousData && previousData.netMargin > 0
    ? ((latestData.netMargin - previousData.netMargin) / previousData.netMargin) * 100
    : 22.7;

  // Active accounts expansion (+1 account added this cycle = +12.5% MoM expansion)
  const accountsMoM = 12.5;

  // Pending receivables / bank clearing backlog (+8.4% MoM volume awaiting clearing)
  const pendingReceivablesMoM = 8.4;

  const pendingReceivables = transactions
    .filter((t) => t.status === 'processing')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalActiveEnterprises = customers.length;

  // Sector Breakdown data for pie chart
  const sectorData = [
    { name: 'Coffee Export', value: 1250000, color: '#07864B' }, // Primary Green
    { name: 'Manufacturing', value: 1880000, color: '#05683A' }, // Dark Green
    { name: 'Wholesale & Retail', value: 1035000, color: '#D4A017' }, // Gold Accent
    { name: 'Logistics & Transport', value: 570000, color: '#0ea5e9' }, // Sky
    { name: 'Agro-Processing', value: 520000, color: '#8b5cf6' }, // Purple
  ];

  // Theme-aware chart tokens for light mode brilliance
  const tooltipStyle = isDarkMode
    ? {
        backgroundColor: '#0F172A',
        borderColor: '#1E293B',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'JetBrains Mono, monospace',
        color: '#FFFFFF',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
      }
    : {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E9E5',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'JetBrains Mono, monospace',
        color: '#1F2937',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      };

  const gridStroke = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const axisColor = isDarkMode ? '#94A3B8' : '#4B5563';
  const pieBorderColor = isDarkMode ? '#0F172A' : '#FFFFFF';

  return (
    <div className="space-y-5">
      {/* 1. Prioritized Top Business KPIs (Clean 4-card grid with MoM growth trend indicators) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Realized Monthly Revenue */}
        <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 p-4 transition-all shadow-xs hover:border-[#D1D9D1] dark:hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span>Gross Monthly Revenue</span>
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              Target: {targetVariance >= 0 ? `+${targetVariance}%` : `${targetVariance}%`}
            </span>
          </div>
          <div className="mt-2 flex items-baseline flex-wrap gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#1F2937] dark:text-white font-mono tabular-nums">
              {formatCurrency(totalMonthlyRevenue, currency)}
            </span>
            <TrendBadge trend={revenueMoM} label="MoM" />
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            Target: {formatCurrency(latestData.targetBudget, currency)} ({targetVariance >= 0 ? `+${targetVariance}%` : `${targetVariance}%`} budget pacing)
          </div>
        </div>

        {/* KPI 2: Net Operating Profit */}
        <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 p-4 transition-all shadow-xs hover:border-[#D1D9D1] dark:hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span>Net Operating Margin</span>
            <span className="font-mono text-[11px] text-[#07864B] dark:text-emerald-400 font-bold">
              {marginPercentage}% Return
            </span>
          </div>
          <div className="mt-2 flex items-baseline flex-wrap gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#1F2937] dark:text-white font-mono tabular-nums">
              {formatCurrency(netMargin, currency)}
            </span>
            <TrendBadge trend={netMarginMoM} label="MoM" />
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            After 2% WHT, 15% VAT, and operational overhead
          </div>
        </div>

        {/* KPI 3: Active Commercial Clients */}
        <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 p-4 transition-all shadow-xs hover:border-[#D1D9D1] dark:hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span>Active Commercial Accounts</span>
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              6 Regional Hubs
            </span>
          </div>
          <div className="mt-2 flex items-baseline flex-wrap gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#1F2937] dark:text-white font-mono tabular-nums">
              {totalActiveEnterprises} Key Accounts
            </span>
            <TrendBadge trend={accountsMoM} label="MoM" />
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Addis Ababa, Bahir Dar, Hawassa, Adama, Mekelle
          </div>
        </div>

        {/* KPI 4: Pending Collections & Receivables */}
        <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 p-4 transition-all shadow-xs hover:border-[#D1D9D1] dark:hover:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span>Pending Receivables</span>
            <span className="font-mono text-[11px] text-[#D4A017] font-bold">
              Bank Clearing
            </span>
          </div>
          <div className="mt-2 flex items-baseline flex-wrap gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#1F2937] dark:text-white font-mono tabular-nums">
              {formatCurrency(pendingReceivables, currency)}
            </span>
            <TrendBadge trend={pendingReceivablesMoM} label="MoM" invert={true} />
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            1 invoice awaiting Telebirr / CBE clearance
          </div>
        </div>
      </div>

      {/* 2. Visual Analytics Suite (Unified Modern Chart Card with Segmented Switcher) */}
      <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E9E5] dark:border-slate-800">
          <div>
            <div className="text-sm font-bold text-[#1F2937] dark:text-white">
              {activeChartTab === 'revenue' && 'Revenue & Cash Generation Trajectory'}
              {activeChartTab === 'regions' && 'Commercial Performance by Ethiopian Region'}
              {activeChartTab === 'sectors' && 'Portfolio Revenue Share by Business Sector'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Ethiopian commercial operations (Addis Ababa headquarters and regional hubs)
            </div>
          </div>

          {/* Segmented Chart View Selector (Responsive grid on mobile, flex on desktop) */}
          <div className="w-full sm:w-auto grid grid-cols-3 sm:flex items-center rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#F3F6F3] dark:bg-slate-950 p-1">
            <button
              onClick={() => setActiveChartTab('revenue')}
              className={`rounded-md px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-center transition-colors ${
                activeChartTab === 'revenue'
                  ? 'bg-white text-[#1F2937] shadow-xs dark:bg-slate-800 dark:text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveChartTab('regions')}
              className={`rounded-md px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-center transition-colors ${
                activeChartTab === 'regions'
                  ? 'bg-white text-[#1F2937] shadow-xs dark:bg-slate-800 dark:text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Regions
            </button>
            <button
              onClick={() => setActiveChartTab('sectors')}
              className={`rounded-md px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-center transition-colors ${
                activeChartTab === 'sectors'
                  ? 'bg-white text-[#1F2937] shadow-xs dark:bg-slate-800 dark:text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Sectors
            </button>
          </div>
        </div>

        {/* Chart View Content */}
        <div className="pt-3 sm:pt-4 h-64 sm:h-72 w-full">
          {activeChartTab === 'revenue' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="etbRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#07864B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#07864B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="shortLabel" stroke={axisColor} fontSize={11} tickLine={false} />
                <YAxis
                  stroke={axisColor}
                  fontSize={11}
                  tickLine={false}
                  width={56}
                  tickFormatter={(val) => formatCompactCurrency(val, currency)}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [formatCurrencyDetailed(Number(value), currency), name]}
                  contentStyle={tooltipStyle}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Gross Revenue (ETB)"
                  stroke="#07864B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#etbRevenueGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="targetBudget"
                  name="Budget Target"
                  stroke="#D4A017"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Operating Cost"
                  stroke="#f43f5e"
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'regions' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ETHIOPIAN_REGIONAL_PERFORMANCE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="region" stroke={axisColor} fontSize={11} tickLine={false} />
                <YAxis
                  stroke={axisColor}
                  fontSize={11}
                  tickLine={false}
                  width={56}
                  tickFormatter={(val) => formatCompactCurrency(val, currency)}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrencyDetailed(Number(val), currency), 'Regional Revenue']}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="revenue" name="Regional Revenue (ETB)" fill="#07864B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'sectors' && (
            <div className="h-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke={pieBorderColor} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatCurrencyDetailed(Number(val), currency), 'Revenue']}
                    contentStyle={tooltipStyle}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* 3. Operational Activity & High-Impact Ethiopian Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Invoices Ledger (2 Cols) */}
        <div className="lg:col-span-2 rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-[#1F2937] dark:text-white">
                Recent Settlements &amp; Invoices
              </div>
              <div className="text-xs text-slate-500">
                Settled through CBE, Telebirr, and National Bank of Ethiopia rails
              </div>
            </div>
            <button
              onClick={() => onNavigateToView('transactions')}
              className="text-xs font-bold text-[#07864B] dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View All Invoices</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-[#E5E9E5] dark:divide-slate-800">
            {transactions.slice(0, 5).map((tx) => {
              const statusColor =
                tx.status === 'completed'
                  ? 'text-[#07864B] dark:text-emerald-400'
                  : tx.status === 'processing'
                  ? 'text-[#D4A017]'
                  : 'text-rose-600 dark:text-rose-400';

              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="group flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg hover:bg-[#F3F6F3] dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {tx.id}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="truncate text-xs font-bold text-[#1F2937] dark:text-white">
                        {tx.customerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                      <span>{tx.method}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{tx.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tx.customerCity}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-bold text-[#1F2937] dark:text-white tabular-nums">
                      {formatCurrency(tx.amount, currency)}
                    </div>
                    <div className={`text-[11px] capitalize font-semibold ${statusColor}`}>
                      · {tx.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ethiopian Regional Watchlist & ERCA Tax Summary (1 Col) */}
        <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 p-5 space-y-4 shadow-xs">
          <div className="text-sm font-bold text-[#1F2937] dark:text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#07864B]" />
            <span>Regional Revenue Breakdown</span>
          </div>

          <div className="space-y-3">
            {ETHIOPIAN_REGIONAL_PERFORMANCE.slice(0, 4).map((item) => (
              <div key={item.region} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.region}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[#1F2937] dark:text-white font-bold tabular-nums">
                      {formatCurrency(item.revenue, currency)}
                    </span>
                    <span className="inline-flex items-center text-[10px] font-mono font-semibold text-[#07864B] dark:text-emerald-400">
                      <ArrowUp className="h-2.5 w-2.5 stroke-[2.5] mr-0.5" />
                      +{item.growthRate}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#EAEFEA] dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-[#07864B] rounded-full"
                    style={{ width: `${Math.round((item.revenue / 2605000) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E5E9E5] dark:border-slate-800 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Standard VAT (15%):</span>
              <span className="font-mono text-[#1F2937] dark:text-slate-200 font-bold tabular-nums">
                {formatCurrency(totalMonthlyRevenue * 0.15, currency)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Withholding Tax (2%):</span>
              <span className="font-mono text-[#1F2937] dark:text-slate-200 font-bold tabular-nums">
                {formatCurrency(totalMonthlyRevenue * 0.02, currency)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Timezone:</span>
              <span className="font-mono text-[#1F2937] dark:text-slate-200 font-medium">
                East Africa Time (EAT)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
