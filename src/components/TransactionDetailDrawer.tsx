import React from 'react';
import { Currency, Transaction } from '../types/dashboard';
import { formatCurrency, formatCurrencyDetailed } from '../data/mockData';
import { X, Receipt, Printer, CheckCircle, MapPin, Phone, Building } from 'lucide-react';

interface TransactionDetailDrawerProps {
  transaction: Transaction | null;
  currency: Currency;
  onClose: () => void;
  onUpdateStatus?: (id: string, newStatus: any) => void;
}

export const TransactionDetailDrawer: React.FC<TransactionDetailDrawerProps> = ({
  transaction,
  currency,
  onClose,
  onUpdateStatus,
}) => {
  if (!transaction) return null;

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] dark:bg-slate-900 border-l border-[#E5E9E5] dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E5E9E5] dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Receipt className="h-5 w-5 text-[#07864B]" />
              <div>
                <div className="text-sm font-bold font-mono text-[#1F2937] dark:text-white">
                  {transaction.id}
                </div>
                <div className="text-[11px] text-slate-500">
                  Ethiopian Commercial Invoice &amp; Tax Receipt
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            {/* Amount Banner */}
            <div className="rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 p-4 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
              <div className="text-slate-500 flex justify-between">
                <span>Gross Settlement</span>
                <span className="font-semibold capitalize text-[#07864B] dark:text-emerald-400">
                  · {transaction.status}
                </span>
              </div>
              <div className="mt-1 text-3xl font-mono font-bold text-[#1F2937] dark:text-white tabular-nums">
                {formatCurrency(transaction.amount, currency)}
              </div>
              <div className="mt-2 flex items-center justify-between text-slate-600 dark:text-slate-300 font-mono border-t border-emerald-200/80 dark:border-emerald-800/80 pt-2">
                <span>Net Credited (less 2% WHT):</span>
                <span className="font-bold tabular-nums text-[#07864B] dark:text-emerald-400">
                  {formatCurrency(transaction.netAmount, currency)}
                </span>
              </div>
            </div>

            {/* Tax & ERCA Audit Details */}
            <div className="space-y-2">
              <div className="font-bold text-[#1F2937] dark:text-white">
                Ministry of Revenue (ERCA) Tax Schedule
              </div>
              <div className="rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/60 p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax Identification (TIN):</span>
                  <span className="font-mono font-bold text-[#1F2937] dark:text-white">{transaction.tinNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Standard VAT (15%):</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{formatCurrency(transaction.vatAmount, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Withholding Tax (2%):</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{formatCurrency(transaction.withholdingTax, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Reference No:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{transaction.referenceNumber}</span>
                </div>
              </div>
            </div>

            {/* Enterprise Information */}
            <div className="space-y-2">
              <div className="font-bold text-[#1F2937] dark:text-white">
                Commercial Enterprise Details
              </div>
              <div className="rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/60 p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Company Name:</span>
                  <span className="font-semibold text-[#1F2937] dark:text-white">{transaction.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">City / Location:</span>
                  <span className="text-slate-800 dark:text-slate-200">{transaction.customerCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{transaction.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Channel:</span>
                  <span className="font-semibold text-[#07864B] dark:text-emerald-400">{transaction.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Settlement Date:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{transaction.date}</span>
                </div>
              </div>
            </div>

            {/* Itemized Services */}
            <div className="space-y-2">
              <div className="font-bold text-[#1F2937] dark:text-white">
                Itemized Schedule
              </div>
              <div className="divide-y divide-[#E5E9E5] dark:divide-slate-800 rounded-lg border border-[#E5E9E5] dark:border-slate-800 overflow-hidden bg-[#FFFFFF] dark:bg-slate-900/60">
                {transaction.items.map((item) => (
                  <div key={item.id} className="p-3 flex justify-between">
                    <div>
                      <div className="font-medium text-[#1F2937] dark:text-white">{item.description}</div>
                      <div className="text-slate-500 font-mono text-[11px]">Qty: {item.qty}</div>
                    </div>
                    <div className="font-mono font-bold text-[#1F2937] dark:text-white">
                      {formatCurrency(item.qty * item.unitPrice, currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {transaction.notes && (
              <div className="rounded-lg bg-[#F8FAF8] dark:bg-slate-800/40 border border-[#E5E9E5] dark:border-slate-800 p-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                {transaction.notes}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#E5E9E5] dark:border-slate-800 p-3.5 sm:p-4 flex flex-col sm:flex-row justify-between gap-2.5 bg-[#FFFFFF] dark:bg-slate-900">
            <button
              onClick={printReceipt}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E9E5] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-[#1F2937] dark:text-slate-300 hover:bg-[#F3F6F3] dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              <Printer className="h-3.5 w-3.5 text-[#07864B]" />
              <span>Print Tax Invoice</span>
            </button>

            {onUpdateStatus && transaction.status !== 'completed' && (
              <button
                onClick={() => {
                  onUpdateStatus(transaction.id, 'completed');
                  onClose();
                }}
                className="flex items-center gap-1.5 rounded-lg bg-[#07864B] hover:bg-[#05683A] px-4 py-2 font-semibold text-white transition-colors shadow-xs"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Confirm Settlement</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
