import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
//import { Progress } from "@/components/ui/progress"
import {Sun, Moon, Thermometer, Droplets, TrendingUp, TrendingDown, Minus, Bubbles} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Cell
} from "recharts";

// Datos simulados para los parámetros
const generateMockData = () => ({
  pm25: 71,
  pm10: 43,
  ozone: 0.02,
  uvRadiation: 4,
  temperature: 19,
  humidity: 77,
})

// Generar datos históricos de las últimas 24 horas
const generateHistoricalData = () => {
  const data = []
  const now = new Date()
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    time.setMinutes(0, 0, 0);  // minutos=0, segundos=0, ms=0
    data.push({
      time: time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      pm25: Math.random() * 10 + 50,
      pm10: Math.random() * 20 + 20,
      ozone: Math.random() * 0.02 + 0.02,
      uvRadiation: Math.random() * 1 + 3,
    })
  }
  
  return data
}

// Función para determinar el estado de calidad del aire basada en la imagen
const getAirQualityStatus = (value: number, type: string) => {
  let ranges: number[]

  switch (type) {
    case "pm25":
      ranges = [6, 12, 35.4, 55.4, 150.4] //ug/m3
      break
    case "pm10":
      ranges = [27, 54, 154, 254, 354] //ug/m3
      break
    case "ozone":
      ranges = [0.027, 0.054, 0.070, 0.085, 0.105] //ppb
      break
    case "uv":
      ranges = [2, 5, 7, 10, 11] //Bajo, Moderado, Alto, Muy alto, Extremo
      if (value <= ranges[0])
        return { status: "Bajo", color: "bg-[#43d256]", textColor: "text-[#43d256]", bgColor: "#43d256" }
      if (value <= ranges[1])
        return { status: "Moderado", color: "bg-[#fdc12b]", textColor: "text-[#fdc12b]", bgColor: "#fdc12b" }
      if (value <= ranges[2])
        return { status: "Alto", color: "bg-orange-500", textColor: "text-orange-700", bgColor: "#f97316" }
      if (value <= ranges[3])
        return { status: "Muy alto", color: "bg-[#e9365a]", textColor: "text-[#e9365a]", bgColor: "#e9365a" }
      if (value <= ranges[4])
        return { status: "Extremo", color: "bg-[#a928d4]", textColor: "text-[#a928d4]", bgColor: "#a928d4" }
      return { status: "Extremo", color: "bg-[#a928d4]", textColor: "text-[#a928d4]", bgColor: "#a928d4" }
      break
    default:
      return { status: "Normal", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "#3b82f6" }
  }

  if (value <= ranges[0])
    return { status: "Excelente", color: "bg-[#1ccffe]", textColor: "text-[#1ccffe]", bgColor: "#1ccffe" }
  if (value <= ranges[1])
    return { status: "Buena", color: "bg-[#43d256]", textColor: "text-[#43d256]", bgColor: "#43d256" }
  if (value <= ranges[2])
    return { status: "Mala", color: "bg-[#fdc12b]", textColor: "text-[#fdc12b]", bgColor: "#fdc12b" }
  if (value <= ranges[3])
    return { status: "Poco saludable", color: "bg-[#e9365a]", textColor: "text-[#e9365a]", bgColor: "#e9365a" }
  if (value <= ranges[4])
    return { status: "Muy poco saludable", color: "bg-[#a928d4]", textColor: "text-[#a928d4]", bgColor: "#a928d4" }
  return { status: "Peligrosa", color: "bg-[#6a0aff]", textColor: "text-[#6a0aff]", bgColor: "#6a0aff" }
}

