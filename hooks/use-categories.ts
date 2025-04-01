"use client"

import { useState, useEffect, useCallback } from "react"
import type { Category } from "@/types/food"
import { categories as fallbackCategories } from "@/lib/data"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Función para cargar las categorías
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/categories")

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()

      // Verificar que data sea un array antes de asignarlo
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data)
      } else {
        console.warn("Los datos de categorías no son válidos, usando datos de fallback")
        // Mantener los datos de fallback
      }
    } catch (err) {
      console.error("Error al cargar categorías:", err)
      setError(err instanceof Error ? err : new Error("Error desconocido al cargar categorías"))
      // Ya tenemos los datos de fallback establecidos en el estado inicial
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Función para añadir una nueva categoría
  const addCategory = useCallback(async (name: string) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const savedCategory = await response.json()

      // Actualizar el estado local
      setCategories((prev) => [...prev, savedCategory])

      return savedCategory
    } catch (err) {
      console.error("Error al añadir categoría:", err)
      throw err
    }
  }, [])

  // Función para actualizar una categoría existente
  const updateCategory = useCallback(async (category: Category) => {
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const updatedCategory = await response.json()

      // Actualizar el estado local
      setCategories((prev) => prev.map((item) => (item.id === category.id ? updatedCategory : item)))

      return updatedCategory
    } catch (err) {
      console.error("Error al actualizar categoría:", err)
      throw err
    }
  }, [])

  // Función para eliminar una categoría
  const deleteCategory = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error HTTP: ${response.status}`)
      }

      // Actualizar el estado local
      setCategories((prev) => prev.filter((item) => item.id !== id))

      return true
    } catch (err) {
      console.error("Error al eliminar categoría:", err)
      throw err
    }
  }, [])

  return {
    categories,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: fetchCategories,
  }
}

