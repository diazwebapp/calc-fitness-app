"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryManager } from "./category-manager"
import { BrandManager } from "./brand-manager"
import { FoodManager } from "./food-manager"

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("categories")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gestión de Datos</CardTitle>
        <CardDescription>Añade, edita o elimina categorías, marcas y alimentos de la base de datos.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="categories">Categorías</TabsTrigger>
            <TabsTrigger value="brands">Marcas</TabsTrigger>
            <TabsTrigger value="foods">Alimentos</TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="brands">
            <BrandManager />
          </TabsContent>

          <TabsContent value="foods">
            <FoodManager />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

