import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Storage keys namespace for SabziMate to prevent collisions.
 */
export const STORAGE_KEYS = {
  ITEMS: 'sabzimate_items_v2',
  BUDGET: 'sabzimate_budget_v2',
  SAVED_PRICES: 'sabzimate_saved_prices_v2',
  HISTORY: 'sabzimate_history_v2',
  LEGACY_ITEMS: 'sabzimate-items-v1',
  LEGACY_BUDGET: 'sabzimate-budget-v1',
  LEGACY_SAVED: 'sabzimate-saved-v1',
  LEGACY_HISTORY: 'sabzimate-history-v1',
}

/**
 * Safely read a value from localStorage.
 */
function readStorage(key, fallback) {
  if (typeof window === 'undefined') {
    return typeof fallback === 'function' ? fallback() : fallback
  }

  try {
    const raw = window.localStorage.getItem(key)
    if (raw !== null && raw !== undefined) {
      return JSON.parse(raw)
    }

    // Check for legacy key if migrating
    const legacyKey = key.replace(/_/g, '-').replace('v2', 'v1')
    const legacyRaw = window.localStorage.getItem(legacyKey)
    if (legacyRaw !== null && legacyRaw !== undefined) {
      const data = JSON.parse(legacyRaw)
      // Save forward to new key
      try {
        window.localStorage.setItem(key, JSON.stringify(data))
      } catch {
        // Ignore write error during migration
      }
      return data
    }

    return typeof fallback === 'function' ? fallback() : fallback
  } catch (error) {
    console.warn(`[SabziMate] Error reading localStorage key "${key}":`, error)
    return typeof fallback === 'function' ? fallback() : fallback
  }
}

/**
 * Safely write a value to localStorage.
 */
function writeStorage(key, value) {
  if (typeof window === 'undefined') return
  try {
    if (value === undefined) {
      window.localStorage.removeItem(key)
    } else {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (error) {
    console.warn(`[SabziMate] Error writing localStorage key "${key}":`, error)
  }
}

/**
 * Custom React hook for persistent state synchronized with localStorage.
 *
 * @template T
 * @param {string} key - The localStorage key.
 * @param {T|(() => T)} initialValue - Fallback value if storage is empty.
 * @returns {[T, (value: T | ((prev: T) => T)) => void]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => readStorage(key, initialValue))
  const keyRef = useRef(key)
  keyRef.current = key

  // Sync state if key changes
  useEffect(() => {
    setStoredValue(readStorage(key, initialValue))
  }, [key])

  // Setter with functional updater support
  const setValue = useCallback(
    (action) => {
      setStoredValue((prev) => {
        const nextValue = typeof action === 'function' ? action(prev) : action
        writeStorage(keyRef.current, nextValue)
        return nextValue
      })
    },
    []
  )

  // Listen for storage events across tabs
  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue))
        } catch {
          // ignore corrupted data from other tab
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}

/**
 * Resets all SabziMate localStorage data cleanly.
 */
export function clearSabziMateStorage() {
  if (typeof window === 'undefined') return
  try {
    Object.values(STORAGE_KEYS).forEach((k) => {
      window.localStorage.removeItem(k)
    })
  } catch (error) {
    console.warn('[SabziMate] Error clearing storage:', error)
  }
}

