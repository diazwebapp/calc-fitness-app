"use client"

import { useState } from "react"
// Importar el contexto
import { useBrandContext } from "@/contexts/brand-context"
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
import type { Brand } from "@/types/food"

export function BrandManager() {
  // Reemplazar la llamada al hook individual
  // const { brands, addBrand, updateBrand, deleteBrand, isLoading } = useBrands()

  // Con la llamada al contexto
  const { brands, addBrand, updateBrand, deleteBrand, isLoading } = useBrandContext()
  const [newBrandName, setNewBrandName] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la marca no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    try {
      await addBrand(newBrandName)
      setNewBrandName("")
      setIsAddDialogOpen(false)
      toast({
        title: "Marca añadida",
        description: `La marca "${newBrandName}" ha sido añadida correctamente.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo añadir la marca. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleEditBrand = (brand: Brand) => {
    setSelectedBrand(brand)
    setNewBrandName(brand.name)
    setIsEditDialogOpen(true)
  }

  const handleUpdateBrand = async () => {
    if (!selectedBrand || !newBrandName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la marca no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    try {
      await updateBrand({
        ...selectedBrand,
        name: newBrandName,
      })
      setNewBrandName("")
      setSelectedBrand(null)
      setIsEditDialogOpen(false)
      toast({
        title: "Marca actualizada",
        description: `La marca ha sido actualizada correctamente.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la marca. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBrand = async (id: string) => {
    try {
      await deleteBrand(id)
      toast({
        title: "Marca eliminada",
        description: "La marca ha sido eliminada correctamente.",
      })
    } catch (error) {
      console.error("Error al eliminar marca:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la marca. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Marcas</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Marca
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nueva Marca</DialogTitle>
              <DialogDescription>Introduce el nombre de la nueva marca de alimentos.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Nombre de la marca"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddBrand}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de edición */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Marca</DialogTitle>
              <DialogDescription>Modifica el nombre de la marca.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  placeholder="Nombre de la marca"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateBrand}>Actualizar</Button>
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
          {Array.isArray(brands) && brands.length > 0 ? (
            brands.map((brand) => (
              <div key={brand.id} className="p-3 rounded-lg border flex justify-between items-center">
                <span>{brand.name}</span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEditBrand(brand)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente la marca "{brand.name}" y los
                          alimentos asociados ya no tendrán marca.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteBrand(brand.id)}>Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">No hay marcas disponibles</div>
          )}
        </div>
      )}
    </div>
  )
}

