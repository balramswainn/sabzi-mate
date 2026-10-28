import React, { useState, useMemo, useCallback } from 'react'

// Custom hook & storage keys
import { useLocalStorage, STORAGE_KEYS } from './hooks/useLocalStorage.js'

// Initial and default data
import {
  INITIAL_SHOPPING_ITEMS,
  DEFAULT_BUDGET,
  STARTER_PRODUCTS,
} from './data/defaultProducts.js'

// Utilities
import { calculateShoppingTotals } from './utils/calculations.js'

// Components
import Sidebar from './components/Sidebar.jsx'
import BottomNav from './components/BottomNav.jsx'
import Header from './components/Header.jsx'
import Toast from './components/Toast.jsx'
import ItemModal from './components/ItemModal.jsx'
import BudgetModal from './components/BudgetModal.jsx'

// Pages
import Dashboard from './pages/Dashboard.jsx'
import ShoppingList from './pages/ShoppingList.jsx'
import Calculator from './pages/Calculator.jsx'
import SavedPrices from './pages/SavedPrices.jsx'
import History from './pages/History.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  // 1. Persistent State
  const [items, setItems] = useLocalStorage(STORAGE_KEYS.ITEMS, INITIAL_SHOPPING_ITEMS)
  const [budget, setBudget] = useLocalStorage(STORAGE_KEYS.BUDGET, DEFAULT_BUDGET)
  const [savedPrices, setSavedPrices] = useLocalStorage(
    STORAGE_KEYS.SAVED_PRICES,
    STARTER_PRODUCTS
  )
  const [history, setHistory] = useLocalStorage(STORAGE_KEYS.HISTORY, [])

  // 2. Navigation State
  const [activePage, setActivePage] = useState('dashboard')
  const [mobileNav, setMobileNav] = useState(false)

  // 3. Modal & Toast State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [toast, setToast] = useState(null)

  // Trigger non-intrusive floating toast notification
  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev))
    }, 2800)
  }, [])

  // 4. Live Calculations (single source of truth)
  const totals = useMemo(() => {
    return calculateShoppingTotals(items, budget)
  }, [items, budget])

  // 5. Item Actions
  const handleSaveItem = useCallback(
    (item) => {
      setItems((prev) => {
        const exists = prev.some((i) => i.id === item.id)
        if (exists) {
          return prev.map((i) => (i.id === item.id ? item : i))
        }
        return [item, ...prev]
      })
      notify(`${item.name} saved to shopping checklist`)
    },
    [setItems, notify]
  )

  const handleTogglePurchased = useCallback(
    (id) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const nextPurchased = !item.purchased
            return { ...item, purchased: nextPurchased }
          }
          return item
        })
      )
    },
    [setItems]
  )

  const handleDeleteItem = useCallback(
    (id) => {
      setItems((prev) => prev.filter((i) => i.id !== id))
      notify('Item removed from checklist')
    },
    [setItems, notify]
  )

  const handleEditItem = useCallback((item) => {
    setItemToEdit(item)
    setIsItemModalOpen(true)
  }, [])

  const handleAddNewItem = useCallback(() => {
    setItemToEdit(null)
    setIsItemModalOpen(true)
  }, [])

  // Quick add starter product from Dashboard or SavedPrices
  const handleQuickAddProduct = useCallback(
    (prod) => {
      const newItem = {
        id: Date.now() + Math.random(),
        name: prod.name,
        category: prod.category || 'Vegetables',
        emoji: prod.emoji || '🥬',
        rate: prod.rate,
        unit: prod.unit,
        quantity: prod.defaultQuantity || 500,
        purchased: false,
      }
      setItems((prev) => [newItem, ...prev])
      notify(`Added ${prod.name} to shopping list`)
    },
    [setItems, notify]
  )

  // Finish shopping session & archive bill into History
  const handleCompleteShopping = useCallback(() => {
    if (!items.length) {
      notify('Your shopping list is empty', 'error')
      return
    }

    const billRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      total: totals.total,
      purchasedTotal: totals.purchasedTotal,
      budget,
      items: items.map((i) => ({ ...i })),
    }

    setHistory((prev) => [billRecord, ...prev].slice(0, 100))
    setItems([])
    setActivePage('history')
    notify('Shopping bill archived in history!')
  }, [items, totals, budget, setHistory, setItems, notify])

  // Clear active shopping list
  const handleClearList = useCallback(() => {
    setItems([])
    notify('Shopping list cleared')
  }, [setItems, notify])

  // Re-add items from a historical bill to active shopping list
  const handleReAddHistoricalItems = useCallback(
    (historicalItems) => {
      const clonedItems = historicalItems.map((item) => ({
        ...item,
        id: Date.now() + Math.random(),
        purchased: false,
      }))
      setItems((prev) => [...clonedItems, ...prev])
      setActivePage('shopping')
      notify(`Re-added ${historicalItems.length} items to shopping list`)
    },
    [setItems, notify]
  )

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-[#17241d] antialiased">
      {/* Desktop & Mobile Drawer Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileNav={mobileNav}
        setMobileNav={setMobileNav}
        pendingCount={totals.pendingCount}
        budget={budget}
      />

      {/* Main Content Area */}
      <div className="min-h-screen lg:pl-64 flex flex-col">
        {/* Sticky Header */}
        <Header
          setMobileNav={setMobileNav}
          activePage={activePage}
          onOpenAddItem={handleAddNewItem}
          onOpenCalculator={() => setActivePage('calculator')}
          budget={budget}
          spent={totals.purchasedTotal}
        />

        {/* Page Container */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 pb-28 lg:pb-12">
          {activePage === 'dashboard' && (
            <Dashboard
              items={items}
              totals={totals}
              budget={budget}
              history={history}
              onOpenAddItem={handleAddNewItem}
              onOpenCalculator={() => setActivePage('calculator')}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              setActivePage={setActivePage}
              onTogglePurchased={handleTogglePurchased}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onQuickAddProduct={handleQuickAddProduct}
            />
          )}

          {activePage === 'shopping' && (
            <ShoppingList
              items={items}
              totals={totals}
              budget={budget}
              onOpenAddItem={handleAddNewItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onTogglePurchased={handleTogglePurchased}
              onCompleteShopping={handleCompleteShopping}
              onClearList={handleClearList}
            />
          )}

          {activePage === 'calculator' && (
            <Calculator
              onAddToList={(item) => {
                handleSaveItem(item)
                notify(`Added ${item.name} to shopping list`)
              }}
            />
          )}

          {activePage === 'saved' && (
            <SavedPrices
              savedPrices={savedPrices}
              setSavedPrices={setSavedPrices}
              onAddToList={(item) => {
                setItems((prev) => [item, ...prev])
              }}
              notify={notify}
            />
          )}

          {activePage === 'history' && (
            <History
              history={history}
              setHistory={setHistory}
              onReAddItems={handleReAddHistoricalItems}
              notify={notify}
            />
          )}

          {activePage === 'settings' && (
            <Settings
              budget={budget}
              setBudget={setBudget}
              items={items}
              setItems={setItems}
              history={history}
              setHistory={setHistory}
              savedPrices={savedPrices}
              setSavedPrices={setSavedPrices}
              notify={notify}
            />
          )}
        </main>

        {/* Mobile Fixed Bottom Navigation */}
        <BottomNav
          activePage={activePage}
          setActivePage={setActivePage}
          pendingCount={totals.pendingCount}
        />
      </div>

      {/* Global Modals */}
      <ItemModal
        isOpen={isItemModalOpen}
        itemToEdit={itemToEdit}
        onSave={handleSaveItem}
        onClose={() => {
          setIsItemModalOpen(false)
          setItemToEdit(null)
        }}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        budget={budget}
        onSave={(newBudget) => {
          setBudget(newBudget)
          notify(`Budget updated to ₹${newBudget}`)
        }}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
