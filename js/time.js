/**
 * time.js
 * Productivity-focused time estimation module.
 * Different rates for prep vs painting.
 */

export function estimatePrepTime(totalAreaSqft, complexityFactor = 1.0) {
  // Rough: 1.8 hours per 100 sqft for basic prep
  return Math.round(((totalAreaSqft / 100) * 1.8 * complexityFactor) * 10) / 10;
}

export function estimatePaintTime(totalAreaSqft, coats = 2, productivityRate = 120) {
  // productivityRate = sqft per hour per painter for rolling
  const hoursPerCoat = totalAreaSqft / productivityRate;
  return Math.round(hoursPerCoat * coats * 10) / 10;
}

export function estimateTotalTime(prepHours, paintHours, bufferPercent = 15) {
  const raw = prepHours + paintHours;
  return Math.round(raw * (1 + bufferPercent / 100) * 10) / 10;
}

export function getProductivityTips() {
  return [
    'Cut in edges first, then roll — saves 20-30% time',
    'Use 3/8" nap roller for smooth walls',
    'Two thin coats dry faster and look better than one thick coat'
  ];
}