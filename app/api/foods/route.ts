import { NextResponse } from "next/server"
import { readJsonFile, writeJsonFile } from "@/lib/fs-utils"
import type { FoodItem } from "@/types/food"
import { foods as fallbackFoods } from "@/lib/data"

export async function GET() {
  try {
    // Intentar leer los alimentos del archivo
    const foods = await readJsonFile<FoodItem[]>("foods.json")

    // Si el archivo está vacío, usar los datos de fallback
    if (!foods || foods.length === 0) {
      await writeJsonFile("foods.json", fallbackFoods)
      return NextResponse.json(fallbackFoods)
    }

    return NextResponse.json(foods)
  } catch (error) {
    console.error("Error al cargar alimentos:", error)
    return NextResponse.json(fallbackFoods, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newFood = await request.json()

    // Validar que el alimento tenga un nombre
    if (!newFood.name) {
      return NextResponse.json({ error: "El nombre del alimento es obligatorio" }, { status: 400 })
    }

    // Leer los alimentos existentes
    const foods = await readJsonFile<FoodItem[]>("foods.json")

    // Añadir el nuevo alimento y guardar
    foods.push(newFood)
    await writeJsonFile("foods.json", foods)

    return NextResponse.json(newFood, { status: 201 })
  } catch (error) {
    console.error("Error al crear alimento:", error)
    return NextResponse.json({ error: "Error al crear el alimento" }, { status: 500 })
  }
}

