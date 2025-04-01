// Nuevo archivo para funciones de formato
import type { FoodItem } from "@/types/food"

// Función para formatear el precio según la unidad
export function formatPrice(food: FoodItem): string {
  switch (food.priceUnit) {
    case "kg":
      return `${food.price.toFixed(2)}€/kg`
    case "g":
      return `${food.price.toFixed(2)}€/100g`
    case "l":
      return `${food.price.toFixed(2)}€/L`
    case "ml":
      return `${food.price.toFixed(2)}€/100ml`
    case "unit":
      return `${food.price.toFixed(2)}€/unidad`
    case "pack":
      return `${food.price.toFixed(2)}€/${food.packSize} unidades`
    default:
      return `${food.price.toFixed(2)}€`
  }
}

// Función para obtener el color del badge según el estado
export function getStateColor(state: string): string {
  switch (state) {
    case "raw":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    case "cooked":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
    case "processed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
    default:
      return ""
  }
}

// Función para traducir el estado
export function translateState(state: string): string {
  switch (state) {
    case "raw":
      return "Crudo"
    case "cooked":
      return "Cocinado"
    case "processed":
      return "Procesado"
    default:
      return state
  }
}

// Función para obtener el color del índice de saciedad
export function getSatietyColor(index: number): string {
  if (index > 20) return "text-green-600 dark:text-green-400"
  if (index > 10) return "text-yellow-600 dark:text-yellow-400"
  return "text-red-600 dark:text-red-400"
}

// Función para obtener el color de la densidad calórica
export function getCalorieColor(calories: number): string {
  if (calories < 100) return "text-green-600 dark:text-green-400"
  if (calories < 300) return "text-yellow-600 dark:text-yellow-400"
  return "text-red-600 dark:text-red-400"
}

// Función para obtener el texto de la unidad de precio
export function getPriceUnitText(priceUnit: string, packSize?: number): string {
  switch (priceUnit) {
    case "kg":
      return "€/kg"
    case "g":
      return "€/100g"
    case "l":
      return "€/L"
    case "ml":
      return "€/100ml"
    case "unit":
      return "€/unidad"
    case "pack":
      return packSize ? `€/${packSize} unidades` : "€/paquete"
    default:
      return "€"
  }
}

