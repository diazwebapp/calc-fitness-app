// Nuevo archivo para funciones de cálculo
import type { FoodItem } from "@/types/food"

// Función para calcular el índice de saciedad
export function calculateSatietyIndex(food: FoodItem): number {
  return food.fiber * 3 + food.water * 0.2 + food.protein * 0.5
}

// Función para calcular la densidad calórica
export function calculateCalorieDensity(food: FoodItem): number {
  return food.calories
}

// Función para calcular el precio según la cantidad y unidad
export function calculateItemPrice(food: FoodItem, quantity: number, customPrice?: number): number {
  // Si hay un precio personalizado, usarlo en lugar del precio original
  const basePrice = customPrice !== undefined ? customPrice : food.price

  switch (food.priceUnit) {
    case "kg":
      return (basePrice * quantity) / 1000 // Convertir g a kg
    case "g":
      return (basePrice * quantity) / 100 // Precio por 100g
    case "l":
      return (basePrice * quantity) / 1000 // Convertir ml a l
    case "ml":
      return (basePrice * quantity) / 100 // Precio por 100ml
    case "unit":
      return basePrice * (quantity / food.portion) // Precio por unidad
    case "pack":
      if (food.packSize) {
        return (basePrice * quantity) / (food.portion * food.packSize) // Precio por paquete
      }
      return basePrice * (quantity / food.portion)
    default:
      return 0
  }
}

// Función para calcular la TMB (Tasa Metabólica Basal) usando la fórmula de Mifflin-St Jeor
export function calculateBMR(
  gender: "male" | "female",
  weight: number, // kg
  height: number, // cm
  age: number, // años
): number {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161
  }
}

// Función para calcular calorías quemadas por actividad
export function calculateActivityCalories(
  activityType: string,
  weight: number, // kg
  duration: number, // minutos
  daysPerWeek: number, // días por semana
): number {
  // MET (Equivalentes Metabólicos) por actividad
  const metValues: Record<string, number> = {
    walking: 3.5, // Caminar (moderado)
    cycling: 7.5, // Ciclismo (general)
    football: 8.0, // Fútbol
    running: 9.8, // Correr (8 km/h)
    swimming: 6.0, // Natación (general)
  }

  // Calorías quemadas = MET × peso (kg) × tiempo (horas) × días/semana ÷ 7 (para promedio diario)
  return metValues[activityType] * weight * (duration / 60) * (daysPerWeek / 7)
}

