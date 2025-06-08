import type { Cordintes } from "@/api/types";
import { weatherAPI } from "@/api/weather-api";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_KEYS = {
    weather: (coords: Cordintes) => ["weather", coords] as const,
    forecast: (coords: Cordintes) => ["forecast", coords] as const,
    location: (coords: Cordintes) => ["location", coords] as const,
    search: (query: string) => ["location-search", query] as const,
} as const

export function useWeatherQuery (cordinates: Cordintes | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.weather(cordinates ?? {lat: 0, lon:0}),
        queryFn: () => cordinates ? weatherAPI.getCurrentWeather(cordinates) : null,
        enabled: !!cordinates,
    });
};

export function useForecastQuery (cordinates: Cordintes | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.forecast(cordinates ?? {lat: 0, lon: 0}),
        queryFn: () => cordinates ? weatherAPI.getCurrentForecast(cordinates) : null,
        enabled: !!cordinates,
    });
};

export function useReverseGeocodeQuery (cordinates: Cordintes | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.location(cordinates ?? {lat: 0, lon: 0}),
        queryFn: () => cordinates ? weatherAPI.reverseGeocode(cordinates) : null,
        enabled: !!cordinates,
    })
}

export function useLocationsSearch (query: string) {
    return useQuery({
        queryKey: WEATHER_KEYS.search(query),
        queryFn: () => weatherAPI.searchLocations(query),
        enabled: query.length >= 3,
    })
}
