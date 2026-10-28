import React from 'react'
import { Check, Edit2, Trash2, Plus, Minus } from 'lucide-react'
import { amountForItem, formatINR } from '../utils/calculations.js'
import { formatQuantity, getUnitShortLabel } from '../utils/unitConversions.js'

export default function ShoppingItem({
  item,
  onTogglePurchased,
  onEdit,
  onDelete,
  onQuickAdjustQty,
  compact = false,
}) {
  const isPurchased = Boolean(item.purchased)
  const amount = amountForItem(item)
  const formattedAmount = formatINR(amount)
  const qtyText = formatQuantity(item.quantity, item.unit)
  const unitRate = `${formatINR(item.rate)}${getUnitShortLabel(item.unit)}`

  return (
    <div
      className={`group relative flex items-center gap-3 rounded-2xl border transition-all duration-150 ${
        isPurchased
          ? 'border-[#e4ebe0] bg-[#f8faf6]/90 opacity-80'
          : 'border-[#e6ebe3] bg-white hover:border-[#cbdec4] hover:shadow-xs'
      } ${compact ? 'p-3' : 'p-3.5 sm:p-4'}`}
    >
      {/* Checkbox button */}
      <button
        type="button"
        role="checkbox"
        aria-checked={isPurchased}
        aria-label={`Mark ${item.name} as ${isPurchased ? 'pending' : 'purchased'}`}
        onClick={() => onTogglePurchased && onTogglePurchased(item.id)}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#62a46c] ${
          isPurchased
            ? 'border-[#307a44] bg-[#307a44] text-white shadow-xs'
            : 'border-[#cfd8cd] bg-white text-transparent hover:border-[#62a46c]'
        }`}
      >
        <Check size={14} strokeWidth={3} className={isPurchased ? 'opacity-100' : 'opacity-0'} />
      </button>

      {/* Emoji / Icon */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl transition-colors ${
          isPurchased ? 'bg-[#edf1eb]' : 'bg-[#f2f6ee]'
        }`}
      >
        <span role="img" aria-label={item.name}>
          {item.emoji || '🥬'}
        </span>
      </div>

      {/* Product Details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={`truncate text-sm font-bold transition-all ${
              isPurchased
                ? 'text-[#7e8e81] line-through decoration-[#b2c2b5]'
                : 'text-[#1c3323]'
            }`}
          >
            {item.name}
          </p>
          {item.category && item.category !== 'Other' && (
            <span className="hidden sm:inline-flex items-center rounded-md bg-[#edf3ea] px-1.5 py-0.5 text-[10px] font-medium text-[#49704e]">
              {item.category}
            </span>
          )}
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-[#7d8c80]">
          <span className="font-semibold text-[#48634e]">{unitRate}</span>
          <span className="text-[#c4cec2]">·</span>
          <span className="font-medium text-[#2d4d35]">{qtyText}</span>
          {item.notes && (
            <>
              <span className="text-[#c4cec2]">·</span>
              <span className="italic text-[#8fa092] truncate max-w-[120px]">{item.notes}</span>
            </>
          )}
        </div>
      </div>

      {/* Amount and Actions */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="text-right">
          <p
            className={`text-sm sm:text-base font-extrabold tabular-nums tracking-tight ${
              isPurchased ? 'text-[#748777]' : 'text-[#193d25]'
            }`}
          >
            {formattedAmount}
          </p>
          <p className="text-[10px] text-[#8ea091]">
            {isPurchased ? 'Purchased' : 'Estimated'}
          </p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-0.5">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(item)}
              aria-label={`Edit ${item.name}`}
              className="rounded-lg p-1.5 text-[#6c8270] transition hover:bg-[#edf5e8] hover:text-[#214f2e] focus:outline-none focus:ring-1 focus:ring-[#8ab48a]"
            >
              <Edit2 size={15} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(item.id, item.name)}
              aria-label={`Remove ${item.name}`}
              className="rounded-lg p-1.5 text-[#9a7671] transition hover:bg-[#fff0ed] hover:text-[#ba4f40] focus:outline-none focus:ring-1 focus:ring-[#e29388]"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

