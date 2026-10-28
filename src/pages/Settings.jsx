import React, { useState, useRef } from 'react'
import {
  Settings2,
  Wallet,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Database,
  Info,
  RefreshCw,
} from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { formatINR } from '../utils/currency.js'
import { BUDGET_PRESETS, STARTER_PRODUCTS } from '../data/defaultProducts.js'
import { clearSabziMateStorage } from '../hooks/useLocalStorage.js'

export default function Settings({
  budget = 500,
  setBudget,
  items = [],
  setItems,
  history = [],
  setHistory,
  savedPrices = [],
  setSavedPrices,
  notify,
}) {
  const [budgetValue, setBudgetValue] = useState(String(budget))
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const fileInputRef = useRef(null)

  const handleSaveBudget = (e) => {
    e.preventDefault()
    const num = Number(budgetValue)
    if (Number.isFinite(num) && num >= 0) {
      setBudget(num)
      notify && notify(`Default budget set to ${formatINR(num, { showDecimals: false })}`)
    }
  }

  // Export JSON backup
  const handleExport = () => {
    try {
      const backupData = {
        app: 'SabziMate',
        version: '2.0.0',
        exportedAt: new Date().toISOString(),
        budget,
        items,
        history,
        savedPrices,
      }

      const jsonStr = JSON.stringify(backupData, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      const datePart = new Date().toISOString().slice(0, 10)
      a.download = `sabzimate-backup-${datePart}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      notify && notify('SabziMate backup downloaded successfully')
    } catch (err) {
      console.error('Export failed:', err)
      notify && notify('Export failed')
    }
  }

  // Import JSON backup
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result)

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON structure')
        }

        if (typeof parsed.budget === 'number') {
          setBudget(parsed.budget)
          setBudgetValue(String(parsed.budget))
        }

        if (Array.isArray(parsed.items)) {
          setItems(parsed.items)
        }

        if (Array.isArray(parsed.history)) {
          setHistory(parsed.history)
        }

        if (Array.isArray(parsed.savedPrices)) {
          setSavedPrices(parsed.savedPrices)
        }

        notify && notify('Backup restored successfully!')
      } catch (err) {
        console.error('Import failed:', err)
        alert('Failed to parse backup file. Please select a valid SabziMate JSON backup.')
      }
    }
    reader.readAsText(file)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Clear all local application data
  const handleClearAllData = () => {
    clearSabziMateStorage()
    setItems([])
    setHistory([])
    setSavedPrices(STARTER_PRODUCTS)
    setBudget(500)
    setBudgetValue('500')
    setConfirmClearOpen(false)
    notify && notify('All local data cleared and reset to defaults')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Preferences & Device Data"
        title="Settings"
        subtitle="Configure your target shopping budget, export or restore backups, and control data stored in your browser."
      />

      <div className="grid gap-6 max-w-3xl">
        {/* Shopping Budget Section */}
        <section className="rounded-2xl border border-[#e5ebe2] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf3e7] text-[#2c7241]">
              <Wallet size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1b3422]">Default Shopping Budget</h2>
              <p className="text-xs text-[#7e8f80]">
                Target amount for monitoring your shopping trips
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveBudget} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#566858]">
                Budget Target (₹)
              </label>
              <div className="relative max-w-sm">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#809183]">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={budgetValue}
                  onChange={(e) => setBudgetValue(e.target.value)}
                  className="field pl-8 font-extrabold text-base text-[#1c3523]"
                />
              </div>
            </div>

            {/* Quick preset chips */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#829585]">
                Quick Presets
              </p>
              <div className="flex flex-wrap gap-2">
                {BUDGET_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => {
                      setBudgetValue(String(preset))
                      setBudget(preset)
                      notify && notify(`Budget set to ₹${preset}`)
                    }}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                      Number(budgetValue) === preset
                        ? 'border-[#276a3b] bg-[#eaf3e7] text-[#1b4b2a]'
                        : 'border-[#dfe6dc] bg-white text-[#566858] hover:border-[#b8cdb6] hover:bg-[#f6faf4]'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#173c2c] px-5 text-xs font-bold text-white shadow-xs hover:bg-[#23553a] transition-colors"
            >
              Save Budget
            </button>
          </form>
        </section>

        {/* Local Storage & Data Summary */}
        <section className="rounded-2xl border border-[#e5ebe2] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf3e7] text-[#2c7241]">
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1b3422]">Local Device Data</h2>
              <p className="text-xs text-[#7e8f80]">
                SabziMate runs entirely offline and stores your lists locally
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-[#edf2ea] bg-[#f8faf6] p-3 text-center">
              <p className="text-xl font-extrabold text-[#173c2c] tabular-nums">{items.length}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-[#738575]">Current Items</p>
            </div>
            <div className="rounded-xl border border-[#edf2ea] bg-[#f8faf6] p-3 text-center">
              <p className="text-xl font-extrabold text-[#173c2c] tabular-nums">
                {savedPrices.length}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-[#738575]">Saved Prices</p>
            </div>
            <div className="rounded-xl border border-[#edf2ea] bg-[#f8faf6] p-3 text-center">
              <p className="text-xl font-extrabold text-[#173c2c] tabular-nums">{history.length}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-[#738575]">Archived Bills</p>
            </div>
          </div>

          {/* Backup / Restore Controls */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3 border-t border-[#f0f4ee] pt-4">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#d6e0d3] bg-white text-xs font-bold text-[#295b36] hover:bg-[#f6faf4] transition-colors"
            >
              <Download size={16} />
              <span>Export JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#d6e0d3] bg-white text-xs font-bold text-[#295b36] hover:bg-[#f6faf4] transition-colors"
            >
              <Upload size={16} />
              <span>Import JSON Backup</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </section>

        {/* Privacy & Browser Notice */}
        <section className="rounded-2xl border border-[#dfe8dc] bg-[#f2f7ef] p-5 text-xs text-[#35573d] flex items-start gap-3">
          <ShieldCheck size={20} className="text-[#3b8c53] shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <p className="font-bold text-[#1f4228]">Private, Zero-Tracking Architecture</p>
            <p>
              Your shopping lists and prices never leave your device. There are no servers, no ads,
              and no login required.
            </p>
            <p className="text-[11px] text-[#5e7762]">
              Note: Clearing your browser's site cache or using private/incognito mode without
              exporting will erase your saved records. Download an occasional backup to stay safe.
            </p>
          </div>
        </section>

        {/* Danger Zone: Clear Data */}
        <section className="rounded-2xl border border-[#ebd7d3] bg-white p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#b4483a]">Danger Zone</h3>
          <p className="mt-1 text-xs text-[#8f7572] leading-relaxed">
            Permanently clear all SabziMate data (current shopping list, custom saved prices,
            archived bills, and budget) from this browser.
          </p>
          <button
            type="button"
            onClick={() => setConfirmClearOpen(true)}
            className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#ebc7c2] bg-[#fff6f4] px-4 text-xs font-bold text-[#b4483a] hover:bg-[#ffece9] transition-colors"
          >
            <Trash2 size={15} />
            <span>Clear All Local Storage Data</span>
          </button>
        </section>
      </div>

      <ConfirmDialog
        isOpen={confirmClearOpen}
        title="Reset all SabziMate data?"
        message="This will permanently delete all your shopping items, history, and custom prices from this browser. This cannot be undone unless you have a JSON backup."
        confirmText="Yes, Clear Everything"
        isDanger={true}
        onConfirm={handleClearAllData}
        onClose={() => setConfirmClearOpen(false)}
      />
    </div>
  )
}

