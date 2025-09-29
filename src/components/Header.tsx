import { Calendar, User, Calculator, Map, UserCircle, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card"
import StarBorder from './StarBorder'
import { useAuth } from '../hooks/useAuth'

export function Header() {
  const { isAuthenticated, logout, user } = useAuth();

  // Debug: Ver qué datos del usuario tenemos
  console.log('🔍 Header - Datos del usuario:', {
    isAuthenticated,
    user,
    userFromLocalStorage: localStorage.getItem('user'),
    tokenFromLocalStorage: localStorage.getItem('authToken')
  });

  return (
    <header className="relative bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-3">
      <div className="relative z-20 flex items-center justify-between w-full mx-auto">
        {/* Logo */}
        <div className="flex items-center pb-3.5">
          <h1 className="text-2xl font-bold text-black tracking-wider">
            FITLIFE
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-8">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link to="/mi-rutina" className="flex flex-col items-center space-y-1 px-4 py-2 cursor-pointer transition-all duration-200 hover:scale-110 group">
                <div className="flex items-center space-x-2">
                  <Calendar size={20} className="text-black" />
                  <span className="text-black font-medium">Mi rutina</span>
                </div>
                <div className="h-0.5 w-0 bg-black transition-all duration-200 group-hover:w-full"></div>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Mi rutina</h4>
                <p className="text-sm text-gray-600">
                  Crea y personaliza tu rutina de ejercicios diaria. Registra tus entrenamientos, 
                  establece metas y sigue tu progreso a lo largo del tiempo.
                </p>
                <div className="flex items-center pt-2">
                  <Calendar className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-xs text-gray-500">
                    Planifica tus entrenamientos semanales
                  </span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Link to="/meditacion" className="flex flex-col items-center space-y-1 px-4 py-2 cursor-pointer transition-all duration-200 hover:scale-110 group">
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-black" />
                  <span className="text-black font-medium">Meditación</span>
                </div>
                <div className="h-0.5 w-0 bg-black transition-all duration-200 group-hover:w-full"></div>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Meditación</h4>
                <p className="text-sm text-gray-600">
                  Encuentra tu paz interior con sesiones de meditación guiada. 
                  Reduce el estrés, mejora tu concentración y bienestar mental.
                </p>
                <div className="flex items-center pt-2">
                  <User className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-xs text-gray-500">
                    Sesiones de 5 a 60 minutos disponibles
                  </span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Link to="/calculadora" className="flex flex-col items-center space-y-1 px-4 py-2 cursor-pointer transition-all duration-200 hover:scale-110 group">
                <div className="flex items-center space-x-2">
                  <Calculator size={20} className="text-black" />
                  <span className="text-black font-medium">Calculadora</span>
                </div>
                <div className="h-0.5 w-0 bg-black transition-all duration-200 group-hover:w-full"></div>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Calculadora</h4>
                <p className="text-sm text-gray-600">
                  Herramientas útiles para tu salud: calcula tu IMC, calorías diarias, 
                  porcentaje de grasa corporal y más métricas importantes.
                </p>
                <div className="flex items-center pt-2">
                  <Calculator className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-xs text-gray-500">
                    BMI, calorías, macronutrientes y más
                  </span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Link to="/mapa" className="flex flex-col items-center space-y-1 px-4 py-2 cursor-pointer transition-all duration-200 hover:scale-110 group">
                <div className="flex items-center space-x-2">
                  <Map size={20} className="text-black" />
                  <span className="text-black font-medium">Mapa</span>
                </div>
                <div className="h-0.5 w-0 bg-black transition-all duration-200 group-hover:w-full"></div>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Mapa</h4>
                <p className="text-sm text-gray-600">
                  Descubre gimnasios, parques, senderos para correr y espacios fitness 
                  cerca de ti. Encuentra el lugar perfecto para tu entrenamiento.
                </p>
                <div className="flex items-center pt-2">
                  <Map className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-xs text-gray-500">
                    Ubicaciones fitness cercanas a ti
                  </span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </nav>

        {/* User Avatar o Botones de Auth */}
        <div className="flex items-center">
          {isAuthenticated ? (
            // Usuario autenticado - mostrar avatar con menú
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="p-2 cursor-pointer transition-all duration-200 hover:scale-110">
                  <UserCircle size={32} className="text-black" />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-64" align="end">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <UserCircle size={24} className="text-gray-600" />
                    <div>
                      <h4 className="text-sm font-semibold">
                        {user?.name || user?.email || 'Usuario'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                   
                    
                    <button
                      onClick={() => logout()}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                    >
                      <LogOut size={16} />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            // Usuario no autenticado - mostrar botones
            <div className="flex items-center space-x-3">
              <div className="relative">
                <StarBorder
                  as={Link}
                  to="/login"
                  color="#9333ea"
                  speed="1.5s"
                  thickness={1}
                  className="cursor-pointer no-underline transition-all duration-500 transform hover:scale-110"
                  innerClassName="relative z-1 backdrop-blur-md bg-black/90 border border-purple-400/30 text-white hover:bg-white/20 hover:text-black hover:border-purple-300/60 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-500 px-6 py-3 text-sm font-semibold rounded-[20px] text-center"
                  style={{ textDecoration: 'none' }}
                >
                  Iniciar Sesión
                </StarBorder>
              </div>
              <div className="relative">
                <StarBorder
                  as={Link}
                  to="/registro"
                  color="#9333ea"
                  speed="1.8s"
                  thickness={1}
                  className="cursor-pointer no-underline transition-all duration-500 transform hover:scale-110"
                  innerClassName="relative z-1 backdrop-blur-md bg-white/20 border border-purple-400/40 text-black hover:bg-black/90 hover:text-white hover:border-purple-300/60 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-500 px-6 py-3 text-sm font-semibold rounded-[20px] text-center"
                  style={{ textDecoration: 'none' }}
                >
                  Registrarse
                </StarBorder>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}