import { HashRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './components/theme-provider'
import Layout from './components/layout'
import WeatherDashboard from './pages/weather-dashboard'
import CityPage from './pages/city-page'
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {Toaster} from 'sonner'
const queryClint = new QueryClient();


function App() {
  return (
    <>
      <QueryClientProvider client={queryClint}>
        <HashRouter>
          <ThemeProvider defaultTheme="light">
            <Layout>
              <Routes>
                <Route path='/' element={<WeatherDashboard />} />
                <Route path='/city/:cityName' element={<CityPage />} />
              </Routes>
            </Layout>
            <Toaster richColors/>
          </ThemeProvider>
        </HashRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>



    </>
  )
}

export default App