// Componente para medidor circular con puntos (basado en la imagen)
const CircularGaugeWithDots = ({
  value,
  max,
  type,
  size = 140,
}: { value: number; max: number; type: string; size?: number }) => {
  const status = getAirQualityStatus(value, type)
  const percentage = Math.min((value / max) * 100, 100)
  const totalDots = 32 // Número total de puntos alrededor del círculo
  const activeDots = Math.round((percentage / 100) * totalDots)

  // Función para obtener la unidad correspondiente
  const getUnit = (type: string) => {
    switch (type) {
      case "pm25":
      case "pm10":
        return "μg/m³"
      case "ozone":
        return "ppb"
      case "uv":
        return "Índice"
      default:
        return "AQI"
    }
  }

  const dots = []
  for (let i = 0; i < totalDots; i++) {
    const angle = (i * 360) / totalDots - 90 // -90 para empezar desde arriba
    const radian = (angle * Math.PI) / 180
    
    // Radio exterior (círculo más grande)
    const radiusOuter = size * 0.35
    const xOuter = Math.cos(radian) * radiusOuter + size / 2
    const yOuter = Math.sin(radian) * radiusOuter + size / 2
    
    // Radio interior (círculo más pequeño)
    const radiusInner = size * 0.3
    const xInner = Math.cos(radian) * radiusInner + size / 2
    const yInner = Math.sin(radian) * radiusInner + size / 2

    // Punto exterior (más pequeño)
    dots.push(
      <circle
        key={`outer-${i}`}
        cx={xOuter}
        cy={yOuter}
        r={i < activeDots ? 2.5 : 2.5}
        fill={i < activeDots ? status.bgColor : "#e5e7eb"}
        className="transition-all duration-300"
      />,
    )
    
    // Punto interior (más grande)
    dots.push(
      <circle
        key={`inner-${i}`}
        cx={xInner}
        cy={yInner}
        r={i < activeDots ? 2.5 : 2.5}
        fill={i < activeDots ? status.bgColor : "#e5e7eb"}
        className="transition-all duration-300"
        opacity={i < activeDots ? 0.8 : 0.8}
      />,
    )
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute">
        {dots}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-xl text-muted-foreground tracking-wide">{getUnit(type)}</div>
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
  type,
  trend,
}: {
  title: string
  value: number
  unit: string
  icon: any
  max: number
  type: string
  trend?: "up" | "down" | "stable"
}) => {
  const status = getAirQualityStatus(value, type)
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-xl text-gray-900 dark:text-slate-100">
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
      <CardContent className="space-y-2">
        <div className="flex items-center justify-center">
          <CircularGaugeWithDots value={value} max={max} type={type} size={200} />
        </div>

        <div className="text-center space-y-2">
          <Badge variant="secondary" className={`${status.color} text-white text-sm px-3 py-1`}>
            {status.status}
          </Badge>
        </div>

        {/*<Progress value={(value / max) * 100} className="h-2" />*/}
      </CardContent>
    </Card>
  )
}

