"use client"

import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, SlidersHorizontal } from "lucide-react"
import type { FoodItem } from "@/types/food"
import { useNutritionalCalculator } from "@/hooks/use-nutritional-calculator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Importar los contextos
import { useFoodContext } from "@/contexts/food-context"
import { useCategoryContext } from "@/contexts/category-context"

// Tipo para los filtros
type FoodFilters = {
  sortBy: "calories" | "satiety" | "none"
  sortOrder: "asc" | "desc"
  minFiber: number
  maxFiber: number
  minWater: number
  maxWater: number
  showHighCalorieLowSatiety: boolean
  showLowCalorieHighSatiety: boolean
}

export function FoodSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Reemplazar las llamadas a los hooks individuales
  // const { foods, isLoading } = useFoods(debouncedSearch)
  // const { categories } = useCategories()

  // Con las llamadas a los contextos
  const { filteredFoods: foods, isLoading, searchFoods } = useFoodContext()
  const { categories } = useCategoryContext()

  // Y actualizar la función de búsqueda
  useEffect(() => {
    searchFoods(debouncedSearch)
  }, [debouncedSearch, searchFoods])

  const { addFoodToCalculator } = useNutritionalCalculator()
  const [activeTab, setActiveTab] = useState("all")

  // Estado para los filtros
  const [filters, setFilters] = useState<FoodFilters>({
    sortBy: "none",
    sortOrder: "desc",
    minFiber: 0,
    maxFiber: 20,
    minWater: 0,
    maxWater: 100,
    showHighCalorieLowSatiety: false,
    showLowCalorieHighSatiety: false,
  })

  // Función para calcular el índice de saciedad (simplificado)
  // Basado en fibra, agua y proteína
  const calculateSatietyIndex = (food: FoodItem): number => {
    return food.fiber * 3 + food.water * 0.2 + food.protein * 0.5
  }

  // Función para calcular la densidad calórica (calorías por 100g)
  const calculateCalorieDensity = (food: FoodItem): number => {
    return food.calories
  }

  // Aplicar filtros y ordenación a los alimentos
  const filteredAndSortedFoods = foods
    .filter(
      (food) =>
        (activeTab === "all" || food.categoryId.toString() === activeTab) &&
        food.fiber >= filters.minFiber &&
        food.fiber <= filters.maxFiber &&
        food.water >= filters.minWater &&
        food.water <= filters.maxWater,
    )
    .filter((food) => {
      const satietyIndex = calculateSatietyIndex(food)
      const calorieDensity = calculateCalorieDensity(food)

      if (filters.showHighCalorieLowSatiety && !filters.showLowCalorieHighSatiety) {
        // Mostrar solo alimentos altos en calorías y bajos en saciedad
        return calorieDensity > 200 && satietyIndex < 15
      } else if (!filters.showHighCalorieLowSatiety && filters.showLowCalorieHighSatiety) {
        // Mostrar solo alimentos bajos en calorías y altos en saciedad
        return calorieDensity < 200 && satietyIndex > 15
      } else {
        // Mostrar todos los alimentos
        return true
      }
    })
    .sort((a, b) => {
      if (filters.sortBy === "calories") {
        const densityA = calculateCalorieDensity(a)
        const densityB = calculateCalorieDensity(b)
        return filters.sortOrder === "asc" ? densityA - densityB : densityB - densityA
      } else if (filters.sortBy === "satiety") {
        const satietyA = calculateSatietyIndex(a)
        const satietyB = calculateSatietyIndex(b)
        return filters.sortOrder === "asc" ? satietyA - satietyB : satietyB - satietyA
      }
      return 0
    })

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Base de Alimentos</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Ordenar por</h4>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, sortBy: value as "calories" | "satiety" | "none" }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona criterio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin ordenar</SelectItem>
                      <SelectItem value="calories">Densidad calórica</SelectItem>
                      <SelectItem value="satiety">Índice de saciedad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filters.sortBy !== "none" && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Orden</h4>
                    <Select
                      value={filters.sortOrder}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, sortOrder: value as "asc" | "desc" }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona orden" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascendente</SelectItem>
                        <SelectItem value="desc">Descendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium">Fibra (g/100g)</h4>
                  <div className="pt-4">
                    <Slider
                      min={0}
                      max={20}
                      step={0.5}
                      value={[filters.minFiber, filters.maxFiber]}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, minFiber: value[0], maxFiber: value[1] }))
                      }
                    />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>{filters.minFiber}g</span>
                      <span>{filters.maxFiber}g</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Agua (%)</h4>
                  <div className="pt-4">
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={[filters.minWater, filters.maxWater]}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, minWater: value[0], maxWater: value[1] }))
                      }
                    />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>{filters.minWater}%</span>
                      <span>{filters.maxWater}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Filtros rápidos</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="highCalLowSat"
                      checked={filters.showHighCalorieLowSatiety}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          showHighCalorieLowSatiety: checked === true,
                          // Si se activa este, desactivar el opuesto
                          showLowCalorieHighSatiety: checked === true ? false : prev.showLowCalorieHighSatiety,
                        }))
                      }
                    />
                    <Label htmlFor="highCalLowSat">Alta caloría, baja saciedad</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowCalHighSat"
                      checked={filters.showLowCalorieHighSatiety}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          showLowCalorieHighSatiety: checked === true,
                          // Si se activa este, desactivar el opuesto
                          showHighCalorieLowSatiety: checked === true ? false : prev.showHighCalorieLowSatiety,
                        }))
                      }
                    />
                    <Label htmlFor="lowCalHighSat">Baja caloría, alta saciedad</Label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
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

        <Tabs defaultValue="all" onValueChange={setActiveTab} className="mt-4">
          <TabsList className="mb-4 flex flex-wrap h-auto">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {Array.isArray(categories) && categories.length > 0
              ? categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id.toString()}>
                    {category.name}
                  </TabsTrigger>
                ))
              : null}
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-20">
                  <div className="w-6 h-6 border-2 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : filteredAndSortedFoods.length > 0 ? (
                filteredAndSortedFoods.map((food) => (
                  <FoodSearchItem
                    key={food.id}
                    food={food}
                    onAdd={() => addFoodToCalculator(food)}
                    satietyIndex={calculateSatietyIndex(food)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {debouncedSearch || filters.showHighCalorieLowSatiety || filters.showLowCalorieHighSatiety
                    ? "No se encontraron alimentos con los filtros actuales"
                    : "Busca alimentos para comenzar"}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function FoodSearchItem({
  food,
  onAdd,
  satietyIndex,
}: {
  food: FoodItem
  onAdd: () => void
  satietyIndex: number
}) {
  // Función para formatear el precio según la unidad
  const formatPrice = (food: FoodItem) => {
    switch (food.priceUnit) {
      case "kg":
        return `${food.price.toFixed(2)}€/kg`
      case "g":
        return `${food.price.toFixed(2)}€/100g`
      case "l":
        return `${food.price.toFixed(2)}€/L`
      case "ml":
        return `${food.price.toFixed(2)}€/100ml`
      case "unit":
        return `${food.price.toFixed(2)}€/unidad`
      case "pack":
        return `${food.price.toFixed(2)}€/${food.packSize} unidades`
      default:
        return `${food.price.toFixed(2)}€`
    }
  }

  // Función para obtener el color del badge según el estado
  const getStateColor = (state: string) => {
    switch (state) {
      case "raw":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "cooked":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      case "processed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      default:
        return ""
    }
  }

  // Función para traducir el estado
  const translateState = (state: string) => {
    switch (state) {
      case "raw":
        return "Crudo"
      case "cooked":
        return "Cocinado"
      case "processed":
        return "Procesado"
      default:
        return state
    }
  }

  // Función para obtener el color del índice de saciedad
  const getSatietyColor = (index: number) => {
    if (index > 20) return "text-green-600 dark:text-green-400"
    if (index > 10) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  // Función para obtener el color de la densidad calórica
  const getCalorieColor = (calories: number) => {
    if (calories < 100) return "text-green-600 dark:text-green-400"
    if (calories < 300) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground hover:bg-accent/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{food.name}</h3>
          <Badge variant="outline" className={getStateColor(food.state)}>
            {translateState(food.state)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className={getCalorieColor(food.calories)}>{food.calories} kcal</span> | {food.protein}g proteína |{" "}
          {food.carbs}g carbohidratos | {food.fat}g grasa
        </p>
        <p className="text-sm text-muted-foreground">
          {food.fiber}g fibra | {food.water}% agua |{" "}
          <span className={getSatietyColor(satietyIndex)}>Saciedad: {satietyIndex.toFixed(1)}</span>
        </p>
        <p className="text-sm font-medium text-primary mt-1">{formatPrice(food)}</p>
      </div>
      <Button size="icon" variant="ghost" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        <span className="sr-only">Añadir {food.name}</span>
      </Button>
    </div>
  )
}

