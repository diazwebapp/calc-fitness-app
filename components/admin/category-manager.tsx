"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import type { Category } from "@/types/food"

// Importar el contexto
import { useCategoryContext } from "@/contexts/category-context"

export function CategoryManager() {
  // Reemplazar la llamada al hook individual
  // const { categories, addCategory, updateCategory, deleteCategory, isLoading } = useCategories()

  // Con la llamada al contexto
  const { categories, addCategory, updateCategory, deleteCategory, isLoading } = useCategoryContext()
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Verificar si existe la categoría "Sin categoría"
  useEffect(() => {
    if (!isLoading && categories.length > 0) {
      const defaultCategory = categories.find((cat) => cat.name === "Sin categoría")
      if (!defaultCategory) {
        // Si no existe, la creamos
        addCategory("Sin categoría")
      }
    }
  }, [categories, isLoading, addCategory])

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    try {
      await addCategory(newCategoryName)
      setNewCategoryName("")
      setIsAddDialogOpen(false)
      toast({
        title: "Categoría añadida",
        description: `La categoría "${newCategoryName}" ha sido añadida correctamente.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo añadir la categoría. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setNewCategoryName(category.name)
    setIsEditDialogOpen(true)
  }

  const handleUpdateCategory = async () => {
    if (!selectedCategory || !newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    // No permitir editar la categoría "Sin categoría"
    if (selectedCategory.name === "Sin categoría") {
      toast({
        title: "Error",
        description: "No se puede modificar la categoría 'Sin categoría'",
        variant: "destructive",
      })
      setIsEditDialogOpen(false)
      return
    }

    try {
      await updateCategory({
        ...selectedCategory,
        name: newCategoryName,
      })
      setNewCategoryName("")
      setSelectedCategory(null)
      setIsEditDialogOpen(false)
      toast({
        title: "Categoría actualizada",
        description: `La categoría ha sido actualizada correctamente.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Corregir la función handleDeleteCategory para manejar errores correctamente
  const handleDeleteCategory = async (id: number) => {
    // Buscar la categoría
    const category = categories.find((cat) => cat.id === id)

    // No permitir eliminar la categoría "Sin categoría"
    if (category && category.name === "Sin categoría") {
      toast({
        title: "Error",
        description: "No se puede eliminar la categoría 'Sin categoría'",
        variant: "destructive",
      })
      return
    }

    try {
      await deleteCategory(id)
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada correctamente.",
      })
    } catch (error) {
      console.error("Error al eliminar categoría:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la categoría. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Categorías</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nueva Categoría</DialogTitle>
              <DialogDescription>Introduce el nombre de la nueva categoría de alimentos.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Nombre de la categoría"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCategory}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de edición */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoría</DialogTitle>
              <DialogDescription>Modifica el nombre de la categoría.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  placeholder="Nombre de la categoría"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateCategory}>Actualizar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="p-3 rounded-lg border flex justify-between items-center">
                <span>{category.name}</span>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditCategory(category)}
                    disabled={category.name === "Sin categoría"}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" disabled={category.name === "Sin categoría"}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría "{category.name}
                          " y los alimentos asociados se moverán a "Sin categoría".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">No hay categorías disponibles</div>
          )}
        </div>
      )}
    </div>
  )
}

