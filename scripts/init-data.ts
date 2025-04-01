import { writeJsonFile, ensureDataDir } from "../lib/fs-utils"
import { categories, brands, foods } from "../lib/data"

async function initializeData() {
  try {
    console.log("Inicializando directorio de datos...")
    await ensureDataDir()

    console.log("Escribiendo datos iniciales...")
    await writeJsonFile("categories.json", categories)
    await writeJsonFile("brands.json", brands)
    await writeJsonFile("foods.json", foods)

    console.log("Datos inicializados correctamente.")
  } catch (error) {
    console.error("Error al inicializar datos:", error)
  }
}

// Ejecutar la función de inicialización
initializeData()

