import { NextResponse } from "next/server"
import { readJsonFile, writeJsonFile } from "@/lib/fs-utils"
import type { FoodItem } from "@/types/food"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updatedFood = await request.json()

    // Validar que el alimento tenga un nombre
    if (!updatedFood.name) {
      return NextResponse.json({ error: "El nombre del alimento es obligatorio" }, { status: 400 })
    }

    // Leer los alimentos existentes
    const foods = await readJsonFile<FoodItem[]>("foods.json")

    // Buscar el alimento a actualizar
    const foodIndex = foods.findIndex((food) => food.id === id)

    if (foodIndex === -1) {
      return NextResponse.json({ error: "Alimento no encontrado" }, { status: 404 })
    }

    // Actualizar el alimento
    foods[foodIndex] = {
      ...updatedFood,
      id, // Asegurarse de mantener el mismo ID
    }

    // Guardar los cambios
    await writeJsonFile("foods.json", foods)

    return NextResponse.json(foods[foodIndex])
  } catch (error) {
    console.error("Error al actualizar alimento:", error)
    return NextResponse.json({ error: "Error al actualizar el alimento" }, { status: 500 })
  }
}

// Asegurarnos de que la respuesta sea correcta para DELETE
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Leer los alimentos existentes
    const foods = await readJsonFile<FoodItem[]>("foods.json")

    // Buscar el alimento a eliminar
    const foodIndex = foods.findIndex((food) => food.id === id)

    if (foodIndex === -1) {
      return NextResponse.json({ error: "Alimento no encontrado" }, { status: 404 })
    }

    // Eliminar el alimento
    const updatedFoods = foods.filter((food) => food.id !== id)

    // Guardar los cambios
    await writeJsonFile("foods.json", updatedFoods)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar alimento:", error)
    return NextResponse.json({ error: "Error al eliminar el alimento" }, { status: 500 })
  }
}

