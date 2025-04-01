"use client"

// Componente para mostrar un elemento en la calculadora
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit2, Check } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { FoodItem } from "@/types/food"
import { getStateColor, translateState, getPriceUnitText } from "@/lib/utils/formatting"
import { calculateItemPrice } from "@/lib/utils/calculations"

interface CalculatorItemProps {
  item: {
    id: string
    food: FoodItem
    quantity: number
    customPrice?: number
  }
  onRemove: () => void
  onQuantityChange: (quantity: number) => void
  onPriceChange: (price: number) => void
}

export function CalculatorItem({ item, onRemove, onQuantityChange, onPriceChange }: CalculatorItemProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(false)
  const [priceInput, setPriceInput] = useState(
    item.customPrice !== undefined ? item.customPrice.toString() : item.food.price.toString(),
  )

  const price = calculateItemPrice(item.food, item.quantity, item.customPrice)
  const basePrice = item.customPrice !== undefined ? item.customPrice : item.food.price
  const priceUnitText = getPriceUnitText(item.food.priceUnit, item.food.packSize)

  const handleSavePrice = () => {
    const newPrice = Number.parseFloat(priceInput)
    if (!isNaN(newPrice) && newPrice >= 0) {
      onPriceChange(newPrice)
      setIsEditingPrice(false)
    }
  }

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

