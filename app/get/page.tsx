import { EnergyCalculator } from "@/components/energy-calculator"
import { Header } from "@/components/header"

export const metadata = {
  title: "Calculadora de Gasto Energético - Calculadora Nutricional",
  description: "Calcula tu gasto energético total (GET) y obtén recomendaciones de ingesta calórica",
}

export default function EnergyCalculatorPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container px-4 py-8 mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-center text-primary">Calculadora de GET</h1>
        <EnergyCalculator />
      </div>
    </main>
  )
}

