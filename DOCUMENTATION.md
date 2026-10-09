# Kirchat — Enterprise Commercial & Revenue Dashboard Documentation

> **System Version:** 2.4-ET  
> **Target Jurisdiction:** Federal Democratic Republic of Ethiopia  
> **Base Currency:** Ethiopian Birr (ETB)  
> **Timezone:** Africa/Addis_Ababa (East Africa Time — EAT, UTC+3)  
> **Date Format:** DD/MM/YYYY  

---

## 1. Dashboard Overview

### Purpose
**Kirchat** is a purpose-built commercial operations, revenue intelligence, and financial settlement dashboard tailored for Ethiopian business enterprises, conglomerates, exporters, logistics operators, and manufacturing plants. 

The platform aggregates multi-channel Ethiopian financial flows (including Commercial Bank of Ethiopia, Telebirr, Awash Bank, Bank of Abyssinia, and National Bank of Ethiopia Letters of Credit) into an executive cockpit. It automates Ethiopian fiscal tax schedules (15% Standard VAT and 2% Withholding Tax), tracks regional performance across Ethiopian economic hubs, and safeguards commercial account health.

### Intended Users
1. **Executive Management & Managing Directors (e.g., Kidus Mesay):** Monitor high-level gross revenue velocity, operating margins, budget variance, and enterprise retention across regions.
2. **Finance Directors & Chief Accountants (e.g., Abebe Kebede, Meron Alemu):** Audit daily settlements, reconcile bank transfer references, manage ERCA tax obligations, and export fiscal CSV audit trails.
3. **Commercial & Operations Managers (e.g., Hana Tesfaye, Dawit Bekele):** Oversee enterprise accounts, track contract renewals, and ensure delivery milestones along key transit corridors (e.g., Djibouti corridor logistics).
4. **Operations & Compliance Officers:** Verify Tax Identification Numbers (TIN), monitor daily Telebirr merchant caps, and oversee foreign exchange allocations.

---

## 2. Features & Modules

| Module Name | Business Purpose | Key Capabilities |
| :--- | :--- | :--- |
| **Executive Cockpit** | Executive performance and strategic tracking | Top 4 high-priority business KPIs, Recharts revenue velocity charts, regional share analysis, and recent settlement feed. |
| **Invoices & Ledger** | Financial operations and tax reconciliation | Comprehensive invoice ledger, live search by TIN/Enterprise, status filtering (`Settled`, `Bank Clearing`, `Overdue`), 15% VAT and 2% WHT schedule, and instant CSV export. |
| **Commercial Accounts** | Client portfolio and account retention | Directory of key Ethiopian accounts, regional clustering (Addis Ababa, Bahir Dar, Hawassa, Adama, Mekelle, Dire Dawa), health scoring (0–100), and contact tracking. |
| **Ethiopian Localization & Settings** | Regulatory compliance and system preferences | Base currency configuration (ETB default with USD/EUR benchmarks), Ministry of Revenue TIN registry, active Ethiopian Fiscal Year (EFY), and primary bank branch linkage. |
| **Identity & Access Management** | Role-based governance and route security | Built-in authentication, role-based route protection (`Admin`, `Finance`, `DevOps/Commercial`, `Viewer`), one-click demo credentials, and session persistence. |
| **Command Palette (`⌘K`)** | Operator speed and productivity | Universal keyboard-driven search for views, quick invoice generation, and ledger exports. |

---

## 3. Key Metrics & KPI Calculations

### 1. Gross Realized Monthly Revenue
* **Definition:** Total commercial inflows recognized across all cleared and settled client contracts within the active billing cycle.
* **Calculation:**  
  $$\text{Gross Revenue} = \sum_{i=1}^{n} \text{Amount of Cleared Invoices}_i$$
* **Current Operational Benchmark:** `ETB 5,465,000` (+18.4% MoM pacing).

### 2. Net Operating Margin
* **Definition:** Realized revenue remaining after subtracting direct operational expenses, 2% Ethiopian Withholding Tax (WHT), and allocated operational costs.
* **Calculation:**  
  $$\text{Net Operating Margin} = \text{Gross Revenue} - \text{Operating Expenses} - \text{Withholding Tax}$$
