import React from 'react'
import { Menu, Plus, Calculator, Leaf, Search, Wallet } from 'lucide-react'
import { formatINR } from '../utils/currency.js'

export default function Header({
  setMobileNav,
  activePage,
  onOpenAddItem,
  onOpenCalculator,
  budget = 0,
  spent = 0,
}) {
  const remaining = budget - spent

  return (
    <header className="sticky top-0 z-30 border-b border-[#e6ebe3] bg-[#f9faf7]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNav(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e7df] bg-white text-[#415344] lg:hidden hover:bg-[#f3f6f0] focus:outline-none focus:ring-2 focus:ring-[#8ab48a]"
            aria-label="Open mobile navigation"
          >
            <Menu size={20} />
          </button>

          {/* Mobile brand mark */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#173c2c] text-[#b9e4a8]">
              <Leaf size={16} />
            </div>
            <span className="text-base font-extrabold tracking-tight text-[#173c2c]">
              SabziMate
            </span>
          </div>

          {/* Desktop page subtitle */}
          <div className="hidden lg:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#718b74]">
              Fruits & Veggies Market Assistant
            </p>
            <p className="text-xs font-semibold text-[#243f2a]">
              Accurate weighing & fair market pricing
            </p>
          </div>
        </div>

        {/* Right: Quick actions & budget badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Budget status chip */}
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#e2e8df] bg-white px-3 py-1.5 text-xs shadow-xs">
            <Wallet size={14} className="text-[#3b7c4a]" />
            <span className="text-[#6d7e70]">Budget:</span>
            <span
              className={`font-bold tabular-nums ${
                remaining < 0 ? 'text-[#c24f40]' : 'text-[#244c2c]'
              }`}
            >
              {remaining < 0 ? `${formatINR(Math.abs(remaining))} over` : `${formatINR(remaining)} left`}
            </span>
          </div>

          {/* Quick Calculator button (if not already on calculator page) */}
          {activePage !== 'calculator' && onOpenCalculator && (
            <button
              type="button"
              onClick={onOpenCalculator}
              className="flex h-9 sm:h-10 items-center gap-1.5 rounded-xl border border-[#dfe6dc] bg-white px-3 text-xs font-bold text-[#355f3e] hover:bg-[#f4f8f1] transition-colors"
              title="Quick Price Calculator"
            >
              <Calculator size={15} />
              <span className="hidden md:inline">Calculator</span>
            </button>
          )}

          {/* Quick Add item button */}
          {onOpenAddItem && (
            <button
              type="button"
              onClick={onOpenAddItem}
              className="flex h-9 sm:h-10 items-center gap-1.5 rounded-xl bg-[#173c2c] px-3 sm:px-4 text-xs font-bold text-white shadow-xs hover:bg-[#23553a] active:scale-95 transition-all"
            >
              <Plus size={16} />
              <span>Add item</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

