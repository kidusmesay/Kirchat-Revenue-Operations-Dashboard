export type Currency = 'ETB' | 'USD' | 'EUR';

export type DateRange = '7d' | '30d' | '90d' | '12m';

export type TransactionStatus = 'completed' | 'processing' | 'failed' | 'refunded';

export type PaymentMethod = 
  | 'Telebirr Commercial' 
  | 'CBE Direct Transfer' 
  | 'Awash Bank Wire' 
  | 'Bank of Abyssinia' 
  | 'Dashen Bank Amole' 
  | 'NBE Letter of Credit';

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Transaction {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity: string;
  customerRegion: string;
  planTier: 'Enterprise Corporate' | 'Growth Business' | 'Starter Merchant';
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  date: string; // DD/MM/YYYY
  timestamp: number;
  method: PaymentMethod;
  referenceNumber: string;
  tinNumber: string;
  items: InvoiceItem[];
  withholdingTax: number; // 2% Ethiopian WHT
  vatAmount: number; // 15% Ethiopian VAT
  netAmount: number;
  notes?: string;
}

export interface CustomerAccount {
  id: string;
  name: string;
  tinNumber: string;
  domain: string;
  city: 'Addis Ababa' | 'Adama' | 'Bahir Dar' | 'Hawassa' | 'Mekelle' | 'Dire Dawa';
  subcityOrZone: string;
  tier: 'Enterprise Corporate' | 'Growth Business' | 'Starter Merchant';
  sector: 'Coffee Export' | 'Logistics & Transport' | 'Manufacturing' | 'Wholesale & Retail' | 'Agro-Processing';
  mrr: number; // In ETB
  healthScore: number; // 0 - 100
  status: 'healthy' | 'at-risk' | 'churned';
  contactPerson: string;
  phone: string;
  email: string;
  joinedDate: string; // DD/MM/YYYY
  renewalDate: string; // DD/MM/YYYY
}

export interface EthiopianRegionData {
  region: string;
  city: string;
  revenue: number;
  activeAccounts: number;
  growthRate: number;
}

export interface RevenueDataPoint {
  date: string;
  shortLabel: string;
  revenue: number;
  expenses: number;
  netMargin: number;
  targetBudget: number;
}

export type ActiveView = 'overview' | 'transactions' | 'customers' | 'settings';