* **Current Operational Benchmark:** `ETB 4,075,000` (74.6% net margin ratio).

### 3. Active Commercial Accounts
* **Definition:** Count of distinct Ethiopian enterprises currently holding active multi-year service agreements with Kirchat across key regional economic clusters.
* **Current Operational Benchmark:** `104 Key Accounts` spanning Addis Ababa, Bahir Dar, Hawassa, Adama, Mekelle, and Dire Dawa.

### 4. Pending Collections & Bank Receivables
* **Definition:** Total invoice value currently in transit or awaiting settlement via bank clearance rails (Telebirr merchant clearance, CBE RTGS, or NBE Letter of Credit verification).
* **Calculation:**  
  $$\text{Pending Collections} = \sum \text{Amount of Invoices with status 'processing'}$$
* **Current Operational Benchmark:** `ETB 320,000` (1 invoice pending Telebirr batch release).

### 5. ERCA Tax Obligations (VAT & WHT)
* **Standard Value Added Tax (VAT):** 15% levied on non-exempt gross invoice values:
  $$\text{VAT} = \text{Invoice Base Amount} \times 0.15$$
* **Withholding Tax (WHT):** 2% deducted at source by authorized withholding entities (registered category 'A' taxpayers):
  $$\text{WHT} = \text{Invoice Base Amount} \times 0.02$$

---

## 4. Data Sources & Refresh Cadence

1. **Banking & Financial Rails (Integrated Mock Engine):**
   - **Commercial Bank of Ethiopia (CBE Direct Transfer / Core Banking):** Real-time fund transfers, transaction IDs (`CBE-FT-...`), and RTGS settlement notices.
   - **Ethio Telecom (Telebirr Commercial Merchant Gateway):** High-volume micro-settlements and merchant wallet transfers (`TLB-COMM-...`).
   - **Private Commercial Banks (Awash Bank, Bank of Abyssinia, Dashen Bank Amole):** Wire transfers and local payroll/supplier disbursements.
   - **National Bank of Ethiopia (NBE):** Foreign exchange allocations and Letter of Credit (LC) tracking for agricultural exporters (e.g., Ethio Coffee Export PLC).
2. **Update Cadence:**
   - **Real-Time Webhooks:** Immediate status updates upon invoice settlement.
   - **On-Demand Manual Refresh:** Operator trigger via the TopBar synchronization control with active feedback indicators.
   - **Local Cache Persistence:** State cached in browser `localStorage` (`kirchat_auth_user`, `kirchat_registered_users`).

---

## 5. Dashboard Sections

### A. Executive Cockpit (`OverviewView.tsx`)
- **Top Metric Cards:** 4 high-contrast KPI cards prioritizing Gross Revenue, Net Margin, Active Accounts, and Pending Receivables.
- **Visual Analytics Suite (Recharts):**
  - **Revenue Velocity Tab:** Area and line chart showing gross monthly revenue vs. operating expenses and target budget curves.
  - **Regional Share Tab:** Bar chart visualizing revenue generated across Addis Ababa, Amhara, Oromia, Sidama, Tigray, and Dire Dawa.
  - **Sector Share Tab:** Donut chart illustrating commercial concentration (Coffee Export, Manufacturing, Wholesale/Retail, Logistics, Agro-Processing).
- **Recent Settlements Feed:** Top 5 recent invoices with direct modal inspect triggers.
- **Regional Breakdown Table:** Revenue share progress bars paired with VAT/WHT tax summaries.

### B. Invoices & Ledger (`TransactionsView.tsx`)
- **Universal Search:** Real-time filtering by enterprise name, TIN number, city, or transaction reference.
- **Payment Rail Dropdown:** Filter by CBE, Telebirr, Awash Bank, Bank of Abyssinia, or NBE LC.
- **Status Tabs:** Segmented buttons for `All Invoices`, `Settled & Cleared`, `Bank Clearing`, and `Overdue / Cap Exceeded`.
- **Multi-Selection & Batch Actions:** Checkbox selection for multi-invoice CSV export.
- **Detail Inspection Drawer:** Slide-out drawer presenting itemized services, ERCA tax breakdowns, and printable tax receipts.

