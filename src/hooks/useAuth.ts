import { useState, useEffect } from 'react';
import { authService, userService, APIError } from '../services/api';
import { getUserIdFromToken } from '../utils/jwt';
import type { LoginRequest, OTPRequest, User, RegisterRequest } from '../services/api';

// Función para generar un UUID temporal válido (fallback)
function generateTempUUID(): string {
  return 'temp-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface AuthState {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = authService.isAuthenticated();
      const user = authService.getCurrentUser();
      
      setAuthState({
        isAuthenticated: isAuth,
        user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: 'Error al verificar autenticación',
      });
    }
  };

  const login = async (credentials: LoginRequest) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Limpiar sesión anterior completamente
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      const response = await authService.login(credentials);
      
      // Tu API devuelve { token: "...", expires: "..." } sin campo "success"
      if (response.token) {
        // Guardar el token primero
        authService.saveUserSession(response.token, null);
        
        try {
          // Obtener información completa del usuario de la API
          const userData = await userService.getCurrentUser();
          
          // Crear objeto usuario con datos reales
          const user = {
            id: userData.id,
            email: userData.email,
            name: `${userData.firstName} ${userData.lastName}`.trim(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            weight: userData.weight,
            height: userData.height,
            age: userData.age,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt
          };
          
          // Actualizar la sesión con datos completos
          authService.saveUserSession(response.token, user);
          setAuthState({
            isAuthenticated: true,
            user: user,
            isLoading: false,
            error: null,
          });
          
          console.log('✅ Login exitoso con datos completos:', { 
            userId: user.id, 
            name: user.name, 
            email: user.email 
          });
          
          // Debug: verificar que se guardó correctamente
          console.log('🔍 Verificando localStorage después del login:', {
            token: localStorage.getItem('authToken') ? 'Presente' : 'Ausente',
            user: JSON.parse(localStorage.getItem('user') || 'null'),
            authServiceUser: authService.getCurrentUser()
          });
          
          return { success: true, requiresOTP: false };
          
        } catch (userError) {
          console.error('Error al obtener datos del usuario:', userError);
          
          // Fallback: usar datos básicos del token JWT si falla la obtención del usuario
          const userIdFromToken = getUserIdFromToken(response.token);
          const fallbackUser = {
            id: userIdFromToken || generateTempUUID(),
            email: credentials.email,
            name: credentials.email.split('@')[0]
          };
          
          authService.saveUserSession(response.token, fallbackUser);
          setAuthState({
            isAuthenticated: true,
            user: fallbackUser,
            isLoading: false,
            error: null,
          });
          
          console.log('⚠️ Login exitoso con datos limitados:', fallbackUser);
          return { success: true, requiresOTP: false };
        }
      }
      
      // Si no hay token, algo salió mal
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: response.message || 'No se recibió token de autenticación' 
      }));
      return { success: false, message: response.message || 'Error en la respuesta del servidor' };
      
    } catch (error) {
      console.error('Error en login:', error);
      
      let errorMessage = 'Error de conexión';
      
      if (error instanceof APIError) {
        // Manejar errores específicos de la API
        switch (error.status) {
          case 401:
            errorMessage = 'Correo electrónico o contraseña no válidos';
            break;
          case 400:
            errorMessage = 'Datos de acceso inválidos';
            break;
          case 422:
            errorMessage = 'Correo electrónico o contraseña no válidos';
            break;
          case 500:
            errorMessage = 'Error del servidor. Inténtalo más tarde';
            break;
          default:
            errorMessage = error.message || 'Error al iniciar sesión';
        }
      }
        
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage 
      }));
      return { success: false, message: errorMessage };
    }
  };

  const register = async (userData: RegisterRequest) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Limpiar sesión anterior completamente
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      console.log('🚀 Iniciando registro con datos:', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: '***' // No loggear la contraseña completa
      });
      
      const response = await authService.register(userData);
      
      console.log('📝 Registro - Respuesta de API:', response);
      
      // La API devuelve el usuario creado directamente
      if (response.id && response.email) {
        // No guardamos sesión aquí, el usuario debe hacer login después del registro
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
        
        console.log('✅ Registro exitoso:', { 
          userId: response.id, 
          name: `${response.firstName} ${response.lastName}`, 
          email: response.email 
        });
        
        return { success: true, user: response };
      }
      
      // Si no hay datos del usuario, algo salió mal
      console.log('❌ Registro fallido: respuesta sin datos de usuario');
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Error en el registro: respuesta inválida del servidor' 
      }));
      return { success: false, message: 'Error en el registro' };
      
    } catch (error) {
      console.error('Error en registro:', error);
      
      let errorMessage = 'Error de conexión durante el registro';
      
      if (error instanceof APIError) {
        console.log('📋 Detalles del error API:', {
          status: error.status,
          message: error.message,
          data: error.data
        });
        
        // Manejar errores específicos de la API
        switch (error.status) {
          case 400:
            errorMessage = error.message || 'Datos inválidos. Verifica que todos los campos sean correctos.';
            break;
          case 409:
            errorMessage = 'Este email ya está registrado. ¿Ya tienes una cuenta?';
            break;
          case 422:
            errorMessage = error.message || 'Los datos proporcionados no son válidos.';
            break;
          case 500:
            // Para error 500, verificar si puede ser email duplicado
            if (error.message && error.message.toLowerCase().includes('email')) {
              errorMessage = 'Este email ya está registrado. Usa un email diferente.';
            } else if (error.data && typeof error.data === 'string' && error.data.toLowerCase().includes('email')) {
              errorMessage = 'Este email ya está registrado. Usa un email diferente.';
            } else {
              // Si es un error 500 en registro, muy probablemente es email duplicado
              errorMessage = 'Es probable que este email ya esté registrado. Intenta con un email diferente o inicia sesión si ya tienes una cuenta.';
            }
            break;
          default:
            errorMessage = error.message || 'Error al crear la cuenta';
        }
      }
        
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage 
      }));
      return { success: false, message: errorMessage };
    }
  };

  const verifyOTP = async (otpData: OTPRequest) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.verifyOTP(otpData);
      
      if (response.success && response.token && response.user) {
        authService.saveUserSession(response.token, response.user);
        setAuthState({
          isAuthenticated: true,
          user: response.user,
          isLoading: false,
          error: null,
        });
        return { success: true };
      }
      
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: response.message || 'Código OTP inválido' 
      }));
      return { success: false, message: response.message || 'Código OTP inválido' };
      
    } catch (error) {
      const errorMessage = error instanceof APIError 
        ? error.message 
        : 'Error al verificar código';
        
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage 
      }));
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authService.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      // Incluso si falla la petición al servidor, limpiamos la sesión local
      await authService.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const refreshUserData = async () => {
    try {
      if (!authState.isAuthenticated) {
        return;
      }
      
      const userData = await userService.getCurrentUser();
      const user = {
        id: userData.id,
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`.trim(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        weight: userData.weight,
        height: userData.height,
        age: userData.age,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      };
      
      // Mantener el token actual
      const currentToken = localStorage.getItem('authToken');
      if (currentToken) {
        authService.saveUserSession(currentToken, user);
      }
      
      setAuthState(prev => ({ ...prev, user }));
      console.log('✅ Datos de usuario actualizados:', user);
      
    } catch (error) {
      console.error('Error al actualizar datos del usuario:', error);
    }
  };

  return {
    ...authState,
    login,
    register,
    verifyOTP,
    logout,
    clearError,
    refresh: checkAuthStatus,
    refreshUserData,
  };
}