import React from 'react'
import { House, ShoppingBasket, Calculator, BadgeIndianRupee, History, Settings2 } from 'lucide-react'

const BOTTOM_NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBasket },
  { id: 'calculator', label: 'Calculate', icon: Calculator },
  { id: 'saved', label: 'Prices', icon: BadgeIndianRupee },
  { id: 'history', label: 'History', icon: History },
]

export default function BottomNav({ activePage, setActivePage, pendingCount = 0 }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e5eae2] bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md lg:hidden shadow-lg"
      aria-label="Mobile Navigation"
    >
      <div className="mx-auto grid grid-cols-5 max-w-md items-center">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = activePage === item.id
          const hasBadge = item.id === 'shopping' && pendingCount > 0

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-colors ${
                active ? 'text-[#1e542f]' : 'text-[#7d8c80] hover:text-[#213828]'
              }`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={active ? 2.4 : 1.9} />
                {hasBadge && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1e542f] px-1 text-[9px] font-bold text-white shadow-xs">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
              {active && (
                <span className="absolute bottom-0.5 h-1 w-6 rounded-full bg-[#2a7042]" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

