import React from 'react'
import {
  CheckCircle2,
  Wallet,
  ShoppingBag,
  ListOrdered,
  Plus,
  Trash2,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react'
import { formatINR } from '../utils/currency.js'

export default function ShoppingSummary({
  items = [],
  totals,
  budget = 0,
  onCompleteShopping,
  onClearList,
  onAddNew,
}) {
  const {
    total = 0,
    purchasedTotal = 0,
    pendingTotal = 0,
    itemCount = 0,
    purchasedCount = 0,
    pendingCount = 0,
    remaining = 0,
    estimatedRemaining = 0,
    isOverBudget = false,
  } = totals || {}

  const hasPurchasedItems = purchasedCount > 0
  const allPurchased = itemCount > 0 && purchasedCount === itemCount

  return (
    <aside className="space-y-4">
      {/* Main Bill Summary Card */}
      <div className="rounded-2xl border border-[#e6ebe3] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#f0f3ee] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eef6ec] text-[#2c7241]">
              <ShoppingBag size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1b3423]">Shopping Summary</h3>
              <p className="text-[11px] text-[#869688]">Live session calculations</p>
            </div>
          </div>
          <span className="rounded-full bg-[#f1f6ed] px-2.5 py-0.5 text-[11px] font-bold text-[#3d6e49]">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Item count breakdown */}
        <div className="mt-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#6d7e70]">Purchased items</span>
            <span className="font-bold text-[#234c2e] tabular-nums">
              {purchasedCount} / {itemCount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#6d7e70]">Pending to buy</span>
            <span className="font-bold text-[#627766] tabular-nums">{pendingCount}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[#6d7e70]">Purchased amount</span>
            <span className="font-bold text-[#1a4427] tabular-nums">
              {formatINR(purchasedTotal)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#6d7e70]">Pending amount</span>
            <span className="font-semibold text-[#738776] tabular-nums">
              {formatINR(pendingTotal)}
            </span>
          </div>

          <div className="border-t border-dashed border-[#e4ebe0] pt-2.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#173822]">Total Estimated Bill</p>
                <p className="text-[10px] text-[#89998c]">If all items are bought</p>
              </div>
              <p className="text-base font-extrabold text-[#173822] tabular-nums">
                {formatINR(total)}
              </p>
            </div>
          </div>
        </div>

        {/* Budget Comparison Box */}
        <div className="mt-4 rounded-xl bg-[#f4f7f2] p-3.5 border border-[#e4ede1]">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-medium text-[#657867]">
              <Wallet size={13} className="text-[#3b7c4a]" /> Budget Limit
            </span>
            <span className="font-bold text-[#24452e]">{formatINR(budget)}</span>
          </div>

          {/* Progress mini bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#dbe5d8]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverBudget ? 'bg-[#d95d4d]' : 'bg-[#3b8c53]'
              }`}
              style={{
                width: `${budget > 0 ? Math.min(100, (purchasedTotal / budget) * 100) : 0}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#728374]">
              {isOverBudget ? 'Exceeded budget by' : 'Remaining budget'}
            </span>
            <span
              className={`font-bold tabular-nums ${
                isOverBudget ? 'text-[#c24f40]' : 'text-[#2a7042]'
              }`}
            >
              {isOverBudget
                ? `+${formatINR(Math.abs(remaining))}`
                : formatINR(remaining)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={onCompleteShopping}
            disabled={itemCount === 0}
            className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white shadow-xs transition-all duration-150 ${
              itemCount === 0
                ? 'cursor-not-allowed bg-[#a4b5a7] opacity-60'
                : 'bg-[#173c2c] hover:bg-[#23563a] active:scale-[0.99]'
            }`}
          >
            <CheckCircle2 size={17} />
            <span>Finish & Save Bill</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onAddNew}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#d8e2d4] bg-white text-xs font-semibold text-[#2f5a3a] hover:bg-[#f6f9f4] transition-colors"
            >
              <Plus size={14} /> Add Item
            </button>
            <button
              type="button"
              onClick={onClearList}
              disabled={itemCount === 0}
              className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#ebd6d2] bg-white px-3 text-xs font-semibold text-[#9e5348] hover:bg-[#fff5f2] disabled:opacity-50 transition-colors"
              title="Clear list"
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>

        <p className="mt-2.5 text-center text-[10px] leading-relaxed text-[#92a294]">
          Finishing shopping records this trip into History and resets your checklist.
        </p>
      </div>

      {/* Helpful Market Shopping Tip */}
      <div className="rounded-2xl border border-[#e5ebe2] bg-[#f2f7ef] p-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#234b2f]">
          <HelpCircle size={15} className="text-[#3b8c53]" />
          Market Shopping Tip
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-[#59705e]">
          Tap the checkbox next to any item as you pay the vendor. SabziMate automatically updates your purchased spent and informs you before you overspend.
        </p>
      </div>
    </aside>
  )
}

