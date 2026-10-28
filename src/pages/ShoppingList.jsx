import React, { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  X,
  Filter,
  CheckCircle2,
  Trash2,
  ShoppingBag,
  ArrowUpDown,
  ShoppingBasket,
  Wallet,
} from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import ShoppingItem from '../components/ShoppingItem.jsx'
import ShoppingSummary from '../components/ShoppingSummary.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { CATEGORIES } from '../data/defaultProducts.js'
import { formatINR } from '../utils/currency.js'

export default function ShoppingList({
  items = [],
  totals,
  budget = 500,
  onOpenAddItem,
  onEditItem,
  onDeleteItem,
  onTogglePurchased,
  onCompleteShopping,
  onClearList,
}) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'pending' | 'purchased'

  // Confirmation dialogs state
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  // Filter items based on search, category, and purchased status
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search match
      const query = search.trim().toLowerCase()
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        (item.notes && item.notes.toLowerCase().includes(query))

      // Category match
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory

      // Status match
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'purchased' ? item.purchased : !item.purchased)

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [items, search, selectedCategory, statusFilter])

  const handleDeletePrompt = (id, name) => {
    setItemToDelete({ id, name })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        eyebrow="Market Checklist"
        title="Shopping List"
        subtitle="Weigh and calculate as you shop. Mark items purchased to track real-time spending against your budget."
        actions={
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmCompleteOpen(true)}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#173c2c] px-3.5 sm:px-4 text-xs font-bold text-white shadow-xs hover:bg-[#23553a] transition-colors"
              >
                <CheckCircle2 size={16} />
                <span>Finish & Save Bill</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenAddItem}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#d6e0d3] bg-white px-3 sm:px-4 text-xs font-bold text-[#275c35] shadow-xs hover:bg-[#f6faf4] transition-colors"
            >
              <Plus size={16} />
              <span>Add Item</span>
            </button>
          </div>
        }
      />

      {/* Mini metric pills (especially helpful on mobile) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="rounded-2xl border border-[#e5ebe2] bg-white p-3 sm:p-4">
          <p className="text-[11px] font-semibold text-[#7b8b7e]">List Total</p>
          <p className="mt-1 text-base sm:text-xl font-extrabold text-[#1a3522] tabular-nums">
            {formatINR(totals.total)}
          </p>
        </div>
        <div className="rounded-2xl border border-[#e5ebe2] bg-white p-3 sm:p-4">
          <p className="text-[11px] font-semibold text-[#7b8b7e]">Purchased</p>
          <p className="mt-1 text-base sm:text-xl font-extrabold text-[#2a6d41] tabular-nums">
            {formatINR(totals.purchasedTotal)}
          </p>
        </div>
        <div className="rounded-2xl border border-[#e5ebe2] bg-white p-3 sm:p-4">
          <p className="text-[11px] font-semibold text-[#7b8b7e]">Budget Balance</p>
          <p
            className={`mt-1 text-base sm:text-xl font-extrabold tabular-nums ${
              totals.isOverBudget ? 'text-[#c24f40]' : 'text-[#204a2c]'
            }`}
          >
            {totals.isOverBudget
              ? `-${formatINR(Math.abs(totals.remaining))}`
              : formatINR(totals.remaining)}
          </p>
        </div>
      </div>

      {/* Main layout: Checklist on Left, Bill Summary on Right */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] items-start">
        {/* Left Column: Search, Filters, and List */}
        <section className="rounded-2xl border border-[#e5ebe2] bg-white p-4 sm:p-6 shadow-xs space-y-4">
          {/* Top Bar: Search + Status Toggle */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa091]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search shopping items..."
                className="field pl-9 pr-8"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c9c8e] hover:text-[#213827]"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Status Filter Tabs: All, To Buy, Purchased */}
            <div className="flex shrink-0 items-center rounded-xl bg-[#f1f5ee] p-1 text-xs">
              {[
                { id: 'all', label: 'All', count: items.length },
                { id: 'pending', label: 'To Buy', count: totals.pendingCount },
                { id: 'purchased', label: 'Bought', count: totals.purchasedCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-lg px-2.5 py-1.5 font-bold transition-all ${
                    statusFilter === tab.id
                      ? 'bg-white text-[#1f4a2d] shadow-xs'
                      : 'text-[#6c7d70] hover:text-[#23422a]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="ml-1 text-[10px] opacity-70">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-[#173c2c] text-white shadow-xs'
                    : 'bg-[#f4f7f1] text-[#556958] hover:bg-[#e9efe5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items Listing */}
          <div className="space-y-2.5 pt-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <ShoppingItem
                  key={item.id}
                  item={item}
                  onTogglePurchased={onTogglePurchased}
                  onEdit={onEditItem}
                  onDelete={handleDeletePrompt}
                />
              ))
            ) : (
              <EmptyState
                icon={ShoppingBag}
                title={
                  items.length === 0
                    ? 'Your shopping list is empty'
                    : 'No matching items found'
                }
                description={
                  items.length === 0
                    ? 'Tap "Add Item" to add fruits, vegetables, or groceries from the scale.'
                    : `No items matched "${search || selectedCategory}". Try adjusting your filters.`
                }
                actionLabel={items.length === 0 ? 'Add First Item' : 'Clear Filters'}
                onAction={
                  items.length === 0
                    ? onOpenAddItem
                    : () => {
                        setSearch('')
                        setSelectedCategory('All')
                        setStatusFilter('all')
                      }
                }
              />
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#f0f4ee]">
            <button
              type="button"
              onClick={onOpenAddItem}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#2a6d41] hover:text-[#184427]"
            >
              <Plus size={15} /> Add another item
            </button>

            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmClearOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#a05b50] hover:text-[#7f3b31]"
              >
                <Trash2 size={14} /> Clear entire list
              </button>
            )}
          </div>
        </section>

        {/* Right Column: Sticky Bill Summary */}
        <div className="sticky top-20">
          <ShoppingSummary
            items={items}
            totals={totals}
            budget={budget}
            onCompleteShopping={() => setConfirmCompleteOpen(true)}
            onClearList={() => setConfirmClearOpen(true)}
            onAddNew={onOpenAddItem}
          />
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={confirmClearOpen}
        title="Clear entire shopping list?"
        message="This will remove all items from your current session. If you've finished shopping, you can save the bill instead."
        confirmText="Clear List"
        isDanger={true}
        onConfirm={onClearList}
        onClose={() => setConfirmClearOpen(false)}
      />

      <ConfirmDialog
        isOpen={confirmCompleteOpen}
        title="Complete shopping trip?"
        message={`This will save this bill (${formatINR(totals.total)}) with all ${items.length} items to your shopping history and reset your checklist for next time.`}
        confirmText="Save & Finish"
        isDanger={false}
        onConfirm={onCompleteShopping}
        onClose={() => setConfirmCompleteOpen(false)}
      />

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title={`Remove ${itemToDelete?.name || 'item'}?`}
        message="Are you sure you want to remove this item from your shopping list?"
        confirmText="Remove"
        isDanger={true}
        onConfirm={() => {
          if (itemToDelete) onDeleteItem(itemToDelete.id)
          setItemToDelete(null)
        }}
        onClose={() => setItemToDelete(null)}
      />
    </div>
  )
}

