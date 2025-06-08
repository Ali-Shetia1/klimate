import { Button } from "@/components/ui/button";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { AlertTriangle, MapPin, RefreshCcw} from "lucide-react";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather";
import CurrentWeather from "@/components/current-weather";
import HourlyTemperature from "@/components/hourly-temperature";
import WeatherDetails from "@/components/weather-details";
import WeatherForecast from "@/components/weather-forecast";
import FavouriteCities from "@/components/favourite-cities";
const WeatherDashboard = () => {
  const { cordinates, error: locationError, isLoading: locationLoading, getLocation } = useGeoLocation()
  const weatherQuery = useWeatherQuery(cordinates);
  const forecastQuery = useForecastQuery(cordinates);
  const locationQuery = useReverseGeocodeQuery(cordinates);

  const handleRefresh = () => {
    getLocation();
    if (cordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };


  if (locationLoading) {
    return <WeatherSkeleton />

  }
  if (locationError) {
    return <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Location Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        {locationError}
        <Button onClick={getLocation} variant={"outline"} className="w-fit">
          <MapPin className="w-4 h-4" />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
  }
  if (!cordinates) {
    return <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Location Required</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Please enable location access to get your current weather state.</p>
        <Button onClick={getLocation} variant={"outline"} className="w-fit">
          <MapPin className="w-4 h-4" />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
  }
  const locationName = locationQuery.data?.[0];
  if (weatherQuery.error || forecastQuery.error) {
    return <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Failed to fetch weather data. Please try again.</p>
        <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
          <RefreshCcw className="w-4 h-4" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>

  }
  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />
  }

  return (
    <>
      <div className="space-y-4">
      <FavouriteCities />
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">{locationName?.name}</h1>
          <div className="flex justify-between gap-10">
            <Button variant={"outline"} size={"icon"} onClick={handleRefresh} disabled={weatherQuery.isFetching || forecastQuery.isFetching}>
              <RefreshCcw className={`h-4 w-4 ${weatherQuery.isFetching || forecastQuery.isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>

        </div>

        <div className="grid grid-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <CurrentWeather data={weatherQuery.data} locationName={locationName} />
            <HourlyTemperature data={forecastQuery.data} />
          </div>
          <div className="grid md:grid-cols-2 items-start gap-6 mt-7">
            <WeatherDetails data={weatherQuery.data} />
            <WeatherForecast data={forecastQuery.data} />
          </div>
        </div>
      </div>
    </>
  )
}

export default WeatherDashboard;