### C. Commercial Accounts Portfolio (`CustomersView.tsx`)
- **Summary Cards:** Total Annualized Contract Value, Good Standing accounts, and Watchlist accounts.
- **Sector Filtering:** Filter by Coffee Export, Manufacturing, Logistics, Wholesale/Retail, and Agro-Processing.
- **Enterprise Table:** Displays company name, city, subcity/zone, TIN number, authorized contact, phone (+251), and renewal dates.
- **Inspection Modal:** Detailed client profile with one-click health remediation action.

### D. Ethiopian Localization & Settings (`SettingsView.tsx`)
- **Accounting Currency Toggle:** Seamless switching between Ethiopian Birr (ETB default), US Dollar (USD), and Euro (EUR).
- **Ministry of Revenue (MoR / ERCA) Configuration:** Active Enterprise TIN (`0098412894`) and Ethiopian Fiscal Year calendar (`2018/2019 EFY`).
- **Primary Settlement Bank:** Linked commercial bank account and branch.

---

## 6. User Roles & Access Control (RBAC)

The system implements strict Role-Based Access Control enforced by `<ProtectedRoute />`:

| Role Name | Typical Title | Permissions & Route Access |
| :--- | :--- | :--- |
| **Administrator (`admin`)** | Kidus Mesay (Managing Director / CEO) | **Full Root Access:** Can access Executive Cockpit, Invoices Ledger, Commercial Accounts, and Settings. Can issue invoices, override account health, and configure currency/tax settings. |
| **Finance Manager (`finance`)** | Abebe Kebede / Meron Alemu (Chief Accountant) | **Financial Authority:** Can access Executive Cockpit, Invoices Ledger, and Commercial Accounts. Can issue commercial invoices, confirm settlements, and export CSV tax reports. Blocked from workspace administrative settings. |
| **DevOps & Commercial (`engineer`)** | Dawit Bekele / Elena Rostova (Operations Lead) | **Commercial Operations:** Can access Executive Cockpit and Commercial Accounts. Restricted from modifying financial ledger settings and fiscal tax rules. |
| **Viewer (`viewer`)** | Hana Tesfaye / External Auditor | **Read-Only Access:** Can inspect the Executive Cockpit. Blocked from financial invoice creation and account modifications. |

---

## 7. Business Workflows

### Workflow 1: Issuing a Commercial Ethiopian Invoice
1. Operator clicks **"+ Issue Invoice"** in the TopBar or Ledger.
2. Operator enters enterprise name (e.g., `Ethio Coffee Export PLC`), 10-digit TIN, phone number (`+251 911 123 456`), and city (`Addis Ababa`).
3. Operator selects payment rail (`CBE Direct Transfer` or `Telebirr Commercial`).
4. System automatically computes:
   - Base Amount: e.g., `ETB 250,000`
   - 2% Withholding Tax: `ETB 5,000`
   - 15% VAT: `ETB 37,500`
   - Net Settlement Credited: `ETB 245,000`
5. Invoice is issued with reference `FT-...`, immediately reflected in the ledger and KPI totals.

### Workflow 2: Exporting Fiscal Audit CSV
1. Accountant navigates to **"Invoices & Ledger"**.
2. Selects payment rail or status filters (or checks specific rows).
3. Clicks **"Export CSV"** or **"Export Selected CSV"**.
4. Browser generates and downloads `kirchat-ethiopia-ledger-[timestamp].csv` containing all TINs, VAT, WHT, and settlement references.

### Workflow 3: Remediating an At-Risk Account
1. Operations Manager navigates to **"Commercial Accounts"**.
2. Identifies flagged account (e.g., `Sheger Retail Stores`, health score 48 due to Telebirr merchant daily cap).
3. Clicks **"Inspect"** to review contact (`Ephrem Tadesse`, `+251 944 556 778`).
4. Verifies daily cap expansion with Ethio Telecom and clicks **"Verify Cap & Reset Health"**.
5. Account status returns to healthy (`95/100`).

