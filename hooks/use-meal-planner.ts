// use-meal-planner.ts
"use client"

import { useState, useEffect, useCallback } from "react"
import type { Meal } from "@/types/meal"
import { v4 as uuidv4 } from "uuid"

const STORAGE_KEY = "nutri-calc-meals"

// Variables globales para el estado compartido
let globalSavedMeals: Meal[] = []
let subscribers: (() => void)[] = []

function notifySubscribers() {
  subscribers.forEach((callback) => callback())
}

type MealValidation = (meal: any) => meal is Meal

export function useMealPlanner() {
  const [savedMeals, setSavedMeals] = useState<Meal[]>(globalSavedMeals)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Suscripción a cambios globales
  useEffect(() => {
    const callback = () => setSavedMeals([...globalSavedMeals])
    subscribers.push(callback)
    return () => {
      subscribers = subscribers.filter((cb) => cb !== callback)
    }
  }, [])

  const isValidMeal: MealValidation = (meal): meal is Meal => {
    return (
      typeof meal?.id === 'string' &&
      typeof meal?.date === 'string' &&
      typeof meal?.name === 'string' &&
      typeof meal?.totals === 'object' &&
      !isNaN(Date.parse(meal.date))
    )
  }

  // Cargar datos iniciales
  useEffect(() => {
    const loadMeals = () => {
      try {
        const storedMeals = localStorage.getItem(STORAGE_KEY)
        if (!storedMeals) return
        
        const parsed = JSON.parse(storedMeals)
        if (!Array.isArray(parsed)) throw new Error("Formato de datos inválido")
        
        const validatedMeals = parsed.filter(isValidMeal)
        globalSavedMeals = validatedMeals // Actualizar estado global
        setSavedMeals(validatedMeals)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las comidas')
        localStorage.removeItem(STORAGE_KEY)
      } finally {
        setIsLoading(false)
      }
    }

    loadMeals()
  }, [])

  const saveMeal = useCallback((meal: Omit<Meal, "id" | "date">) => {
    const newMeal: Meal = {
      ...meal,
      id: uuidv4(),
      date: new Date().toISOString(),
    }
    
    // Actualizar estado global
    globalSavedMeals = [newMeal, ...globalSavedMeals]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalSavedMeals))
    notifySubscribers() // Notificar a los componentes
  }, [])

  const removeMeal = useCallback((id: string) => {
    globalSavedMeals = globalSavedMeals.filter(meal => meal.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalSavedMeals))
    notifySubscribers() // Notificar a los componentes
  }, [])

  return { savedMeals, saveMeal, removeMeal, isLoading, error }
}