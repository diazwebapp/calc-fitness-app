export interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number // Nuevo campo para fibra
  water: number // Nuevo campo para agua (porcentaje)
  categoryId: number
  brandId?: string
  portion: number
  unit: string
  price: number
  priceUnit: "kg" | "g" | "l" | "ml" | "unit" | "pack"
  packSize?: number
  state: "raw" | "cooked" | "processed"
}

export interface Category {
  id: number
  name: string
}

export interface Brand {
  id: string
  name: string
}

