"use client"

import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import { Settings, Calculator } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Calculadora Nutricional</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/get">
            <Button variant="ghost" className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              <span className="hidden sm:inline">Calculadora GET</span>
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
              <span className="sr-only">Administración</span>
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

