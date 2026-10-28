import React from 'react'
import { Plus } from 'lucide-react'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d5ded2] bg-[#fbfdfa] px-4 py-12 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff6ec] text-[#347847] shadow-xs">
          <Icon size={24} />
        </div>
      )}
      <h3 className="mt-4 text-base font-bold text-[#1c3523]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-[#7e8e81]">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#173c2c] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#23553a]"
        >
          <Plus size={15} />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

