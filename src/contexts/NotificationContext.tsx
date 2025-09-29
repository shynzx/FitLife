import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import type { UseNotificationsReturn } from '../hooks/useNotifications';
import { ToastContainer } from '../components/ui/toast';

// Contexto de notificaciones
const NotificationContext = createContext<UseNotificationsReturn | null>(null);

// Provider component
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
      {/* Renderizar el contenedor de toasts */}
      <ToastContainer 
        toasts={notifications.toasts} 
        onClose={notifications.hideNotification} 
      />
    </NotificationContext.Provider>
  );
};

// Hook para usar las notificaciones en cualquier componente
export const useNotificationContext = (): UseNotificationsReturn => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotificationContext debe ser usado dentro de NotificationProvider');
  }
  
  return context;
};

// Hook personalizado con funciones de conveniencia y mensajes predeterminados para la app
export const useAppNotifications = () => {
  const notifications = useNotificationContext();

  return {
    ...notifications,
    
    // Notificaciones específicas de la aplicación
    notifyLoginSuccess: (username: string) => 
      notifications.showSuccess(
        '¡Bienvenido!', 
        `Sesión iniciada correctamente como ${username}`
      ),
    
    notifyLogoutSuccess: () => 
      notifications.showInfo(
        'Sesión cerrada', 
        'Has cerrado sesión correctamente'
      ),
    
    notifyPlanCreated: (planName: string) => 
      notifications.showSuccess(
        'Plan creado', 
        `El plan "${planName}" se ha creado exitosamente`
      ),
    
    notifyPlanDeleted: (planName: string) => 
      notifications.showInfo(
        'Plan eliminado', 
        `El plan "${planName}" se ha eliminado`
      ),
    
    notifyExerciseAdded: (exerciseName: string) => 
      notifications.showSuccess(
        'Ejercicio agregado', 
        `"${exerciseName}" se ha agregado al plan`
      ),
    
    notifyExerciseRemoved: (exerciseName: string) => 
      notifications.showInfo(
        'Ejercicio eliminado', 
        `"${exerciseName}" se ha eliminado del plan`
      ),
    
    notifyError: (message: string, details?: string) => 
      notifications.showError(message, details),
    
    notifyNetworkError: () => 
      notifications.showError(
        'Error de conexión', 
        'No se pudo conectar con el servidor. Usando modo local.'
      ),
    
    notifyDataSaved: () => 
      notifications.showSuccess(
        'Datos guardados', 
        'Los cambios se han guardado correctamente'
      ),
    
    notifyFeatureComingSoon: (feature: string) => 
      notifications.showInfo(
        'Próximamente', 
        `La función "${feature}" estará disponible pronto`
      )
  };
};