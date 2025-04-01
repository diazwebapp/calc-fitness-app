"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMealPlanner } from "@/hooks/use-meal-planner"
import { Copy, Trash2 } from "lucide-react"
import { useNutritionalCalculator } from "@/hooks/use-nutritional-calculator"

export function MealPlanner() {
  const { savedMeals, removeMeal } = useMealPlanner()
  const { loadMealToCalculator } = useNutritionalCalculator()
  const [activeTab, setActiveTab] = useState("saved")

  const mealsByDate = savedMeals.reduce(
    (acc, meal) => {
      const date = new Date(meal.date).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(meal)
      return acc
    },
    {} as Record<string, typeof savedMeals>,
  )

  const dates = Object.keys(mealsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planificador de Comidas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="saved" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="saved">Comidas Guardadas</TabsTrigger>
            <TabsTrigger value="weekly">Plan Semanal</TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            {savedMeals.length > 0 ? (
              <div className="space-y-6">
                {dates.map((date) => (
                  <div key={date}>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">{date}</h3>
                    <div className="space-y-2">
                      {mealsByDate[date].map((meal) => (
                        <div key={meal.id} className="p-3 rounded-lg border flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{meal.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {meal.totals.calories.toFixed(0)} kcal |{meal.totals.protein.toFixed(1)}g proteína |
                              {meal.totals.carbs.toFixed(1)}g carbohidratos |{meal.totals.fat.toFixed(1)}g grasa
                            </p>
                            <p className="text-xs font-medium text-primary mt-1">
                              Costo: {meal.totals.price.toFixed(2)}€
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => loadMealToCalculator(meal)}>
                              <Copy className="h-4 w-4" />
                              <span className="sr-only">Copiar a calculadora</span>
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => removeMeal(meal.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No hay comidas guardadas</div>
            )}
          </TabsContent>

          <TabsContent value="weekly">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Próximamente</h3>
              <p className="text-muted-foreground">La planificación semanal estará disponible pronto</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

