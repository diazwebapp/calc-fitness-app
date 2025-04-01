"use client"

import type React from "react"

import { useState } from "react"
import { useFoodContext } from "@/contexts/food-context"
import { useCategoryContext } from "@/contexts/category-context"
import { useBrandContext } from "@/contexts/brand-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
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
import type { FoodItem } from "@/types/food"
import { v4 as uuidv4 } from "uuid"

export function FoodManager() {
  // Reemplazar las llamadas a los hooks individuales
  // const { foods, addFood, updateFood, deleteFood, isLoading: isFoodsLoading } = useFoods()
  // const { categories, isLoading: isCategoriesLoading } = useCategories()
  // const { brands, isLoading: isBrandsLoading } = useBrands()

  // Con las llamadas a los contextos
  const { foods, addFood, updateFood, deleteFood, isLoading: isFoodsLoading } = useFoodContext()
  const { categories, isLoading: isCategoriesLoading } = useCategoryContext()
  const { brands, isLoading: isBrandsLoading } = useBrandContext()

  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)

  // Estado para el nuevo alimento
  const [newFood, setNewFood] = useState<Partial<FoodItem>>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    water: 0,
    portion: 100,
    unit: "g",
    price: 0,
    priceUnit: "kg",
    state: "raw",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewFood((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number.parseFloat(value) || 0,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "brandId" && value === "none") {
      // Si seleccionamos "Sin marca", establecemos brandId como undefined
      setNewFood((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    } else {
      setNewFood((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleAddFood = async () => {
    if (!newFood.name || !newFood.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del alimento no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    try {
      const foodToAdd: FoodItem = {
        id: uuidv4(),
        name: newFood.name,
        calories: newFood.calories || 0,
        protein: newFood.protein || 0,
        carbs: newFood.carbs || 0,
        fat: newFood.fat || 0,
        fiber: newFood.fiber || 0,
        water: newFood.water || 0,
        categoryId: Number.parseInt(newFood.categoryId as unknown as string) || 1,
        brandId: newFood.brandId,
        portion: newFood.portion || 100,
        unit: newFood.unit as "g" | "ml" | "unit",
        price: newFood.price || 0,
        priceUnit: newFood.priceUnit as "kg" | "g" | "l" | "ml" | "unit" | "pack",
        state: newFood.state as "raw" | "cooked" | "processed",
        packSize: newFood.packSize,
      }

      await addFood(foodToAdd)

      // Resetear el formulario
      setNewFood({
        name: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        water: 0,
        portion: 100,
        unit: "g",
        price: 0,
        priceUnit: "kg",
        state: "raw",
      })

      setIsAddDialogOpen(false)

      toast({
        title: "Alimento añadido",
        description: `El alimento "${foodToAdd.name}" ha sido añadido correctamente.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo añadir el alimento. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleEditFood = (food: FoodItem) => {
    setSelectedFood(food)
    setNewFood({
      ...food,
      categoryId: food.categoryId.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateFood = async () => {
    if (!selectedFood || !newFood.name || !newFood.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del alimento no puede estar vacío",
        variant: "destructive",
      })
      return
    }

    try {
      const foodToUpdate: FoodItem = {
        id: selectedFood.id,
        name: newFood.name,
        calories: newFood.calories || 0,
        protein: newFood.protein || 0,
        carbs: newFood.carbs || 0,
        fat: newFood.fat || 0,
        fiber: newFood.fiber || 0,
        water: newFood.water || 0,
        categoryId: Number.parseInt(newFood.categoryId as unknown as string) || 1,
        brandId: newFood.brandId,
        portion: newFood.portion || 100,
        unit: newFood.unit as "g" | "ml" | "unit",
        price: newFood.price || 0,
        priceUnit: newFood.priceUnit as "kg" | "g" | "l" | "ml" | "unit" | "pack",
        state: newFood.state as "raw" | "cooked" | "processed",
        packSize: newFood.packSize,
      }

      await updateFood(foodToUpdate)

      // Resetear el formulario
      setNewFood({
        name: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        water: 0,
        portion: 100,
        unit: "g",
        price: 0,
        priceUnit: "kg",
        state: "raw",
      })
      setSelectedFood(null)
      setIsEditDialogOpen(false)

      toast({
        title: "Alimento actualizado",
        description: `El alimento "${foodToUpdate.name}" ha sido actualizado correctamente.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el alimento. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Corregir la función handleDeleteFood para manejar errores correctamente
  const handleDeleteFood = async (id: string) => {
    try {
      await deleteFood(id)
      toast({
        title: "Alimento eliminado",
        description: "El alimento ha sido eliminado correctamente.",
      })
    } catch (error) {
      console.error("Error al eliminar alimento:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el alimento. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Filtrar alimentos según la búsqueda
  const filteredFoods = foods.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const isLoading = isFoodsLoading || isCategoriesLoading || isBrandsLoading

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Alimentos</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Alimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Alimento</DialogTitle>
              <DialogDescription>Introduce los detalles del nuevo alimento.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nombre del alimento"
                    value={newFood.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="categoryId">Categoría</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("categoryId", value)}
                    defaultValue={newFood.categoryId?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(categories) &&
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="brandId">Marca (opcional)</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("brandId", value)}
                    defaultValue={newFood.brandId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin marca</SelectItem>
                      {Array.isArray(brands) &&
                        brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select onValueChange={(value) => handleSelectChange("state", value)} defaultValue={newFood.state}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raw">Crudo</SelectItem>
                      <SelectItem value="cooked">Cocinado</SelectItem>
                      <SelectItem value="processed">Procesado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="calories">Calorías (kcal/100g)</Label>
                  <Input
                    id="calories"
                    name="calories"
                    type="number"
                    placeholder="0"
                    value={newFood.calories}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="protein">Proteínas (g/100g)</Label>
                  <Input
                    id="protein"
                    name="protein"
                    type="number"
                    placeholder="0"
                    value={newFood.protein}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="carbs">Carbohidratos (g/100g)</Label>
                  <Input
                    id="carbs"
                    name="carbs"
                    type="number"
                    placeholder="0"
                    value={newFood.carbs}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fat">Grasas (g/100g)</Label>
                  <Input
                    id="fat"
                    name="fat"
                    type="number"
                    placeholder="0"
                    value={newFood.fat}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fiber">Fibra (g/100g)</Label>
                  <Input
                    id="fiber"
                    name="fiber"
                    type="number"
                    placeholder="0"
                    value={newFood.fiber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="water">Agua (%)</Label>
                  <Input
                    id="water"
                    name="water"
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={newFood.water}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="portion">Porción</Label>
                  <Input
                    id="portion"
                    name="portion"
                    type="number"
                    placeholder="100"
                    value={newFood.portion}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="unit">Unidad</Label>
                  <Select onValueChange={(value) => handleSelectChange("unit", value)} defaultValue={newFood.unit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">Gramos (g)</SelectItem>
                      <SelectItem value="ml">Mililitros (ml)</SelectItem>
                      <SelectItem value="unit">Unidad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newFood.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="priceUnit">Unidad de precio</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("priceUnit", value)}
                    defaultValue={newFood.priceUnit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Por kilogramo (kg)</SelectItem>
                      <SelectItem value="g">Por 100 gramos (g)</SelectItem>
                      <SelectItem value="l">Por litro (l)</SelectItem>
                      <SelectItem value="ml">Por 100 mililitros (ml)</SelectItem>
                      <SelectItem value="unit">Por unidad</SelectItem>
                      <SelectItem value="pack">Por paquete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newFood.priceUnit === "pack" && (
                  <div className="grid gap-2">
                    <Label htmlFor="packSize">Unidades por paquete</Label>
                    <Input
                      id="packSize"
                      name="packSize"
                      type="number"
                      placeholder="0"
                      value={newFood.packSize || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddFood}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de edición */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Alimento</DialogTitle>
              <DialogDescription>Modifica los detalles del alimento.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nombre</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    placeholder="Nombre del alimento"
                    value={newFood.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-categoryId">Categoría</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("categoryId", value)}
                    value={newFood.categoryId?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(categories) &&
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-brandId">Marca (opcional)</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("brandId", value)}
                    value={newFood.brandId || "none"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin marca</SelectItem>
                      {Array.isArray(brands) &&
                        brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-state">Estado</Label>
                  <Select onValueChange={(value) => handleSelectChange("state", value)} value={newFood.state}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raw">Crudo</SelectItem>
                      <SelectItem value="cooked">Cocinado</SelectItem>
                      <SelectItem value="processed">Procesado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-calories">Calorías (kcal/100g)</Label>
                  <Input
                    id="edit-calories"
                    name="calories"
                    type="number"
                    placeholder="0"
                    value={newFood.calories}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-protein">Proteínas (g/100g)</Label>
                  <Input
                    id="edit-protein"
                    name="protein"
                    type="number"
                    placeholder="0"
                    value={newFood.protein}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-carbs">Carbohidratos (g/100g)</Label>
                  <Input
                    id="edit-carbs"
                    name="carbs"
                    type="number"
                    placeholder="0"
                    value={newFood.carbs}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-fat">Grasas (g/100g)</Label>
                  <Input
                    id="edit-fat"
                    name="fat"
                    type="number"
                    placeholder="0"
                    value={newFood.fat}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-fiber">Fibra (g/100g)</Label>
                  <Input
                    id="edit-fiber"
                    name="fiber"
                    type="number"
                    placeholder="0"
                    value={newFood.fiber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-water">Agua (%)</Label>
                  <Input
                    id="edit-water"
                    name="water"
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={newFood.water}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-portion">Porción</Label>
                  <Input
                    id="edit-portion"
                    name="portion"
                    type="number"
                    placeholder="100"
                    value={newFood.portion}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-unit">Unidad</Label>
                  <Select onValueChange={(value) => handleSelectChange("unit", value)} value={newFood.unit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">Gramos (g)</SelectItem>
                      <SelectItem value="ml">Mililitros (ml)</SelectItem>
                      <SelectItem value="unit">Unidad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Precio</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newFood.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-priceUnit">Unidad de precio</Label>
                  <Select onValueChange={(value) => handleSelectChange("priceUnit", value)} value={newFood.priceUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Por kilogramo (kg)</SelectItem>
                      <SelectItem value="g">Por 100 gramos (g)</SelectItem>
                      <SelectItem value="l">Por litro (l)</SelectItem>
                      <SelectItem value="ml">Por 100 mililitros (ml)</SelectItem>
                      <SelectItem value="unit">Por unidad</SelectItem>
                      <SelectItem value="pack">Por paquete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newFood.priceUnit === "pack" && (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-packSize">Unidades por paquete</Label>
                    <Input
                      id="edit-packSize"
                      name="packSize"
                      type="number"
                      placeholder="0"
                      value={newFood.packSize || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateFood}>Actualizar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar alimentos..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFoods.length > 0 ? (
            filteredFoods.map((food) => {
              const category = Array.isArray(categories) ? categories.find((c) => c.id === food.categoryId) : undefined
              const brand = food.brandId && Array.isArray(brands) ? brands.find((b) => b.id === food.brandId) : null

              return (
                <div key={food.id} className="p-3 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{food.name}</h3>
                      <div className="flex gap-2 text-xs mt-1">
                        {category && <span className="bg-primary/10 px-1.5 py-0.5 rounded">{category.name}</span>}
                        {brand && <span className="bg-muted px-1.5 py-0.5 rounded">{brand.name}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEditFood(food)}>
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
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el alimento "{food.name}"
                              de la base de datos.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteFood(food.id)}>Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {food.calories} kcal | {food.protein}g proteína | {food.carbs}g carbohidratos | {food.fat}g grasa
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {food.fiber}g fibra | {food.water}% agua
                  </p>
                  <p className="text-xs font-medium text-primary mt-1">
                    {food.price.toFixed(2)}€/{food.priceUnit === "pack" ? `${food.packSize} unidades` : food.priceUnit}
                  </p>
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">No se encontraron alimentos</div>
          )}
        </div>
      )}
    </div>
  )
}

