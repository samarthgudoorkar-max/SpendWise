# SpendWise — Personal Expense Tracking & Financial Analytics

SpendWise is a personal expense tracking and financial intelligence web application built with React, TypeScript, Tailwind CSS, and Recharts. Inspired by modern fintech dashboards, it offers real-time cash flow monitoring, multi-month spending trend analysis, category allocations, and client-side transaction management backed by browser LocalStorage.

---

## Key Highlights

- **Fintech SaaS Interface**: Designed with a high-contrast dark palette (`#0F172A`, `#1E293B`, `#6366F1`) alongside a crisp light mode option.
- **Integer Paise Storage Engine**: Eliminates IEEE 754 floating-point rounding errors by storing all currency values internally as integer paise ($1\text{ INR} = 100\text{ paise}$).
- **Indian Locale Formatting**: Native `en-IN` formatting (e.g. `₹12,500.00`) across all summary widgets, ledger tables, charts, and exports.
- **Dynamic Recharts Analytics**:
  - Monthly Cash Flow Comparison (Income vs. Expense grouped bar charts).
  - Expense Distribution Donut Chart with centered summary totals.
  - Spending & Savings Trajectory area chart.
  - Granular Category Spending Breakdown table with percentage share and average ticket sizes.
- **Comprehensive Transaction Registry**:
  - Full CRUD lifecycle (Add, Edit, Delete with confirmation modal).
  - Multi-condition filtering: real-time description/category search, transaction type tabs (All / Income / Expense), category dropdown, and bi-directional sorting by date, amount, or description.
  - Responsive pagination controls.
- **Local Persistence & Fault Recovery**:
  - Validates all stored records against schema upon loading.
  - Automatically identifies, recovers, and filters corrupted records without application crashes.
  - Single-click Demo Data loading and safe demo-only removal without touching real user transactions.
  - Permanent ledger purge with double confirmation.
- **RFC 4180 CSV Export**: One-click spreadsheet export with formatted rupee values, headers, and quote escaping.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19 & TypeScript** | Component architecture, state hooks, and strict type safety |
| **Vite 6** | Fast HMR dev server and optimized production bundler |
| **Tailwind CSS 3** | Fintech design system, responsive layouts, and dark mode |
| **Recharts 2** | Composable SVG financial charts |
| **Lucide React** | Lightweight icons for navigation and category identification |
| **Vitest** | Automated unit testing for financial formulas and storage validations |
| **LocalStorage** | Zero-backend, privacy-first client persistence |

---

## Project Screenshots

<!-- Screenshots Placeholder -->
> _Screenshots will be placed here representing Dashboard Overview, Transaction Ledger, Analytics, and Settings views._

```
+------------------------------------------------------------------------------------+
|  [₹] SpendWise      Dashboard Overview               [Export CSV] [Theme] [+ New]   |
+------------------------------------------------------------------------------------+
|  [ Total Balance ]    [ Total Income ]    [ Total Expenses ]    [ Savings Rate ]   |
|     ₹67,500.00           ₹95,000.00           ₹27,500.00             42.1%         |
+---------------------------------------------------+--------------------------------+
|  Cash Flow Comparison (Bar Chart)                 |  Expense Distribution (Donut)  |
|  Income vs Outflows across chronological months   |  Category percentage breakdown |
+---------------------------------------------------+--------------------------------+
|  Recent Transactions Ledger (Type, Category, Date, Formatted INR, Actions)         |
+------------------------------------------------------------------------------------+
```

---

## Architecture & Code Structure

The project follows a clean separation of concerns:

```
src/
├── components/
│   ├── analytics/          # Recharts visualizations (Bar, Donut, Area, Category Breakdown)
│   ├── common/             # Accessible Modal, ConfirmDialog, Badge, CategoryIcon, EmptyState, Toast
│   ├── dashboard/          # SummaryCards, StatCard, RecentTransactions, DashboardPage
│   ├── layout/             # Sidebar, Header, MobileNav, MainLayout
│   ├── settings/           # SettingsView (Theme, Diagnostics, Demo Controls, Purge)
│   └── transactions/       # TransactionTable, TransactionFiltersBar, TransactionModal, TransactionsPage
├── context/
│   ├── ThemeContext.tsx    # Dark/Light theme state and HTML root class sync
│   ├── ToastContext.tsx    # Non-blocking notification queue
│   └── TransactionContext.tsx # Central financial state, CRUD operations, and derived metrics
├── data/
│   ├── categories.ts       # Category metadata, colors, and Lucide icon mappings
│   └── sampleData.ts       # Realistic multi-month sample transactions generator
├── types/
│   └── index.ts            # Domain entities, filters, summaries, and union types
└── utils/
    ├── calculations.ts     # Pure functions for balances, savings rate, monthly groups, breakdowns
    ├── currency.ts         # Integer paise converter, validation rules, Indian locale formatters
    ├── date.ts             # Chronological sorting, month grouping, ISO formatting
    ├── csv.ts              # RFC 4180 CSV stringifier and browser download trigger
    ├── storage.ts          # LocalStorage schema validation, corruption recovery, diagnostics
    └── __tests__/          # Vitest suites for financial formulas, currency, storage, and CSV
```

### Mathematical & Accounting Integrity

1. **Savings Rate Formula**:
   $$\text{Savings Rate} = \frac{\text{Total Income} - \text{Total Expenses}}{\text{Total Income}} \times 100$$
   *Zero-Income Safety*: When income is 0 or unrecorded, the application renders a clean `—` unavailable indicator rather than producing `NaN` or dividing by zero.

2. **Integer Paise Representation**:
   All monetary amounts are multiplied by 100 and rounded upon input validation (`Math.round(rupees * 100)`), stored as integers, and divided back only for display or export formatting.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended; developed on v26)
- npm (v9+ or compatible package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd SpendWise
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

### Running Unit Tests

Run the complete test suite with Vitest:

```bash
npm test
```

### Building for Production

Compile TypeScript and build the optimized production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Deployment (Vercel)

SpendWise is configured for Vercel deployment:

1. Push your code to GitHub.
2. In the Vercel dashboard, click **Add New Project** and select your `SpendWise` repository.
3. Configure the build settings (detected automatically):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. The included `vercel.json` configures single-page application routing rewrites to route all traffic to `/index.html`.
5. Click **Deploy**.

---

## Future Improvements

- Custom user-defined category creation with custom colors and icon picker.
- Monthly budget limits per category with threshold alert badges.
- Recurring transaction schedules (e.g. automatic monthly rent and salary credits).
- Multi-currency conversion via offline exchange rate presets.
- Biometric WebAuthn lock for personal privacy on shared devices.

---

## License

MIT License. Designed and engineered for personal finance tracking.
