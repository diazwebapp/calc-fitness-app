import { NextResponse } from "next/server"
import { readJsonFile, writeJsonFile } from "@/lib/fs-utils"
import type { Brand } from "@/types/food"
import { brands as fallbackBrands } from "@/lib/data"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    // Intentar leer las marcas del archivo
    const brands = await readJsonFile<Brand[]>("brands.json")

    // Si el archivo está vacío, usar los datos de fallback
    if (!brands || brands.length === 0) {
      await writeJsonFile("brands.json", fallbackBrands)
      return NextResponse.json(fallbackBrands)
    }

    return NextResponse.json(brands)
  } catch (error) {
    console.error("Error al cargar marcas:", error)
    return NextResponse.json(fallbackBrands, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newBrand = await request.json()

    // Validar que la marca tenga un nombre
    if (!newBrand.name) {
      return NextResponse.json({ error: "El nombre de la marca es obligatorio" }, { status: 400 })
    }

    // Leer las marcas existentes
    const brands = await readJsonFile<Brand[]>("brands.json")

    // Crear la nueva marca con ID
    const brandToSave: Brand = {
      id: uuidv4(),
      name: newBrand.name,
    }

    // Añadir la nueva marca y guardar
    brands.push(brandToSave)
    await writeJsonFile("brands.json", brands)

    return NextResponse.json(brandToSave, { status: 201 })
  } catch (error) {
    console.error("Error al crear marca:", error)
    return NextResponse.json({ error: "Error al crear la marca" }, { status: 500 })
  }
}

