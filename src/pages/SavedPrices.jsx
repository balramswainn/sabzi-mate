import React, { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  X,
  Edit2,
  Trash2,
  ShoppingBag,
  BadgeIndianRupee,
  Info,
  Sparkles,
} from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { CATEGORIES, STARTER_PRODUCTS } from '../data/defaultProducts.js'
import { UNIT_TYPES, getUnitShortLabel } from '../utils/unitConversions.js'
import { formatINR } from '../utils/currency.js'

export default function SavedPrices({
  savedPrices = [],
  setSavedPrices,
  onAddToList,
  notify,
}) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Modal / Form state for Add or Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [name, setName] = useState('')
  const [rate, setRate] = useState('')
  const [unit, setUnit] = useState('kg')
  const [category, setCategory] = useState('Vegetables')
  const [emoji, setEmoji] = useState('🥬')

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filteredPrices = useMemo(() => {
    return savedPrices.filter((prod) => {
      const q = search.trim().toLowerCase()
      const matchSearch = !q || prod.name.toLowerCase().includes(q)
      const matchCat = selectedCategory === 'All' || prod.category === selectedCategory
      return matchSearch && matchCat
    })
  }, [savedPrices, search, selectedCategory])

  const openNewModal = () => {
    setEditingIndex(null)
    setName('')
    setRate('40')
    setUnit('kg')
    setCategory('Vegetables')
    setEmoji('🥬')
    setIsModalOpen(true)
  }

  const openEditModal = (prod, index) => {
    setEditingIndex(index)
    setName(prod.name)
    setRate(String(prod.rate))
    setUnit(prod.unit || 'kg')
    setCategory(prod.category || 'Vegetables')
    setEmoji(prod.emoji || '🥬')
    setIsModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!name.trim() || Number(rate) < 0) return

    const newProd = {
      name: name.trim(),
      rate: Number(rate),
      unit,
      category,
      emoji: emoji.trim() || '🥬',
      defaultQuantity: UNIT_TYPES[unit]?.defaultQuantity || 1,
    }

    if (editingIndex !== null) {
      setSavedPrices((prev) =>
        prev.map((item, idx) => (idx === editingIndex ? newProd : item))
      )
      notify && notify(`Updated rate for ${name}`)
    } else {
      setSavedPrices((prev) => [newProd, ...prev])
      notify && notify(`Saved price for ${name}`)
    }

    setIsModalOpen(false)
  }

  const handleDelete = () => {
    if (deleteTarget === null) return
    const targetName = savedPrices[deleteTarget]?.name
    setSavedPrices((prev) => prev.filter((_, idx) => idx !== deleteTarget))
    setDeleteTarget(null)
    notify && notify(`Removed ${targetName || 'product'} from saved prices`)
  }

  const handleAddProductToList = (prod) => {
    const qty = prod.defaultQuantity || UNIT_TYPES[prod.unit]?.defaultQuantity || 1
    onAddToList({
      id: Date.now() + Math.random(),
      name: prod.name,
      emoji: prod.emoji || '🥬',
      category: prod.category || 'Vegetables',
      rate: prod.rate,
      unit: prod.unit,
      quantity: qty,
      purchased: false,
    })
    notify && notify(`Added ${prod.name} to shopping checklist`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Personal Price Guide"
        title="Saved Prices"
        subtitle="Manage your everyday fruits, vegetables, and grocery reference rates. Quickly tap any item to add it to your shopping checklist."
        actions={
          <button
            type="button"
            onClick={openNewModal}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#173c2c] px-4 text-xs font-bold text-white shadow-xs hover:bg-[#23553a] transition-colors"
          >
            <Plus size={16} />
            <span>New Saved Price</span>
          </button>
        }
      />

      {/* Notice Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#dfe8dc] bg-[#f2f7ef] p-4 text-xs text-[#35573d]">
        <Info size={18} className="text-[#3b8c53] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold text-[#1f4228]">User-Maintained Reference Rates:</strong> These prices are entered and maintained by you on this device to match your local market or sabzi mandi. They are not live stock prices.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa091]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search saved items..."
              className="field pl-9 pr-8"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c9c8e] hover:text-[#213827]"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <span className="text-xs font-semibold text-[#758677]">
            {filteredPrices.length} saved products
          </span>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-[#173c2c] text-white shadow-xs'
                  : 'bg-white border border-[#e2e8df] text-[#556958] hover:bg-[#f6faf4]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredPrices.length > 0 ? (
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPrices.map((prod, idx) => (
            <div
              key={`${prod.name}-${idx}`}
              className="group flex items-center gap-3 rounded-2xl border border-[#e5ebe2] bg-white p-4 shadow-xs transition hover:border-[#cbdec4] hover:shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f2f6ee] text-2xl">
                {prod.emoji || '🥬'}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#1b3422]">{prod.name}</p>
                <p className="mt-0.5 text-xs text-[#718574]">
                  <span className="font-extrabold text-[#235832]">
                    {formatINR(prod.rate)}
                  </span>{' '}
                  <span className="text-[#849586]">{getUnitShortLabel(prod.unit)}</span>
                </p>
                {prod.category && (
                  <span className="mt-1 inline-block text-[10px] font-semibold text-[#8b9c8d]">
                    {prod.category}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {/* Add to current shopping list */}
                <button
                  type="button"
                  onClick={() => handleAddProductToList(prod)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf3e7] text-[#276a3b] hover:bg-[#d9ebd4] transition-colors"
                  title="Add to shopping checklist"
                  aria-label={`Add ${prod.name} to list`}
                >
                  <Plus size={16} strokeWidth={2.4} />
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => openEditModal(prod, idx)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#7f8f82] hover:bg-[#f2f6ee] hover:text-[#21462a] transition-colors"
                  title="Edit rate"
                  aria-label={`Edit ${prod.name}`}
                >
                  <Edit2 size={14} />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => setDeleteTarget(idx)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#9c7873] hover:bg-[#fff0ed] hover:text-[#b84e40] transition-colors"
                  title="Delete product"
                  aria-label={`Delete ${prod.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BadgeIndianRupee}
          title="No saved prices found"
          description={
            savedPrices.length === 0
              ? 'You have not added any custom prices yet. Create one or load starters.'
              : `No items matched "${search || selectedCategory}".`
          }
          actionLabel="Add New Price"
          onAction={openNewModal}
        />
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#e4ebe0]">
            <div className="flex items-center justify-between border-b border-[#f0f4ee] pb-3.5">
              <h3 className="text-base font-bold text-[#1b3422]">
                {editingIndex !== null ? 'Edit Saved Price' : 'Add New Saved Price'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[#809183] hover:bg-[#f1f6ed]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-[1fr_75px] gap-2.5">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#566858]">Product Name *</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Potatoes"
                    className="field font-semibold"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#566858]">Emoji</label>
                  <input
                    type="text"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    maxLength={4}
                    className="field text-center text-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#566858]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="field"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#566858]">Pricing Basis</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="field font-medium"
                  >
                    {Object.values(UNIT_TYPES).map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#566858]">
                  Price (₹ per {unit}) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#809183]">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="35"
                    className="field pl-8 font-extrabold text-[#1c3523] text-base"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 flex-1 rounded-xl border border-[#dce3da] text-xs font-semibold text-[#5a6b5d] hover:bg-[#f6f8f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 flex-1 rounded-xl bg-[#173c2c] text-xs font-bold text-white shadow-xs hover:bg-[#23553a]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete saved price?"
        message={`Are you sure you want to remove ${savedPrices[deleteTarget]?.name || 'this item'} from your saved prices?`}
        confirmText="Delete"
        isDanger={true}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}

