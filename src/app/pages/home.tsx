import { Header } from '../../components/Header';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import SpotlightCard from '../../components/SpotlightCard';
import SplashCursor from '../../components/SplashCursor';
import TextType from '../../components/TextType';
import BlurText from '../../components/BlurText';
import RotatingText from '../../components/RotatingText';
import CircularGallery from '../../components/CircularGallery';

export function Home() {
  // Cambiar el título de la página
  useDocumentTitle('Inicio - FitLife');

  // Función callback para cuando complete la animación
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div className="max-w-full min-h-screen bg-transparent relative">
      {/* SplashCursor - Efecto de fluido interactivo detrás de todo */}
      <div className="fixed inset-0 z-10">
        <SplashCursor
          SPLAT_FORCE={3000}
          SPLAT_RADIUS={0.08}
          DENSITY_DISSIPATION={6}
          VELOCITY_DISSIPATION={3}
          TRANSPARENT={true}
          SHADING={false}
          COLOR_UPDATE_SPEED={4}
        />
      </div>
      
      {/* Contenido principal con z-index superior */}
      <div className="relative z-30 ">
        <Header />
        <Breadcrumb />
        
        <main className="max-w-full mx-auto px-15 py-18">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <TextType
              text={["Bienvenido a FitLife", "Tu plataforma fitness", "Alcanza tus metas"]}
              typingSpeed={100}
              deletingSpeed={50}
              pauseDuration={2000}
              loop={true}
              showCursor={true}
              cursorCharacter="|"
              cursorClassName="text-blue-600"
              textColors={["#1f2937", "#3b82f6", "#059669"]}
            />
          </h1>
          <BlurText
            text="Tu compañero perfecto para alcanzar tus objetivos de fitness y bienestar. Planifica rutinas, medita, calcula tus necesidades y encuentra los mejores lugares."
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-6"
            animateBy="words"
            delay={150}
            direction="top"
            threshold={0.1}
            onAnimationComplete={handleAnimationComplete}
          />
          
          {/* Textos motivacionales rotativos */}
          <div className="text-center">
            <div className="inline-flex items-center">
              <span className="px-2 text-gray-800 text-xl font-semibold">
                FitLife es
              </span>
              <RotatingText
                texts={[
                  "Motivación",
                  "Progreso",
                  "Disciplina",
                  "Constancia",
                  "Bienestar"
                ]}
                mainClassName="px-2 sm:px-2 md:px-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white overflow-hidden py-0.5 sm:py-1 md:py-2 rounded-lg text-xl font-semibold"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={4000}
                splitBy="words"
                loop={true}
                auto={true}
              />
            </div>
          </div>
        </div>

        {/* Cards de características principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <SpotlightCard 
            className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
            spotlightColor="rgba(59, 130, 246, 0.4)"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mi Rutina</h3>
            <p className="text-gray-600 text-sm">
              Planifica y sigue tus rutinas de ejercicio personalizadas
            </p>
          </SpotlightCard>

          <SpotlightCard 
            className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
            spotlightColor="rgba(139, 92, 246, 0.4)"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Meditación</h3>
            <p className="text-gray-600 text-sm">
              Encuentra paz interior con nuestras sesiones guiadas
            </p>
          </SpotlightCard>

          <SpotlightCard 
            className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
            spotlightColor="rgba(34, 197, 94, 0.4)"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Calculadora</h3>
            <p className="text-gray-600 text-sm">
              Calcula tu IMC, calorías y otros datos importantes
            </p>
          </SpotlightCard>

          <SpotlightCard 
            className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
            spotlightColor="rgba(239, 68, 68, 0.4)"
          >
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mapa</h3>
            <p className="text-gray-600 text-sm">
              Encuentra gimnasios y lugares fitness cerca de ti
            </p>
          </SpotlightCard>
        </div>

        {/* Sección de bienvenida adicional */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            ¡Comienza tu viaje fitness hoy!
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya han transformado su vida con FitLife. 
            Herramientas completas para tu bienestar físico y mental.
          </p>
          <div className="h-96 w-full">
            <CircularGallery
              items={[
                { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', text: 'Mi Rutina' },
                { image: 'https://images.unsplash.com/photo-1506629905607-74f3dd7b2851?w=400&h=400&fit=crop', text: 'Meditación' },
                { image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop', text: 'Calculadora' },
                { image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop', text: 'Mapa' },
                { image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop', text: 'Nutrición' },
                { image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=400&fit=crop', text: 'Progreso' }
              ]}
              bend={2.5}
              textColor="#1f2937"
              borderRadius={0.1}
              font="bold 24px system-ui"
              scrollSpeed={1.5}
              scrollEase={0.08}
            />
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}