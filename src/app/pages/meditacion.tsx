import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import SpotlightCard from '../../components/SpotlightCard';
import { Button } from '../../components/ui/button';
import { PlayIcon, PauseIcon, RotateCcw } from 'lucide-react';

export function Meditacion() {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Cambiar el título de la página
  useDocumentTitle('Meditación - FitLife');

  // Timer logic
  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            setIsPaused(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isActive && timeLeft === 0) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft]);

  const handleTimeSelect = (minutes: number) => {
    setSelectedTime(minutes);
    setTimeLeft(minutes * 60); // Convert to seconds
    setIsActive(false);
    setIsPaused(false);
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    if (selectedTime) {
      setTimeLeft(selectedTime * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!selectedTime) return 0;
    const totalSeconds = selectedTime * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb />
      
      <main className="max-w-full mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meditación Guiada
          </h1>
          <p className="text-xl text-gray-600">
            Encuentra tu paz interior con nuestras sesiones de meditación. 
            Elige la duración que mejor se adapte a tu rutina.
          </p>
        </div>

        {/* Selector de tiempo */}
        {!selectedTime && (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div 
              onClick={() => handleTimeSelect(5)}
              className="group relative"
            >
              <SpotlightCard 
                className="p-8 bg-gradient-to-br from-green-50 to-green-100 border-2 border-black hover:border-green-400 hover:from-green-100 hover:to-green-200 hover:shadow-2xl hover:scale-110 transition-all duration-300 transform cursor-pointer active:scale-105 group-hover:ring-4 group-hover:ring-green-200/50"
                spotlightColor="rgba(34, 197, 94, 0.6)"
              >
                <div className="text-center relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:shadow-xl group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2 group-hover:text-green-900 transition-colors">5 Minutos</h3>
                  <p className="text-green-700 font-medium group-hover:text-green-800 transition-colors">
                    Perfecta para principiantes o una pausa rápida durante el día
                  </p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="mt-4 text-sm font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ✨ Haz click para comenzar
                  </div>
                </div>
              </SpotlightCard>
            </div>

            <div 
              onClick={() => handleTimeSelect(10)}
              className="group relative"
            >
              <SpotlightCard 
                className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-black hover:border-blue-400 hover:from-blue-100 hover:to-blue-200 hover:shadow-2xl hover:scale-110 transition-all duration-300 transform cursor-pointer active:scale-105 group-hover:ring-4 group-hover:ring-blue-200/50"
                spotlightColor="rgba(59, 130, 246, 0.6)"
              >
                <div className="text-center relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:shadow-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-2 group-hover:text-blue-900 transition-colors">10 Minutos</h3>
                  <p className="text-blue-700 font-medium group-hover:text-blue-800 transition-colors">
                    Ideal para una sesión equilibrada de relajación y concentración
                  </p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="mt-4 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ✨ Haz click para comenzar
                  </div>
                </div>
              </SpotlightCard>
            </div>

            <div 
              onClick={() => handleTimeSelect(15)}
              className="group relative"
            >
              <SpotlightCard 
                className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-black hover:border-purple-400 hover:from-purple-100 hover:to-purple-200 hover:shadow-2xl hover:scale-110 transition-all duration-300 transform cursor-pointer active:scale-105 group-hover:ring-4 group-hover:ring-purple-200/50"
                spotlightColor="rgba(139, 92, 246, 0.6)"
              >
                <div className="text-center relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:shadow-xl group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-800 mb-2 group-hover:text-purple-900 transition-colors">15 Minutos</h3>
                  <p className="text-purple-700 font-medium group-hover:text-purple-800 transition-colors">
                    Para una experiencia profunda de meditación y mindfulness
                  </p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="mt-4 text-sm font-semibold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ✨ Haz click para comenzar
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        )}

        {/* Timer de meditación */}
        {selectedTime && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Sesión de {selectedTime} minutos
              </h2>
              
              {/* Círculo de progreso */}
              <div className="relative w-48 h-48 mx-auto mb-8">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-gray-300"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - getProgress() / 100)}`}
                    className="text-purple-600 transition-all duration-1000 ease-linear"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Controles */}
              <div className="flex justify-center space-x-4 mb-6">
                {!isActive && timeLeft > 0 && (
                  <Button
                    onClick={handleStart}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
                  >
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Comenzar
                  </Button>
                )}
                
                {isActive && (
                  <Button
                    onClick={handlePause}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full"
                  >
                    <PauseIcon className="w-5 h-5 mr-2" />
                    {isPaused ? 'Reanudar' : 'Pausar'}
                  </Button>
                )}
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="px-6 py-3 rounded-full"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reiniciar
                </Button>
              </div>

              {/* Botón para volver a seleccionar tiempo */}
              <Button
                onClick={() => {
                  setSelectedTime(null);
                  setTimeLeft(0);
                  setIsActive(false);
                  setIsPaused(false);
                }}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                Cambiar duración
              </Button>

              {/* Estado actual */}
              {timeLeft === 0 && selectedTime && (
                <div className="mt-6 p-4 bg-green-100 rounded-lg">
                  <p className="text-green-800 font-semibold">
                    ¡Felicidades! Has completado tu sesión de meditación
                  </p>
                </div>
              )}
            </div>
        )}

        {/* Información adicional */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Beneficios de la Meditación
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Reduce el Estrés</h3>
              <p className="text-gray-600 text-sm">
                Disminuye los niveles de cortisol y alivia la tensión
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mejora el Sueño</h3>
              <p className="text-gray-600 text-sm">
                Ayuda a conseguir un descanso más reparador
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Aumenta el Foco</h3>
              <p className="text-gray-600 text-sm">
                Mejora la concentración y claridad mental
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
