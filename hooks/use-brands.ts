"use client"

import { useState, useEffect, useCallback } from "react"
import type { Brand } from "@/types/food"
import { brands as fallbackBrands } from "@/lib/data"

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>(fallbackBrands)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Función para cargar las marcas
  const fetchBrands = useCallback(async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/brands")

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()

      // Verificar que data sea un array antes de asignarlo
      if (Array.isArray(data) && data.length > 0) {
        setBrands(data)
      } else {
        console.warn("Los datos de marcas no son válidos, usando datos de fallback")
        // Mantener los datos de fallback
      }
    } catch (err) {
      console.error("Error al cargar marcas:", err)
      setError(err instanceof Error ? err : new Error("Error desconocido al cargar marcas"))
      // Ya tenemos los datos de fallback establecidos en el estado inicial
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar marcas al montar el componente
  useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

  // Función para añadir una nueva marca
  const addBrand = useCallback(async (name: string) => {
    try {
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const savedBrand = await response.json()

      // Actualizar el estado local
      setBrands((prev) => [...prev, savedBrand])

      return savedBrand
    } catch (err) {
      console.error("Error al añadir marca:", err)
      throw err
    }
  }, [])

  // Función para actualizar una marca existente
  const updateBrand = useCallback(async (brand: Brand) => {
    try {
      const response = await fetch(`/api/brands/${brand.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brand),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const updatedBrand = await response.json()

      // Actualizar el estado local
      setBrands((prev) => prev.map((item) => (item.id === brand.id ? updatedBrand : item)))

      return updatedBrand
    } catch (err) {
      console.error("Error al actualizar marca:", err)
      throw err
    }
  }, [])

  // Función para eliminar una marca
  const deleteBrand = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/brands/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error HTTP: ${response.status}`)
      }

      // Actualizar el estado local
      setBrands((prev) => prev.filter((item) => item.id !== id))

      return true
    } catch (err) {
      console.error("Error al eliminar marca:", err)
      throw err
    }
  }, [])

  return {
    brands,
    isLoading,
    error,
    addBrand,
    updateBrand,
    deleteBrand,
    refreshBrands: fetchBrands,
  }
}

