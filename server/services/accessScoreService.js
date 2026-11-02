/**
 * Calculates Smart Access Score for a pharmacy inventory item relative to a user location.
 * Formula:
 * AccessScore = 0.40 * availability_score + 0.20 * distance_score + 0.15 * price_score + 0.15 * freshness_score + 0.10 * pickup_score
 */

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

function calculateAccessScore(pharmacy, inventoryItem, userLat, userLon, avgPriceInRegion = 50) {
  const distanceKm = calculateDistanceKm(
    userLat || 28.6139,
    userLon || 77.2090,
    pharmacy.latitude,
    pharmacy.longitude
  );

  // 1. Availability Score (0-100)
  let availabilityScore = 0;
  let status = 'Out of Stock';
  if (inventoryItem.quantity > 10) {
    availabilityScore = 100;
    status = 'In Stock';
  } else if (inventoryItem.quantity > 0) {
    availabilityScore = 65;
    status = 'Limited Stock';
  } else {
    availabilityScore = 0;
    status = 'Out of Stock';
  }

  // 2. Distance Score (0-100): 0 km -> 100, 10+ km -> 10
  const maxDistance = 10;
  const distanceScore = Math.max(10, Math.min(100, Math.round(100 - (distanceKm / maxDistance) * 90)));

  // 3. Price Score (0-100): lower than avg -> higher score
  const priceRatio = inventoryItem.price / (avgPriceInRegion || inventoryItem.price || 1);
  let priceScore = 75;
  if (priceRatio <= 0.9) priceScore = 95;
  else if (priceRatio <= 1.0) priceScore = 85;
  else if (priceRatio <= 1.15) priceScore = 70;
  else priceScore = 50;

  // 4. Freshness Score (0-100): based on last updated minutes ago
  const minutesAgo = (Date.now() - new Date(inventoryItem.lastUpdated).getTime()) / (1000 * 60);
  let freshnessScore = 100;
  if (minutesAgo < 15) freshnessScore = 98;
  else if (minutesAgo < 60) freshnessScore = 90;
  else if (minutesAgo < 360) freshnessScore = 75;
  else freshnessScore = 55;

  // 5. Pickup Score (0-100): based on avg pickup minutes & open status
  let pickupScore = pharmacy.isOpenNow ? 85 : 20;
  const avgPickup = pharmacy.avgPickupMinutes || 15;
  if (avgPickup <= 10) pickupScore += 15;
  else if (avgPickup <= 20) pickupScore += 10;

  // Calculate Weighted Access Score
  const rawScore =
    0.40 * availabilityScore +
    0.20 * distanceScore +
    0.15 * priceScore +
    0.15 * freshnessScore +
    0.10 * pickupScore;

  const accessScore = Math.min(99, Math.max(10, Math.round(rawScore)));

  // Generate highlights / reasoning tags
  const reasons = [];
  if (inventoryItem.quantity > 0) reasons.push('✓ In stock');
  else reasons.push('✕ Out of stock');

  if (distanceKm <= 2.0) reasons.push(`✓ Nearby (${distanceKm} km)`);
  else reasons.push(`📍 ${distanceKm} km away`);

  if (minutesAgo < 30) reasons.push(`✓ Recently verified (${Math.round(minutesAgo)} min ago)`);
  if (pharmacy.isOpenNow) reasons.push(`✓ Fast pickup (~${avgPickup} min)`);
  else reasons.push('⚠️ Currently closed');

  return {
    accessScore,
    distanceKm,
    status,
    availabilityScore,
    distanceScore,
    priceScore,
    freshnessScore,
    pickupScore,
    reasons,
    confidenceScore: Math.round((availabilityScore * 0.5) + (freshnessScore * 0.5)),
  };
}

module.exports = {
  calculateDistanceKm,
  calculateAccessScore,
};
