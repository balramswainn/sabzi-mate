import React from 'react'
import {
  House,
  ShoppingBasket,
  Calculator,
  BadgeIndianRupee,
  History,
  Settings2,
  Leaf,
  X,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { formatINR } from '../utils/currency.js'

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: House, description: 'Overview & quick actions' },
  { id: 'shopping', label: 'Shopping List', icon: ShoppingBasket, description: 'Market checklist' },
  { id: 'calculator', label: 'Price Calculator', icon: Calculator, description: 'Instant weight & rate math' },
  { id: 'saved', label: 'Saved Prices', icon: BadgeIndianRupee, description: 'Everyday item reference' },
  { id: 'history', label: 'Shopping History', icon: History, description: 'Past shopping trips' },
]

export default function Sidebar({
  activePage,
  setActivePage,
  mobileNav,
  setMobileNav,
  pendingCount = 0,
  budget = 0,
}) {
  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[#e5eae2] bg-white px-5 py-6 lg:flex">
        <Brand />

        <div className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#98a49a]">
          Shopping Space
        </div>

        <nav className="mt-2.5 space-y-1.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={activePage === item.id}
              badge={item.id === 'shopping' && pendingCount > 0 ? pendingCount : null}
              onClick={() => setActivePage(item.id)}
            />
          ))}
        </nav>

        <div className="mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#98a49a]">
          Preferences
        </div>
        <div className="mt-2">
          <NavButton
            item={{ id: 'settings', label: 'Settings', icon: Settings2 }}
            active={activePage === 'settings'}
            onClick={() => setActivePage('settings')}
          />
        </div>

        {/* Pro-tip card */}
        <div className="mt-auto rounded-2xl bg-[#f0f6ec] p-4 border border-[#e2ece0]">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#2a6d41] shadow-xs">
            <Sparkles size={16} />
          </div>
          <p className="mt-2.5 text-xs font-bold text-[#1f472d]">Market Tip</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#5e7762]">
            Always weigh veggies with skins on and verify the scale zeros before weighing.
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-[#e2ede0] pt-2.5 text-[11px]">
            <span className="flex items-center gap-1 font-medium text-[#657d6a]">
              <Wallet size={13} className="text-[#3b7c4a]" /> Budget:
            </span>
            <span className="font-bold text-[#1e442c]">{formatINR(budget, { showDecimals: false })}</span>
          </div>
        </div>

        {/* User device badge */}
        <div className="mt-4 flex items-center gap-3 px-2 py-1 text-xs text-[#7d8c80]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#173c2c] text-xs font-bold text-[#b9e4a8]">
            SM
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#203627]">Local Storage</p>
            <p className="truncate text-[10px] text-[#95a396]">Private & offline-ready</p>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileNav && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setMobileNav(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          <aside
            className="flex h-full w-[280px] flex-col bg-white p-5 shadow-2xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <Brand />
              <button
                onClick={() => setMobileNav(false)}
                className="rounded-xl p-2 text-[#647466] hover:bg-[#f2f6ef] focus:outline-none focus:ring-2 focus:ring-[#8ab48a]"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#98a49a]">
              Navigation
            </div>

            <nav className="mt-2 space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  active={activePage === item.id}
                  badge={item.id === 'shopping' && pendingCount > 0 ? pendingCount : null}
                  onClick={() => {
                    setActivePage(item.id)
                    setMobileNav(false)
                  }}
                />
              ))}
              <div className="pt-2">
                <NavButton
                  item={{ id: 'settings', label: 'Settings', icon: Settings2 }}
                  active={activePage === 'settings'}
                  onClick={() => {
                    setActivePage('settings')
                    setMobileNav(false)
                  }}
                />
              </div>
            </nav>

            <div className="mt-auto rounded-2xl bg-[#f0f6ec] p-4 text-xs">
              <p className="font-bold text-[#224b30]">SabziMate v1.2</p>
              <p className="mt-1 text-[11px] text-[#69806c]">Smart shopping assistant for everyday markets.</p>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#173c2c] text-[#b9e4a8] shadow-sm">
        <Leaf size={22} strokeWidth={2.4} />
      </div>
      <div>
        <div className="text-xl font-extrabold tracking-tight text-[#173c2c]">
          SabziMate<span className="text-[#5ba14b]">.</span>
        </div>
        <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#869688]">
          Shop Smarter Every Day
        </div>
      </div>
    </div>
  )
}

function NavButton({ item, active, onClick, badge }) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-colors duration-150 ${
        active
          ? 'bg-[#eaf3e7] text-[#1e542f] shadow-xs'
          : 'text-[#5f6e63] hover:bg-[#f6f8f4] hover:text-[#213828]'
      }`}
    >
      <Icon
        size={18}
        strokeWidth={active ? 2.4 : 1.9}
        className={active ? 'text-[#2a7042]' : 'text-[#7d8d80] group-hover:text-[#2a7042]'}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {badge !== null && badge !== undefined && (
        <span
          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums ${
            active ? 'bg-[#2a7042] text-white' : 'bg-[#e5eee2] text-[#33593c]'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

