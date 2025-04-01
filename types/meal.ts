import type { FoodItem } from "./food"

export interface Meal {
  id: string
  name: string
  date: string
  foods: Array<{
    id: string
    food: FoodItem
    quantity: number
    customPrice?: number // Precio personalizado
  }>
  totals: {
    calories: number
    protein: number
    carbs: number
    fat: number
    price: number // Añadido precio total
  }
}

