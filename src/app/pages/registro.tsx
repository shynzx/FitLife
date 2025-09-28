import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import FitLifeLogo from '../../assets/fitlife-logo.svg';

export function Registro() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Cambiar el título de la página
  useDocumentTitle('Crear Cuenta - FitLife');

  useEffect(() => {
    // Trigger la animación después de que el componente se monte
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex items-center justify-center p-4">
      <Card 
        className={`w-full px-10 bg-white shadow-lg hover:shadow-xl transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isLoaded 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-8 opacity-0'
        }`}
        style={{ maxWidth: '480px' }}
      >
        <CardHeader className={`text-center pb-6 transition-all duration-700 ease-out delay-150 ${
          isLoaded 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-6 opacity-0'
        }`}>
          <div className="flex justify-center">
            <img 
              src={FitLifeLogo} 
              alt="FitLife" 
              className="h-12 w-auto"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <form className="space-y-4">
            <div className={`space-y-2 transition-all duration-700 ease-out delay-300 ${
              isLoaded 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-6 opacity-0'
            }`}>
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Nombre completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                className="w-full h-12 border-gray-300 rounded-lg text-black placeholder:text-gray-400 hover:scale-105 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:scale-105 transition-all duration-600 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] autofill:bg-transparent autofill:shadow-[inset_0_0_0px_1000px_transparent]"
                style={{
                  WebkitBoxShadow: "0 0 0 1000px transparent inset",
                  WebkitTextFillColor: "#000000",
                  transition: "background-color 5000s ease-in-out 0s, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                }}
              />
            </div>
            
            <div className={`space-y-2 transition-all duration-700 ease-out delay-500 ${
              isLoaded 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-6 opacity-0'
            }`}>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Correo
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                className="w-full h-12 border-gray-300 rounded-lg text-black placeholder:text-gray-400 hover:scale-105 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:scale-105 transition-all duration-600 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] autofill:bg-transparent autofill:shadow-[inset_0_0_0px_1000px_transparent]"
                style={{
                  WebkitBoxShadow: "0 0 0 1000px transparent inset",
                  WebkitTextFillColor: "#000000",
                  transition: "background-color 5000s ease-in-out 0s, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                }}
              />
            </div>
            
            <div className={`space-y-2 transition-all duration-700 ease-out delay-700 ${
              isLoaded 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-6 opacity-0'
            }`}>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                className="w-full h-12 border-gray-300 rounded-lg text-black placeholder:text-gray-400 hover:scale-105 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:scale-105 transition-all duration-600 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] autofill:bg-transparent autofill:shadow-[inset_0_0_0px_1000px_transparent]"
                style={{
                  WebkitBoxShadow: "0 0 0 1000px transparent inset",
                  WebkitTextFillColor: "#000000",
                  transition: "background-color 5000s ease-in-out 0s, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                }}
              />
            </div>
            
            <div className={`space-y-2 transition-all duration-700 ease-out delay-[900ms] ${
              isLoaded 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-6 opacity-0'
            }`}>
              <Label htmlFor="confirm-password" className="text-gray-700 font-medium">
                Confirmar contraseña
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirma tu contraseña"
                className="w-full h-12 border-gray-300 rounded-lg text-black placeholder:text-gray-400 hover:scale-105 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:scale-105 transition-all duration-600 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] autofill:bg-transparent autofill:shadow-[inset_0_0_0px_1000px_transparent]"
                style={{
                  WebkitBoxShadow: "0 0 0 1000px transparent inset",
                  WebkitTextFillColor: "#000000",
                  transition: "background-color 5000s ease-in-out 0s, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                }}
              />
            </div>
            
            <div className={`text-center text-xs text-gray-600 transition-all duration-700 ease-out delay-[1000ms] ${
              isLoaded 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-6 opacity-0'
            }`}>
              Al registrarte, aceptas nuestras{' '}
              <a href="#" className="text-blue-600 hover:underline">Condiciones</a>, la{' '}
              <a href="#" className="text-blue-600 hover:underline">Política de privacidad</a>{' '}
              y la{' '}
              <a href="#" className="text-blue-600 hover:underline">Política de cookies</a>.
            </div>
            
            <Button 
              type="submit"
              className={`w-full h-12 !bg-black hover:!bg-white !border !border-black hover:!border-gray-300 !text-white hover:!text-black hover:scale-105 rounded-full font-medium transition-all duration-[400ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] delay-[1200ms] ${
                isLoaded 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-6 opacity-0'
              }`}
              style={{
                backgroundColor: 'black',
                color: 'white',
                border: '1px solid black',
                transition: 'all 400ms cubic-bezier(0.4, 0.0, 0.2, 1)'
              }}
            >
              Crear cuenta
            </Button>
          </form>
          
          <div className={`text-center text-sm transition-all duration-700 ease-out delay-[1400ms] ${
            isLoaded 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-6 opacity-0'
          }`}>
            <span className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
            </span>
            <Link to="/login" className="text-blue-600 hover:underline hover:scale-110 hover:text-blue-700 transition-all duration-600 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] font-medium inline-block">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
