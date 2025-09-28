import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FuzzyText from '../../components/FuzzyText';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function NotFound() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  
  // Cambiar el título de la página
  useDocumentTitle('Página no encontrada - FitLife');

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
        
        {/* FuzzyText for 404 */}
        <div className="mb-8">
          <FuzzyText
            fontSize="clamp(4rem, 12vw, 12rem)"
            fontWeight={900}
            color="#e879f9"
            enableHover={true}
            baseIntensity={0.3}
            hoverIntensity={0.8}
          >
            404
          </FuzzyText>
        </div>

        {/* Error message with FuzzyText */}
        <div className="mb-8">
          <FuzzyText
            fontSize="clamp(1.5rem, 4vw, 3rem)"
            fontWeight={700}
            color="#3b82f6"
            enableHover={true}
            baseIntensity={0.2}
            hoverIntensity={0.6}
          >
            Página no encontrada
          </FuzzyText>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-lg mb-8 max-w-md leading-relaxed">
          Oops! La página que buscas no existe. Parece que te has perdido en tu viaje fitness.
        </p>

        {/* Countdown and redirect info */}
        <div className="bg-white/10 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 mb-8">
          <div className="text-gray-800 mb-4">
            <p className="text-sm text-gray-600">Te redirigiremos automáticamente en:</p>
            <div className="text-4xl font-bold text-purple-600 mt-2">
              {countdown}
            </div>
            <p className="text-xs text-gray-500 mt-1">segundos</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGoHome}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ir al Inicio
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-gray-100 text-gray-800 font-semibold rounded-full border border-gray-300 hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
          >
            Volver Atrás
          </button>
        </div>

        {/* Decorative text */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            🏋️‍♂️ Mantente en forma, mantente enfocado
          </p>
        </div>
      </div>
    </div>
  );
}