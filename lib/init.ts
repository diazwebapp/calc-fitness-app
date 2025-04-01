import { ensureDataDir, readJsonFile, writeJsonFile } from "./fs-utils"
import { categories, brands, foods } from "./data"

export async function initializeDataIfNeeded() {
  try {
    // Asegurarse de que el directorio de datos exista
    await ensureDataDir()

    // Verificar si los archivos existen y tienen datos
    const existingCategories = await readJsonFile<typeof categories>("categories.json")
    if (!existingCategories || existingCategories.length === 0) {
      await writeJsonFile("categories.json", categories)
      console.log("Archivo de categorías inicializado.")
    }

    const existingBrands = await readJsonFile<typeof brands>("brands.json")
    if (!existingBrands || existingBrands.length === 0) {
      await writeJsonFile("brands.json", brands)
      console.log("Archivo de marcas inicializado.")
    }

    const existingFoods = await readJsonFile<typeof foods>("foods.json")
    if (!existingFoods || existingFoods.length === 0) {
      await writeJsonFile("foods.json", foods)
      console.log("Archivo de alimentos inicializado.")
    }

    console.log("Verificación de datos completada.")
  } catch (error) {
    console.error("Error al inicializar datos:", error)
  }
}

