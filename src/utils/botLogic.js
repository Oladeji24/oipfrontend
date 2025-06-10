// src/utils/botLogic.js
// Core trading bot logic (trend detection, trade management)
// Placeholder for EMA, MACD, RSI, Volume calculations

/**
 * Detects trading trend using indicators (placeholder logic)
 * @param {Array} priceData - Array of price/volume objects
 * @returns {string} 'buy' | 'sell' | 'hold'
 */
export function detectTrend(priceData) {
  // TODO: Implement EMA, MACD, RSI, Volume logic
  // For now, always hold
  return 'hold';
}

/**
 * Checks if target profit is reached
 * @param {number} entryPrice
 * @param {number} currentPrice
 * @param {number} targetPercent
 * @returns {boolean}
 */
export function isTargetProfit(entryPrice, currentPrice, targetPercent = 5) {
  return ((currentPrice - entryPrice) / entryPrice) * 100 >= targetPercent;
}
