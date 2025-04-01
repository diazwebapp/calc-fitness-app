"use client"

import { useState, useEffect, useCallback } from "react"
import type { FoodItem } from "@/types/food"
import { foods as fallbackFoods } from "@/lib/data"

export function useFoods(searchQuery = "") {
  const [foods, setFoods] = useState<FoodItem[]>(
    searchQuery
      ? fallbackFoods.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : fallbackFoods,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

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
        // Filtrar los datos de fallback según la búsqueda
        if (searchQuery) {
          const filtered = fallbackFoods.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
          setFoods(filtered)
        } else {
          setFoods(fallbackFoods)
        }
        return
      }

      let filteredFoods = data

      if (searchQuery) {
        filteredFoods = data.filter((food: FoodItem) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
      }

      setFoods(filteredFoods)
    } catch (err) {
      console.error("Error al cargar alimentos:", err)
      setError(err instanceof Error ? err : new Error("Error desconocido al cargar alimentos"))

      // Filtrar los datos de fallback según la búsqueda
      if (searchQuery) {
        const filtered = fallbackFoods.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
        setFoods(filtered)
      } else {
        setFoods(fallbackFoods)
      }
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

  // Cargar alimentos al montar el componente o cuando cambia la búsqueda
  useEffect(() => {
    // Simulamos un pequeño retraso para mostrar el estado de carga
    const timer = setTimeout(() => {
      fetchFoods()
    }, 300)

    return () => clearTimeout(timer)
  }, [fetchFoods, searchQuery])

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
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const updatedFood = await response.json()

      // Actualizar el estado local
      setFoods((prev) => prev.map((item) => (item.id === food.id ? updatedFood : item)))

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

      return true
    } catch (err) {
      console.error("Error al eliminar alimento:", err)
      throw err
    }
  }, [])

  return { foods, isLoading, error, addFood, updateFood, deleteFood, refreshFoods: fetchFoods }
}

