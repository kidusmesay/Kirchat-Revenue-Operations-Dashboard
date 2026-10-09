import React, { useState } from 'react';
import { Currency, DateRange } from '../../types/dashboard';
import { Check, Globe, Bell, Building2, Shield, Sun, Moon, Palette } from 'lucide-react';

interface SettingsViewProps {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  isDarkMode: boolean;
  setIsDarkMode: (d: boolean) => void;
  dateRange: DateRange;
  setDateRange: (r: DateRange) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currency,
  setCurrency,
  isDarkMode,
  setIsDarkMode,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [tinNumber, setTinNumber] = useState('0098412894');
  const [fiscalYear, setFiscalYear] = useState('2018/2019 EFY (2026/2027 GC)');
  const [bankBranch, setBankBranch] = useState('Commercial Bank of Ethiopia - Finfine Main Branch');

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <div className="text-base font-bold text-slate-900 dark:text-white">
          Workspace Settings &amp; Ethiopian Localization
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          Accounting currency, ERCA fiscal rules, theme style, and East Africa Timezone (EAT)
        </div>
      </div>

      {/* Interface Theme & Appearance */}
      <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-[#07864B]" />
          <div className="text-sm font-bold text-[#1F2937] dark:text-white">
            Interface Theme &amp; Visual Style
          </div>
        </div>
        <div className="text-xs text-slate-500">
          Switch between the Daylight Ethiopian Enterprise theme or the Slate Dark theme.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setIsDarkMode(false)}
            className={`flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              !isDarkMode
                ? 'border-[#07864B] bg-[#F0FDF4] dark:bg-emerald-950/20 shadow-xs ring-1 ring-[#07864B]'
                : 'border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#07864B] text-white">
              <Sun className="h-5 w-5 text-[#D4A017]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F2937] dark:text-white">
                  Daylight Theme (Ethiopian Standard)
                </span>
                {!isDarkMode && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#07864B] text-white text-xs">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Primary Green (#07864B), Gold (#D4A017), Crisp Canvas (#F8FAF8), and White Cards
              </div>
            </div>
          </button>

          <button
            onClick={() => setIsDarkMode(true)}
            className={`flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              isDarkMode
                ? 'border-[#07864B] bg-[#F0FDF4] dark:bg-emerald-950/20 shadow-xs ring-1 ring-[#07864B]'
                : 'border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white">
              <Moon className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F2937] dark:text-white">
                  Slate Dark Theme
                </span>
                {isDarkMode && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#07864B] text-white text-xs">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Deep slate background, slate cards, and high-contrast green telemetry
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Currency Settings */}
      <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#07864B]" />
          <div className="text-sm font-bold text-[#1F2937] dark:text-white">
            Default Accounting Currency
          </div>
        </div>
        <div className="text-xs text-slate-500">
          Financial ledger reports and invoice calculations will default to Ethiopian Birr (ETB).
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[
            { id: 'ETB' as Currency, name: 'Ethiopian Birr (Default)', symbol: 'ETB', rate: 'Base 1.00 ETB' },
            { id: 'USD' as Currency, name: 'US Dollar (Export Parity)', symbol: '$', rate: '~128.5 ETB' },
            { id: 'EUR' as Currency, name: 'Euro (NBE Benchmark)', symbol: '€', rate: '~138.2 ETB' },
          ].map((c) => {
            const isSelected = currency === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCurrency(c.id)}
                className={`flex flex-col items-start p-3.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-[#07864B] bg-[#F0FDF4] dark:bg-emerald-950/20 shadow-xs'
                    : 'border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-base font-bold text-[#1F2937] dark:text-white">
                    {c.symbol}
                  </span>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#07864B] text-white text-xs">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-[#1F2937] dark:text-slate-200 mt-1">
                  {c.name}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">{c.rate}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ethiopian Fiscal & Regulatory Setup */}
      <div className="rounded-xl border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900/70 p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-[#07864B]" />
          <div className="text-sm font-bold text-[#1F2937] dark:text-white">
            Ethiopian Ministry of Revenue (MoR / ERCA) Configuration
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#1F2937] dark:text-slate-300 font-semibold mb-1">
              Enterprise Tax Identification Number (TIN)
            </label>
            <input
              type="text"
              value={tinNumber}
              onChange={(e) => setTinNumber(e.target.value)}
              className="w-full rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-950 p-2.5 font-mono text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#07864B]"
            />
          </div>

          <div>
            <label className="block text-[#1F2937] dark:text-slate-300 font-semibold mb-1">
              Active Fiscal Year
            </label>
            <input
              type="text"
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="w-full rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-950 p-2.5 font-mono text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#07864B]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[#1F2937] dark:text-slate-300 font-semibold mb-1">
              Primary Settlement Bank &amp; Branch
            </label>
            <input
              type="text"
              value={bankBranch}
              onChange={(e) => setBankBranch(e.target.value)}
              className="w-full rounded-lg border border-[#E5E9E5] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-950 p-2.5 text-[#1F2937] dark:text-white focus:outline-hidden focus:border-[#07864B]"
            />
          </div>
        </div>

        <div className="border-t border-[#E5E9E5] dark:border-slate-800 pt-3 flex justify-between items-center text-xs text-slate-500">
          <div>Timezone: <strong className="text-[#1F2937] dark:text-white">Africa/Addis_Ababa (EAT, UTC+3)</strong></div>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-[#07864B] hover:bg-[#05683A] px-4 py-2 text-xs font-semibold text-white transition-colors shadow-xs"
          >
            {isSaved ? <Check className="h-3.5 w-3.5" /> : null}
            <span>{isSaved ? 'Settings Saved' : 'Save Ethiopian Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
