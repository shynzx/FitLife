import React from 'react';
import { X, Clock, Dumbbell } from 'lucide-react';
import { Button } from './button';

interface ExerciseReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSnooze: () => void;
}

export const ExerciseReminderModal: React.FC<ExerciseReminderModalProps> = ({ 
  isOpen, 
  onClose, 
  onSnooze 
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white/20 rounded-full">
                <Dumbbell className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">¡Es hora de entrenar!</h2>
                <p className="text-orange-100">Tu recordatorio de ejercicio</p>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6 space-y-4">
            <div className="text-center space-y-3">
              <div className="text-6xl">💪</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                ¡No olvides hacer ejercicio!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Es el momento perfecto para moverte y mantenerte saludable. 
                Tu cuerpo te lo agradecerá.
              </p>
            </div>

            {/* Estadísticas motivacionales */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Recomendado: 30-45 minutos de ejercicio</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                💡 Tip: Incluso 10 minutos de actividad pueden marcar la diferencia
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={onSnooze}
                variant="outline"
                className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
              >
                <Clock className="w-4 h-4 mr-2" />
                Recordar en 10 min
              </Button>
              
              <Button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-none shadow-lg"
              >
                <Dumbbell className="w-4 h-4 mr-2" />
                ¡Vamos a entrenar!
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};