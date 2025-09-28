import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from '../../components/ui/alert-dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../components/ui/input-otp';
import { useEffect, useState } from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Link } from 'react-router-dom';
import FitLifeLogo from '../../assets/fitlife-logo.svg';

export function InicioSesion() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cambiar el título de la página
  useDocumentTitle('Iniciar Sesión - FitLife');

  useEffect(() => {
    // Trigger la animación después de que el componente se monte
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Función para manejar el envío del formulario inicial
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Simular envío de código OTP
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setShowOTPDialog(true);
      }, 1500);
    }
  };

  // Función para manejar la verificación del código OTP
  const handleOTPVerification = () => {
    if (otpValue.length === 6) {
      setIsSubmitting(true);
      // Simular verificación
      setTimeout(() => {
        setIsSubmitting(false);
        setShowOTPDialog(false);
        // Aquí redirigiríamos al dashboard
        window.location.href = '/home';
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card 
        className={`w-full px-10 bg-white shadow-lg hover:shadow-xl transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isLoaded 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-8 opacity-0'
        }`}
        style={{ maxWidth: '672px' }}
      >
        <CardHeader className={`text-center pb-6 transition-all duration-300 ease-out delay-150 ${
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
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className={`space-y-2 transition-all duration-700 ease-out delay-300 ${
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                required
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
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                required
                className="w-full h-12 border-gray-300 rounded-lg text-black placeholder:text-gray-400 hover:scale-105 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:scale-105 transition-all duration-600 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] autofill:bg-transparent autofill:shadow-[inset_0_0_0px_1000px_transparent]"
                style={{
                  WebkitBoxShadow: "0 0 0 1000px transparent inset",
                  WebkitTextFillColor: "#000000",
                  transition: "background-color 5000s ease-in-out 0s, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                }}
              />
            </div>
            
            <div className={`text-center pt-2 transition-all duration-700 ease-out delay-700 ${
              isLoaded 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-6 opacity-0'
            }`}>
              <span className="text-sm text-gray-600">
                ¿No tienes cuenta? 
                <a href="/registro" className="text-blue-600 hover:underline hover:scale-110 hover:text-blue-700 transition-all duration-600 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ml-1 inline-block">
                  Regístrate
                </a>
              </span>
            </div>
            
            <Button 
              type="submit"
              className={`w-full h-12 !bg-black hover:!bg-white !border !border-black hover:!border-gray-300 !text-white hover:!text-black hover:scale-105 rounded-full font-medium transition-all duration-[400ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] delay-[900ms] ${
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
              Iniciar sesión
            </Button>
          </form>
          
          <div className={` transition-all duration-700 ease-out delay-[1100ms] ${
            isLoaded 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-6 opacity-0'
          }`}>
            <Button
              variant="outline"
              className="w-full h-12 !bg-white hover:!bg-black !text-black hover:!text-white !border !border-gray-300 hover:!border-black hover:scale-105 rounded-full font-medium hover:shadow-md transition-all duration-[400ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                backgroundColor: 'white',
                color: 'black',
                border: '1px solid #d1d5db',
                transition: 'all 400ms cubic-bezier(0.4, 0.0, 0.2, 1)'
              }}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Inicia Sesión con Google
            </Button>
            
            {/* Enlace temporal para probar la página Home */}
            <div className="mt-4 text-center">
              <Link 
                to="/home" 
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
              >
                Ir a la página principal →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Dialog para verificación OTP */}
      <AlertDialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <AlertDialogContent className="max-w-md mx-auto bg-white border-0 shadow-2xl rounded-2xl">
          <div className="text-center px-6 py-8">
            {/* Icono de verificación */}
            <div className="mx-auto mb-6 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            
            {/* Título */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verificación de Código
            </h2>
            
            {/* Descripción */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              Hemos enviado un código de verificación de 6 dígitos a tu correo electrónico. 
              Ingresa el código para completar el inicio de sesión.
            </p>
            
            {/* Input OTP */}
            <div className="mb-8">
              <InputOTP 
                maxLength={6} 
                value={otpValue} 
                onChange={(value) => setOtpValue(value)}
                className="justify-center"
              >
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot 
                    index={0} 
                    className="w-14 h-14 text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                  <InputOTPSlot 
                    index={1} 
                    className="w-14 h-14 text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                  <InputOTPSlot 
                    index={2} 
                    className="w-14 h-14 text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                  <InputOTPSlot 
                    index={3} 
                    className="w-14 h-14 text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                  <InputOTPSlot 
                    index={4} 
                    className="w-14 h-14 text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                  <InputOTPSlot 
                    index={5} 
                    className="w-14 h-14 text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            {/* Botones de acción */}
            <div className="flex gap-3">
              <AlertDialogCancel className="flex-1 h-12 bg-white hover:bg-gray-50 text-black border-2 border-gray-300 hover:border-gray-400 rounded-xl font-medium transition-all duration-300">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleOTPVerification}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl font-medium transition-all duration-300"
              >
                Verificar Código
              </AlertDialogAction>
            </div>
            
            {/* Enlace para reenviar código */}
            <div className="mt-6">
              <button 
                type="button"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors duration-200"
                onClick={() => {
                  // Aquí puedes implementar la lógica para reenviar el código
                  console.log("Reenviando código...");
                }}
              >
                ¿No recibiste el código? Reenviar
              </button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}