---

## 8. Technical Architecture

```
Kirchat Web Application (SPA)
│
├── Presentation Layer (React 19 + Tailwind CSS v4)
│   ├── Component Hierarchy: App -> Sidebar / TopBar -> Active View (Overview / Ledger / Accounts / Settings)
│   ├── Data Visualization: Recharts (ResponsiveContainer, AreaChart, BarChart, PieChart)
│   ├── Iconography: Lucide React
│   └── Typography: Plus Jakarta Sans (Prose) + JetBrains Mono (Tabular Numeral Figures)
│
├── State & Context Management
│   ├── AuthProvider (User sessions, RBAC, localStorage persistence)
│   ├── Currency & DateRange State (Reactive recalculation across all views)
│   └── Ledger Mutation State (Live array operations with immutable updates)
│
├── Localization Engine
│   ├── formatCurrency: Formats ETB with comma thousand separators (e.g., "ETB 250,000")
│   ├── formatCurrencyDetailed: Formats ETB with 2 decimal precision (e.g., "ETB 1,250,000.00")
│   ├── DD/MM/YYYY Gregorian & Ethiopian Fiscal Year (EFY) Date Notation
│   └── East Africa Time (EAT, UTC+3) Timezone Anchor
│
└── Build & Bundling
    ├── Vite 8 + ESNext Bundler
    └── TypeScript Strict Type Checking
```

---

## 9. Security & Governance

1. **Authentication:** Email and password credential validation backed by persistent local storage with zero plain-text leaks in UI.
2. **Route Authorization Guard (`<ProtectedRoute />`):** Intercepts unauthorized navigation, displaying clear permission feedback rather than crashing or leaking sensitive data.
3. **Data Sanitization & Integrity:** Strict TypeScript interfaces for all transactions, prevent malformed tax entries or negative balances.
4. **Zero External Unverified Image CDNs:** All portraits generated and stored as local high-resolution assets with graceful SVG fallback initials.

---

## 10. Ethiopian Localization Specifications

| Attribute | Standard Value | Implementation Details |
| :--- | :--- | :--- |
| **Primary Currency** | Ethiopian Birr (`ETB`) | Displayed as `ETB 15,000`, `ETB 250,000`, `ETB 1,250,000`. |
| **Secondary Currencies** | US Dollar (`USD`), Euro (`EUR`) | Benchmarked against National Bank of Ethiopia indicative rates. |
| **Date Format** | `DD/MM/YYYY` | Consistent across all transaction timestamps and contract renewals. |
| **Timezone** | `Africa/Addis_Ababa` (EAT) | Standard East Africa Time (UTC+3). |
| **Tax Standard** | Ministry of Revenue (MoR) | Automatic 15% VAT calculation and 2% Withholding Tax deduction. |
| **Brand Palette** | Ethiopian Heritage Palette | Primary Green (`#07864B`), Dark Green (`#05683A`), Gold Accent (`#D4A017`), Background (`#F8FAF8`), Card (`#FFFFFF`), Text (`#1F2937`). |

---

## 11. Future Improvements & Scalability

1. **Direct Core Banking API Integration:**
   - Integrate direct REST webhooks with the **Commercial Bank of Ethiopia (CBE) API Gateway** for automated RTGS receipt validation.
   - Connect with the **Ethio Telecom Telebirr B2B Gateway** for automated merchant settlement webhooks.
2. **Ethiopian Calendar (Ge'ez Calendar) Converter:**
   - Implement a dual-calendar toggle allowing operators to switch between Gregorian Calendar (GC) and Ethiopian Calendar (EC / ዓ.ም).
3. **Multi-Branch Hierarchy:**
   - Add granular permission scoping so regional branch managers in Bahir Dar or Hawassa only view regional transaction batches.
4. **Automated ERCA Fiscal Machine Integration:**
   - Integrate with certified Electronic Fiscal Cash Registers (FCR) for digital fiscal slip generation.

---

*Kirchat Commercial Operations Platform — Engineered for Ethiopian Business Excellence.*
