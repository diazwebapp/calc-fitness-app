"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { FoodItem } from "@/types/food"
import { foods as fallbackFoods } from "@/lib/data"

type FoodContextType = {
  foods: FoodItem[]
  isLoading: boolean
  error: Error | null
  addFood: (food: FoodItem) => Promise<FoodItem>
  updateFood: (food: FoodItem) => Promise<FoodItem>
  deleteFood: (id: string) => Promise<boolean>
  refreshFoods: () => Promise<void>
  searchFoods: (query: string) => void
  filteredFoods: FoodItem[]
}

const FoodContext = createContext<FoodContextType | undefined>(undefined)

export function FoodProvider({ children }: { children: React.ReactNode }) {
  const [foods, setFoods] = useState<FoodItem[]>(fallbackFoods)
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>(fallbackFoods)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Función para cargar los alimentos
  const fetchFoods = useCallback(async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/foods")

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()

      // Verificar que data sea un array
      if (!Array.isArray(data) || data.length === 0) {
        console.warn("Los datos de alimentos no son válidos, usando datos de fallback")
        setFoods(fallbackFoods)
        setFilteredFoods(fallbackFoods)
        return
      }

      setFoods(data)

      // Aplicar filtro si hay una búsqueda activa
      if (searchQuery) {
        setFilteredFoods(data.filter((food: FoodItem) => food.name.toLowerCase().includes(searchQuery.toLowerCase())))
      } else {
        setFilteredFoods(data)
      }
    } catch (err) {
      console.error("Error al cargar alimentos:", err)
      setError(err instanceof Error ? err : new Error("Error desconocido al cargar alimentos"))
      setFoods(fallbackFoods)
      setFilteredFoods(fallbackFoods)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

  // Cargar alimentos al montar el componente
  useEffect(() => {
    fetchFoods()
  }, [fetchFoods])

  // Función para buscar alimentos
  const searchFoods = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (query) {
        setFilteredFoods(foods.filter((food) => food.name.toLowerCase().includes(query.toLowerCase())))
      } else {
        setFilteredFoods(foods)
      }
    },
    [foods],
  )

  // Función para añadir un nuevo alimento
  const addFood = useCallback(async (food: FoodItem) => {
    try {
      const response = await fetch("/api/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(food),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const savedFood = await response.json()

      // Actualizar el estado local
      setFoods((prev) => [...prev, savedFood])
      setFilteredFoods((prev) => [...prev, savedFood])

      return savedFood
    } catch (err) {
      console.error("Error al añadir alimento:", err)
      throw err
    }
  }, [])

  // Función para actualizar un alimento existente
  const updateFood = useCallback(async (food: FoodItem) => {
    try {
      const response = await fetch(`/api/foods/${food.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(food),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error HTTP: ${response.status}`)
      }

      const updatedFood = await response.json()

      // Actualizar el estado local
      setFoods((prev) => prev.map((item) => (item.id === food.id ? updatedFood : item)))
      setFilteredFoods((prev) => prev.map((item) => (item.id === food.id ? updatedFood : item)))

      return updatedFood
    } catch (err) {
      console.error("Error al actualizar alimento:", err)
      throw err
    }
  }, [])

  // Función para eliminar un alimento
  const deleteFood = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/foods/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error HTTP: ${response.status}`)
      }

      // Actualizar el estado local
      setFoods((prev) => prev.filter((item) => item.id !== id))
      setFilteredFoods((prev) => prev.filter((item) => item.id !== id))

      return true
    } catch (err) {
      console.error("Error al eliminar alimento:", err)
      throw err
    }
  }, [])

  const value = {
    foods,
    filteredFoods,
    isLoading,
    error,
    addFood,
    updateFood,
    deleteFood,
    refreshFoods: fetchFoods,
    searchFoods,
  }

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>
}

export function useFoodContext() {
  const context = useContext(FoodContext)
  if (context === undefined) {
    throw new Error("useFoodContext debe ser usado dentro de un FoodProvider")
  }
  return context
}

