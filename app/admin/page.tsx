import { AdminPanel } from "@/components/admin/admin-panel"

export const metadata = {
  title: "Panel de Administración - Calculadora Nutricional",
  description: "Administra categorías, alimentos y marcas",
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-center text-primary">Panel de Administración</h1>
        <AdminPanel />
      </div>
    </main>
  )
}

