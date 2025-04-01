import { Suspense } from "react"
import { FoodSearch } from "@/components/food-search"
import { NutritionalCalculator } from "@/components/nutritional-calculator"
import { MealPlanner } from "@/components/meal-planner"
import { Header } from "@/components/header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Suspense fallback={<LoadingSpinner />}>
              <FoodSearch />
            </Suspense>
          </div>

          <div>
            <Suspense fallback={<LoadingSpinner />}>
              <NutritionalCalculator />
            </Suspense>
          </div>
        </div>

        <div className="mt-12">
          <Suspense fallback={<LoadingSpinner />}>
            <MealPlanner />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

