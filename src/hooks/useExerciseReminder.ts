import { useState, useCallback, useEffect } from 'react';

export interface ScheduledNotification {
  id: string;
  time: string; // HH:MM format
  isActive: boolean;
  message: string;
}

export interface UseExerciseReminderReturn {
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  isScheduled: boolean;
  timeUntilNotification: string;
  scheduleNotification: () => void;
  cancelNotification: () => void;
  checkForNotification: () => boolean;
}

export const useExerciseReminder = (): UseExerciseReminderReturn => {
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [timeUntilNotification, setTimeUntilNotification] = useState<string>('');

  // Función para calcular el tiempo hasta la notificación
  const calculateTimeUntil = useCallback((targetTime: string): string => {
    if (!targetTime) return '';

    const now = new Date();
    const [hours, minutes] = targetTime.split(':').map(Number);
    
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    
    // Si la hora ya pasó hoy, programar para mañana
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    
    const diffMs = target.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  }, []);

  // Función para programar la notificación
  const scheduleNotification = useCallback(() => {
    if (!scheduledTime) return;

    // Solicitar permisos de notificación si no los tiene
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🔔 Permisos de notificación:', permission);
      });
    }

    // Cancelar notificación anterior si existe
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const now = new Date();
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    
    const targetTime = new Date();
    targetTime.setHours(hours, minutes, 0, 0);
    
    // Si la hora ya pasó hoy, programar para mañana
    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const timeUntilMs = targetTime.getTime() - now.getTime();
    
    console.log(`⏰ Notificación programada para ${scheduledTime} (en ${calculateTimeUntil(scheduledTime)})`);
    
    const newTimeoutId = setTimeout(() => {
      // Aquí se disparará la notificación
      console.log('🔔 ¡Es hora de hacer ejercicio! - Disparando evento');
      setIsScheduled(false);
      setTimeoutId(null);
      
      // Crear evento personalizado para que el componente padre lo escuche
      const event = new CustomEvent('exerciseReminder', {
        detail: {
          time: scheduledTime,
          message: '¡Es hora de hacer ejercicio!'
        }
      });
      
      window.dispatchEvent(event);
      console.log('📢 Evento exerciseReminder disparado');
      
      // También mostrar notificación del navegador si tiene permisos
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🏋️ FitLife - ¡Es hora de entrenar!', {
          body: `Tu recordatorio de ejercicio programado para las ${scheduledTime}`,
          icon: '/favicon.ico'
        });
      }
    }, timeUntilMs);
    
    setTimeoutId(newTimeoutId);
    setIsScheduled(true);
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('exerciseReminder', JSON.stringify({
      time: scheduledTime,
      scheduledAt: now.toISOString(),
      targetTime: targetTime.toISOString()
    }));
  }, [scheduledTime, timeoutId, calculateTimeUntil]);

  // Función para cancelar la notificación
  const cancelNotification = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsScheduled(false);
    localStorage.removeItem('exerciseReminder');
    console.log('❌ Notificación cancelada');
  }, [timeoutId]);

  // Función para verificar si es hora de mostrar la notificación
  const checkForNotification = useCallback((): boolean => {
    if (!isScheduled || !scheduledTime) return false;

    const now = new Date();
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Verificar si es exactamente la hora programada (dentro de un margen de 1 minuto)
    return currentHours === hours && Math.abs(currentMinutes - minutes) <= 1;
  }, [isScheduled, scheduledTime]);

  // Actualizar tiempo restante cada minuto
  useEffect(() => {
    if (!isScheduled) {
      setTimeUntilNotification('');
      return;
    }

    const updateTimeUntil = () => {
      setTimeUntilNotification(calculateTimeUntil(scheduledTime));
    };

    updateTimeUntil(); // Actualizar inmediatamente
    
    const interval = setInterval(updateTimeUntil, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, [isScheduled, scheduledTime, calculateTimeUntil]);

  // Restaurar notificación al cargar la página
  useEffect(() => {
    const saved = localStorage.getItem('exerciseReminder');
    if (saved) {
      try {
        const { time, targetTime } = JSON.parse(saved);
        const target = new Date(targetTime);
        const now = new Date();
        
        if (target > now) {
          // La notificación aún está vigente
          setScheduledTime(time);
          setIsScheduled(true);
          
          const timeUntilMs = target.getTime() - now.getTime();
          const newTimeoutId = setTimeout(() => {
            setIsScheduled(false);
            setTimeoutId(null);
            window.dispatchEvent(new CustomEvent('exerciseReminder'));
          }, timeUntilMs);
          
          setTimeoutId(newTimeoutId);
        } else {
          // La notificación ya expiró
          localStorage.removeItem('exerciseReminder');
        }
      } catch (error) {
        console.error('Error al restaurar notificación:', error);
        localStorage.removeItem('exerciseReminder');
      }
    }
  }, []);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return {
    scheduledTime,
    setScheduledTime,
    isScheduled,
    timeUntilNotification,
    scheduleNotification,
    cancelNotification,
    checkForNotification
  };
};