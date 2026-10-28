# SabziMate 🥬

A mobile-first Fruits, Vegetables, and Grocery Shopping Calculator & Assistant built with React, Vite, and Tailwind CSS.

SabziMate helps users calculate the cost of fruits, vegetables, and everyday grocery items based on actual weighing machine scales, quantities, and vendor rates with zero rounding errors.

---

## 🚀 Key Features

- **Accurate Market Calculations**:
  - Tomatoes: ₹40/kg × 789 g → **₹31.56**
  - Capsicum: ₹60/kg × 1 kg 270 g → **₹76.20**
  - Bananas: ₹60/dozen × 7 pieces → **₹35.00**
  - Milk: ₹80/litre × 750 ml → **₹60.00**
  - Bread: ₹25/packet × 3 packets → **₹75.00**
- **Dashboard**:
  - Live shopping session totals and item counts (purchased vs. pending).
  - Target budget monitoring with dynamic progress indicators and over-budget warnings.
  - Interactive shopping checklist preview and one-tap quick-add essentials.
  - Recent shopping trips summary.
- **Shopping List**:
  - Add, edit, and remove items with custom rate, unit, quantity, notes, and emoji.
  - Search by item name or note keywords.
  - Category filters (*Vegetables*, *Fruits*, *Dairy*, *Groceries*, *Other*) and status filters (*All*, *To Buy*, *Purchased*).
  - Side-by-side financial summary with estimated vs. actual purchased totals.
  - "Finish & Save Bill" to archive the shopping session and start a fresh list.
  - Confirmation modals for destructive actions.
- **Price Calculator**:
  - Dedicated tabs for Weight (kg/g with mixed input support: e.g. 1 kg 270 g), Volume (L/ml), Dozen (pieces), and Discrete units (packet, bundle, tray, piece).
  - Quick quantity presets (100g, 250g, 500g, 750g, 1kg, 2kg; 250ml, 500ml, 750ml, 1L; 1, 3, 6, 12 pcs).
  - Live mathematical formula breakdown (e.g. `789 g ÷ 1,000 g × ₹40.00/kg = ₹31.56`).
  - Direct "Add to Shopping List" action with user feedback.
- **Saved Prices**:
  - User-maintained reference prices for local mandi/market items.
  - Add, edit, or delete saved products.
  - One-tap addition to active shopping checklist.
- **Shopping History**:
  - Archived shopping bills with date, time, item count, and total.
  - Expandable bill view with item-by-item breakdown preserving historical rates.
  - One-click "Re-add" button to repeat past shopping trips.
- **Settings & Privacy**:
  - Configurable shopping budget target with quick presets.
  - 100% offline & client-side: data stays in your browser's LocalStorage.
  - Full JSON backup export and import/restore capability.
  - Safe data reset with confirmation.

---

## 📁 Modular Project Structure

```text
sabzi-mate/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx         # Mobile navigation bar
│   │   ├── BudgetCard.jsx        # Budget progress card (dark & light variants)
│   │   ├── BudgetModal.jsx       # Budget configuration modal
│   │   ├── ConfirmDialog.jsx     # Accessible destructive action confirmation dialog
│   │   ├── EmptyState.jsx        # Reusable empty state view
│   │   ├── Header.jsx            # Responsive sticky header
│   │   ├── ItemModal.jsx         # Modal for adding and editing shopping items
│   │   ├── PageHeader.jsx        # Reusable page title and actions header
│   │   ├── ShoppingItem.jsx      # Individual item row with purchased toggle & actions
│   │   ├── ShoppingSummary.jsx   # Live session bill summary
│   │   ├── Sidebar.jsx           # Desktop navigation sidebar & mobile drawer
│   │   ├── StatCard.jsx          # Metric cards
│   │   └── Toast.jsx             # Non-intrusive notification pill
│   ├── pages/
│   │   ├── Calculator.jsx        # Instant price & scale math page
│   │   ├── Dashboard.jsx         # Main overview dashboard
│   │   ├── History.jsx           # Archived bills & repeat trips
│   │   ├── SavedPrices.jsx       # User-maintained reference price guide
│   │   ├── Settings.jsx          # Budget, backup/restore, and storage management
│   │   └── ShoppingList.jsx      # Market checklist with filters and summary
│   ├── utils/
│   │   ├── calculations.js       # Core math, amount calculations, and breakdown
│   │   ├── calculations.test.js  # Node.js native unit test suite (15 tests)
│   │   ├── currency.js           # INR formatting, safe parsing, and paise rounding
│   │   └── unitConversions.js    # Mixed weights (kg+g), volumes (L+ml), dozen conversions
│   ├── hooks/
│   │   └── useLocalStorage.js    # Resilient LocalStorage persistence hook
│   ├── data/
│   │   └── defaultProducts.js    # Catalog, categories, starter essentials, initial items
│   ├── App.jsx                   # Application layout, navigation & state orchestration
│   ├── main.jsx                  # React DOM root entry
│   └── index.css                 # Tailwind CSS v4 styling and custom utilities
├── package.json
└── vite.config.js
```

---

## 🛠️ Local Development & Build

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Run Unit Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
npm run preview
```
