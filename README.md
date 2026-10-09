# Kirchat --- Revenue & Operations Dashboard

Kirchat is a SaaS revenue and operations dashboard designed to bring
business performance, financial activity, customer health, and
infrastructure telemetry into one workspace.

The interface is built with React, TypeScript, Tailwind CSS, and
Recharts. It is designed for business owners, finance teams, and
engineering teams who need a clear view of operational and financial
indicators.

> **Project status:** The features described here may use demonstration
> or mock data depending on the current implementation. Before using
> Kirchat for real financial or customer operations, verify data
> integrations, authentication, authorization, persistence, and security
> controls.

## Highlights

-   **Business overview:** Revenue, expenses, growth, and operational
    KPIs.
-   **Analytics:** Line/area, bar, pie/donut, and composed charts.
-   **Financial ledger:** Search, filtering, sorting, transaction
    details, bulk actions, and CSV export.
-   **Invoice creation:** Create invoice/transaction records with line
    items and fee calculations.
-   **Customer portfolio:** Monitor account health, annual recurring
    revenue (ARR), seat utilization, and renewals.
-   **Infrastructure telemetry:** View regional latency, uptime, error
    budgets, and diagnostic simulations.
-   **Role-based navigation:** Different views for administrators,
    finance users, and engineering users.
-   **Workspace preferences:** Currency display, light/dark themes, and
    keyboard shortcuts.
-   **Command palette:** Quick navigation and actions with `Ctrl+K` /
    `⌘K`.

## Tech Stack

-   [React](https://react.dev/) --- UI components and application
    interface
-   [TypeScript](https://www.typescriptlang.org/) --- typed JavaScript
-   [Vite](https://vite.dev/) --- development server and production
    build tooling
-   [Tailwind CSS](https://tailwindcss.com/) --- styling utilities
-   [Recharts](https://recharts.org/) --- charts and data visualization
-   [Lucide React](https://lucide.dev/) --- icons
-   [Motion](https://motion.dev/) --- animation and transitions, where
    used

## Getting Started

### Prerequisites

Install the following on your development machine:

-   Node.js (use a version supported by the project's dependencies;
    Node.js 20+ is a sensible starting point for a modern Vite project)
-   npm

Check your installed versions:

```bash
node --version
npm --version
```

### Installation

1.  Clone or download the project.
2.  Open a terminal in the project root.
3.  Install dependencies:

```bash
npm install
```

4.  Start the development server:

```bash
npm run dev
```

5.  Open the local URL printed in the terminal by Vite.

### Production build

Run the production build:

```bash
npm run build
```

If the project defines a separate type-check script, run it as well. To
preview a production build locally, check whether the project has a
`preview` script:

```bash
npm run preview
```

The available commands are defined in `package.json`. If a command is
unavailable, inspect that file and use the scripts listed there.

## Demo Roles

The project description defines these example roles:

| Demo user | Role | Intended access |
| :--- | :--- | :--- |
| Kidus Mesay | Administrator | All available application areas |
| Marcus Brody | Finance Manager | Revenue, ledger, transactions, and customer portfolio |
| Elena Rostova | DevOps Engineer | Infrastructure and telemetry |

These are example/demo identities. Do not treat client-side demo login
or browser storage as production-grade authentication.

## Application Areas

| Area | Purpose |
| :--- | :--- |
| Overview | High-level business KPIs and performance indicators |
| Analytics | Revenue, expansion, plan mix, throughput, and latency charts |
| Transactions | Financial records, invoice details, filtering, sorting, and CSV export |
| Customers | Account health, ARR, seat utilization, and renewal information |
| Infrastructure | Regional service health, latency, uptime, and diagnostic tools |
| Settings | Currency display, theme preferences, and available workspace configuration |

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl+K` / `⌘K` | Open the command palette |
| `/` | Focus the search or command field, if supported by the current view |
| `N` | Open new transaction creation, if supported by the current view |
| `Esc` | Close an open modal or drawer |

Shortcut behavior can depend on the active view and whether the cursor
is already inside an input.

## Project Structure

```text
src/
├── assets/                 # Images and other visual assets
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx
│   │   └── ProtectedRoute.tsx
│   ├── views/
│   │   ├── OverviewView.tsx
│   │   ├── AnalyticsChartsView.tsx
│   │   ├── TransactionsView.tsx
│   │   ├── CustomersView.tsx
│   │   ├── InfrastructureView.tsx
│   │   └── SettingsView.tsx
│   ├── CommandPalette.tsx
│   ├── NewTransactionModal.tsx
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   └── TransactionDetailDrawer.tsx
├── context/
│   └── AuthContext.tsx
├── data/
│   └── mockData.ts
├── types/
│   └── dashboard.ts
├── App.tsx
├── index.css
└── main.tsx
package.json
tsconfig.json
vite.config.ts
```

The structure above reflects the intended project layout. Actual
filenames may vary as the codebase evolves.

## Important Production Considerations

Kirchat's interface is not, by itself, proof of a production-ready
financial system. Before handling real business data:

-   Use a secure backend and a trusted authentication/session strategy.
-   Enforce authorization on the server/API, not only in the React
    interface.
-   Never store plaintext passwords or sensitive secrets in
    `localStorage`.
-   Connect financial information to trusted payment/accounting sources
    and reconcile totals.
-   Persist invoices and transactions in a database with appropriate
    audit history.
-   Validate and authorize every write operation on the server.
-   Protect exports and customer information according to business and
    legal requirements.
-   Obtain infrastructure metrics from real monitoring systems rather
    than simulated values.
-   Add automated tests, error monitoring, backups, and a
    deployment/security review.

## Troubleshooting

### `npm` or `node` is not recognized

Node.js may not be installed or may not be available in your terminal's
PATH. On a managed company computer, follow your organization's
software-installation policy or use an approved development environment.

### Dependency installation fails

-   Confirm that your Node.js and npm versions meet the project's
    requirements.
-   Read the full terminal error.
-   If your organization uses a proxy or private package registry,
    verify the approved configuration.
-   Avoid deleting the lockfile unless you intentionally want to
    regenerate dependency versions.

### The build fails

Run `npm run build` and review the first relevant error. Check
TypeScript types, import paths, and whether all referenced packages are
installed.

## Contributing

1.  Create a branch for your change.
2.  Make a focused update.
3.  Run the available checks and production build.
4.  Review the changes before opening a pull request.

## License

This project is described as licensed under the Apache License 2.0.
Ensure the repository includes the corresponding `LICENSE` file and that
third-party assets and dependencies comply with their own licenses.

------------------------------------------------------------------------

**Kirchat** --- one workspace for revenue visibility, customer health,
and operational awareness.
