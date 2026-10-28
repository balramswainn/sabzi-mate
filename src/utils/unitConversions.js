/**
 * Unit conversion and formatting utilities for SabziMate.
 * Handles weight (kg/g), volume (litre/ml), count (dozen/pieces), and discrete units.
 */

import { parseNumber } from './currency.js'

export const UNIT_TYPES = {
  kg: {
    value: 'kg',
    label: 'Per kg',
    shortLabel: '/kg',
    rateUnit: 'kg',
    quantityUnit: 'g',
    type: 'weight',
    step: 10,
    defaultQuantity: 500,
  },
  litre: {
    value: 'litre',
    label: 'Per litre',
    shortLabel: '/L',
    rateUnit: 'litre',
    quantityUnit: 'ml',
    type: 'volume',
    step: 50,
    defaultQuantity: 500,
  },
  dozen: {
    value: 'dozen',
    label: 'Per dozen (12 pcs)',
    shortLabel: '/dozen',
    rateUnit: 'dozen',
    quantityUnit: 'pieces',
    type: 'dozen',
    step: 1,
    defaultQuantity: 6,
  },
  piece: {
    value: 'piece',
    label: 'Per piece',
    shortLabel: '/pc',
    rateUnit: 'piece',
    quantityUnit: 'pieces',
    type: 'count',
    step: 1,
    defaultQuantity: 1,
  },
  packet: {
    value: 'packet',
    label: 'Per packet',
    shortLabel: '/pkt',
    rateUnit: 'packet',
    quantityUnit: 'packets',
    type: 'discrete',
    step: 1,
    defaultQuantity: 1,
  },
  bundle: {
    value: 'bundle',
    label: 'Per bundle',
    shortLabel: '/bdl',
    rateUnit: 'bundle',
    quantityUnit: 'bundles',
    type: 'discrete',
    step: 1,
    defaultQuantity: 1,
  },
  tray: {
    value: 'tray',
    label: 'Per tray',
    shortLabel: '/tray',
    rateUnit: 'tray',
    quantityUnit: 'trays',
    type: 'discrete',
    step: 1,
    defaultQuantity: 1,
  },
}

/**
 * Convert mixed kg and grams into total grams.
 * e.g., 1 kg and 270 g = 1,270 g.
 */
export function mixedWeightToGrams(kg = 0, grams = 0) {
  const k = Math.max(0, parseNumber(kg, 0))
  const g = Math.max(0, parseNumber(grams, 0))
  return Math.round(k * 1000 + g)
}

/**
 * Break total grams down into kg and remaining grams.
 * e.g., 1,270 g -> { kg: 1, grams: 270 }
 */
export function gramsToMixedWeight(totalGrams = 0) {
  const g = Math.max(0, parseNumber(totalGrams, 0))
  const kg = Math.floor(g / 1000)
  const rem = Math.round(g % 1000)
  return { kg, grams: rem }
}

/**
 * Convert mixed litres and millilitres into total millilitres.
 * e.g., 1 L and 250 ml = 1,250 ml.
 */
export function mixedVolumeToMl(litres = 0, ml = 0) {
  const l = Math.max(0, parseNumber(litres, 0))
  const m = Math.max(0, parseNumber(ml, 0))
  return Math.round(l * 1000 + m)
}

/**
 * Break total millilitres down into litres and remaining ml.
 * e.g., 1,250 ml -> { litres: 1, ml: 250 }
 */
export function mlToMixedVolume(totalMl = 0) {
  const m = Math.max(0, parseNumber(totalMl, 0))
  const litres = Math.floor(m / 1000)
  const rem = Math.round(m % 1000)
  return { litres, ml: rem }
}

/**
 * Convert mixed dozen and pieces into total pieces.
 * e.g., 1 dozen and 3 pieces = 15 pieces.
 */
export function mixedDozenToPieces(dozen = 0, pieces = 0) {
  const d = Math.max(0, parseNumber(dozen, 0))
  const p = Math.max(0, parseNumber(pieces, 0))
  return Math.round(d * 12 + p)
}

/**
 * Break total pieces down into dozens and remaining pieces.
 * e.g., 15 pieces -> { dozen: 1, pieces: 3 }
 */