// Componente especial para temperatura y humedad (sin escala AQI)
const ClimateCard = ({
  title,
  value,
  unit,
  icon: Icon,
  color,
  trend,
}: {
  title: string
  value: number
  unit: string
  icon: any
  color: string
  trend?: "up" | "down" | "stable"
}) => {
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
                trend === "up" ? "text-red-500" : trend === "down" ? "text-blue-500" : "text-gray-500"
              }`}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <div
            className="relative flex items-center justify-center rounded-full border-4"
            style={{
              width: 120,
              height: 120,
              borderColor: color,
              backgroundColor: `${color}10`,
            }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold">{value}{unit}</div>
              {/*<div className="text-xs text-muted-foreground uppercase tracking-wide">{unit}</div>*/}
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          {/*<div className="text-2xl font-bold">
            {value} <span className="text-base font-normal text-muted-foreground">{unit}</span>
          </div>*/}

          {/*<Badge variant="outline" className="text-sm px-3 py-1">
            Normal
          </Badge>*/}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para tarjetas pequeñas de clima en el header
const ClimateMiniCard = ({
  title,
  value,
  unit,
  icon: Icon,
  color,
}: {
  title: string
  value: number
  unit: string
  icon: any
  color: string
}) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 shadow-sm">
      <div 
        className="flex items-center justify-center w-10 h-10 rounded-full"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color: color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-600 dark:text-slate-300">{title}</div>
        <div className="text-lg font-bold" style={{ color: color }}>
          {value}{unit}
        </div>
      </div>
    </div>
  )
}

// Definimos la forma personalizada de la barra
const RoundedBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  const radius = 4; // radio superior
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={radius}
        ry={radius}
      />
    </g>
  );
};

// Tooltip personalizado para el BarChart
const CustomBarTooltip = ({
  active,
  payload,
  label,
  parameter,
  type,
  unit,
  data,
}: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const status = getAirQualityStatus(value, type);
    const entry = data.find((d: any) => d.time === label);
    const dateStr = entry?.date ? `${entry.date} ${label}` : label;

    // Formateo de decimales según parámetro
    let formattedValue = value;
    if (parameter === "ozone") {
      formattedValue = value.toFixed(3);
    } else if (parameter === "uvRadiation") {
      formattedValue = Math.round(value);
    } else {
      formattedValue = value.toFixed(1);
    }

    return (
      <div className="rounded-lg shadow-lg px-4 py-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 min-w-[140px] text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: status.bgColor }} />
          <span className="font-bold text-lg text-gray-900 dark:text-slate-100">{formattedValue}</span>
          <span className="text-xs text-gray-600 dark:text-slate-300">{unit}</span>
        </div>
        <div className="text-sm font-medium mb-1" style={{ color: status.bgColor }}>{status.status}</div>
        <div className="text-xs text-gray-500 dark:text-slate-400">{dateStr}</div>
      </div>
    );
  }
  return null;
};

// Componente para gráfico de barras histórico
const HistoricalBarChart = ({
  data,
  parameter,
  title,
  unit,
  max,
  type,
}: {
  data: any[];
  parameter: string;
  title: string;
  unit: string;
  max: number;
  type: string;
}) => {
  return (
    <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-slate-100">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
            <XAxis dataKey="time" stroke="#6b7280" strokeOpacity={0.7} />
            <YAxis domain={[0, max]} stroke="#6b7280" strokeOpacity={0.7} />
            <Tooltip
              content={({ active, payload, label }) =>
                <CustomBarTooltip
                  active={active}
                  payload={payload}
                  label={label}
                  parameter={parameter}
                  type={type}
                  unit={unit}
                  data={data}
                />
              }
            />
            <Bar
              dataKey={parameter}
              shape={<RoundedBar />}
            >
              {data.map((entry, index) => {
                const status = getAirQualityStatus(entry[parameter], type);
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={status.bgColor}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Componente para escala de parámetros
const ParameterScaleCard = ({
  title,
  ranges,
  colors,
  units,
}: {
  title: string
  ranges: { min: number; max: number; status: string; color: string }[]
  colors: string[]
  units: string
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ranges.map((range, index) => (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              <div className="flex-1">
                <div className="font-medium" style={{ color: colors[index] }}>
                  {range.status}
                </div>
                <div className="text-sm text-muted-foreground">
                  {range.min} - {range.max} {units}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para tabla de escalas de calidad del aire
const AirQualityScaleTable = () => {
  const statuses = [
    { status: "Excelente", color: "#1ccffe" },
    { status: "Buena", color: "#43d256" },
    { status: "Mala", color: "#fdc12b" },
    { status: "Poco saludable", color: "#e9365a" },
    { status: "Muy poco saludable", color: "#a928d4" },
    { status: "Peligrosa", color: "#6a0aff" },
  ]

  const ranges = {
    pm25: [6, 12, 35.4, 55.4, 150.4],
    pm10: [27, 54, 154, 254, 354],
    ozone: [0.027, 0.054, 0.070, 0.085, 0.105],
  }

  return (
    <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 dark:text-slate-100">Escalas de Calidad del Aire</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 font-medium text-md text-gray-900 dark:text-slate-100">Estado</th>
                <th className="text-center py-2 px-3 font-medium text-md text-gray-900 dark:text-slate-100">PM 2.5 (μg/m³)</th>
                <th className="text-center py-2 px-3 font-medium text-md text-gray-900 dark:text-slate-100">PM 10 (μg/m³)</th>
                <th className="text-center py-2 px-3 font-medium text-md text-gray-900 dark:text-slate-100">Ozono (ppb)</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map((status, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-slate-700">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="font-medium text-md" style={{ color: status.color }}>
                        {status.status}
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-3 text-gray-600 dark:text-slate-300">
                    {index === 0 ? `0 - ${ranges.pm25[index]}` : 
                     index === ranges.pm25.length ? `${ranges.pm25[index-1]}+` :
                     `${ranges.pm25[index-1]} - ${ranges.pm25[index]}`}
                  </td>
                  <td className="text-center py-3 px-3 text-gray-600 dark:text-slate-300">
                    {index === 0 ? `0 - ${ranges.pm10[index]}` : 
                     index === ranges.pm10.length ? `${ranges.pm10[index-1]}+` :
                     `${ranges.pm10[index-1]} - ${ranges.pm10[index]}`}
                  </td>
                  <td className="text-center py-3 px-3 text-gray-600 dark:text-slate-300">
                    {index === 0 ? `0 - ${ranges.ozone[index]}` : 
                     index === ranges.ozone.length ? `${ranges.ozone[index-1]}+` :
                     `${ranges.ozone[index-1]} - ${ranges.ozone[index]}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para escala de parámetros UV horizontal
