import React, { useState } from 'react'
import {
  Calculator as CalcIcon,
  Plus,
  RotateCcw,
  Scale,
  Droplets,
  Hash,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { amountForItem, getCalculationBreakdown } from '../utils/calculations.js'
import { formatINR } from '../utils/currency.js'
import {
  UNIT_TYPES,
  mixedWeightToGrams,
  gramsToMixedWeight,
  mixedVolumeToMl,
  mlToMixedVolume,
  getQuantityPresets,
} from '../utils/unitConversions.js'

export default function Calculator({ onAddToList }) {
  // Unit tabs: 'kg' | 'litre' | 'dozen' | 'packet' | 'bundle' | 'tray' | 'piece'
  const [unit, setUnit] = useState('kg')
  const [name, setName] = useState('Tomatoes')
  const [rate, setRate] = useState('40')
  const [category, setCategory] = useState('Vegetables')
  const [emoji, setEmoji] = useState('🍅')

  // Direct quantity state
  const [quantity, setQuantity] = useState('789')

  // Mixed inputs
  const [mixedMode, setMixedMode] = useState(false)
  const [kgVal, setKgVal] = useState('0')
  const [gVal, setGVal] = useState('789')
  const [litreVal, setLitreVal] = useState('0')
  const [mlVal, setMlVal] = useState('750')

  // Handle unit tab switch
  const handleSelectUnit = (newUnit) => {
    setUnit(newUnit)
    setMixedMode(false)
    if (newUnit === 'kg') {
      setName('Tomatoes')
      setEmoji('🍅')
      setRate('40')
      setQuantity('789')
      setKgVal('0')
      setGVal('789')
      setCategory('Vegetables')
    } else if (newUnit === 'litre') {
      setName('Milk')
      setEmoji('🥛')
      setRate('80')
      setQuantity('750')
      setLitreVal('0')
      setMlVal('750')
      setCategory('Dairy')
    } else if (newUnit === 'dozen') {
      setName('Bananas')
      setEmoji('🍌')
      setRate('60')
      setQuantity('7')
      setCategory('Fruits')
    } else if (newUnit === 'packet') {
      setName('Bread')
      setEmoji('🍞')
      setRate('25')
      setQuantity('3')
      setCategory('Groceries')
    } else {
      setName('Item')
      setEmoji('🥬')
      setRate('30')
      setQuantity('1')
      setCategory('Vegetables')
    }
  }

  // Handle mixed weight inputs
  const handleMixedWeight = (k, g) => {
    setKgVal(k)
    setGVal(g)
    const totalGrams = mixedWeightToGrams(k, g)
    setQuantity(String(totalGrams))
  }

  // Handle mixed volume inputs
  const handleMixedVolume = (l, m) => {
    setLitreVal(l)
    setMlVal(m)
    const totalMl = mixedVolumeToMl(l, m)
    setQuantity(String(totalMl))
  }

  // Current calculation item
  const currentItem = {
    name: name.trim() || 'Shopping Item',
    category,
    emoji: emoji || '🥬',
    rate: Number(rate) || 0,
    unit,
    quantity: Number(quantity) || 0,
  }

  const breakdown = getCalculationBreakdown(currentItem)
  const presets = getQuantityPresets(unit)

  // Real world demo presets
  const sampleCalculations = [
    {
      title: 'Tomatoes by weight',
      detail: '₹40/kg · 789 grams',
      rate: 40,
      qty: 789,
      unit: 'kg',
      name: 'Tomatoes',
      emoji: '🍅',
      category: 'Vegetables',
    },
    {
      title: 'Capsicum mixed weight',
      detail: '₹60/kg · 1 kg 270 g',
      rate: 60,
      qty: 1270,
      unit: 'kg',
      name: 'Capsicum',
      emoji: '🫑',
      category: 'Vegetables',
      mixed: { kg: 1, g: 270 },
    },
    {
      title: 'Bananas per dozen',
      detail: '₹60/dozen · 7 pieces',
      rate: 60,
      qty: 7,
      unit: 'dozen',
      name: 'Bananas',
      emoji: '🍌',
      category: 'Fruits',
    },
    {
      title: 'Milk volume',
      detail: '₹80/litre · 750 ml',
      rate: 80,
      qty: 750,
      unit: 'litre',
      name: 'Milk',
      emoji: '🥛',
      category: 'Dairy',
    },
  ]

  const loadSample = (s) => {
    setUnit(s.unit)
    setName(s.name)
    setEmoji(s.emoji)
    setRate(String(s.rate))
    setQuantity(String(s.qty))
    setCategory(s.category)
    if (s.mixed) {
      setMixedMode(true)
      setKgVal(String(s.mixed.kg))
      setGVal(String(s.mixed.g))
    } else {
      setMixedMode(false)
    }
  }

  const handleReset = () => {
    setName('')
    setRate('')
    setQuantity('')
    setKgVal('0')
    setGVal('0')
    setLitreVal('0')
    setMlVal('0')
  }

  const handleAdd = () => {
    if (!name.trim() || Number(rate) <= 0 || Number(quantity) <= 0) return
    onAddToList({
      id: Date.now() + Math.random(),
      name: name.trim(),
      category,
      emoji: emoji.trim() || '🥬',
      rate: Number(rate),
      unit,
      quantity: Number(quantity),
      purchased: false,
      notes: `Calculated at scale: ${breakdown.formula}`,
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Precision Market Arithmetic"
        title="Price Calculator"
        subtitle="Never get overcharged. Type the vendor's rate and scale reading to see the exact cost to the nearest paise."
        actions={
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#d6e0d3] bg-white px-3.5 text-xs font-bold text-[#4e6451] hover:bg-[#f6faf4]"
          >
            <RotateCcw size={14} /> Clear fields
          </button>
        }
      />

      {/* Pricing basis tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'kg', label: 'Weight (kg / g)', icon: Scale },
          { id: 'litre', label: 'Volume (L / ml)', icon: Droplets },
          { id: 'dozen', label: 'Dozen (12 pcs)', icon: Hash },
          { id: 'packet', label: 'Packets', icon: Package },
          { id: 'bundle', label: 'Bundles', icon: Layers },
          { id: 'piece', label: 'Per Piece', icon: Hash },
        ].map((tab) => {
          const Icon = tab.icon
          const active = unit === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectUnit(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${active
                ? 'bg-[#173c2c] text-white shadow-xs'
                : 'border border-[#e2e7df] bg-white text-[#566858] hover:border-[#b8cdb6] hover:bg-[#f6faf4]'
                }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Main Grid: Calculator Inputs on Left, Result Card on Right */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
        {/* Left: Input Form Card */}
        <section className="rounded-2xl border border-[#e5ebe2] bg-white p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#f0f4ee] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#1b3422]">
                {unit === 'kg'
                  ? 'Weight-Based Calculation'
                  : unit === 'litre'
                    ? 'Volume-Based Calculation'
                    : unit === 'dozen'
                      ? 'Dozen-Based Calculation'
                      : 'Discrete Units Calculation'}
              </h2>
              <p className="mt-0.5 text-xs text-[#7e8e81]">
                Rate basis: <span className="font-semibold text-[#276a3b]">{UNIT_TYPES[unit]?.label}</span>
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf3e7] text-2xl">
              {emoji}
            </span>
          </div>

          {/* Product Name & Emoji */}
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#566858]">Item Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tomatoes"
                className="field font-semibold text-[#1c3523]"
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

          {/* Rate and Quantity Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#566858]">
                Rate (₹ {UNIT_TYPES[unit]?.shortLabel}) *
              </label>
              <div className="relative">
                {/* <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#809183]">
                  ₹
                </span> */}
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="40"
                  className="field pl-8 font-extrabold text-[#1c3523] text-base"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#566858]">
                  {unit === 'kg'
                    ? 'Scale Weight'
                    : unit === 'litre'
                      ? 'Liquid Volume'
                      : unit === 'dozen'
                        ? 'Piece Count'
                        : 'Count'} *
                </label>
                {(unit === 'kg' || unit === 'litre') && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = !mixedMode
                      setMixedMode(next)
                      if (next && unit === 'kg') {
                        const { kg, grams } = gramsToMixedWeight(Number(quantity) || 0)
                        setKgVal(String(kg))
                        setGVal(String(grams))
                      } else if (next && unit === 'litre') {
                        const { litres, ml } = mlToMixedVolume(Number(quantity) || 0)
                        setLitreVal(String(litres))
                        setMlVal(String(ml))
                      }
                    }}
                    className="text-[10px] font-bold text-[#2a6d41] hover:underline"
                  >
                    {mixedMode ? 'Direct numeric' : 'Mixed (kg+g)'}
                  </button>
                )}
              </div>

              {!mixedMode ? (
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder={unit === 'kg' ? '789' : '1'}
                    className="field font-extrabold text-[#1c3523] text-base"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#809183]">
                    {unit === 'kg' ? 'grams' : unit === 'litre' ? 'ml' : 'units'}
                  </span>
                </div>
              ) : unit === 'kg' ? (
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={kgVal}
                      onChange={(e) => handleMixedWeight(e.target.value, gVal)}
                      className="field pr-6 font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#809183]">
                      kg
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={gVal}
                      onChange={(e) => handleMixedWeight(kgVal, e.target.value)}
                      className="field pr-5 font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#809183]">
                      g
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={litreVal}
                      onChange={(e) => handleMixedVolume(e.target.value, mlVal)}
                      className="field pr-5 font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#809183]">
                      L
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={mlVal}
                      onChange={(e) => handleMixedVolume(litreVal, e.target.value)}
                      className="field pr-6 font-bold"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#809183]">
                      ml
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick preset chips */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#829585]">
              Quick Weight Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  type="button"
                  key={p.value}
                  onClick={() => {
                    setQuantity(String(p.value))
                    if (unit === 'kg') {
                      const { kg, grams } = gramsToMixedWeight(p.value)
                      setKgVal(String(kg))
                      setGVal(String(grams))
                    } else if (unit === 'litre') {
                      const { litres, ml } = mlToMixedVolume(p.value)
                      setLitreVal(String(litres))
                      setMlVal(String(ml))
                    }
                  }}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${Number(quantity) === p.value
                    ? 'border-[#276a3b] bg-[#eaf3e7] text-[#1b4b2a]'
                    : 'border-[#dfe6dc] bg-white text-[#516453] hover:border-[#b8cdb6] hover:bg-[#f6faf4]'
                    }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Right: Big Result Display & Add to list */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-[#173c2c] p-6 sm:p-7 text-white shadow-lg">
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-[#276a3b]/40 blur-2xl" />

            <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                  {emoji || '🥬'}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{name || 'Your Item'}</h3>
                  <p className="text-xs text-[#bcd2c0]">
                    {rate ? `₹${rate} ${UNIT_TYPES[unit]?.shortLabel}` : 'Rate not set'}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-[#b9e4a8]">
                Exact Math
              </span>
            </div>

            <div className="relative mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a9c5ad]">
                Final Amount to Pay
              </p>
              <p className="mt-1 text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-white">
                {breakdown.formattedAmount}
              </p>
            </div>

            {/* Arithmetic Formula Explanation */}
            <div className="relative mt-5 rounded-xl bg-white/10 p-3.5 text-xs text-[#d3e5d7] leading-relaxed">
              <p className="font-semibold text-white">Breakdown:</p>
              <p className="mt-0.5">{breakdown.textBreakdown}</p>
            </div>

            {/* Add to current shopping list button */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={!name.trim() || Number(rate) <= 0 || Number(quantity) <= 0}
              className="relative mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#a7e494] text-sm font-extrabold text-[#173c2c] shadow-md transition hover:bg-[#bcf0ab] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={18} strokeWidth={2.6} />
              <span>Add to Shopping List</span>
            </button>
          </div>

          {/* Real-World Clickable Examples */}
          <div className="rounded-2xl border border-[#e5ebe2] bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#3b8c53]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#566858]">
                Try Real Market Examples
              </h4>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {sampleCalculations.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadSample(sample)}
                  className="rounded-xl border border-[#e8eee6] p-2.5 text-left transition hover:border-[#b8cdb6] hover:bg-[#f6faf4]"
                >
                  <p className="text-xs font-bold text-[#1e3825]">
                    {sample.emoji} {sample.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#788a7c]">{sample.detail}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

