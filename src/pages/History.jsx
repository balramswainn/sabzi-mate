import React, { useState } from 'react'
import {
  History as HistoryIcon,
  Receipt,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  Clock3,
} from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { formatINR } from '../utils/currency.js'
import { formatQuantity, getUnitShortLabel } from '../utils/unitConversions.js'
import { amountForItem } from '../utils/calculations.js'

export default function History({ history = [], setHistory, onReAddItems, notify }) {
  const [selectedBillId, setSelectedBillId] = useState(null)
  const [billToDelete, setBillToDelete] = useState(null)
  const [confirmClearHistory, setConfirmClearHistory] = useState(false)

  const toggleDetails = (id) => {
    setSelectedBillId((prev) => (prev === id ? null : id))
  }

  const handleDeleteBill = () => {
    if (!billToDelete) return
    setHistory((prev) => prev.filter((b) => b.id !== billToDelete.id))
    setBillToDelete(null)
    notify && notify('Shopping bill removed from history')
  }

  const handleClearAll = () => {
    setHistory([])
    setConfirmClearHistory(false)
    notify && notify('All shopping history cleared')
  }

  const handleReAdd = (bill) => {
    if (!bill.items || bill.items.length === 0) return
    if (onReAddItems) {
      onReAddItems(bill.items)
      notify && notify(`Re-added ${bill.items.length} items to active shopping list`)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Purchases & Archives"
        title="Shopping History"
        subtitle="Review past bills, see how much you spent on previous market visits, and repeat your favorite shopping lists in one click."
        actions={
          history.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClearHistory(true)}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#ebd6d2] bg-white px-3.5 text-xs font-bold text-[#a45347] hover:bg-[#fff5f2] transition-colors"
            >
              <Trash2 size={15} />
              <span>Clear History</span>
            </button>
          )
        }
      />

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((bill) => {
            const isExpanded = selectedBillId === bill.id
            const dateObj = new Date(bill.date)
            const dateStr = new Intl.DateTimeFormat('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }).format(dateObj)
            const timeStr = new Intl.DateTimeFormat('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            }).format(dateObj)

            return (
              <div
                key={bill.id}
                className="overflow-hidden rounded-2xl border border-[#e5ebe2] bg-white shadow-xs transition hover:border-[#cbdec4]"
              >
                {/* Header Row */}
                <div className="flex flex-col gap-3 p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#edf5e8] text-[#2c7241]">
                      <Receipt size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-[#193521]">
                          Shopping Bill
                        </h3>
                        <span className="rounded-md bg-[#f2f6ee] px-2 py-0.5 text-[10px] font-bold text-[#56755c]">
                          {bill.items?.length || 0} items
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#7e8f80]">
                        {dateStr} at {timeStr}
                      </p>
                    </div>
                  </div>

                  {/* Bill Total & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0f4ee]">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] uppercase tracking-wider text-[#859687]">
                        Total Amount
                      </p>
                      <p className="text-xl font-extrabold text-[#173c2c] tabular-nums">
                        {formatINR(bill.total)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Repeat items button */}
                      <button
                        type="button"
                        onClick={() => handleReAdd(bill)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#d6e0d3] bg-[#f9faf7] px-3 text-xs font-bold text-[#2a6d41] hover:bg-[#eef5eb] transition-colors"
                        title="Re-add all items to shopping list"
                      >
                        <RotateCcw size={13} />
                        <span className="hidden md:inline">Re-add</span>
                      </button>

                      {/* Expand / Collapse */}
                      <button
                        type="button"
                        onClick={() => toggleDetails(bill.id)}
                        className="inline-flex h-9 items-center gap-1 rounded-xl border border-[#e4eae0] bg-white px-3 text-xs font-bold text-[#4c5f50] hover:bg-[#f6faf4]"
                      >
                        <span>{isExpanded ? 'Hide' : 'Details'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setBillToDelete(bill)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-[#9c7873] hover:bg-[#fff0ed] hover:text-[#b84e40]"
                        title="Delete bill"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details: Breakdown of all items */}
                {isExpanded && (
                  <div className="border-t border-[#edf2ea] bg-[#fafcf9] p-4 sm:p-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#738776] mb-3">
                      Purchased Items Snapshot
                    </h4>

                    <div className="divide-y divide-[#edf2ea] rounded-xl border border-[#e2e9df] bg-white">
                      {bill.items?.map((item, idx) => {
                        const itemAmt = amountForItem(item)
                        return (
                          <div
                            key={item.id ?? idx}
                            className="flex items-center justify-between p-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-xl">{item.emoji || '🥬'}</span>
                              <div className="min-w-0">
                                <p className="font-bold text-[#1f3724] truncate">{item.name}</p>
                                <p className="text-[11px] text-[#7d8f80]">
                                  {formatINR(item.rate)}
                                  {getUnitShortLabel(item.unit)} ·{' '}
                                  {formatQuantity(item.quantity, item.unit)}
                                </p>
                              </div>
                            </div>
                            <span className="font-extrabold text-[#173c2c] tabular-nums">
                              {formatINR(itemAmt)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={Clock3}
          title="No shopping trips recorded yet"
          description="When you complete a market shopping session on the Shopping List screen, your verified bill and all weighed items are saved here."
        />
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={Boolean(billToDelete)}
        title="Delete this shopping bill?"
        message="Are you sure you want to delete this historical bill? This cannot be undone."
        confirmText="Delete Bill"
        isDanger={true}
        onConfirm={handleDeleteBill}
        onClose={() => setBillToDelete(null)}
      />

      <ConfirmDialog
        isOpen={confirmClearHistory}
        title="Clear entire shopping history?"
        message="This will delete all saved bills from your browser storage. Your current active shopping checklist will not be affected."
        confirmText="Clear All History"
        isDanger={true}
        onConfirm={handleClearAll}
        onClose={() => setConfirmClearHistory(false)}
      />
    </div>
  )
}

