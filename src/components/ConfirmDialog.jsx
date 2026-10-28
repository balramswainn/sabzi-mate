import React, { useEffect } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

export default function ConfirmDialog({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
  onConfirm,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-[#e6eae2] transition-all">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isDanger ? 'bg-[#feece9] text-[#c04d3e]' : 'bg-[#e8f4e5] text-[#2c7542]'
            }`}
          >
            {isDanger ? <AlertTriangle size={20} /> : <Trash2 size={20} />}
          </div>
          <div className="flex-1">
            <h3 id="confirm-dialog-title" className="text-base font-bold text-[#1b3422]">
              {title}
            </h3>
            {message && <p className="mt-1 text-xs leading-relaxed text-[#758477]">{message}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#8c9c8f] hover:bg-[#f2f5f0]"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-10 flex-1 rounded-xl border border-[#dce3da] text-xs font-semibold text-[#5a6b5d] hover:bg-[#f6f8f5] transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            autoFocus
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`h-10 flex-1 rounded-xl text-xs font-bold text-white shadow-xs transition-colors ${
              isDanger
                ? 'bg-[#c5493a] hover:bg-[#ad3b2e]'
                : 'bg-[#173c2c] hover:bg-[#23553a]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

