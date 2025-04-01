"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Brand } from "@/types/food"
import { brands as fallbackBrands } from "@/lib/data"

type BrandContextType = {
  brands: Brand[]
  isLoading: boolean
  error: Error | null
  addBrand: (name: string) => Promise<Brand>
  updateBrand: (brand: Brand) => Promise<Brand>
  deleteBrand: (id: string) => Promise<boolean>
  refreshBrands: () => Promise<void>
}

const BrandContext = createContext<BrandContextType | undefined>(undefined)

export function BrandProvider({ children }: { children: React.ReactNode }) {
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
        const errorData = await response.json()
        throw new Error(errorData.error || `Error HTTP: ${response.status}`)
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

  const value = {
    brands,
    isLoading,
    error,
    addBrand,
    updateBrand,
    deleteBrand,
    refreshBrands: fetchBrands,
  }

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
}

export function useBrandContext() {
  const context = useContext(BrandContext)
  if (context === undefined) {
    throw new Error("useBrandContext debe ser usado dentro de un BrandProvider")
  }
  return context
}

