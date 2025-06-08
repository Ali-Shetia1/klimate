import type { ForecastData } from "@/api/types"
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number,
  temp_min: number,
  temp_max: number,
  humidity: number,
  wind: number,
  weather: {
    id: number,
    main: string,
    description: string,
    icon: string,
  }
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;
  const dailyForecast = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: Math.round(forecast.wind.speed * 10) / 10,
        weather: forecast.weather[0],
        date: forecast.dt,
      }
    }
    else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }
    return acc;
  }, {} as Record<string, DailyForecast>)
  const nextDays = Object.values(dailyForecast).slice(0, 5)
  return (
    <Card className='flex-1 py-7'>
      <CardHeader>
        <CardTitle className='text-xl font-bold'>Weather Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nextDays.map((day) => {
            return (
              <div key={day.date} className="grid grid-cols-3 border p-4 rounded-lg gap-4">
                <div>
                  <p className="font-medium">{format(new Date(day.date * 1000), "EEE, MMM d")}</p>
                  <span className="text-muted-foreground text-sm capitalize">{day.weather.description}</span>
                </div>
                <div className='flex justify-center gap-4'>
                  <span className="flex mr-1 items-center text-blue-500">
                    <ArrowDown className='h-4 w-4' />
                    {formatTemp(day.temp_min)}
                  </span>
                  <span className="flex mr-1 items-center text-red-500">
                    <ArrowUp className='h-4 w-4' />
                    {formatTemp(day.temp_max)}
                  </span>
                </div>
                <div className="flex justify-end gap-4">
                  <div className="flex items-center gap-1">
                    <Droplets className='text-blue-500 w-6 h-6' />
                    <p className='text-sm text-muted-foreground'>{day.humidity}%</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className='text-blue-500 w-6 h-6' />
                    <p className='text-sm text-muted-foreground min-w-[25px]'>{day.wind}%</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default WeatherForecast