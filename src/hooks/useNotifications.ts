import { useState, useCallback } from 'react';
import type { ToastType, ToastProps } from '../components/ui/toast';

export interface NotificationOptions {
  title: string;
  description?: string;
  duration?: number;
  type?: ToastType;
}

export interface UseNotificationsReturn {
  toasts: ToastProps[];
  showNotification: (options: NotificationOptions) => string;
  showSuccess: (title: string, description?: string) => string;
  showError: (title: string, description?: string) => string;
  showWarning: (title: string, description?: string) => string;
  showInfo: (title: string, description?: string) => string;
  hideNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Función principal para mostrar notificaciones
  const showNotification = useCallback((options: NotificationOptions): string => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newToast: ToastProps = {
      id,
      type: options.type || 'info',
      title: options.title,
      description: options.description,
      duration: options.duration || 5000,
      onClose: hideNotification
    };

    setToasts(prev => [...prev, newToast]);
    
    // Log para debug
    console.log('🔔 Notificación mostrada:', {
      type: newToast.type,
      title: newToast.title,
      id: newToast.id
    });

    return id;
  }, []);

  // Función para ocultar una notificación específica
  const hideNotification = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
    console.log('🔕 Notificación ocultada:', id);
  }, []);

  // Funciones de conveniencia para diferentes tipos
  const showSuccess = useCallback((title: string, description?: string): string => {
    return showNotification({
      title,
      description,
      type: 'success',
      duration: 4000
    });
  }, [showNotification]);

  const showError = useCallback((title: string, description?: string): string => {
    return showNotification({
      title,
      description,
      type: 'error',
      duration: 6000 // Errores duran más tiempo
    });
  }, [showNotification]);

  const showWarning = useCallback((title: string, description?: string): string => {
    return showNotification({
      title,
      description,
      type: 'warning',
      duration: 5000
    });
  }, [showNotification]);

  const showInfo = useCallback((title: string, description?: string): string => {
    return showNotification({
      title,
      description,
      type: 'info',
      duration: 4000
    });
  }, [showNotification]);

  // Función para limpiar todas las notificaciones
  const clearAll = useCallback(() => {
    setToasts([]);
    console.log('🧹 Todas las notificaciones limpiadas');
  }, []);

  return {
    toasts,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
    clearAll
  };
};