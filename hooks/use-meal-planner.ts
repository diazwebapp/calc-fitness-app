"use client"

import { useState, useEffect, useCallback } from "react"
import type { Meal } from "@/types/meal"
import { v4 as uuidv4 } from "uuid"

// Clave para almacenar las comidas en localStorage
const STORAGE_KEY = "nutri-calc-meals"

export function useMealPlanner() {
  const [savedMeals, setSavedMeals] = useState<Meal[]>([])

  // Cargar comidas guardadas al iniciar
  useEffect(() => {
    try {
      const storedMeals = localStorage.getItem(STORAGE_KEY)
      if (storedMeals) {
        setSavedMeals(JSON.parse(storedMeals))
      }
    } catch (error) {
      console.error("Error al cargar comidas guardadas:", error)
    }
  }, [])

  // Guardar comidas en localStorage cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMeals))
    } catch (error) {
      console.error("Error al guardar comidas:", error)
    }
  }, [savedMeals])

  const saveMeal = useCallback((meal: Omit<Meal, "id" | "date">) => {
    const newMeal: Meal = {
      ...meal,
      id: uuidv4(),
      date: new Date().toISOString(),
    }

    setSavedMeals((prev) => [newMeal, ...prev])
  }, [])

  const removeMeal = useCallback((id: string) => {
    setSavedMeals((prev) => prev.filter((meal) => meal.id !== id))
  }, [])

  return {
    savedMeals,
    saveMeal,
    removeMeal,
  }
}

