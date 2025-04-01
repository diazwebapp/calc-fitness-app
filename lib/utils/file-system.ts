// Mover las utilidades de sistema de archivos a una subcarpeta específica
import fs from "fs"
import path from "path"
import { promises as fsPromises } from "fs"

// Ruta base para los archivos de datos
const DATA_DIR = path.join(process.cwd(), "data")

// Asegurarse de que el directorio de datos exista
export async function ensureDataDir() {
  try {
    await fsPromises.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error("Error al crear el directorio de datos:", error)
    throw error
  }
}

// Leer un archivo JSON
export async function readJsonFile<T>(filename: string): Promise<T> {
  try {
    const filePath = path.join(DATA_DIR, filename)

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return [] as unknown as T
    }

    const data = await fsPromises.readFile(filePath, "utf8")
    return JSON.parse(data) as T
  } catch (error) {
    console.error(`Error al leer el archivo ${filename}:`, error)
    return [] as unknown as T
  }
}

// Escribir en un archivo JSON
export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  try {
    await ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)
    await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2), "utf8")
  } catch (error) {
    console.error(`Error al escribir en el archivo ${filename}:`, error)
    throw error
  }
}

