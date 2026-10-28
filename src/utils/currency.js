/**
 * Currency utilities for Indian Rupee (INR) formatting and accurate decimal calculations.
 */

/**
 * Safely parse a value into a finite number.
 * @param {any} value - The input value.
 * @param {number} fallback - The fallback value if parsing fails.
 * @returns {number}
 */
export function parseNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

/**
 * Rounds a monetary amount to 2 decimal places (paise) safely,
 * preventing IEEE-754 floating point arithmetic anomalies.
 * @param {number|string} amount
 * @returns {number}
 */
export function roundToPaise(amount) {
  const num = parseNumber(amount, 0)
  return Math.round((num + Number.EPSILON) * 100) / 100
}

/**
 * Convert rupee amount to integer paise (1 INR = 100 paise).
 * @param {number|string} amount
 * @returns {number}
 */
export function toPaise(amount) {
  const num = parseNumber(amount, 0)
  return Math.round((num + Number.EPSILON) * 100)
}

/**
 * Convert integer paise back to rupees.
 * @param {number} paise
 * @returns {number}
 */
export function fromPaise(paise) {
  const p = parseNumber(paise, 0)
  return roundToPaise(p / 100)
}

/**
 * Format a number as an Indian Rupee string (e.g. ₹31.56, ₹1,270.00).
 * @param {number|string} amount
 * @param {object} [options]
 * @param {boolean} [options.showDecimals=true]
 * @param {boolean} [options.compact=false]
 * @returns {string}
 */
export function formatINR(amount, options = {}) {
  const { showDecimals = true, compact = false } = options
  const num = roundToPaise(amount)

  if (compact && Math.abs(num) >= 1000) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num)
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(num)
}

