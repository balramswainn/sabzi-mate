import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  if (!toast) return null

  const isString = typeof toast === 'string'
  const message = isString ? toast : toast.message
  const type = isString ? 'success' : toast.type || 'success'

  return (
    <div
      className="fixed bottom-20 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[#173c2c] px-4 py-2.5 text-xs font-semibold text-white shadow-xl border border-[#2b5840] lg:bottom-6 animate-fade-in"
      role="status"
      aria-live="polite"
    >
      {type === 'success' && <CheckCircle2 size={16} className="text-[#a6e696]" />}
      {type === 'error' && <AlertCircle size={16} className="text-[#ff9d91]" />}
      {type === 'info' && <Info size={16} className="text-[#96d2e6]" />}
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-1 rounded-full p-0.5 text-white/70 hover:text-white"
          aria-label="Dismiss toast"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}

