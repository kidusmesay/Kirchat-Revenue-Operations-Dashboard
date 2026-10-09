import React, { useState } from 'react';
import { Currency, PaymentMethod, Transaction } from '../types/dashboard';
import { formatCurrency } from '../data/mockData';
import { Plus, X, Building, Mail, Phone, MapPin } from 'lucide-react';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onAddTransaction: (tx: Transaction) => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  currency,
  onAddTransaction,
}) => {
  const [customerName, setCustomerName] = useState('Ethio Coffee Export PLC');
  const [customerEmail, setCustomerEmail] = useState('invoices@ethiocoffee-export.com');
  const [customerPhone, setCustomerPhone] = useState('+251 911 123 456');
  const [customerCity, setCustomerCity] = useState('Addis Ababa');
  const [tinNumber, setTinNumber] = useState('0029841029');
  const [planTier, setPlanTier] = useState<'Enterprise Corporate' | 'Growth Business' | 'Starter Merchant'>('Enterprise Corporate');
  const [amount, setAmount] = useState('250000');
  const [method, setMethod] = useState<PaymentMethod>('CBE Direct Transfer');
  const [itemDescription, setItemDescription] = useState('Commercial Export Clearing & Data Service');
  const [notes, setNotes] = useState('ERCA Withholding Tax certificate attached');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount) || 15000;
    const wht = Math.round(numAmount * 0.02); // 2% Ethiopian WHT
    const vat = Math.round(numAmount * 0.15); // 15% Ethiopian VAT

    const newTx: Transaction = {
      id: `TXN-ET-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: customerName.trim() || 'Addis Trading PLC',
      customerEmail: customerEmail.trim() || 'accounts@addistrading.com.et',
      customerPhone: customerPhone.trim() || '+251 911 123 456',
      customerCity: customerCity || 'Addis Ababa',
      customerRegion: `${customerCity} Commercial Zone`,
      planTier,
      amount: numAmount,
      currency,
      status: 'completed',
      date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
      timestamp: Date.now(),
      method,
      referenceNumber: `FT-${Math.floor(100000 + Math.random() * 900000)}`,
      tinNumber: tinNumber.trim() || '0019283746',
      withholdingTax: wht,
      vatAmount: vat,
      netAmount: numAmount - wht,
      items: [
        {
          id: `item-${Date.now()}`,
          description: itemDescription || 'Commercial Software License',
          qty: 1,
          unitPrice: numAmount,
        },
      ],
      notes: notes.trim() || undefined,
    };

    onAddTransaction(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-4 sm:p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07864B] text-white font-bold">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-bold text-[#1F2937] dark:text-white">
              Issue Ethiopian Commercial Invoice
            </div>
            <div className="text-xs text-slate-500">
              Generate invoice compliant with Ministry of Revenue (MoR) standards
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1F2937] dark:text-slate-300 mb-1">
                Enterprise Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-950 p-2.5 text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#07864B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2937] dark:text-slate-300 mb-1">
                Tax Identification Number (TIN)
              </label>
              <input
                type="text"
                required
                value={tinNumber}
                onChange={(e) => setTinNumber(e.target.value)}
                placeholder="10-digit TIN"
                className="w-full rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-950 p-2.5 font-mono text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#07864B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1F2937] dark:text-slate-300 mb-1">
                Phone Number (+251)
              </label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-950 p-2.5 font-mono text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#07864B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2937] dark:text-slate-300 mb-1">
                Ethiopian City
              </label>
              <select
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                className="w-full rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-950 p-2.5 text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#07864B] cursor-pointer"
              >
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Bahir Dar">Bahir Dar</option>
                <option value="Hawassa">Hawassa</option>
                <option value="Adama">Adama</option>
                <option value="Mekelle">Mekelle</option>
                <option value="Dire Dawa">Dire Dawa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1F2937] dark:text-slate-300 mb-1">
                Invoice Amount ({currency})
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-950 p-2.5 font-mono font-bold text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#07864B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1F2937] dark:text-slate-300 mb-1">
                Payment Channel
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-950 p-2.5 text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#07864B] cursor-pointer"
              >
                <option value="CBE Direct Transfer">CBE Direct Transfer</option>
                <option value="Telebirr Commercial">Telebirr Commercial</option>
                <option value="Awash Bank Wire">Awash Bank Wire</option>
                <option value="Bank of Abyssinia">Bank of Abyssinia</option>
                <option value="NBE Letter of Credit">NBE Letter of Credit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#1F2937] dark:text-slate-300 mb-1">
              Description of Goods / Services
            </label>
            <input
              type="text"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="w-full rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-950 p-2.5 text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#07864B]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E9E5] dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E5E9E5] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-800 px-4 py-2 text-[#1F2937] dark:text-slate-300 hover:bg-[#F3F6F3] dark:hover:bg-slate-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#07864B] hover:bg-[#05683A] px-4 py-2 font-semibold text-white transition-colors shadow-xs"
            >
              Record &amp; Issue Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
