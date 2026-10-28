import React, { useState, useEffect } from 'react'
import { Wallet, X, Check } from 'lucide-react'
import { BUDGET_PRESETS } from '../data/defaultProducts.js'
import { formatINR } from '../utils/currency.js'

export default function BudgetModal({ isOpen, budget = 500, onSave, onClose }) {
  const [value, setValue] = useState(String(budget))

  useEffect(() => {
    if (isOpen) {
      setValue(String(budget))
    }
  }, [isOpen, budget])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = Number(value)
    if (Number.isFinite(num) && num >= 0) {
      onSave(num)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[65] flex items-end justify-center bg-black/40 p-0 backdrop-blur-xs sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="budget-modal-title"
    >
      <div className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl border border-[#e5ebe1] sm:rounded-3xl sm:p-6 transition-all">
        <div className="flex items-center justify-between border-b border-[#f0f4ee] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf3e7] text-[#2c7241]">
              <Wallet size={20} />
            </div>
            <div>
              <h2 id="budget-modal-title" className="text-base font-bold text-[#1b3422]">
                Set Shopping Budget
              </h2>
              <p className="text-xs text-[#7e8e81]">Keep your spending controlled</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[#7f8f82] hover:bg-[#f1f6ed]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#566758]">
              Budget Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#849587]">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="1"
                autoFocus
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="500"
                className="field pl-8 text-base font-bold text-[#1c3523]"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#829285]">
              Quick Presets
            </p>
            <div className="grid grid-cols-3 gap-2">
              {BUDGET_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setValue(String(preset))}
                  className={`flex h-10 items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                    Number(value) === preset
                      ? 'border-[#2c7241] bg-[#eaf3e7] text-[#1b4b2a]'
                      : 'border-[#dfe6dd] bg-white text-[#566858] hover:border-[#b9ccb7] hover:bg-[#f9fbf8]'
                  }`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-xl border border-[#dce3da] text-xs font-semibold text-[#5a6b5d] hover:bg-[#f6f8f5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 flex-1 rounded-xl bg-[#173c2c] text-xs font-bold text-white shadow-xs hover:bg-[#23553a]"
            >
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

