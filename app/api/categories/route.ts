import { NextResponse } from "next/server"
import { readJsonFile, writeJsonFile } from "@/lib/fs-utils"
import type { Category } from "@/types/food"
import { categories as fallbackCategories } from "@/lib/data"
import { initializeDataIfNeeded } from "@/lib/init"

export async function GET() {
  try {
    // Inicializar datos si es necesario
    await initializeDataIfNeeded()

    // Leer las categorías del archivo
    const categories = await readJsonFile<Category[]>("categories.json")

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error al cargar categorías:", error)
    return NextResponse.json(fallbackCategories, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newCategory = await request.json()

    // Validar que la categoría tenga un nombre
    if (!newCategory.name) {
      return NextResponse.json({ error: "El nombre de la categoría es obligatorio" }, { status: 400 })
    }

    // Leer las categorías existentes
    const categories = await readJsonFile<Category[]>("categories.json")

    // Generar un nuevo ID
    const newId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1

    // Crear la nueva categoría con ID
    const categoryToSave: Category = {
      id: newId,
      name: newCategory.name,
    }

    // Añadir la nueva categoría y guardar
    categories.push(categoryToSave)
    await writeJsonFile("categories.json", categories)

    return NextResponse.json(categoryToSave, { status: 201 })
  } catch (error) {
    console.error("Error al crear categoría:", error)
    return NextResponse.json({ error: "Error al crear la categoría" }, { status: 500 })
  }
}