const UVScaleCard = () => {
  const uvRanges = [
    { min: 0, max: 2, status: "Bajo", color: "#43d256" },
    { min: 2, max: 5, status: "Moderado", color: "#fdc12b" },
    { min: 5, max: 7, status: "Alto", color: "#f97316" },
    { min: 7, max: 10, status: "Muy alto", color: "#e9365a" },
    { min: 10, max: 11, status: "Extremo", color: "#a928d4" },
  ]

  return (
    <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-slate-100">Radiación UV</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          {uvRanges.map((range, index) => (
            <div key={index} className="flex flex-col items-center text-center flex-1">
              <div 
                className="w-full h-4 rounded-sm mb-2"
                style={{ backgroundColor: range.color }}
              />
              <div className="font-medium text-sm" style={{ color: range.color }}>
                {range.status}
              </div>
              <div className="text-xs text-gray-600 dark:text-slate-300">
                {range.min} - {range.max}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Component() {
  const [isDark, setIsDark] = useState(false)
  const [data, setData] = useState(generateMockData())
  const [historicalData, setHistoricalData] = useState(generateHistoricalData())
  const [activeTab, setActiveTab] = useState("parametros")

  // Simular actualización de datos cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData())
      setHistoricalData(generateHistoricalData())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Toggle tema
  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  // Definir escalas de parámetros
  const airQualityRanges = [
    { min: 0, max: 6, status: "Excelente", color: "#1ccffe" },
    { min: 6, max: 12, status: "Buena", color: "#43d256" },
    { min: 12, max: 35.4, status: "Mala", color: "#fdc12b" },
    { min: 35.4, max: 55.4, status: "Poco saludable", color: "#e9365a" },
    { min: 55.4, max: 150.4, status: "Muy poco saludable", color: "#a928d4" },
    { min: 150.4, max: 500, status: "Peligrosa", color: "#6a0aff" },
  ]

  const uvRanges = [
    { min: 0, max: 2, status: "Bajo", color: "#43d256" },
    { min: 2, max: 5, status: "Moderado", color: "#fdc12b" },
    { min: 5, max: 7, status: "Alto", color: "#f97316" },
    { min: 7, max: 10, status: "Muy alto", color: "#e9365a" },
    { min: 10, max: 11, status: "Extremo", color: "#a928d4" },
  ]

  const airQualityColors = ["#1ccffe", "#43d256", "#fdc12b", "#e9365a", "#a928d4", "#6a0aff"]
  const uvColors = ["#43d256", "#fdc12b", "#f97316", "#e9365a", "#a928d4"]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "dark bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700" : "bg-gradient-to-br from-blue-50 via-white to-green-50"}`}>
      {/* Header moderno con gradiente */}
      <div className="relative overflow-hidden">
        {/* Fondo degradado: verde en claro, acero oscuro en oscuro */}
        <div
          className={`
            absolute inset-0
            bg-gradient-to-r from-green-600 via-green-400 to-green-300 opacity-80
            dark:bg-gradient-to-r dark:from-[#1e293b] dark:via-[#334155] dark:to-[#475569] dark:opacity-90
          `}
        ></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                Monitoreo Medioambiental
              </h1>
            </div>

            <Button 
              onClick={toggleTheme} 
              variant="outline" 
              size="lg" 
              className="h-12 w-12 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
          </div>

          {/* Tarjetas de clima en el header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ClimateMiniCard
              title="Temperatura"
              value={data.temperature}
              unit="°C"
              icon={Thermometer}
              color="#10b981"
            />
            <ClimateMiniCard
              title="Humedad"
              value={data.humidity}
              unit="%"
              icon={Droplets}
              color="#10b981"
            />
            <div className="hidden md:block"></div>
            <div className="hidden md:block"></div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 pb-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50">
            <TabsTrigger value="parametros" className="text-base data-[state=active]:bg-green-500 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-white">Parámetros críticos</TabsTrigger>
            <TabsTrigger value="escalas" className="text-base data-[state=active]:bg-green-500 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-white">Escalas de parámetros</TabsTrigger>
            <TabsTrigger value="historicos" className="text-base data-[state=active]:bg-green-500 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-white">Niveles históricos</TabsTrigger>
          </TabsList> 

          <div className="h-[calc(100vh-300px)] overflow-y-auto scrollbar-hide">
            <TabsContent value="parametros" className="space-y-6">
              {/* Grid de parámetros - solo los 4 principales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <EnvironmentalCard
                  title="Material particulado 2.5"
                  value={data.pm25}
                  unit="μg/m³"
                  icon={Bubbles}
                  max={150.4}
                  type="pm25"
                />

                <EnvironmentalCard
                  title="Material particulado 10"
                  value={data.pm10}
                  unit="μg/m³"
                  icon={Bubbles}
                  max={354}
                  type="pm10"
                />

                <EnvironmentalCard
                  title="Ozono troposférico"
                  value={data.ozone}
                  unit="ppb"
                  icon={Bubbles}
                  max={0.105}
                  type="ozone"
                />

                <EnvironmentalCard
                  title="Índice de radiación UV"
                  value={data.uvRadiation}
                  unit="Índice"
                  icon={Sun}
                  max={11}
                  type="uv"
                />
              </div>
            </TabsContent>

            <TabsContent value="escalas" className="space-y-6">
              <AirQualityScaleTable />
              <UVScaleCard />
            </TabsContent>

            <TabsContent value="historicos" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <HistoricalBarChart
                  data={historicalData}
                  parameter="pm25"
                  title="Historial PM 2.5"
                  unit="μg/m³"
                  max={150.4}
                  type="pm25"
                />
                <HistoricalBarChart
                  data={historicalData}
                  parameter="pm10"
                  title="Historial PM 10"
                  unit="μg/m³"
                  max={354}
                  type="pm10"
                />
                <HistoricalBarChart
                  data={historicalData}
                  parameter="ozone"
                  title="Historial Ozono"
                  unit="ppb"
                  max={0.105}
                  type="ozone"
                />
                <HistoricalBarChart
                  data={historicalData}
                  parameter="uvRadiation"
                  title="Historial índice UV"
                  unit="Índice"
                  max={11}
                  type="uv"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
