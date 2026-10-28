import React from 'react'
import { Wallet, AlertCircle, CheckCircle2, ArrowUpRight, TrendingUp } from 'lucide-react'
import { formatINR } from '../utils/currency.js'

export default function BudgetCard({
  budget = 0,
  spent = 0,
  estimatedTotal = 0,
  onEditBudget,
  variant = 'dark', // 'dark' | 'light'
}) {
  const safeBudget = Number(budget) || 0
  const safeSpent = Number(spent) || 0
  const remaining = safeBudget - safeSpent
  const isOver = remaining < 0

  const progressPercent =
    safeBudget > 0 ? Math.min(100, Math.max(0, (safeSpent / safeBudget) * 100)) : 0
  const actualUsageRatio = safeBudget > 0 ? ((safeSpent / safeBudget) * 100).toFixed(0) : 0

  if (variant === 'light') {
    return (
      <div className="rounded-2xl border border-[#e5ebe2] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#697d6d]">
            <Wallet size={15} className="text-[#327a46]" />
            Shopping Budget
          </div>
          {onEditBudget && (
            <button
              onClick={onEditBudget}
              className="text-xs font-bold text-[#276a3b] hover:text-[#184626] transition-colors"
            >
              Adjust
            </button>
          )}
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <p className="text-[11px] text-[#7d8c80]">Spent so far</p>
            <p className="text-2xl font-bold tracking-tight text-[#1c3323]">{formatINR(safeSpent)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-[#7d8c80]">of {formatINR(safeBudget)}</p>
            <p className="text-xs font-semibold text-[#516b57]">{actualUsageRatio}% used</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#e9eee7]">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOver ? 'bg-[#d95d4d]' : progressPercent > 80 ? 'bg-[#d99434]' : 'bg-[#3b8c53]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-[#7d8c80]">{isOver ? 'Over budget by' : 'Remaining balance'}</span>
          <span
            className={`font-bold tabular-nums ${
              isOver ? 'text-[#c24f40]' : 'text-[#2a7042]'
            }`}
          >
            {isOver ? `+${formatINR(Math.abs(remaining))}` : formatINR(remaining)}
          </span>
        </div>
      </div>
    )
  }

  // Dark forest green hero card
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#173c2c] p-5 sm:p-6 text-white shadow-md">
      {/* Background accent ring */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#2a6845]/40 blur-2xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#bcd2c0]">
          <Wallet size={16} className="text-[#a4e190]" />
          Today's Budget
        </div>
        {onEditBudget && (
          <button
            onClick={onEditBudget}
            className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-white/20 active:scale-95"
          >
            Edit budget
          </button>
        )}
      </div>

      <div className="relative mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-[#a9c5ad]">Purchased spent</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {formatINR(safeSpent)}
          </p>
        </div>
        <div className="pb-1 text-right">
          <p className="text-xs text-[#a9c5ad]">Budget: {formatINR(safeBudget)}</p>
          <p className="mt-0.5 text-xs font-bold text-[#d2e8d6]">
            {actualUsageRatio}% utilized
          </p>
        </div>
      </div>

      {/* Progress track */}
      <div className="relative mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOver ? 'bg-[#ff9080]' : progressPercent > 85 ? 'bg-[#fed27a]' : 'bg-[#9ae786]'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="relative mt-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#b9d2bd]">
          {isOver ? (
            <AlertCircle size={14} className="text-[#ff9080]" />
          ) : (
            <CheckCircle2 size={14} className="text-[#9ae786]" />
          )}
          <span>{isOver ? 'Exceeded budget limit' : 'Safe shopping balance'}</span>
        </div>
        <span
          className={`font-bold tabular-nums text-sm ${
            isOver ? 'text-[#ff9080]' : 'text-[#b0ef9c]'
          }`}
        >
          {isOver
            ? `${formatINR(Math.abs(remaining))} over`
            : `${formatINR(remaining)} left`}
        </span>
      </div>

      {estimatedTotal > safeSpent && (
        <div className="relative mt-3 border-t border-white/10 pt-2.5 text-[11px] text-[#9fc1a4] flex justify-between">
          <span>Est. list total if all bought:</span>
          <span className="font-semibold text-white">{formatINR(estimatedTotal)}</span>
        </div>
      )}
    </div>
  )
}