export function piecesToMixedDozen(totalPieces = 0) {
  const p = Math.max(0, parseNumber(totalPieces, 0))
  const dozen = Math.floor(p / 12)
  const pieces = Math.round(p % 12)
  return { dozen, pieces }
}

/**
 * Formats a quantity based on the pricing unit for human display.
 * @param {number|string} quantity
 * @param {string} unit
 * @returns {string}
 */
export function formatQuantity(quantity, unit) {
  const q = parseNumber(quantity, 0)

  switch (unit) {
    case 'kg': {
      if (q <= 0) return '0 g'
      const { kg, grams } = gramsToMixedWeight(q)
      if (kg > 0 && grams > 0) return `${kg} kg ${grams} g`
      if (kg > 0) return `${kg} kg`
      return `${grams} g`
    }
    case 'litre': {
      if (q <= 0) return '0 ml'
      if (q >= 1000) {
        const { litres, ml } = mlToMixedVolume(q)
        if (ml === 0) return `${litres} L`
        return `${litres} L ${ml} ml`
      }
      return `${q} ml`
    }
    case 'dozen': {
      if (q === 12) return '1 dozen (12 pcs)'
      if (q % 12 === 0 && q > 0) return `${q / 12} dozen (${q} pcs)`
      return `${q} ${q === 1 ? 'pc' : 'pcs'}`
    }
    case 'packet':
      return `${q} ${q === 1 ? 'packet' : 'packets'}`
    case 'bundle':
      return `${q} ${q === 1 ? 'bundle' : 'bundles'}`
    case 'tray':
      return `${q} ${q === 1 ? 'tray' : 'trays'}`
    case 'piece':
    default:
      return `${q} ${q === 1 ? 'pc' : 'pcs'}`
  }
}

/**
 * Get readable label for the unit basis.
 * @param {string} unit
 * @returns {string}
 */
export function getUnitLabel(unit) {
  return UNIT_TYPES[unit]?.label || `Per ${unit}`
}

/**
 * Get short label for the unit basis.
 * @param {string} unit
 * @returns {string}
 */
export function getUnitShortLabel(unit) {
  return UNIT_TYPES[unit]?.shortLabel || `/${unit}`
}

/**
 * Get input helper label for entering quantity.
 * @param {string} unit
 * @returns {string}
 */
export function getQuantityInputLabel(unit) {
  switch (unit) {
    case 'kg':
      return 'Actual weight in grams (g)'
    case 'litre':
      return 'Volume in millilitres (ml)'
    case 'dozen':
      return 'Number of pieces (1 dozen = 12 pcs)'
    case 'packet':
      return 'Number of packets'
    case 'bundle':
      return 'Number of bundles'
    case 'tray':
      return 'Number of trays'
    case 'piece':
    default:
      return 'Number of pieces'
  }
}

/**
 * Get quick preset buttons for a given unit.
 * @param {string} unit
 * @returns {Array<{ label: string, value: number }>}
 */
export function getQuantityPresets(unit) {
  switch (unit) {
    case 'kg':
      return [
        { label: '100 g', value: 100 },
        { label: '250 g', value: 250 },
        { label: '500 g', value: 500 },
        { label: '750 g', value: 750 },
        { label: '1 kg', value: 1000 },
        { label: '1.5 kg', value: 1500 },
        { label: '2 kg', value: 2000 },
      ]
    case 'litre':
      return [
        { label: '100 ml', value: 100 },
        { label: '250 ml', value: 250 },
        { label: '500 ml', value: 500 },
        { label: '750 ml', value: 750 },
        { label: '1 L', value: 1000 },
        { label: '2 L', value: 2000 },
      ]
    case 'dozen':
      return [
        { label: '1 pc', value: 1 },
        { label: '3 pcs', value: 3 },
        { label: '6 pcs (½ dz)', value: 6 },
        { label: '12 pcs (1 dz)', value: 12 },
        { label: '24 pcs (2 dz)', value: 24 },
      ]
    case 'packet':
    case 'bundle':
    case 'tray':
    case 'piece':
    default:
      return [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '10', value: 10 },
      ]
  }
}

