"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Save, Edit2, Check } from "lucide-react"
import { useNutritionalCalculator } from "@/hooks/use-nutritional-calculator"
import type { FoodItem } from "@/types/food"
import { useMealPlanner } from "@/hooks/use-meal-planner"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function NutritionalCalculator() {
  const { selectedFoods, removeFood, updateFoodQuantity, updateFoodPrice, calculateTotals, clearCalculator } =
    useNutritionalCalculator()

  const { saveMeal } = useMealPlanner()
  const [mealName, setMealName] = useState("")

  const totals = calculateTotals()

  const handleSaveMeal = () => {
    if (selectedFoods.length === 0) return

    const name = mealName.trim() || `Comida ${new Date().toLocaleString()}`
    saveMeal({
      name,
      foods: selectedFoods,
      totals,
    })

    setMealName("")
    clearCalculator()
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Calculadora Nutricional</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          {selectedFoods.length > 0 ? (
            selectedFoods.map((item) => (
              <CalculatorItem
                key={`${item.food.id}-${item.id}`}
                item={item}
                onRemove={() => removeFood(item.id)}
                onQuantityChange={(quantity) => updateFoodQuantity(item.id, quantity)}
                onPriceChange={(price) => updateFoodPrice(item.id, price)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">Añade alimentos desde la búsqueda</div>
          )}
        </div>

        {selectedFoods.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-semibold mb-2">Totales Nutricionales</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="p-2 bg-primary/10 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Calorías</p>
                <p className="font-medium">{totals.calories.toFixed(0)} kcal</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Proteínas</p>
                <p className="font-medium">{totals.protein.toFixed(1)}g</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Carbohidratos</p>
                <p className="font-medium">{totals.carbs.toFixed(1)}g</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-md text-center">
                <p className="text-xs text-muted-foreground">Grasas</p>
                <p className="font-medium">{totals.fat.toFixed(1)}g</p>
              </div>
            </div>
            <div className="mt-2 p-2 bg-primary/10 rounded-md text-center">
              <p className="text-xs text-muted-foreground">Costo Total</p>
              <p className="font-medium">{totals.price.toFixed(2)}€</p>
            </div>
          </div>
        )}
      </CardContent>
      {selectedFoods.length > 0 && (
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <div className="w-full sm:w-auto flex-1">
            <Input placeholder="Nombre de la comida" value={mealName} onChange={(e) => setMealName(e.target.value)} />
          </div>
          <Button onClick={handleSaveMeal} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            Guardar Comida
          </Button>
          <Button variant="outline" onClick={clearCalculator} className="w-full sm:w-auto">
            <Trash2 className="mr-2 h-4 w-4" />
            Limpiar
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

function CalculatorItem({
  item,
  onRemove,
  onQuantityChange,
  onPriceChange,
}: {
  item: {
    id: string
    food: FoodItem
    quantity: number
    customPrice?: number
  }
  onRemove: () => void
  onQuantityChange: (quantity: number) => void
  onPriceChange: (price: number) => void
}) {
  const [isEditingPrice, setIsEditingPrice] = useState(false)
  const [priceInput, setPriceInput] = useState(
    item.customPrice !== undefined ? item.customPrice.toString() : item.food.price.toString(),
  )

  // Función para calcular el precio según la cantidad
  const calculatePrice = (food: FoodItem, quantity: number, customPrice?: number) => {
    const basePrice = customPrice !== undefined ? customPrice : food.price

    switch (food.priceUnit) {
      case "kg":
        return (basePrice * quantity) / 1000 // Convertir g a kg
      case "g":
        return (basePrice * quantity) / 100 // Precio por 100g
      case "l":
        return (basePrice * quantity) / 1000 // Convertir ml a l
      case "ml":
        return (basePrice * quantity) / 100 // Precio por 100ml
      case "unit":
        return basePrice * (quantity / food.portion) // Precio por unidad
      case "pack":
        if (food.packSize) {
          return (basePrice * quantity) / (food.portion * food.packSize) // Precio por paquete
        }
        return basePrice * (quantity / food.portion)
      default:
        return 0
    }
  }

  // Función para obtener el texto de la unidad de precio
  const getPriceUnitText = (priceUnit: string, packSize?: number) => {
    switch (priceUnit) {
      case "kg":
        return "€/kg"
      case "g":
        return "€/100g"
      case "l":
        return "€/L"
      case "ml":
        return "€/100ml"
      case "unit":
        return "€/unidad"
      case "pack":
        return packSize ? `€/${packSize} unidades` : "€/paquete"
      default:
        return "€"
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

  const handleSavePrice = () => {
    const newPrice = Number.parseFloat(priceInput)
    if (!isNaN(newPrice) && newPrice >= 0) {
      onPriceChange(newPrice)
      setIsEditingPrice(false)
    }
  }

  const price = calculatePrice(item.food, item.quantity, item.customPrice)
  const basePrice = item.customPrice !== undefined ? item.customPrice : item.food.price
  const priceUnitText = getPriceUnitText(item.food.priceUnit, item.food.packSize)

  return (
    <div className="flex flex-col p-3 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{item.food.name}</h3>
            <Badge variant="outline" className={getStateColor(item.food.state)}>
              {translateState(item.food.state)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.round((item.food.calories * item.quantity) / 100)} kcal |
            {((item.food.protein * item.quantity) / 100).toFixed(1)}g proteína
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20">
            <Input
              type="number"
              min="0"
              value={item.quantity}
              onChange={(e) => onQuantityChange(Number(e.target.value))}
              className="text-right"
            />
            <p className="text-xs text-center text-muted-foreground">
              {item.food.unit === "g" || item.food.unit === "ml" ? item.food.unit : "g"}
            </p>
          </div>
          <Button size="icon" variant="ghost" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Eliminar</span>
          </Button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditingPrice ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="w-20 h-8 text-sm"
                autoFocus
              />
              <span className="text-xs">{priceUnitText}</span>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSavePrice}>
                <Check className="h-4 w-4" />
                <span className="sr-only">Guardar precio</span>
              </Button>
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => setIsEditingPrice(true)}>
                    <p className="text-xs font-medium text-primary">
                      {basePrice.toFixed(2)} {priceUnitText}
                    </p>
                    <Edit2 className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Haz clic para editar el precio</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-sm font-medium text-primary">Total: {price.toFixed(2)}€</p>
      </div>
    </div>
  )
}
