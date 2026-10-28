import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { amountForItem, calculateShoppingTotals, getCalculationBreakdown } from './calculations.js'
import { formatINR, roundToPaise, toPaise, fromPaise } from './currency.js'
import {
  mixedWeightToGrams,
  gramsToMixedWeight,
  mixedVolumeToMl,
  mlToMixedVolume,
  mixedDozenToPieces,
  piecesToMixedDozen,
  formatQuantity,
} from './unitConversions.js'

describe('SabziMate Calculation Accuracy Tests', () => {
  test('Example 1: Tomatoes ₹40/kg with 789 g = ₹31.56', () => {
    const item = { rate: 40, unit: 'kg', quantity: 789 }
    const result = amountForItem(item)
    assert.equal(result, 31.56)
  })

  test('Example 2: Capsicum ₹60/kg with 1,270 g = ₹76.20', () => {
    const item = { rate: 60, unit: 'kg', quantity: 1270 }
    const result = amountForItem(item)
    assert.equal(result, 76.20)
  })

  test('Example 3: Bananas ₹60/dozen with 7 pieces = ₹35.00', () => {
    const item = { rate: 60, unit: 'dozen', quantity: 7 }
    const result = amountForItem(item)
    assert.equal(result, 35.00)
  })

  test('Example 4: Milk ₹80/litre with 750 ml = ₹60.00', () => {
    const item = { rate: 80, unit: 'litre', quantity: 750 }
    const result = amountForItem(item)
    assert.equal(result, 60.00)
  })

  test('Example 5: Packets ₹25/packet with 3 packets = ₹75.00', () => {
    const item = { rate: 25, unit: 'packet', quantity: 3 }
    const result = amountForItem(item)
    assert.equal(result, 75.00)
  })

  test('Example 6: Discrete units (bundle, tray, piece)', () => {
    assert.equal(amountForItem({ rate: 15, unit: 'bundle', quantity: 2 }), 30.00)
    assert.equal(amountForItem({ rate: 110, unit: 'tray', quantity: 1 }), 110.00)
    assert.equal(amountForItem({ rate: 10, unit: 'piece', quantity: 5 }), 50.00)
  })

  test('Edge cases: zero, negative, invalid, or missing values', () => {
    assert.equal(amountForItem({ rate: 0, unit: 'kg', quantity: 500 }), 0)
    assert.equal(amountForItem({ rate: 40, unit: 'kg', quantity: 0 }), 0)
    assert.equal(amountForItem({ rate: -40, unit: 'kg', quantity: 500 }), 0)
    assert.equal(amountForItem({ rate: 40, unit: 'kg', quantity: -500 }), 0)
    assert.equal(amountForItem({ rate: 'abc', unit: 'kg', quantity: 500 }), 0)
    assert.equal(amountForItem(null), 0)
    assert.equal(amountForItem(undefined), 0)
  })

  test('Decimal precision & paise rounding', () => {
    assert.equal(roundToPaise(10.126), 10.13)
    assert.equal(roundToPaise(10.124), 10.12)
    assert.equal(toPaise(31.56), 3156)
    assert.equal(fromPaise(3156), 31.56)
  })
})

describe('SabziMate Unit Conversions', () => {
  test('Mixed weight entry: 1 kg 270 g = 1,270 g', () => {
    assert.equal(mixedWeightToGrams(1, 270), 1270)
    assert.deepEqual(gramsToMixedWeight(1270), { kg: 1, grams: 270 })
  })

  test('Mixed volume entry: 1 L 250 ml = 1,250 ml', () => {
    assert.equal(mixedVolumeToMl(1, 250), 1250)
    assert.deepEqual(mlToMixedVolume(1250), { litres: 1, ml: 250 })
  })

  test('Mixed dozen entry: 1 dozen 3 pieces = 15 pieces', () => {
    assert.equal(mixedDozenToPieces(1, 3), 15)
    assert.deepEqual(piecesToMixedDozen(15), { dozen: 1, pieces: 3 })
  })

  test('Format quantity label', () => {
    assert.equal(formatQuantity(1270, 'kg'), '1 kg 270 g')
    assert.equal(formatQuantity(1000, 'kg'), '1 kg')
    assert.equal(formatQuantity(789, 'kg'), '789 g')
    assert.equal(formatQuantity(750, 'litre'), '750 ml')
    assert.equal(formatQuantity(1500, 'litre'), '1 L 500 ml')
    assert.equal(formatQuantity(12, 'dozen'), '1 dozen (12 pcs)')
    assert.equal(formatQuantity(7, 'dozen'), '7 pcs')
    assert.equal(formatQuantity(3, 'packet'), '3 packets')
    assert.equal(formatQuantity(1, 'packet'), '1 packet')
  })
})

describe('SabziMate Shopping Totals & Budget', () => {
  const items = [
    { id: 1, name: 'Tomatoes', rate: 40, unit: 'kg', quantity: 789, purchased: true },
    { id: 2, name: 'Capsicum', rate: 60, unit: 'kg', quantity: 1270, purchased: true },
    { id: 3, name: 'Bananas', rate: 60, unit: 'dozen', quantity: 7, purchased: false },
  ]

  test('Calculates live totals, purchased vs pending, and budget remaining', () => {
    // 31.56 + 76.20 + 35.00 = 142.76
    // purchased = 31.56 + 76.20 = 107.76
    // pending = 35.00
    const totals = calculateShoppingTotals(items, 500)
    assert.equal(totals.total, 142.76)
    assert.equal(totals.purchasedTotal, 107.76)
    assert.equal(totals.pendingTotal, 35.00)
    assert.equal(totals.itemCount, 3)
    assert.equal(totals.purchasedCount, 2)
    assert.equal(totals.pendingCount, 1)
    assert.equal(totals.remaining, 392.24)
    assert.equal(totals.isOverBudget, false)
  })

  test('Detects over budget correctly', () => {
    const totals = calculateShoppingTotals(items, 100)
    assert.equal(totals.remaining, -7.76)
    assert.equal(totals.isOverBudget, true)
  })

  test('Calculation breakdown returns valid structure', () => {
    const breakdown = getCalculationBreakdown({ rate: 40, unit: 'kg', quantity: 789 })
    assert.equal(breakdown.amount, 31.56)
    assert.match(breakdown.textBreakdown, /789/)
    assert.match(breakdown.formula, /40/)
  })
})

