/**
 * cost.js
 * Handles all cost calculations (paint + optional labor).
 */

export function calculatePaintCost(gallonsNeeded, pricePerGallon) {
  return Math.round(gallonsNeeded * pricePerGallon * 100) / 100;
}

export function calculateLaborCost(totalArea, hourlyRate = 45, hoursPerHundredSqft = 2.5) {
  const hours = (totalArea / 100) * hoursPerHundredSqft;
  return Math.round(hours * hourlyRate * 100) / 100;
}

export function calculateTotalCost(paintCost, laborCost = 0) {
  return Math.round((paintCost + laborCost) * 100) / 100;
}