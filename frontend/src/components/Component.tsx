"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sun, Moon, Thermometer, Droplets, Wind, Zap, Shield, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

// Datos simulados para los parámetros
const generateMockData = () => ({
  pm25: Math.floor(Math.random() * 100) + 10,
  ozone: Math.floor(Math.random() * 200) + 50,
  uvRadiation: Math.floor(Math.random() * 11) + 1,
  temperature: Math.floor(Math.random() * 15) + 20,
  humidity: Math.floor(Math.random() * 40) + 40,
})

// Función para determinar el estado de calidad del aire
const getAirQualityStatus = (value: number, type: string) => {
  switch (type) {
    case "pm25":
      if (value <= 12) return { status: "Bueno", color: "bg-green-500", textColor: "text-green-700" }
      if (value <= 35) return { status: "Moderado", color: "bg-yellow-500", textColor: "text-yellow-700" }
      if (value <= 55) return { status: "Insalubre", color: "bg-orange-500", textColor: "text-orange-700" }
      return { status: "Peligroso", color: "bg-red-500", textColor: "text-red-700" }
    case "ozone":
      if (value <= 100) return { status: "Bueno", color: "bg-green-500", textColor: "text-green-700" }
      if (value <= 160) return { status: "Moderado", color: "bg-yellow-500", textColor: "text-yellow-700" }
      return { status: "Insalubre", color: "bg-red-500", textColor: "text-red-700" }
    case "uv":
      if (value <= 2) return { status: "Bajo", color: "bg-green-500", textColor: "text-green-700" }
      if (value <= 5) return { status: "Moderado", color: "bg-yellow-500", textColor: "text-yellow-700" }
      if (value <= 7) return { status: "Alto", color: "bg-orange-500", textColor: "text-orange-700" }
      return { status: "Extremo", color: "bg-red-500", textColor: "text-red-700" }
    default:
      return { status: "Normal", color: "bg-blue-500", textColor: "text-blue-700" }
  }
}

// Componente para medidor circular
const CircularGauge = ({
  value,
  max,
  color,
  size = 120,
}: { value: number; max: number; color: string; size?: number }) => {
  const percentage = (value / max) * 100
  const data = [
    { name: "value", value: percentage },
    { name: "remaining", value: 100 - percentage },
  ]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.3}
            outerRadius={size * 0.45}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  )
}

// Componente para cada parámetro ambiental
const EnvironmentalCard = ({
  title,
  value,
  unit,
  icon: Icon,
  max,
  color,
  type,
  trend,
}: {
  title: string
  value: number
  unit: string
  icon: any
  max: number
  color: string
  type: string
  trend?: "up" | "down" | "stable"
}) => {
  const status = getAirQualityStatus(value, type)

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Icon className="h-6 w-6" />
            <span>{title}</span>
          </div>
          {trend && (
            <TrendIcon
              className={`h-5 w-5 ${
                trend === "up" ? "text-red-500" : trend === "down" ? "text-green-500" : "text-gray-500"
              }`}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <CircularGauge value={value} max={max} color={color} size={100} />
        </div>

        <div className="text-center space-y-2">
          <div className="text-3xl font-bold">
            {value} <span className="text-lg font-normal text-muted-foreground">{unit}</span>
          </div>

          <Badge variant="secondary" className={`${status.color} text-white text-sm px-3 py-1`}>
            {status.status}
          </Badge>
        </div>

        <Progress value={(value / max) * 100} className="h-2" />
      </CardContent>
    </Card>
  )
}

export default function Component() {
  const [isDark, setIsDark] = useState(false)
  const [data, setData] = useState(generateMockData())

  // Simular actualización de datos cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Toggle tema
  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${isDark ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Monitor Ambiental</h1>
            <p className="text-muted-foreground text-lg">Monitoreo en tiempo real de parámetros medioambientales</p>
          </div>

          <Button onClick={toggleTheme} variant="outline" size="lg" className="h-12 w-12 bg-transparent">
            {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
        </div>

        {/* Timestamp */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">Última actualización: {new Date().toLocaleString("es-ES")}</div>
              <Badge variant="outline" className="text-sm px-3 py-1">
                Actualizando cada 5s
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Grid de parámetros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EnvironmentalCard
            title="PM 2.5"
            value={data.pm25}
            unit="μg/m³"
            icon={Wind}
            max={100}
            color="#ef4444"
            type="pm25"
            trend="up"
          />

          <EnvironmentalCard
            title="Ozono"
            value={data.ozone}
            unit="μg/m³"
            icon={Shield}
            max={250}
            color="#f59e0b"
            type="ozone"
            trend="stable"
          />

          <EnvironmentalCard
            title="Radiación UV"
            value={data.uvRadiation}
            unit="Índice"
            icon={Zap}
            max={11}
            color="#8b5cf6"
            type="uv"
            trend="down"
          />

          <EnvironmentalCard
            title="Temperatura"
            value={data.temperature}
            unit="°C"
            icon={Thermometer}
            max={50}
            color="#06b6d4"
            type="temperature"
            trend="up"
          />

          <EnvironmentalCard
            title="Humedad"
            value={data.humidity}
            unit="%"
            icon={Droplets}
            max={100}
            color="#10b981"
            type="humidity"
            trend="stable"
          />
        </div>

        {/* Resumen de calidad del aire */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Resumen de Calidad del Aire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-green-600">Bueno</div>
                <div className="text-sm text-muted-foreground">Estado general</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{Math.round((data.pm25 + data.ozone / 2.5) / 2)}</div>
                <div className="text-sm text-muted-foreground">Índice AQI</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-blue-600">Seguro</div>
                <div className="text-sm text-muted-foreground">Para actividades</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
