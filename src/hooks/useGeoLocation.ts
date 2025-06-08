import type { Cordintes } from "@/api/types"
import { useEffect, useState } from "react"

interface GeoLocationData {
    cordinates: Cordintes | null,
    error: string | null,
    isLoading: boolean
}
export function useGeoLocation () {
    const [locationData, setLocationData] = useState<GeoLocationData>({
        cordinates: null,
        error: null,
        isLoading: true,
    });

    const getLocation = () => {
        setLocationData((prev) => ({...prev, isLoading: true, error: null}));
        if(!navigator.geolocation) {
            setLocationData ({
                cordinates: null,
                error: "Geolocation is not supported by your browser",
                isLoading: false
            });
            return;
        }
        navigator.geolocation.getCurrentPosition((position) => {
            setLocationData({
                cordinates:{
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                },
                error: null,
                isLoading: false,
            });
        }, (error) => {
            let errorMessage: string;
            switch(error.code){
                case error.PERMISSION_DENIED:
                    errorMessage = "Location permission denied. Please enable location access.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable;";
                    break;
                case error.TIMEOUT:
                    errorMessage = "Location request time out.";
                    break;
                default:
                    errorMessage = "An unknown error occured;";
            }
            setLocationData({
                cordinates: null,
                error: errorMessage,
                isLoading: false,
            })
        });
    };

    useEffect(() => {
        getLocation();
    }, [])

    return {
        ...locationData,
        getLocation,
    }
}