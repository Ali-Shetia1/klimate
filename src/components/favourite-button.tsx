import { Star } from 'lucide-react'
import { Button } from './ui/button'
import { useFavourites } from '@/hooks/use-favourites'
import type { WeatherData } from '@/api/types'
import { toast } from 'sonner'
interface FavouriteButtonProps {
    data: WeatherData
}

const FavouriteButton = ({data}: FavouriteButtonProps) => {
    const {addFavourite, removeFavourite, isFavourite} = useFavourites();
    const isCurrentlyFavourite = isFavourite(data.coord.lat, data.coord.lon);
    const handleToggleFavourites = () => {
        if (isCurrentlyFavourite) {
            removeFavourite.mutate(`${data.coord.lat}-${data.coord.lon}`);
            toast.error(`${data.name} city was removed from favourites`, {
                icon: '🗑️',
                duration: 3000,
            });
        } else {
            addFavourite.mutate({
                lat: data.coord.lat,
                lon: data.coord.lon,
                name: data.name,
                country: data.sys.country
            })
            toast.success(`${data.name} city was successfully added to favourites`, {
                duration: 3000,
            })
        }
    }
  return (
    <>
        <Button variant={"outline"} size={"icon"} onClick={handleToggleFavourites} className={`${isCurrentlyFavourite ? "text-yellow-500 hover:text-yellow-600" : ""}`}>
            <Star className={`h4 w-4 ${isCurrentlyFavourite ? "fill-current" : ""}`}/>
        </Button>
    </>
  )
}

export default FavouriteButton