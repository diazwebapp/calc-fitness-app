import { NextResponse } from "next/server"
import { readJsonFile, writeJsonFile } from "@/lib/fs-utils"
import type { Brand, FoodItem } from "@/types/food"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updatedBrand = await request.json()

    // Validar que la marca tenga un nombre
    if (!updatedBrand.name) {
      return NextResponse.json({ error: "El nombre de la marca es obligatorio" }, { status: 400 })
    }

    // Leer las marcas existentes
    const brands = await readJsonFile<Brand[]>("brands.json")

    // Buscar la marca a actualizar
    const brandIndex = brands.findIndex((brand) => brand.id === id)

    if (brandIndex === -1) {
      return NextResponse.json({ error: "Marca no encontrada" }, { status: 404 })
    }

    // Actualizar la marca
    brands[brandIndex] = {
      ...brands[brandIndex],
      name: updatedBrand.name,
    }

    // Guardar los cambios
    await writeJsonFile("brands.json", brands)

    return NextResponse.json(brands[brandIndex])
  } catch (error) {
    console.error("Error al actualizar marca:", error)
    return NextResponse.json({ error: "Error al actualizar la marca" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Leer las marcas existentes
    const brands = await readJsonFile<Brand[]>("brands.json")

    // Buscar la marca a eliminar
    const brandIndex = brands.findIndex((brand) => brand.id === id)

    if (brandIndex === -1) {
      return NextResponse.json({ error: "Marca no encontrada" }, { status: 404 })
    }

    // Actualizar los alimentos que usan esta marca
    const foods = await readJsonFile<FoodItem[]>("foods.json")
    const updatedFoods = foods.map((food) => {
      if (food.brandId === id) {
        // Eliminar la referencia a la marca
        const { brandId, ...foodWithoutBrand } = food
        return foodWithoutBrand as FoodItem
      }
      return food
    })

    // Eliminar la marca
    const updatedBrands = brands.filter((brand) => brand.id !== id)

    // Guardar los cambios
    await writeJsonFile("foods.json", updatedFoods)
    await writeJsonFile("brands.json", updatedBrands)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar marca:", error)
    return NextResponse.json({ error: "Error al eliminar la marca" }, { status: 500 })
  }
}

