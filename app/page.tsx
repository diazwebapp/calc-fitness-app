import { Suspense } from "react"
import { FoodSearch } from "@/components/food-search"
import { NutritionalCalculator } from "@/components/nutritional-calculator"
import { MealPlanner } from "@/components/meal-planner"
import { Header } from "@/components/header"
//import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EnergyCalculator } from "@/components/energy-calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="container px-4 py-8 mx-auto max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-center text-primary">Calculadora de GET</h1>
          <EnergyCalculator />
        </div>
      </div>
    </main>
  )
}

