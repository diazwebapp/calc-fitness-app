import { NextResponse } from "next/server"
import { readJsonFile, writeJsonFile } from "@/lib/fs-utils"
import type { Category, FoodItem } from "@/types/food"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const updatedCategory = await request.json()

    // Validar que la categoría tenga un nombre
    if (!updatedCategory.name) {
      return NextResponse.json({ error: "El nombre de la categoría es obligatorio" }, { status: 400 })
    }

    // Leer las categorías existentes
    const categories = await readJsonFile<Category[]>("categories.json")

    // Buscar la categoría a actualizar
    const categoryIndex = categories.findIndex((cat) => cat.id === id)

    if (categoryIndex === -1) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    // No permitir actualizar la categoría "Sin categoría"
    if (categories[categoryIndex].name === "Sin categoría") {
      return NextResponse.json({ error: "No se puede modificar la categoría 'Sin categoría'" }, { status: 403 })
    }

    // Actualizar la categoría
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      name: updatedCategory.name,
    }

    // Guardar los cambios
    await writeJsonFile("categories.json", categories)

    return NextResponse.json(categories[categoryIndex])
  } catch (error) {
    console.error("Error al actualizar categoría:", error)
    return NextResponse.json({ error: "Error al actualizar la categoría" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Leer las categorías existentes
    const categories = await readJsonFile<Category[]>("categories.json")

    // Buscar la categoría a eliminar
    const categoryIndex = categories.findIndex((cat) => cat.id === id)

    if (categoryIndex === -1) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    // No permitir eliminar la categoría "Sin categoría"
    if (categories[categoryIndex].name === "Sin categoría") {
      return NextResponse.json({ error: "No se puede eliminar la categoría 'Sin categoría'" }, { status: 403 })
    }

    // Buscar la categoría "Sin categoría"
    const defaultCategory = categories.find((cat) => cat.name === "Sin categoría")

    if (!defaultCategory) {
      return NextResponse.json({ error: "No se encontró la categoría por defecto" }, { status: 500 })
    }

    // Actualizar los alimentos que usan esta categoría
    const foods = await readJsonFile<FoodItem[]>("foods.json")
    const updatedFoods = foods.map((food) => {
      if (food.categoryId === id) {
        return { ...food, categoryId: defaultCategory.id }
      }
      return food
    })

    // Eliminar la categoría
    const updatedCategories = categories.filter((cat) => cat.id !== id)

    // Guardar los cambios
    await writeJsonFile("foods.json", updatedFoods)
    await writeJsonFile("categories.json", updatedCategories)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    return NextResponse.json({ error: "Error al eliminar la categoría" }, { status: 500 })
  }
}

