/**
 * Calculation logic for SabziMate shopping items and totals.
 * Adheres strictly to real-world market pricing rules and precision rounding.
 */

import { parseNumber, roundToPaise, formatINR } from './currency.js'
import { formatQuantity, getUnitLabel, getUnitShortLabel } from './unitConversions.js'

/**
 * Calculates the exact price for an item based on its pricing unit, rate, and quantity.
 *
 * Examples:
 * - Tomatoes: ₹40/kg, 789 g -> ₹31.56
 * - Capsicum: ₹60/kg, 1270 g -> ₹76.20
 * - Bananas: ₹60/dozen, 7 pieces -> ₹35.00
 * - Milk: ₹80/litre, 750 ml -> ₹60.00
 * - Bread: ₹25/packet, 3 packets -> ₹75.00
 *
 * @param {object} item
 * @param {number|string} item.rate - Price per unit (e.g. 40 for ₹40/kg)
 * @param {number|string} item.quantity - Quantity (grams for kg, ml for litre, pieces for dozen, count for discrete)
 * @param {string} item.unit - Pricing basis ('kg', 'litre', 'dozen', 'piece', 'packet', 'bundle', 'tray')
 * @returns {number} Amount rounded to 2 decimal places (paise)
 */
export function amountForItem(item) {
  if (!item) return 0

  const rate = Math.max(0, parseNumber(item.rate, 0))
  const quantity = Math.max(0, parseNumber(item.quantity, 0))

  if (rate === 0 || quantity === 0) return 0

  let raw = 0
  switch (item.unit) {
    case 'kg':
      // Weight: rate is per 1000 grams (1 kg)
      raw = (rate * quantity) / 1000
      break
    case 'litre':
      // Volume: rate is per 1000 millilitres (1 L)
      raw = (rate * quantity) / 1000
      break
    case 'dozen':
      // Dozen: rate is per 12 pieces
      raw = (rate * quantity) / 12
      break
    case 'piece':
    case 'packet':
    case 'bundle':
    case 'tray':
    default:
      // Discrete units: direct rate per unit
      raw = rate * quantity
      break
  }

  return roundToPaise(raw)
}

/**
 * Provides a human-readable and structured formula breakdown for UI calculation cards.
 * @param {object} item
 * @returns {object}
 */
export function getCalculationBreakdown(item) {
  const rate = Math.max(0, parseNumber(item?.rate, 0))
  const quantity = Math.max(0, parseNumber(item?.quantity, 0))
  const unit = item?.unit || 'kg'
  const amount = amountForItem({ rate, quantity, unit })

  let formula = ''
  let textBreakdown = ''
  const formattedRate = formatINR(rate)
  const formattedAmount = formatINR(amount)

  switch (unit) {
    case 'kg': {
      formula = `(${quantity.toLocaleString('en-IN')} g ÷ 1,000) × ${formattedRate}`
      textBreakdown = `${quantity.toLocaleString('en-IN')} g ÷ 1,000 g × ${formattedRate}/kg = ${formattedAmount}`
      break
    }
    case 'litre': {
      formula = `(${quantity.toLocaleString('en-IN')} ml ÷ 1,000) × ${formattedRate}`
      textBreakdown = `${quantity.toLocaleString('en-IN')} ml ÷ 1,000 ml × ${formattedRate}/L = ${formattedAmount}`
      break
    }
    case 'dozen': {
      formula = `(${quantity} pcs ÷ 12) × ${formattedRate}`
      textBreakdown = `${quantity} pcs ÷ 12 pcs × ${formattedRate}/dozen = ${formattedAmount}`
      break
    }
    case 'packet': {
      formula = `${quantity} pkt${quantity === 1 ? '' : 's'} × ${formattedRate}`
      textBreakdown = `${quantity} packet${quantity === 1 ? '' : 's'} × ${formattedRate} = ${formattedAmount}`
      break
    }
    case 'bundle': {
      formula = `${quantity} bundle${quantity === 1 ? '' : 's'} × ${formattedRate}`
      textBreakdown = `${quantity} bundle${quantity === 1 ? '' : 's'} × ${formattedRate} = ${formattedAmount}`
      break
    }
    case 'tray': {
      formula = `${quantity} tray${quantity === 1 ? '' : 's'} × ${formattedRate}`
      textBreakdown = `${quantity} tray${quantity === 1 ? '' : 's'} × ${formattedRate} = ${formattedAmount}`
      break
    }
    case 'piece':
    default: {
      formula = `${quantity} pc${quantity === 1 ? '' : 's'} × ${formattedRate}`
      textBreakdown = `${quantity} pc${quantity === 1 ? '' : 's'} × ${formattedRate} = ${formattedAmount}`
      break
    }
  }

  return {
    rate,
    quantity,
    unit,
    amount,
    formattedAmount,
    formula,
    textBreakdown,
    unitLabel: getUnitLabel(unit),
    shortLabel: getUnitShortLabel(unit),
  }
}

/**
 * Calculates all summary metrics for the shopping session.
 * @param {Array<object>} items
 * @param {number|string} budget
 * @returns {object}
 */
export function calculateShoppingTotals(items = [], budget = 0) {
  const safeBudget = Math.max(0, parseNumber(budget, 0))

  let total = 0
  let purchasedTotal = 0
  let purchasedCount = 0

  for (const item of items) {
    const itemAmt = amountForItem(item)
    total += itemAmt
    if (item.purchased) {
      purchasedTotal += itemAmt
      purchasedCount += 1
    }
  }

  total = roundToPaise(total)
  purchasedTotal = roundToPaise(purchasedTotal)
  const pendingTotal = roundToPaise(total - purchasedTotal)
  const remaining = roundToPaise(safeBudget - purchasedTotal)
  const estimatedRemaining = roundToPaise(safeBudget - total)
  const isOverBudget = remaining < 0
  const isEstimatedOverBudget = estimatedRemaining < 0
  const progressPercent = safeBudget > 0 ? Math.min(100, Math.max(0, (purchasedTotal / safeBudget) * 100)) : 0
  const totalProgressPercent = safeBudget > 0 ? Math.min(100, Math.max(0, (total / safeBudget) * 100)) : 0

  return {
    total,
    purchasedTotal,
    pendingTotal,
    itemCount: items.length,
    purchasedCount,
    pendingCount: items.length - purchasedCount,
    budget: safeBudget,
    remaining,
    estimatedRemaining,
    isOverBudget,
    isEstimatedOverBudget,
    progressPercent,
    totalProgressPercent,
  }
}

// Re-export for backward compatibility and convenience
export { formatINR, roundToPaise }
export { formatQuantity, formatQuantity as quantityLabel }
