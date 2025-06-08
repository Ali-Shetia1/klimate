import { Link } from 'react-router-dom'
import { useTheme } from './theme-provider'
import { Moon, Sun } from 'lucide-react';
import CitySearch from './city-search';

const Header = () => {
  const {theme, setTheme} = useTheme();
  const isDark = theme === "dark";
  return (
    <header className='sticky z-50 top-0 w-full bg-background/95 border-b backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex items-center justify-between h-16 px-4 '>
        <Link to={'/'}>
          <img src={isDark ? "logo.png" : "logo2.png"} alt="Klimate logo" className='h-14'/>
        </Link>
        <div className='flex gap-10 items-center'>
          <CitySearch />
          <div className={`flex items-center cursor-pointer transition-transform ${isDark ? "rotate-180" : "rotate-0"}`} onClick={() => setTheme(isDark ? "light" : "dark")}>
            {isDark ? (<Sun className='w-6 h-6 text-yellow-500 rotate-0 transition-all duration-500' />) : (<Moon className='w-6 h-6 text-blue-500 rotate-0 transition-all duration-500' />)}
          </div>
        </div>
      </div>
    </header>
  )
}
export default Header