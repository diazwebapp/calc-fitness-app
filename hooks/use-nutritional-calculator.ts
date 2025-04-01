"use client"

import { useState, useCallback, useEffect } from "react"
import type { FoodItem } from "@/types/food"
import { v4 as uuidv4 } from "uuid"
import type { Meal } from "@/types/meal"

type SelectedFood = {
  id: string
  food: FoodItem
  quantity: number
  customPrice?: number // Precio personalizado
}

type NutritionalTotals = {
  calories: number
  protein: number
  carbs: number
  fat: number
  price: number
}

// Usamos un contexto global simulado para mantener el estado entre componentes
// En una aplicación real, usaríamos React Context, Redux, Zustand, etc.
let globalSelectedFoods: SelectedFood[] = []
let subscribers: (() => void)[] = []

function notifySubscribers() {
  subscribers.forEach((callback) => callback())
}

export function useNutritionalCalculator() {
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>(globalSelectedFoods)

  // Suscribirse a cambios
  useEffect(() => {
    const callback = () => setSelectedFoods([...globalSelectedFoods])
    subscribers.push(callback)
    return () => {
      subscribers = subscribers.filter((cb) => cb !== callback)
    }
  }, [])

  const addFoodToCalculator = useCallback((food: FoodItem) => {
    const newFood: SelectedFood = {
      id: uuidv4(),
      food,
      quantity: 100, // Cantidad predeterminada en gramos
    }
    globalSelectedFoods = [...globalSelectedFoods, newFood]
    notifySubscribers()
  }, [])

  const removeFood = useCallback((id: string) => {
    globalSelectedFoods = globalSelectedFoods.filter((item) => item.id !== id)
    notifySubscribers()
  }, [])

  const updateFoodQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeFood(id)
        return
      }

      globalSelectedFoods = globalSelectedFoods.map((item) => (item.id === id ? { ...item, quantity } : item))
      notifySubscribers()
    },
    [removeFood],
  )

  // Nueva función para actualizar el precio personalizado
  const updateFoodPrice = useCallback((id: string, price: number) => {
    globalSelectedFoods = globalSelectedFoods.map((item) => (item.id === id ? { ...item, customPrice: price } : item))
    notifySubscribers()
  }, [])

  // Función para calcular el precio según la cantidad y unidad
  const calculateItemPrice = useCallback((item: SelectedFood) => {
    const { food, quantity, customPrice } = item

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
  }, [])

  const calculateTotals = useCallback((): NutritionalTotals => {
    return globalSelectedFoods.reduce(
      (totals, item) => {
        const factor = item.quantity / 100 // Convertir a porcentaje de 100g
        const itemPrice = calculateItemPrice(item)

        return {
          calories: totals.calories + item.food.calories * factor,
          protein: totals.protein + item.food.protein * factor,
          carbs: totals.carbs + item.food.carbs * factor,
          fat: totals.fat + item.food.fat * factor,
          price: totals.price + itemPrice,
        }
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, price: 0 },
    )
  }, [calculateItemPrice])

  const clearCalculator = useCallback(() => {
    globalSelectedFoods = []
    notifySubscribers()
  }, [])

  const loadMealToCalculator = useCallback((meal: Meal) => {
    globalSelectedFoods = meal.foods.map((item) => ({
      ...item,
      id: uuidv4(), // Generar nuevos IDs para evitar conflictos
    }))
    notifySubscribers()
  }, [])

  return {
    selectedFoods,
    addFoodToCalculator,
    removeFood,
    updateFoodQuantity,
    updateFoodPrice, // Exportamos la nueva función
    calculateTotals,
    clearCalculator,
    loadMealToCalculator,
  }
}

