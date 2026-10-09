import { CustomerAccount, DateRange, EthiopianRegionData, RevenueDataPoint, Transaction } from '../types/dashboard';

export const CURRENCY_SYMBOLS: Record<'ETB' | 'USD' | 'EUR', string> = {
  ETB: 'ETB',
  USD: '$',
  EUR: '€',
};

// National Bank of Ethiopia (NBE) indicative benchmark rates
export const EXCHANGE_RATES: Record<'ETB' | 'USD' | 'EUR', number> = {
  ETB: 1.0,
  USD: 1 / 128.5, // 1 USD ~ 128.5 ETB
  EUR: 1 / 138.2, // 1 EUR ~ 138.2 ETB
};

/**
 * Strictly formats amounts according to Ethiopian business conventions:
 * e.g. ETB 15,000 / ETB 250,000 / ETB 1,250,000
 */
export function formatCurrency(amount: number, currency: 'ETB' | 'USD' | 'EUR' = 'ETB'): string {
  if (currency === 'ETB') {
    const rounded = Math.round(amount);
    return `ETB ${rounded.toLocaleString('en-US')}`;
  }
  const converted = amount * (EXCHANGE_RATES[currency] || 1.0);
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatCurrencyDetailed(amount: number, currency: 'ETB' | 'USD' | 'EUR' = 'ETB'): string {
  if (currency === 'ETB') {
    return `ETB ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  const converted = amount * (EXCHANGE_RATES[currency] || 1.0);
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompactCurrency(amount: number, currency: 'ETB' | 'USD' | 'EUR' = 'ETB'): string {
  const converted = currency === 'ETB' ? amount : amount * (EXCHANGE_RATES[currency] || 1.0);
  const symbol = currency === 'ETB' ? 'ETB ' : CURRENCY_SYMBOLS[currency] || '$';
  const abs = Math.abs(converted);
  if (abs >= 1_000_000) {
    return `${symbol}${(converted / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${symbol}${(converted / 1_000).toFixed(0)}k`;
  }
  return `${symbol}${Math.round(converted)}`;
}

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-ET-84920',
    customerName: 'Ethio Coffee Export PLC',
    customerEmail: 'invoices@ethiocoffee-export.com',
    customerPhone: '+251 911 123 456',
    customerCity: 'Addis Ababa',
    customerRegion: 'Addis Ababa (Bole Subcity)',
    planTier: 'Enterprise Corporate',
    amount: 1250000,
    currency: 'ETB',
    status: 'completed',
    date: '08/10/2026',
    timestamp: 1791400000000,
    method: 'NBE Letter of Credit',
    referenceNumber: 'CBE-LC-2026-0918',
    tinNumber: '0029841029',
    withholdingTax: 25000,
    vatAmount: 187500,
    netAmount: 1225000,
    items: [
      { id: 'item-1', description: 'Annual Export Logistics & Traceability Suite (Yirgacheffe Grade 1)', qty: 1, unitPrice: 1000000 },
      { id: 'item-2', description: 'ECX Floor Data Bridge & Customs Clearing Integration', qty: 1, unitPrice: 250000 },
    ],
    notes: 'National Bank of Ethiopia foreign exchange allocation verified. Direct clearance through CBE Bole Branch.',
  },
  {
    id: 'TXN-ET-84919',
    customerName: 'Blue Nile Manufacturing',
    customerEmail: 'finance@bluenile-mfg.et',
    customerPhone: '+251 922 654 321',
    customerCity: 'Bahir Dar',
    customerRegion: 'Amhara (Industrial Park)',
    planTier: 'Enterprise Corporate',
    amount: 780000,
    currency: 'ETB',
    status: 'completed',
    date: '07/10/2026',
    timestamp: 1791390000000,
    method: 'CBE Direct Transfer',
    referenceNumber: 'CBE-FT-84919-AA',
    tinNumber: '0018472911',
    withholdingTax: 15600,
    vatAmount: 117000,
    netAmount: 764400,
    items: [
      { id: 'item-1', description: 'Factory Floor Automation & Raw Material Inventory Hub', qty: 1, unitPrice: 650000 },
      { id: 'item-2', description: 'Industrial Park Fiber Line Link & Redundancy', qty: 1, unitPrice: 130000 },
    ],
    notes: 'Commercial Bank of Ethiopia transfer confirmation received. Receipt issued.',
  },
  {
    id: 'TXN-ET-84918',
    customerName: 'Abyssinia Logistics',
    customerEmail: 'ops@abyssinia-logistics.com',
    customerPhone: '+251 911 884 219',
    customerCity: 'Addis Ababa',
    customerRegion: 'Addis Ababa (Kazanchis)',
    planTier: 'Growth Business',
    amount: 320000,
    currency: 'ETB',
    status: 'processing',
    date: '06/10/2026',
    timestamp: 1791330000000,
    method: 'Telebirr Commercial',
    referenceNumber: 'TLB-COMM-9921820',
    tinNumber: '0037194821',
    withholdingTax: 6400,
    vatAmount: 48000,
    netAmount: 313600,
    items: [
      { id: 'item-1', description: 'Djibouti Corridor Fleet Telematics & GPS Tracking (45 Trucks)', qty: 1, unitPrice: 320000 },
    ],
    notes: 'Telebirr merchant settlement in progress via Ethio Telecom business gateway.',
  },
  {
    id: 'TXN-ET-84917',
    customerName: 'Addis Trading PLC',
    customerEmail: 'accounts@addistrading.com.et',
    customerPhone: '+251 912 345 678',
    customerCity: 'Addis Ababa',
    customerRegion: 'Addis Ababa (Merkato Commercial)',
    planTier: 'Enterprise Corporate',
    amount: 950000,
    currency: 'ETB',
    status: 'completed',
    date: '06/10/2026',
    timestamp: 1791300000000,
    method: 'Awash Bank Wire',
    referenceNumber: 'AWASH-TX-77401',
    tinNumber: '0041829471',
    withholdingTax: 19000,
    vatAmount: 142500,
    netAmount: 931000,
    items: [
      { id: 'item-1', description: 'Multi-Warehouse Wholesale ERP & POS Synchronization (8 Outlets)', qty: 1, unitPrice: 850000 },
      { id: 'item-2', description: 'ERCA Fiscal Printer Telemetry Link', qty: 1, unitPrice: 100000 },
    ],
    notes: 'ERCA tax clearance documentation verified. Net settlement finalized.',
  },
  {
    id: 'TXN-ET-84916',
    customerName: 'Hawassa Textile & Apparel',
    customerEmail: 'procurement@hawassatex.com',
    customerPhone: '+251 930 112 884',
    customerCity: 'Hawassa',
    customerRegion: 'Sidama (Hawassa Eco-Industrial)',
    planTier: 'Growth Business',
    amount: 450000,
    currency: 'ETB',
    status: 'completed',
    date: '05/10/2026',
    timestamp: 1791230000000,
    method: 'Bank of Abyssinia',
    referenceNumber: 'BOA-RTGS-34901',
    tinNumber: '0055291840',
    withholdingTax: 9000,
    vatAmount: 67500,
    netAmount: 441000,
    items: [
      { id: 'item-1', description: 'Garment Export Supply Chain Monitoring Module', qty: 1, unitPrice: 450000 },
    ],
  },
  {
    id: 'TXN-ET-84915',
    customerName: 'Sheger Retail Stores',
    customerEmail: 'finance@sheger-stores.et',
    customerPhone: '+251 944 556 778',
    customerCity: 'Addis Ababa',
    customerRegion: 'Addis Ababa (Piassa)',
    planTier: 'Starter Merchant',
    amount: 85000,
    currency: 'ETB',
    status: 'failed',
    date: '05/10/2026',
    timestamp: 1791200000000,
    method: 'Telebirr Commercial',
    referenceNumber: 'TLB-ERR-49102',
    tinNumber: '0061928473',
    withholdingTax: 0,
    vatAmount: 0,
    netAmount: 85000,
    items: [
      { id: 'item-1', description: 'Quarterly Smart POS & Telebirr Cash Register', qty: 1, unitPrice: 85000 },
    ],
    notes: 'Transaction declined due to Telebirr merchant daily transfer cap. Retrying tomorrow.',
  },
  {
    id: 'TXN-ET-84914',
    customerName: 'Rift Valley Agro-Industry',
    customerEmail: 'billing@riftvalley-agro.et',
    customerPhone: '+251 915 223 344',
    customerCity: 'Adama',
    customerRegion: 'Oromia (Adama Expressway Zone)',
    planTier: 'Growth Business',
    amount: 520000,
    currency: 'ETB',
    status: 'completed',
    date: '04/10/2026',
    timestamp: 1791140000000,
    method: 'Dashen Bank Amole',
    referenceNumber: 'DASH-FT-66291',
    tinNumber: '0028194018',
    withholdingTax: 10400,
    vatAmount: 78000,
    netAmount: 509600,
    items: [
      { id: 'item-1', description: 'Cold Chain Storage Telemetry & Edible Oil Processing ERP', qty: 1, unitPrice: 520000 },
    ],
  },
  {
    id: 'TXN-ET-84913',
    customerName: 'Tigray Renewable Power PLC',
    customerEmail: 'ops@tigray-renewables.et',
    customerPhone: '+251 914 776 543',
    customerCity: 'Mekelle',
    customerRegion: 'Tigray (Mekelle Industrial Zone)',
    planTier: 'Enterprise Corporate',
    amount: 1100000,
    currency: 'ETB',
    status: 'completed',
    date: '03/10/2026',
    timestamp: 1791050000000,
    method: 'CBE Direct Transfer',
    referenceNumber: 'CBE-MK-88192',
    tinNumber: '0071829402',
    withholdingTax: 22000,
    vatAmount: 165000,
    netAmount: 1078000,
    items: [
      { id: 'item-1', description: 'Off-Grid Solar Micro-Grid Controller Licenses (Year 2)', qty: 1, unitPrice: 1100000 },
    ],
  },
  {
    id: 'TXN-ET-84912',
    customerName: 'Dire Dawa Transit Services',
    customerEmail: 'accounts@diredawatransit.et',
    customerPhone: '+251 925 889 900',
    customerCity: 'Dire Dawa',
    customerRegion: 'Dire Dawa Free Trade Zone',
    planTier: 'Growth Business',
    amount: 250000,
    currency: 'ETB',
    status: 'completed',
    date: '02/10/2026',
    timestamp: 1790970000000,
    method: 'Awash Bank Wire',
    referenceNumber: 'AWASH-DD-11029',
    tinNumber: '0019283746',
    withholdingTax: 5000,
    vatAmount: 37500,
    netAmount: 245000,
    items: [
      { id: 'item-1', description: 'Dry Port Bonded Warehouse Customs Dispatch', qty: 1, unitPrice: 250000 },
    ],
  },
  {
    id: 'TXN-ET-84911',
    customerName: 'Habesha Telecom Solutions',
    customerEmail: 'contact@habeshatelecom.et',
    customerPhone: '+251 911 445 566',
    customerCity: 'Addis Ababa',
    customerRegion: 'Addis Ababa (Bole Medhanialem)',
    planTier: 'Starter Merchant',
    amount: 15000,
    currency: 'ETB',
    status: 'completed',
    date: '01/10/2026',
    timestamp: 1790850000000,
    method: 'Telebirr Commercial',
    referenceNumber: 'TLB-TX-55441',
    tinNumber: '0038472910',
    withholdingTax: 300,
    vatAmount: 2250,
    netAmount: 14700,
    items: [
      { id: 'item-1', description: 'SMS Notification Gateway Credits (50,000 Push Notifications)', qty: 1, unitPrice: 15000 },
    ],
  },
];

export const INITIAL_CUSTOMERS: CustomerAccount[] = [
  {
    id: 'CUST-ET-001',
    name: 'Ethio Coffee Export PLC',
    tinNumber: '0029841029',
    domain: 'ethiocoffee-export.com',
    city: 'Addis Ababa',
    subcityOrZone: 'Bole Subcity, Woreda 03',
    tier: 'Enterprise Corporate',
    sector: 'Coffee Export',
    mrr: 1250000,
    healthScore: 98,
    status: 'healthy',
    contactPerson: 'Abebe Kebede',
    phone: '+251 911 123 456',
    email: 'akebede@ethiocoffee-export.com',
    joinedDate: '15/03/2024',
    renewalDate: '15/03/2027',
  },
  {
    id: 'CUST-ET-002',
    name: 'Addis Trading PLC',
    tinNumber: '0041829471',
    domain: 'addistrading.com.et',
    city: 'Addis Ababa',
    subcityOrZone: 'Kirkos Subcity, Kazanchis',
    tier: 'Enterprise Corporate',
    sector: 'Wholesale & Retail',
    mrr: 950000,
    healthScore: 94,
    status: 'healthy',
    contactPerson: 'Hana Tesfaye',
    phone: '+251 912 345 678',
    email: 'htesfaye@addistrading.com.et',
    joinedDate: '10/06/2024',
    renewalDate: '10/06/2027',
  },
  {
    id: 'CUST-ET-003',
    name: 'Blue Nile Manufacturing',
    tinNumber: '0018472911',
    domain: 'bluenile-mfg.et',
    city: 'Bahir Dar',
    subcityOrZone: 'Industrial Park Phase 1',
    tier: 'Enterprise Corporate',
    sector: 'Manufacturing',
    mrr: 780000,
    healthScore: 92,
    status: 'healthy',
    contactPerson: 'Dawit Bekele',
    phone: '+251 922 654 321',
    email: 'dbekele@bluenile-mfg.et',
    joinedDate: '22/11/2023',
    renewalDate: '22/11/2026',
  },
  {
    id: 'CUST-ET-004',
    name: 'Abyssinia Logistics',
    tinNumber: '0037194821',
    domain: 'abyssinia-logistics.com',
    city: 'Addis Ababa',
    subcityOrZone: 'Yeka Subcity, Megenagna',
    tier: 'Growth Business',
    sector: 'Logistics & Transport',
    mrr: 320000,
    healthScore: 88,
    status: 'healthy',
    contactPerson: 'Meron Alemu',
    phone: '+251 911 884 219',
    email: 'malemu@abyssinia-logistics.com',
    joinedDate: '14/02/2025',
    renewalDate: '14/02/2027',
  },
  {
    id: 'CUST-ET-005',
    name: 'Rift Valley Agro-Industry',
    tinNumber: '0028194018',
    domain: 'riftvalley-agro.et',
    city: 'Adama',
    subcityOrZone: 'Adama Special Economic Zone',
    tier: 'Growth Business',
    sector: 'Agro-Processing',
    mrr: 520000,
    healthScore: 91,
    status: 'healthy',
    contactPerson: 'Kidus Mesay',
    phone: '+251 911 000 111',
    email: 'kidus@riftvalley-agro.et',
    joinedDate: '18/08/2024',
    renewalDate: '18/08/2027',
  },
  {
    id: 'CUST-ET-006',
    name: 'Hawassa Textile & Apparel',
    tinNumber: '0055291840',
    domain: 'hawassatex.com',
    city: 'Hawassa',
    subcityOrZone: 'Hawassa Industrial Park',
    tier: 'Growth Business',
    sector: 'Manufacturing',
    mrr: 450000,
    healthScore: 86,
    status: 'healthy',
    contactPerson: 'Tigist Haile',
    phone: '+251 930 112 884',
    email: 'thaile@hawassatex.com',
    joinedDate: '05/01/2025',
    renewalDate: '05/01/2027',
  },
  {
    id: 'CUST-ET-007',
    name: 'Tigray Renewable Power PLC',
    tinNumber: '0071829402',
    domain: 'tigray-renewables.et',
    city: 'Mekelle',
    subcityOrZone: 'Quiha Industrial Hub',
    tier: 'Enterprise Corporate',
    sector: 'Manufacturing',
    mrr: 1100000,
    healthScore: 90,
    status: 'healthy',
    contactPerson: 'Berhe Gebre',
    phone: '+251 914 776 543',
    email: 'bgebre@tigray-renewables.et',
    joinedDate: '12/04/2024',
    renewalDate: '12/04/2027',
  },
  {
    id: 'CUST-ET-008',
    name: 'Sheger Retail Stores',
    tinNumber: '0061928473',
    domain: 'sheger-stores.et',
    city: 'Addis Ababa',
    subcityOrZone: 'Arada Subcity, Piassa',
    tier: 'Starter Merchant',
    sector: 'Wholesale & Retail',
    mrr: 85000,
    healthScore: 48,
    status: 'at-risk',
    contactPerson: 'Ephrem Tadesse',
    phone: '+251 944 556 778',
    email: 'etadesse@sheger-stores.et',
    joinedDate: '19/06/2025',
    renewalDate: '19/10/2026',
  },
];

export const ETHIOPIAN_REGIONAL_PERFORMANCE: EthiopianRegionData[] = [
  { region: 'Addis Ababa', city: 'Addis Ababa', revenue: 2605000, activeAccounts: 54, growthRate: 18.4 },
  { region: 'Amhara', city: 'Bahir Dar', revenue: 780000, activeAccounts: 16, growthRate: 14.2 },
  { region: 'Oromia', city: 'Adama', revenue: 520000, activeAccounts: 12, growthRate: 16.8 },
  { region: 'Sidama', city: 'Hawassa', revenue: 450000, activeAccounts: 9, growthRate: 11.5 },
  { region: 'Tigray', city: 'Mekelle', revenue: 1100000, activeAccounts: 8, growthRate: 22.0 },
  { region: 'Dire Dawa', city: 'Dire Dawa', revenue: 250000, activeAccounts: 5, growthRate: 9.3 },
];

export function getRevenueTimeSeries(range: DateRange): RevenueDataPoint[] {
  switch (range) {
    case '7d':
      return [
        { date: '02/10/2026', shortLabel: 'Thu', revenue: 480000, expenses: 140000, netMargin: 340000, targetBudget: 420000 },
        { date: '03/10/2026', shortLabel: 'Fri', revenue: 650000, expenses: 180000, netMargin: 470000, targetBudget: 500000 },
        { date: '04/10/2026', shortLabel: 'Sat', revenue: 380000, expenses: 110000, netMargin: 270000, targetBudget: 350000 },
        { date: '05/10/2026', shortLabel: 'Sun', revenue: 290000, expenses: 95000, netMargin: 195000, targetBudget: 300000 },
        { date: '06/10/2026', shortLabel: 'Mon', revenue: 890000, expenses: 220000, netMargin: 670000, targetBudget: 750000 },
        { date: '07/10/2026', shortLabel: 'Tue', revenue: 940000, expenses: 245000, netMargin: 695000, targetBudget: 800000 },
        { date: '08/10/2026', shortLabel: 'Wed', revenue: 1250000, expenses: 290000, netMargin: 960000, targetBudget: 900000 },
      ];
    case '30d':
      return [
        { date: '15/09/2026', shortLabel: 'Week 1', revenue: 3850000, expenses: 1120000, netMargin: 2730000, targetBudget: 3500000 },
        { date: '22/09/2026', shortLabel: 'Week 2', revenue: 4120000, expenses: 1190000, netMargin: 2930000, targetBudget: 3800000 },
        { date: '29/09/2026', shortLabel: 'Week 3', revenue: 4580000, expenses: 1260000, netMargin: 3320000, targetBudget: 4100000 },
        { date: '08/10/2026', shortLabel: 'Current', revenue: 5465000, expenses: 1390000, netMargin: 4075000, targetBudget: 4800000 },
      ];
    case '90d':
      return [
        { date: 'Jul 2026', shortLabel: 'Hamle', revenue: 12400000, expenses: 3600000, netMargin: 8800000, targetBudget: 11500000 },
        { date: 'Aug 2026', shortLabel: 'Nehase', revenue: 13900000, expenses: 3950000, netMargin: 9950000, targetBudget: 12800000 },
        { date: 'Sep 2026', shortLabel: 'Meskerem', revenue: 15400000, expenses: 4200000, netMargin: 11200000, targetBudget: 14000000 },
        { date: 'Oct 2026', shortLabel: 'Tikimt (QTD)', revenue: 17200000, expenses: 4600000, netMargin: 12600000, targetBudget: 15500000 },
      ];
    case '12m':
      return [
        { date: 'Nov 2025', shortLabel: 'Hidar', revenue: 2600000, expenses: 820000, netMargin: 1780000, targetBudget: 2400000 },
        { date: 'Dec 2025', shortLabel: 'Tahsas', revenue: 2850000, expenses: 890000, netMargin: 1960000, targetBudget: 2600000 },
        { date: 'Jan 2026', shortLabel: 'Tir', revenue: 3100000, expenses: 940000, netMargin: 2160000, targetBudget: 2800000 },
        { date: 'Feb 2026', shortLabel: 'Yekatit', revenue: 3400000, expenses: 990000, netMargin: 2410000, targetBudget: 3000000 },
        { date: 'Mar 2026', shortLabel: 'Megabit', revenue: 3750000, expenses: 1050000, netMargin: 2700000, targetBudget: 3300000 },
        { date: 'Apr 2026', shortLabel: 'Miyazya', revenue: 4100000, expenses: 1120000, netMargin: 2980000, targetBudget: 3600000 },
        { date: 'May 2026', shortLabel: 'Ginbot', revenue: 4350000, expenses: 1180000, netMargin: 3170000, targetBudget: 3900000 },
        { date: 'Jun 2026', shortLabel: 'Sene', revenue: 4650000, expenses: 1240000, netMargin: 3410000, targetBudget: 4100000 },
        { date: 'Jul 2026', shortLabel: 'Hamle', revenue: 4900000, expenses: 1300000, netMargin: 3600000, targetBudget: 4400000 },
        { date: 'Aug 2026', shortLabel: 'Nehase', revenue: 5100000, expenses: 1340000, netMargin: 3760000, targetBudget: 4600000 },
        { date: 'Sep 2026', shortLabel: 'Meskerem', revenue: 5350000, expenses: 1370000, netMargin: 3980000, targetBudget: 4800000 },
        { date: 'Oct 2026', shortLabel: 'Tikimt', revenue: 5465000, expenses: 1390000, netMargin: 4075000, targetBudget: 5000000 },
      ];
  }
}
