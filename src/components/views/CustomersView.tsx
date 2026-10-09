import React, { useState, useMemo } from 'react';
import {
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import { Currency, CustomerAccount } from '../../types/dashboard';
import { formatCurrency } from '../../data/mockData';

interface CustomersViewProps {
  customers: CustomerAccount[];
  currency: Currency;
  onUpdateCustomerHealth?: (id: string, newHealthScore: number) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  currency,
  onUpdateCustomerHealth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAccount | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      if (sectorFilter !== 'all' && cust.sector !== sectorFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          cust.name.toLowerCase().includes(q) ||
          cust.tinNumber.includes(q) ||
          cust.city.toLowerCase().includes(q) ||
          cust.contactPerson.toLowerCase().includes(q) ||
          cust.phone.includes(q)
        );
      }
      return true;
    });
  }, [customers, sectorFilter, searchQuery]);

  const totalPortfolioAnnual = customers.reduce((acc, c) => acc + c.mrr * 12, 0);

  return (
    <div className="space-y-5">
      {/* Top Portfolio Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 p-4 shadow-xs">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total Contract Value (Annualized)</div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#1F2937] dark:text-white tabular-nums">
            {formatCurrency(totalPortfolioAnnual, currency)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            {formatCurrency(totalPortfolioAnnual / 12, currency)} / month portfolio run rate
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 p-4 shadow-xs">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Enterprise Accounts in Good Standing</div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#07864B] dark:text-emerald-400 tabular-nums">
            {customers.filter((c) => c.status === 'healthy').length} of {customers.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Average account health: 91 / 100
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 p-4 shadow-xs">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Accounts Requiring Review</div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#D4A017] tabular-nums">
            {customers.filter((c) => c.status === 'at-risk').length} Account
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Sheger Retail (Daily transfer cap renewal)
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enterprise name, city, contact, or TIN..."
            className="w-full rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 pl-9 pr-4 py-2 text-xs text-[#1F2937] dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#07864B] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden shadow-xs cursor-pointer"
          >
            <option value="all">All Ethiopian Sectors</option>
            <option value="Coffee Export">Coffee Export</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Logistics & Transport">Logistics &amp; Transport</option>
            <option value="Wholesale & Retail">Wholesale &amp; Retail</option>
            <option value="Agro-Processing">Agro-Processing</option>
          </select>
        </div>
      </div>

      {/* Customer Accounts Directory (Adaptive Mobile Cards on <md, Table on >=md) */}
      <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 overflow-hidden shadow-xs">
        {/* Mobile Card List (<md) */}
        <div className="md:hidden divide-y divide-[#E5E9E5] dark:divide-slate-800">
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No Ethiopian commercial accounts match your search
            </div>
          ) : (
            filteredCustomers.map((c) => {
              const isHealthy = c.healthScore >= 70;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className="p-3.5 hover:bg-[#F3F6F3] dark:hover:bg-slate-800/40 active:bg-slate-100 dark:active:bg-slate-800 cursor-pointer space-y-2.5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {c.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{c.city} ({c.subcityOrZone})</span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        isHealthy
                          ? 'bg-emerald-50 text-[#07864B] dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-amber-50 text-[#D4A017] dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {c.healthScore}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    <div>
                      <span className="text-[11px] text-slate-500 font-medium">{c.sector}</span>
                      <span className="text-slate-300 dark:text-slate-700 mx-1.5">·</span>
                      <span className="text-[11px] font-mono text-slate-400">{c.contactPerson.split(' ')[0]}</span>
                    </div>

                    <div className="font-mono font-bold text-[#1F2937] dark:text-white tabular-nums">
                      {formatCurrency(c.mrr, currency)}/mo
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop/Tablet Table (>=md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E5E9E5] dark:border-slate-800 bg-[#F8FAF8] dark:bg-slate-900/90 text-slate-600 font-semibold">
                <th className="py-3 px-4">Enterprise &amp; Location</th>
                <th className="py-3 px-4">Sector &amp; Tier</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4 text-right">Monthly Value (ETB)</th>
                <th className="py-3 px-4 text-center">Health</th>
                <th className="py-3 px-4 text-right">Renewal Date</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCustomers.map((c) => {
                const isHealthy = c.healthScore >= 70;
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="hover:bg-[#F3F6F3] dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {c.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{c.city} ({c.subcityOrZone})</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-400">TIN: {c.tinNumber}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {c.sector}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {c.tier}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {c.contactPerson}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {c.phone}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(c.mrr, currency)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          isHealthy
                            ? 'bg-emerald-50 text-[#07864B] dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-amber-50 text-[#D4A017] dark:bg-amber-950/40 dark:text-amber-400'
                        }`}
                      >
                        {c.healthScore} / 100
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {c.renewalDate}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(c);
                        }}
                        className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Inspection Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-4 sm:p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E5E9E5] dark:border-slate-800 pb-3">
              <div>
                <div className="text-base font-bold text-[#1F2937] dark:text-white">
                  {selectedCustomer.name}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  TIN: {selectedCustomer.tinNumber} · {selectedCustomer.city}
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-[#F8FAF8] dark:bg-slate-800/60 border border-[#E5E9E5] dark:border-slate-800 p-3">
                <div className="text-slate-500 font-medium">Business Sector</div>
                <div className="mt-1 font-bold text-[#1F2937] dark:text-white">
                  {selectedCustomer.sector}
                </div>
              </div>

              <div className="rounded-lg bg-[#F8FAF8] dark:bg-slate-800/60 border border-[#E5E9E5] dark:border-slate-800 p-3">
                <div className="text-slate-500 font-medium">Monthly Contract Value</div>
                <div className="mt-1 font-bold font-mono text-[#07864B] dark:text-emerald-400">
                  {formatCurrency(selectedCustomer.mrr, currency)}
                </div>
              </div>

              <div className="rounded-lg bg-[#F8FAF8] dark:bg-slate-800/60 border border-[#E5E9E5] dark:border-slate-800 p-3">
                <div className="text-slate-500 font-medium">Authorized Contact</div>
                <div className="mt-1 font-semibold text-[#1F2937] dark:text-white">
                  {selectedCustomer.contactPerson}
                </div>
                <div className="text-[11px] font-mono text-slate-500">{selectedCustomer.phone}</div>
              </div>

              <div className="rounded-lg bg-[#F8FAF8] dark:bg-slate-800/60 border border-[#E5E9E5] dark:border-slate-800 p-3">
                <div className="text-slate-500 font-medium">Contract Cycle</div>
                <div className="mt-1 font-mono text-[#1F2937] dark:text-white font-semibold">
                  Joined: {selectedCustomer.joinedDate}
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Renews: {selectedCustomer.renewalDate}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E9E5] dark:border-slate-800">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg border border-[#E5E9E5] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-[#1F2937] dark:text-slate-300 hover:bg-[#F3F6F3] dark:hover:bg-slate-700 transition-colors shadow-xs"
              >
                Close
              </button>
              {onUpdateCustomerHealth && selectedCustomer.healthScore < 70 && (
                <button
                  onClick={() => {
                    onUpdateCustomerHealth(selectedCustomer.id, 95);
                    setSelectedCustomer(null);
                  }}
                  className="rounded-lg bg-[#07864B] text-white px-4 py-2 text-xs font-semibold hover:bg-[#05683A] shadow-xs"
                >
                  Verify Cap &amp; Reset Health
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
