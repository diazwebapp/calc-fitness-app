"use client"

// Componente para mostrar un elemento de comida
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { FoodItem } from "@/types/food"
import { formatPrice, getStateColor, translateState, getSatietyColor, getCalorieColor } from "@/lib/utils/formatting"
import { calculateSatietyIndex } from "@/lib/utils/calculations"

interface FoodItemProps {
  food: FoodItem
  onAdd: () => void
}

export function FoodListItem({ food, onAdd }: FoodItemProps) {
  const satietyIndex = calculateSatietyIndex(food)

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

