import CurrentWeather from "@/components/current-weather";
import FavouriteButton from "@/components/favourite-button";
import HourlyTemperature from "@/components/hourly-temperature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import WeatherDetails from "@/components/weather-details";
import WeatherForecast from "@/components/weather-forecast";
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle, MapPin, RefreshCcw} from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom"


const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const cordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(cordinates);
  const forecastQuery = useForecastQuery(cordinates);
  const locationQuery = useReverseGeocodeQuery(cordinates);
  const locationName = locationQuery.data?.[0];

  const handleRefresh = () => {
    if (cordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };
  if (!cordinates) {
    return <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Location Required</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Please enable location access to get your current weather state.</p>
        <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
          <MapPin className="w-4 h-4" />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
  }
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
  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />
  }
  return (
    <>
      <div className="space-y-4">
        <div className="text-right">
          <FavouriteButton data={{ ...weatherQuery.data, name: params.cityName }}/>
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

export default CityPage