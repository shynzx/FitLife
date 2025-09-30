import { Header } from '../../components/Header';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { MapPin, Clock, Wrench } from 'lucide-react';

export function Mapa() {
  // Cambiar el título de la página
  useDocumentTitle('Mapa - FitLife');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb />
      
      <main className="max-w-full mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mapa de Gimnasios
          </h1>
          <p className="text-xl text-gray-600">
            Encuentra gimnasios y lugares fitness cerca de ti
          </p>
        </div>

        {/* Coming Soon Section */}
        <div>
          <div className="bg-white/10 backdrop-blur-sm border border-gray-200 rounded-2xl p-12 text-center">
            
            {/* Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
              <MapPin className="w-12 h-12 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Función Próximamente
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Estamos trabajando en una funcionalidad increíble que te permitirá encontrar 
              gimnasios, parques, centros deportivos y lugares fitness cerca de tu ubicación.
            </p>

            {/* Features coming */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ubicación en Tiempo Real</h3>
                <p className="text-gray-600 text-sm">
                  Encuentra lugares fitness basados en tu ubicación actual
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Horarios y Reviews</h3>
                <p className="text-gray-600 text-sm">
                  Consulta horarios, precios y reseñas de otros usuarios
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6 text-gray-400 mr-2" />
                <span className="text-gray-500 font-medium">En desarrollo</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-300" style={{ width: '65%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">65% completado</p>
            </div>

            {/* Call to action */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-100">
              <h3 className="font-semibold text-gray-900 mb-2">¿Quieres ser notificado?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Te avisaremos cuando esta función esté disponible
              </p>
              <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:from-red-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300">
                Notificarme
              </button>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm border border-gray-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ¿Qué podrás hacer próximamente?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Buscar Gimnasios</h3>
              <p className="text-gray-600 text-sm">
                Encuentra gimnasios cerca de ti con filtros avanzados
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rutas Optimizadas</h3>
              <p className="text-gray-600 text-sm">
                Obtén direcciones y rutas para llegar a tu destino
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Reseñas y Ratings</h3>
              <p className="text-gray-600 text-sm">
                Lee opiniones de otros usuarios y califica lugares
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}