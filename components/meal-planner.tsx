// meal-planner.tsx
"use client"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMealPlanner } from "@/hooks/use-meal-planner"
import { Copy, Trash2 } from "lucide-react"
import { useNutritionalCalculator } from "@/hooks/use-nutritional-calculator"
import { Skeleton } from "@/components/ui/skeleton"
import { Meal } from "@/types/meal"

export function MealPlanner() {
  const [isClient, setIsClient] = useState(false)
  const { savedMeals, removeMeal, isLoading, error } = useMealPlanner()
  const { loadMealToCalculator } = useNutritionalCalculator()

  useEffect(() => setIsClient(true), [])

  const { groupedMeals, sortedDates } = useMemo(() => {
    const grouped: Record<string, Meal[]> = {}
    const validMeals = savedMeals.filter(meal => !isNaN(new Date(meal.date).getTime()))

    validMeals.forEach(meal => {
      const date = new Date(meal.date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      grouped[date] = [...(grouped[date] || []), meal]
    })

    const dates = Object.keys(grouped).sort((a, b) => 
      new Date(b.split('/').reverse().join('-')).getTime() - 
      new Date(a.split('/').reverse().join('-')).getTime()
    )

    return { groupedMeals: grouped, sortedDates: dates }
  }, [savedMeals])

  if (!isClient) return null

  if (isLoading) return <LoadingSkeleton />

  if (error) return <ErrorDisplay message={error} />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planificador de Comidas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="saved">
          <TabsList className="mb-4">
            <TabsTrigger value="saved">Comidas Guardadas</TabsTrigger>
            <TabsTrigger value="weekly">Plan Semanal</TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            {savedMeals.length > 0 ? (
              <div className="space-y-6">
                {sortedDates.map(date => (
                  <DateGroup 
                    key={date}
                    date={date}
                    meals={groupedMeals[date]}
                    onRemove={removeMeal}
                    onLoad={loadMealToCalculator}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          <TabsContent value="weekly">
            <ComingSoon />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Componentes auxiliares
const LoadingSkeleton = () => (
  <Card>
    <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
)

const ErrorDisplay = ({ message }: { message: string }) => (
  <Card>
    <CardHeader><CardTitle>Error</CardTitle></CardHeader>
    <CardContent className="text-red-500">{message}</CardContent>
  </Card>
)

const DateGroup = ({ date, meals, onRemove, onLoad }: { 
  date: string
  meals: Meal[]
  onRemove: (id: string) => void
  onLoad: (meal: Meal) => void 
}) => (
  <div>
    <h3 className="font-medium text-sm text-muted-foreground mb-2">{date}</h3>
    <div className="space-y-2">
      {meals.map(meal => (
        <MealItem 
          key={meal.id}
          meal={meal}
          onRemove={onRemove}
          onLoad={onLoad}
        />
      ))}
    </div>
  </div>
)

const MealItem = ({ meal, onRemove, onLoad }: { 
  meal: Meal
  onRemove: (id: string) => void
  onLoad: (meal: Meal) => void 
}) => (
  <div className="p-3 rounded-lg border flex items-center justify-between">
    <div>
      <h4 className="font-medium">{meal.name}</h4>
      <NutritionalInfo totals={meal.totals} />
      <PriceInfo price={meal.totals.price} />
    </div>
    <div className="flex gap-1">
      <Button size="icon" variant="ghost" onClick={() => onLoad(meal)}>
        <Copy className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" onClick={() => onRemove(meal.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </div>
)

const NutritionalInfo = ({ totals }: { totals: Meal['totals'] }) => (
  <p className="text-xs text-muted-foreground">
    {Object.entries({
      calories: `${totals.calories?.toFixed(0) || 0} kcal`,
      protein: `${totals.protein?.toFixed(1) || 0}g proteína`,
      carbs: `${totals.carbs?.toFixed(1) || 0}g carbohidratos`,
      fat: `${totals.fat?.toFixed(1) || 0}g grasa`
    }).join(' | ')}
  </p>
)

const PriceInfo = ({ price }: { price: number }) => (
  <p className="text-xs font-medium text-primary mt-1">
    {price?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) || '0.00€'}
  </p>
)

const EmptyState = () => <div className="text-center py-8 text-muted-foreground">No hay comidas guardadas</div>

const ComingSoon = () => (
  <div className="text-center py-8">
    <h3 className="text-lg font-medium mb-2">Próximamente</h3>
    <p className="text-muted-foreground">Planificación semanal en desarrollo</p>
  </div>
)