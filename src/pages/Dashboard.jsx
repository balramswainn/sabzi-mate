import React from 'react'
import {
  ShoppingBasket,
  Wallet,
  CheckCircle2,
  Clock3,
  Plus,
  Calculator,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShoppingBag,
} from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import BudgetCard from '../components/BudgetCard.jsx'
import ShoppingItem from '../components/ShoppingItem.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { formatINR } from '../utils/currency.js'
import { STARTER_PRODUCTS } from '../data/defaultProducts.js'

export default function Dashboard({
  items = [],
  totals,
  budget = 500,
  history = [],
  onOpenAddItem,
  onOpenCalculator,
  onOpenBudgetModal,
  setActivePage,
  onTogglePurchased,
  onEditItem,
  onDeleteItem,
  onQuickAddProduct,
}) {
  const {
    total = 0,
    purchasedTotal = 0,
    itemCount = 0,
    purchasedCount = 0,
    pendingCount = 0,
    remaining = 0,
    isOverBudget = false,
  } = totals || {}

  // Current date formatted nicely
  const todayStr = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  // Preview up to 4 items on the dashboard
  const previewItems = items.slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow={todayStr}
        title="Welcome to SabziMate 👋"
        subtitle="Your smart fruits, vegetables, and grocery shopping companion. Accurate weights, fair prices, zero surprises."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenBudgetModal}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#d8e2d4] bg-white px-3.5 text-xs font-bold text-[#2a5635] shadow-xs hover:bg-[#f6f9f4] transition-colors"
            >
              <Wallet size={15} />
              <span>Set Budget</span>
            </button>
            <button
              type="button"
              onClick={onOpenAddItem}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#173c2c] px-4 text-xs font-bold text-white shadow-xs hover:bg-[#23553a] transition-colors"
            >
              <Plus size={16} />
              <span>Add Item</span>
            </button>
          </div>
        }
      />

      {/* 4 Stat Cards */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Session Total"
          value={formatINR(total)}
          detail={`${itemCount} items on checklist`}
          icon={ShoppingBasket}
          tone="green"
          badge={itemCount > 0 ? `${pendingCount} pending` : 'Ready'}
          onClick={() => setActivePage('shopping')}
        />

        <StatCard
          label="Budget Balance"
          value={isOverBudget ? `-${formatINR(Math.abs(remaining))}` : formatINR(remaining)}
          detail={isOverBudget ? 'Spending exceeded budget' : `Within ₹${budget} budget`}
          icon={Wallet}
          tone={isOverBudget ? 'rose' : 'mint'}
          badge={isOverBudget ? 'Over Budget' : 'On Track'}
          onClick={onOpenBudgetModal}
        />

        <StatCard
          label="Items Bought"
          value={`${purchasedCount} / ${itemCount}`}
          detail={itemCount > 0 ? `${((purchasedCount / itemCount) * 100).toFixed(0)}% completed` : 'No items added'}
          icon={CheckCircle2}
          tone="amber"
          onClick={() => setActivePage('shopping')}
        />

        <StatCard
          label="Shopping Trips"
          value={String(history.length)}
          detail={history.length > 0 ? 'Saved bills on device' : 'First trip will save here'}
          icon={Clock3}
          tone="lavender"
          onClick={() => setActivePage('history')}
        />
      </section>

      {/* Main Grid: Shopping Checklist Preview + Budget Card & Quick Add */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        {/* Left Column: Active Shopping List Preview */}
        <section className="rounded-2xl border border-[#e5ebe2] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#1b3422]">Current Shopping Checklist</h2>
                <p className="mt-0.5 text-xs text-[#809183]">
                  Tick items off as the scale weighs them
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('shopping')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#276a3b] hover:text-[#174624] transition-colors"
              >
                <span>View All ({itemCount})</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* List preview */}
            <div className="mt-5 space-y-2.5">
              {previewItems.length > 0 ? (
                previewItems.map((item) => (
                  <ShoppingItem
                    key={item.id}
                    item={item}
                    compact
                    onTogglePurchased={onTogglePurchased}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                  />
                ))
              ) : (
                <EmptyState
                  icon={ShoppingBag}
                  title="Your shopping list is empty"
                  description="Add vegetables, fruits, or dairy to start calculating your market bill."
                  actionLabel="Add First Item"
                  onAction={onOpenAddItem}
                />
              )}
            </div>
          </div>

          {/* Quick Add more item trigger */}
          <div className="mt-5 pt-3 border-t border-[#f0f4ed] flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenAddItem}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2a6d41] hover:text-[#184427]"
            >
              <Plus size={15} />
              <span>Add custom item</span>
            </button>
            <button
              type="button"
              onClick={onOpenCalculator}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#56735e] hover:text-[#184427]"
            >
              <Calculator size={15} />
              <span>Instant price math</span>
            </button>
          </div>
        </section>

        {/* Right Column: Hero Budget Card + Quick Add Starter Essentials */}
        <div className="space-y-6">
          <BudgetCard
            budget={budget}
            spent={purchasedTotal}
            estimatedTotal={total}
            onEditBudget={onOpenBudgetModal}
            variant="dark"
          />

          {/* Quick Add Essentials Card */}
          <section className="rounded-2xl border border-[#e5ebe2] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1b3422]">Quick Add Essentials</h3>
                <p className="text-[11px] text-[#809183]">Add standard market items with 1 tap</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-[#eef6ec] px-2 py-0.5 text-[10px] font-bold text-[#2e7443]">
                <Sparkles size={11} />
                Popular
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {STARTER_PRODUCTS.slice(0, 6).map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => onQuickAddProduct && onQuickAddProduct(prod)}
                  className="group flex items-center gap-2 rounded-xl border border-[#e8eee6] p-2.5 text-left transition hover:border-[#b8cdb6] hover:bg-[#f6faf4]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0f5ee] text-lg">
                    {prod.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-[#1e3625] group-hover:text-[#286e3f]">
                      {prod.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-[#7d8f80]">
                      ₹{prod.rate}/{prod.unit}
                    </p>
                  </div>
                  <Plus
                    size={14}
                    className="shrink-0 text-[#859787] group-hover:text-[#286e3f] transition-colors"
                  />
                </button>
              ))}
            </div>

            <p className="mt-3 text-[10px] leading-relaxed text-[#8a9b8c]">
              Tap any item to add it to your list at the standard rate. You can edit weight or price anytime.
            </p>
          </section>
        </div>
      </div>

      {/* Recent Activity section */}
      <section className="rounded-2xl border border-[#e5ebe2] bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1b3422]">Recent Shopping Trips</h3>
            <p className="text-xs text-[#809183]">Archived bills from your market runs</p>
          </div>
          <button
            type="button"
            onClick={() => setActivePage('history')}
            className="text-xs font-bold text-[#2a6d41] hover:text-[#184427]"
          >
            All History ({history.length}) →
          </button>
        </div>

        {history.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {history.slice(0, 3).map((bill) => (
              <div
                key={bill.id}
                onClick={() => setActivePage('history')}
                className="cursor-pointer rounded-xl border border-[#e9efe7] bg-[#f9fbf8] p-3.5 transition hover:border-[#cbdec4] hover:bg-white"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1c3623]">
                    {new Intl.DateTimeFormat('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(bill.date))}
                  </span>
                  <span className="text-sm font-extrabold text-[#245e35] tabular-nums">
                    {formatINR(bill.total)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#7d8f80]">
                  {bill.items?.length || 0} items purchased
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#f8faf6] p-4 text-xs text-[#718574]">
            <Clock3 size={18} className="text-[#3b8c53] shrink-0" />
            <span>
              Your shopping history is clean. Finish your first shopping session to archive the bill here.
            </span>
          </div>
        )}
      </section>
    </div>
  )
}

