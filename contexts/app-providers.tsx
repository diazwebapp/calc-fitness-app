"use client"

import type React from "react"
import { FoodProvider } from "./food-context"
import { CategoryProvider } from "./category-context"
import { BrandProvider } from "./brand-context"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CategoryProvider>
      <BrandProvider>
        <FoodProvider>{children}</FoodProvider>
      </BrandProvider>
    </CategoryProvider>
  )
}

