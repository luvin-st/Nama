/**
 * Estimated kg CO₂e avoided per kg of food scraps composted instead of landfilled.
 * Based on US EPA WARM v16 food-waste factors (landfill ≈ +0.50, compost ≈ −0.15 t CO₂e per short ton).
 */
export const CO2_PER_KG = 0.7;

/** 12 kg → 8.4 (kg CO₂e, estimate). */
export function co2ForKg(kg: number): number {
  return Math.round(kg * CO2_PER_KG * 10) / 10;
}

