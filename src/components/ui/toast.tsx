import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
    descColor: 'text-green-700'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    descColor: 'text-red-700'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50 border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-800',
    descColor: 'text-yellow-700'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    descColor: 'text-blue-700'
  }
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  description,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const config = toastConfig[type];
  const IconComponent = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose(id);
    }, 300); // Duración de la animación de salida
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border
        transition-all duration-300 ease-in-out transform
        ${config.bgColor}
        ${isAnimatingOut 
          ? 'translate-x-full opacity-0 scale-95' 
          : 'translate-x-0 opacity-100 scale-100'
        }
      `}
      style={{
        animation: isAnimatingOut 
          ? 'slideOut 0.3s ease-in-out forwards' 
          : 'slideIn 0.3s ease-in-out'
      }}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent 
              className={`h-6 w-6 ${config.iconColor}`} 
              aria-hidden="true" 
            />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${config.titleColor}`}>
              {title}
            </p>
            {description && (
              <p className={`mt-1 text-sm ${config.descColor}`}>
                {description}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`
                inline-flex rounded-md p-1.5 transition-colors
                ${config.iconColor} hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2
              `}
              onClick={handleClose}
            >
              <span className="sr-only">Cerrar</span>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contenedor de toasts
export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <>
      {/* Estilos CSS para las animaciones */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `
      }} />
      
      {/* Contenedor fijo en la esquina superior derecha */}
      <div 
        aria-live="assertive" 
        className="fixed top-0 right-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 z-50"
      >
        <div className="flex flex-col space-y-4 w-full">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={onClose}
            />
          ))}
        </div>
      </div>
    </>
  );
};