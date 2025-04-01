"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calculator } from "lucide-react"

type Activity = {
  type: string
  duration: number
  days: number
}

export function EnergyCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male")
  const [age, setAge] = useState<number>(30)
  const [weight, setWeight] = useState<number>(70)
  const [height, setHeight] = useState<number>(170)
  const [activityLevel, setActivityLevel] = useState<string>("1.55")
  const [activities, setActivities] = useState<Activity[]>([{ type: "walking", duration: 30, days: 3 }])
  const [results, setResults] = useState<any>(null)

  const handleAddActivity = () => {
    setActivities([...activities, { type: "walking", duration: 30, days: 3 }])
  }

  const handleActivityChange = (index: number, field: keyof Activity, value: string | number) => {
    const newActivities = [...activities]
    newActivities[index] = { ...newActivities[index], [field]: value }
    setActivities(newActivities)
  }

  const handleRemoveActivity = (index: number) => {
    const newActivities = [...activities]
    newActivities.splice(index, 1)
    setActivities(newActivities)
  }

  const calculateCalories = () => {
    // 1. Calcular TMB (Mifflin-St Jeor)
    let bmr
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // 2. Calcular GET base (sin actividades adicionales)
    const get = bmr * Number.parseFloat(activityLevel)

    // 3. Calcular calorías de actividades adicionales
    let extraCalories = 0
    const activitiesDetail: { name: string; calories: number; details: string }[] = []

    // MET (Equivalentes Metabólicos) por actividad
    const metValues: Record<string, number> = {
      walking: 3.5, // Caminar (moderado)
      cycling: 7.5, // Ciclismo (general)
      football: 8.0, // Fútbol
      running: 9.8, // Correr (8 km/h)
      swimming: 6.0, // Natación (general)
    }

    // Nombres de actividades en español
    const activityNames: Record<string, string> = {
      walking: "Caminar",
      cycling: "Ciclismo",
      football: "Fútbol",
      running: "Correr",
      swimming: "Natación",
    }

    activities.forEach((activity) => {
      if (activity.duration > 0 && activity.days > 0) {
        // Calorías quemadas = MET × peso (kg) × tiempo (horas) × días/semana ÷ 7 (para promedio diario)
        const calories = metValues[activity.type] * weight * (activity.duration / 60) * (activity.days / 7)
        extraCalories += calories

        activitiesDetail.push({
          name: activityNames[activity.type],
          calories: Math.round(calories),
          details: `${activity.duration} min × ${activity.days} días/semana`,
        })
      }
    })

    // 4. GET total (base + actividades)
    const totalCalories = get + extraCalories

    setResults({
      bmr: Math.round(bmr),
      get: Math.round(get),
      extraCalories: Math.round(extraCalories),
      totalCalories: Math.round(totalCalories),
      activities: activitiesDetail,
      maintenance: Math.round(totalCalories),
      weightLoss: {
        min: Math.round(totalCalories * 0.85),
        max: Math.round(totalCalories * 0.8),
      },
      muscleGain: {
        min: Math.round(totalCalories * 1.1),
        max: Math.round(totalCalories * 1.15),
      },
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Calculadora de Gasto Energético Total (GET)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Sexo</Label>
              <Select value={gender} onValueChange={(value) => setGender(value as "male" | "female")}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Selecciona tu sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Hombre</SelectItem>
                  <SelectItem value="female">Mujer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Edad (años)</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(Number.parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                min="1"
                value={height}
                onChange={(e) => setHeight(Number.parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="activity">Nivel de actividad base</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger id="activity">
                  <SelectValue placeholder="Selecciona tu nivel de actividad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.2">Sedentario (poco o nada de ejercicio)</SelectItem>
                  <SelectItem value="1.375">Ligero (ejercicio 1-3 días/semana)</SelectItem>
                  <SelectItem value="1.55">Moderado (ejercicio 3-5 días/semana)</SelectItem>
                  <SelectItem value="1.725">Intenso (ejercicio 6-7 días/semana)</SelectItem>
                  <SelectItem value="1.9">Muy intenso (atleta o trabajo físico)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Actividades Adicionales</h3>
              <Button type="button" size="sm" onClick={handleAddActivity}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir Actividad
              </Button>
            </div>

            {activities.map((activity, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                <div className="space-y-2">
                  <Label htmlFor={`activity-type-${index}`}>Tipo</Label>
                  <Select value={activity.type} onValueChange={(value) => handleActivityChange(index, "type", value)}>
                    <SelectTrigger id={`activity-type-${index}`}>
                      <SelectValue placeholder="Tipo de actividad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walking">Caminar</SelectItem>
                      <SelectItem value="cycling">Ciclismo</SelectItem>
                      <SelectItem value="football">Fútbol</SelectItem>
                      <SelectItem value="running">Correr</SelectItem>
                      <SelectItem value="swimming">Natación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`activity-duration-${index}`}>Duración (min)</Label>
                  <Input
                    id={`activity-duration-${index}`}
                    type="number"
                    min="0"
                    value={activity.duration}
                    onChange={(e) => handleActivityChange(index, "duration", Number.parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`activity-days-${index}`}>Días/semana</Label>
                  <Input
                    id={`activity-days-${index}`}
                    type="number"
                    min="1"
                    max="7"
                    value={activity.days}
                    onChange={(e) => handleActivityChange(index, "days", Number.parseInt(e.target.value) || 0)}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveActivity(index)}
                  disabled={activities.length === 1}
                >
                  <span className="sr-only">Eliminar</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {results && (
          <div className="mt-8 p-4 bg-primary/10 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Resultados:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-background rounded-md">
                <p className="text-sm text-muted-foreground">Tasa Metabólica Basal (TMB)</p>
                <p className="text-xl font-bold">{results.bmr} kcal/día</p>
              </div>
              <div className="p-3 bg-background rounded-md">
                <p className="text-sm text-muted-foreground">Gasto por actividad base</p>
                <p className="text-xl font-bold">{results.get} kcal/día</p>
              </div>
            </div>

            {results.activities.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Actividades adicionales:</h4>
                <ul className="space-y-1">
                  {results.activities.map((activity: any, index: number) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{activity.name}:</span> {activity.calories} kcal/día (
                      {activity.details})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 p-3 bg-primary/20 rounded-md">
              <p className="text-sm text-muted-foreground">Gasto Energético Total (GET)</p>
              <p className="text-2xl font-bold">{results.totalCalories} kcal/día</p>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Recomendaciones de ingesta calórica:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="p-2 bg-background rounded-md">
                  <p className="text-xs text-muted-foreground">Mantener peso</p>
                  <p className="font-medium">{results.maintenance} kcal/día</p>
                </div>
                <div className="p-2 bg-background rounded-md">
                  <p className="text-xs text-muted-foreground">Bajar de peso (15-20% menos)</p>
                  <p className="font-medium">
                    {results.weightLoss.min} - {results.weightLoss.max} kcal/día
                  </p>
                </div>
                <div className="p-2 bg-background rounded-md">
                  <p className="text-xs text-muted-foreground">Ganar músculo (10-15% más)</p>
                  <p className="font-medium">
                    {results.muscleGain.min} - {results.muscleGain.max} kcal/día
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">* Ajusta según tu progreso semanal.</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={calculateCalories} className="w-full">
          <Calculator className="mr-2 h-4 w-4" />
          Calcular Calorías
        </Button>
      </CardFooter>
    </Card>
  )
}

