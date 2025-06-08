import { API_CONFIG } from "./config";
import type { Cordintes, ForecastData, GeocodingResponse, WeatherData } from "./types";

export class WeatherAPI {
    private createUrl(endPoint: string, params: Record<string, string | number>) {
        const searchParams = new URLSearchParams({
            appid: API_CONFIG.API_KEY,
            ...params
        });
        return `${endPoint}?${searchParams.toString()}`;
    }
    private async fetchData<T>(url: string): Promise<T> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather APi Error: ${response.statusText}`);
        }
        return response.json();
    }
    async getCurrentWeather({ lat, lon }: Cordintes): Promise<WeatherData> {
        const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
            lat: lat.toString(),
            lon: lon.toString(),
            units: API_CONFIG.DEFAULT_PARAMS.units,
        });
        return this.fetchData<WeatherData>(url);
    }
    async getCurrentForecast({ lat, lon }: Cordintes): Promise<ForecastData> {
        const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
            lat: lat.toString(),
            lon: lon.toString(),
            units: API_CONFIG.DEFAULT_PARAMS.units,
        });
        return this.fetchData<ForecastData>(url);
    }
    async reverseGeocode({ lat, lon }: Cordintes): Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIG.GEO}/reverse`, {
            lat: lat.toString(),
            lon: lon.toString(),
            units: API_CONFIG.DEFAULT_PARAMS.units,
            limit: 1,
        });
        return this.fetchData<GeocodingResponse[]>(url);
    }
    async searchLocations(query: string): Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIG.GEO}/direct`, {
            q: query,
            limit: 3,
        });
        return this.fetchData<GeocodingResponse[]>(url);
    }
}

export const weatherAPI = new WeatherAPI();
