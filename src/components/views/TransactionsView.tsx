import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus,
  Check,
  AlertCircle,
  Building,
} from 'lucide-react';
import { Currency, Transaction, TransactionStatus } from '../../types/dashboard';
import { formatCurrency, formatCurrencyDetailed } from '../../data/mockData';

interface TransactionsViewProps {
  transactions: Transaction[];
  currency: Currency;
  onSelectTransaction: (tx: Transaction) => void;
  onOpenNewTransaction: () => void;
  onUpdateTransactionStatus?: (id: string, newStatus: TransactionStatus) => void;
}

type SortField = 'date' | 'amount' | 'customer' | 'status';
type SortOrder = 'asc' | 'desc';

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  currency,
  onSelectTransaction,
  onOpenNewTransaction,
  onUpdateTransactionStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
        if (methodFilter !== 'all' && tx.method !== methodFilter) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          return (
            tx.id.toLowerCase().includes(q) ||
            tx.customerName.toLowerCase().includes(q) ||
            tx.customerCity.toLowerCase().includes(q) ||
            tx.tinNumber.toLowerCase().includes(q) ||
            tx.referenceNumber.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'date') cmp = a.timestamp - b.timestamp;
        else if (sortField === 'amount') cmp = a.amount - b.amount;
        else if (sortField === 'customer') cmp = a.customerName.localeCompare(b.customerName);
        else if (sortField === 'status') cmp = a.status.localeCompare(b.status);
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [transactions, statusFilter, methodFilter, searchQuery, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredTransactions.map((t) => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const exportSelectedCSV = () => {
    const listToExport = transactions.filter((t) => selectedIds.has(t.id));
    const header = 'Invoice ID,Customer,City,TIN,Amount,WHT (2%),VAT (15%),Net Settlement,Payment Rail,Date,Status\r\n';

    // Safe CSV cell encoder mitigating CSV Formula Injection (CWE-1236)
    const sanitizeCell = (val: string | number | undefined | null): string => {
      if (val === undefined || val === null) return '""';
      let str = String(val);
      // Neutralize spreadsheet command prefixes (=, +, -, @, \t, \r)
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = listToExport
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
    link.setAttribute('download', `kirchat-ethiopia-ledger-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Ethiopian enterprise, TIN, or reference..."
            className="w-full rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 pl-9 pr-4 py-2 text-xs text-[#1F2937] dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#07864B] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden shadow-xs cursor-pointer"
          >
            <option value="all">All Payment Rails</option>
            <option value="CBE Direct Transfer">CBE Direct Transfer</option>
            <option value="Telebirr Commercial">Telebirr Commercial</option>
            <option value="Awash Bank Wire">Awash Bank Wire</option>
            <option value="Bank of Abyssinia">Bank of Abyssinia</option>
            <option value="NBE Letter of Credit">NBE Letter of Credit</option>
          </select>

          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 rounded-lg bg-[#07864B] hover:bg-[#05683A] text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Issue Invoice</span>
          </button>
        </div>
      </div>

      {/* Segmented Status Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E9E5] dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1 p-1 bg-[#F3F6F3] dark:bg-slate-900 rounded-lg overflow-x-auto no-scrollbar max-w-full">
          {[
            { key: 'all', label: 'All Invoices', short: 'All' },
            { key: 'completed', label: 'Settled & Cleared', short: 'Settled' },
            { key: 'processing', label: 'Bank Clearing', short: 'Clearing' },
            { key: 'failed', label: 'Overdue / Cap Exceeded', short: 'Overdue' },
          ].map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key as any)}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white text-[#1F2937] shadow-xs dark:bg-slate-800 dark:text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.short}</span>
              </button>
            );
          })}
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 text-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg">
            <span className="font-semibold text-emerald-900 dark:text-emerald-200">
              {selectedIds.size} selected
            </span>
            <button
              onClick={exportSelectedCSV}
              className="flex items-center gap-1 text-[#07864B] font-semibold hover:underline ml-2"
            >
              <Download className="h-3 w-3" />
              <span>Export CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Ledger Container (Adaptive Mobile Cards on <md, Full Table on >=md) */}
      <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 overflow-hidden shadow-xs">
        {/* Mobile Card List (<md) */}
        <div className="md:hidden divide-y divide-[#E5E9E5] dark:divide-slate-800">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No Ethiopian invoices match your filter
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const statusColor =
                tx.status === 'completed'
                  ? 'bg-emerald-50 text-[#07864B] dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900'
                  : tx.status === 'processing'
                  ? 'bg-amber-50 text-[#D4A017] dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900';

              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="p-3.5 hover:bg-[#F3F6F3] dark:hover:bg-slate-800/40 active:bg-slate-100 dark:active:bg-slate-800 cursor-pointer space-y-2 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {tx.id}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {tx.date}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${statusColor}`}>
                      {tx.status}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {tx.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{tx.customerCity}</span>
                        <span>·</span>
                        <span>{tx.method}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs font-bold text-[#1F2937] dark:text-white tabular-nums">
                        {formatCurrency(tx.amount, currency)}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        Net: {formatCurrency(tx.netAmount, currency)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop/Tablet Table (>=md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-[#E5E9E5] dark:border-slate-800 bg-[#F8FAF8] dark:bg-slate-900/90 text-slate-600 font-semibold">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={filteredTransactions.length > 0 && selectedIds.size === filteredTransactions.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-[#07864B] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th onClick={() => toggleSort('date')} className="py-3 px-4 cursor-pointer hover:text-slate-900">
                  <div className="flex items-center gap-1">
                    <span>Invoice &amp; Date (DD/MM/YYYY)</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th onClick={() => toggleSort('customer')} className="py-3 px-4 cursor-pointer hover:text-slate-900">
                  <div className="flex items-center gap-1">
                    <span>Ethiopian Enterprise &amp; City</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Payment Rail &amp; Reference</th>
                <th onClick={() => toggleSort('amount')} className="py-3 px-4 text-right cursor-pointer hover:text-slate-900">
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount (ETB)</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Tax (15% VAT / 2% WHT)</th>
                <th onClick={() => toggleSort('status')} className="py-3 px-4 text-right cursor-pointer hover:text-slate-900">
                  <div className="flex items-center justify-end gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map((tx) => {
                const isSelected = selectedIds.has(tx.id);
                const statusColor =
                  tx.status === 'completed'
                    ? 'text-[#07864B] dark:text-emerald-400'
                    : tx.status === 'processing'
                    ? 'text-[#D4A017]'
                    : 'text-rose-600';

                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className={`hover:bg-[#F3F6F3] dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-50/60 dark:bg-emerald-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4" onClick={(e) => toggleSelectRow(tx.id, e)}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-slate-300 text-[#07864B] focus:ring-0 cursor-pointer"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {tx.id}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {tx.date}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {tx.customerName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span>{tx.customerCity}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-400">TIN: {tx.tinNumber}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">{tx.method}</div>
                      <div className="text-slate-400 text-[10px]">{tx.referenceNumber}</div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(tx.amount, currency)}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 tabular-nums">
                        Net: {formatCurrency(tx.netAmount, currency)}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-500 tabular-nums">
                      <div>VAT: {formatCurrency(tx.vatAmount, currency)}</div>
                      <div className="text-[10px] text-slate-400">WHT: {formatCurrency(tx.withholdingTax, currency)}</div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className={`font-semibold capitalize text-xs ${statusColor}`}>
                        · {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Ledger Footer */}
        <div className="border-t border-[#E5E9E5] dark:border-slate-800 bg-[#F8FAF8] dark:bg-slate-900/80 px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900 dark:text-white">{filteredTransactions.length}</strong> records
          </div>
          <div className="font-mono text-[11px]">
            Filtered Volume:{' '}
            <strong className="text-slate-900 dark:text-white">
              {formatCurrency(
                filteredTransactions.reduce((acc, t) => acc + t.amount, 0),
                currency
              )}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
