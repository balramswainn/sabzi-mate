import React, { useState, useEffect } from 'react'
import { Plus, X, Check, Calculator, Sparkles } from 'lucide-react'
import { amountForItem, getCalculationBreakdown } from '../utils/calculations.js'
import { formatINR } from '../utils/currency.js'
import {
  UNIT_TYPES,
  getQuantityInputLabel,
  getQuantityPresets,
  mixedWeightToGrams,
  gramsToMixedWeight,
} from '../utils/unitConversions.js'
import { STARTER_PRODUCTS, CATEGORIES } from '../data/defaultProducts.js'

export default function ItemModal({
  isOpen,
  itemToEdit = null, // if null -> add mode, if object -> edit mode
  onSave,
  onClose,
}) {
  const isEdit = Boolean(itemToEdit)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('Vegetables')
  const [emoji, setEmoji] = useState('🥬')
  const [unit, setUnit] = useState('kg')
  const [rate, setRate] = useState('40')
  const [quantity, setQuantity] = useState('500')
  const [notes, setNotes] = useState('')

  // Mixed weight helper state
  const [useMixedWeight, setUseMixedWeight] = useState(false)
  const [mixedKg, setMixedKg] = useState('0')
  const [mixedGrams, setMixedGrams] = useState('500')

  // Populate form on open
  useEffect(() => {
    if (!isOpen) return

    if (itemToEdit) {
      setName(itemToEdit.name || '')
      setCategory(itemToEdit.category || 'Vegetables')
      setEmoji(itemToEdit.emoji || '🥬')
      setUnit(itemToEdit.unit || 'kg')
      setRate(String(itemToEdit.rate ?? ''))
      setQuantity(String(itemToEdit.quantity ?? ''))
      setNotes(itemToEdit.notes || '')

      if (itemToEdit.unit === 'kg') {
        const { kg, grams } = gramsToMixedWeight(Number(itemToEdit.quantity) || 0)
        setMixedKg(String(kg))
        setMixedGrams(String(grams))
        setUseMixedWeight(kg > 0)
      } else {
        setUseMixedWeight(false)
      }
    } else {
      // Default new item
      setName('')
      setCategory('Vegetables')
      setEmoji('🥬')
      setUnit('kg')
      setRate('40')
      setQuantity('500')
      setNotes('')
      setMixedKg('0')
      setMixedGrams('500')
      setUseMixedWeight(false)
    }
  }, [isOpen, itemToEdit])

  // Sync mixed weight to quantity
  const handleMixedWeightChange = (newKg, newGrams) => {
    setMixedKg(newKg)
    setMixedGrams(newGrams)
    const totalG = mixedWeightToGrams(newKg, newGrams)
    setQuantity(String(totalG))
  }

  // Keyboard escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const currentItem = {
    name: name.trim(),
    category,
    emoji: emoji || '🥬',
    unit,
    rate: Number(rate) || 0,
    quantity: Number(quantity) || 0,
    notes: notes.trim(),
  }

  const breakdown = getCalculationBreakdown(currentItem)
  const presets = getQuantityPresets(unit)

  const handleSelectStarter = (prod) => {
    setName(prod.name)
    setEmoji(prod.emoji)
    setCategory(prod.category)
    setUnit(prod.unit)
    setRate(String(prod.rate))
    setQuantity(String(prod.defaultQuantity || UNIT_TYPES[prod.unit]?.defaultQuantity || 1))
    if (prod.unit === 'kg') {
      const { kg, grams } = gramsToMixedWeight(prod.defaultQuantity || 500)
      setMixedKg(String(kg))
      setMixedGrams(String(grams))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    const rateNum = Number(rate)
    const qtyNum = Number(quantity)

    if (!Number.isFinite(rateNum) || rateNum < 0) return
    if (!Number.isFinite(qtyNum) || qtyNum <= 0) return

    onSave({
      id: itemToEdit?.id || Date.now() + Math.random(),
      name: name.trim(),
      category,
      emoji: emoji.trim() || '🥬',
      unit,
      rate: rateNum,
      quantity: qtyNum,
      purchased: itemToEdit ? itemToEdit.purchased : false,
      notes: notes.trim(),
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[65] flex items-end justify-center bg-black/45 p-0 backdrop-blur-xs sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-modal-title"
    >
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl border border-[#e4ebe0] sm:rounded-3xl sm:p-6 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0f4ed] pb-4">
          <div>
            <h2 id="item-modal-title" className="text-lg font-bold text-[#1a3321]">
              {isEdit ? 'Edit Shopping Item' : 'Add Item to Shopping List'}
            </h2>
            <p className="mt-0.5 text-xs text-[#7e8e81]">
              Enter actual scale weight or quantity for accurate pricing
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[#7f8f82] hover:bg-[#f1f6ed]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick starter chips (only on new item) */}
        {!isEdit && (
          <div className="mt-3.5 border-b border-[#f0f4ed] pb-3.5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#829585]">
              Quick autofill essentials
            </p>
            <div className="flex flex-wrap gap-1.5">
              {STARTER_PRODUCTS.slice(0, 6).map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleSelectStarter(p)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#dfe7dd] bg-[#f8faf6] px-2.5 py-1 text-xs font-medium text-[#44624b] hover:border-[#b8cdb6] hover:bg-[#eef5eb] transition-colors"
                >
                  <span>{p.emoji}</span>
                  <span>{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Name & Emoji */}
          <div className="grid grid-cols-[1fr_75px] gap-2.5">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#566858]">Item Name *</label>
              <input
                type="text"
                required
                autoFocus={!isEdit}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tomatoes"
                className="field font-semibold text-[#1c3523]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#566858]">Icon</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={4}
                className="field text-center text-xl"
                title="Product emoji"
              />
            </div>
          </div>

          {/* Category & Pricing Unit */}
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
                onChange={(e) => {
                  const newUnit = e.target.value
                  setUnit(newUnit)
                  const def = UNIT_TYPES[newUnit]?.defaultQuantity || 1
                  setQuantity(String(def))
                  if (newUnit === 'kg') {
                    setMixedKg('0')
                    setMixedGrams(String(def))
                  }
                }}
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

          {/* Rate & Quantity */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#566858]">
                Rate ({formatINR(0).charAt(0)}) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#849587]">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="40"
                  className="field pl-7 font-bold text-[#1c3523]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#566858]">
                  {unit === 'kg' ? 'Weight (g)' : unit === 'litre' ? 'Volume (ml)' : 'Quantity'} *
                </label>
                {unit === 'kg' && (
                  <button
                    type="button"
                    onClick={() => setUseMixedWeight(!useMixedWeight)}
                    className="text-[10px] font-semibold text-[#2c7241] hover:underline"
                  >
                    {useMixedWeight ? 'Direct (g)' : 'kg + g'}
                  </button>
                )}
              </div>

              {!useMixedWeight ? (
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={unit === 'kg' ? '789' : '1'}
                  className="field font-bold text-[#1c3523]"
                />
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={mixedKg}
                      onChange={(e) => handleMixedWeightChange(e.target.value, mixedGrams)}
                      placeholder="0"
                      className="field pr-6 font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#7f8e81]">
                      kg
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={mixedGrams}
                      onChange={(e) => handleMixedWeightChange(mixedKg, e.target.value)}
                      placeholder="270"
                      className="field pr-5 font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#7f8e81]">
                      g
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  type="button"
                  key={preset.value}
                  onClick={() => {
                    setQuantity(String(preset.value))
                    if (unit === 'kg') {
                      const { kg, grams } = gramsToMixedWeight(preset.value)
                      setMixedKg(String(kg))
                      setMixedGrams(String(grams))
                    }
                  }}
                  className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                    Number(quantity) === preset.value
                      ? 'bg-[#2a7042] text-white'
                      : 'bg-[#edf3ea] text-[#426148] hover:bg-[#dfeada]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <label className="mb-1 block text-xs font-bold text-[#566858]">Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ripe, from local vendor"
              className="field text-xs text-[#2b4432]"
            />
          </div>

          {/* Live Calculation Preview Card */}
          <div className="rounded-2xl border border-[#d8e6d4] bg-[#f1f7ed] p-4 text-[#1a3a23]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#57725b]">Calculated Total</span>
              <span className="text-xl font-extrabold text-[#174424] tabular-nums">
                {breakdown.formattedAmount}
              </span>
            </div>
            <p className="mt-1 text-[11px] font-medium text-[#67826b]">
              Formula: {breakdown.textBreakdown}
            </p>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-xl border border-[#dce3da] text-xs font-semibold text-[#5a6b5d] hover:bg-[#f6f8f5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || Number(quantity) <= 0}
              className="h-11 flex-1 rounded-xl bg-[#173c2c] text-xs font-bold text-white shadow-xs hover:bg-[#23553a] disabled:opacity-50"
            >
              {isEdit ? 'Save Changes' : 'Add to List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

