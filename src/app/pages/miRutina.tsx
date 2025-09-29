import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from '../../components/Header';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useExercisePlans } from '../../hooks/useExercisePlans';
import { useAuth } from '../../hooks/useAuth';
import { useAppNotifications } from '../../contexts/NotificationContext';
import { useExerciseReminder } from '../../hooks/useExerciseReminder';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ExerciseReminderModal } from '../../components/ui/exercise-reminder-modal';
import { ChevronLeft, Plus, Check, Calendar, Clock, Trash2, Target, Zap, Loader2, AlarmClock, X } from 'lucide-react';
import SpotlightCard from '../../components/SpotlightCard';

interface Exercise {
  id: string;
  name: string;
  icon: string;
  category: 'upper' | 'lower' | 'full';
}

interface DayExercises {
  [key: string]: Exercise[];
}

const exercises: Exercise[] = [
  { id: '1', name: 'Pecho', icon: '', category: 'upper' },
  { id: '2', name: 'Tríceps', icon: '', category: 'upper' },
  { id: '3', name: 'Hombro', icon: '', category: 'upper' },
  { id: '4', name: 'Espalda', icon: '', category: 'upper' },
  { id: '5', name: 'Bíceps', icon: '', category: 'upper' },
  { id: '6', name: 'Antebrazo', icon: '', category: 'upper' },
  { id: '7', name: 'Pierna Completa', icon: '', category: 'full' },
  { id: '8', name: 'Cuadríceps', icon: '', category: 'lower' },
  { id: '9', name: 'Glúteo', icon: '', category: 'lower' },
  { id: '10', name: 'Femoral', icon: '', category: 'lower' },
  { id: '11', name: 'Pantorrilla', icon: '', category: 'lower' },
];

const daysOfWeek = [
  { key: 'lunes', name: 'Lunes', short: 'LUN' },
  { key: 'martes', name: 'Martes', short: 'MAR' },
  { key: 'miercoles', name: 'Miércoles', short: 'MIE' },
  { key: 'jueves', name: 'Jueves', short: 'JUE' },
  { key: 'viernes', name: 'Viernes', short: 'VIE' },
  { key: 'sabado', name: 'Sábado', short: 'SAB' },
  { key: 'domingo', name: 'Domingo', short: 'DOM' },
];

const exerciseColors = [
  {
    selected: 'bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600 hover:from-pink-600 hover:via-pink-700 hover:to-rose-700 text-white shadow-lg shadow-pink-500/40 border-pink-400',
    unselected: 'bg-white/80 dark:bg-transparent hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-700 dark:text-gray-300 border-2 border-pink-200 dark:border-pink-700 hover:border-pink-400 dark:hover:border-pink-500 hover:shadow-md hover:shadow-pink-200/50 dark:hover:shadow-pink-900/30'
  },
  {
    selected: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/40 border-emerald-400',
    unselected: 'bg-white/80 dark:bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/30'
  },
  {
    selected: 'bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:via-orange-700 hover:to-amber-700 text-white shadow-lg shadow-orange-500/40 border-orange-400',
    unselected: 'bg-white/80 dark:bg-transparent hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 border-2 border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-md hover:shadow-orange-200/50 dark:hover:shadow-orange-900/30'
  },
  {
    selected: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/40 border-blue-400',
    unselected: 'bg-white/80 dark:bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30'
  },
  {
    selected: 'bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 hover:from-purple-600 hover:via-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-500/40 border-purple-400',
    unselected: 'bg-white/80 dark:bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30'
  },
  {
    selected: 'bg-gradient-to-br from-red-500 via-red-600 to-pink-600 hover:from-red-600 hover:via-red-700 hover:to-pink-700 text-white shadow-lg shadow-red-500/40 border-red-400',
    unselected: 'bg-white/80 dark:bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 border-2 border-red-200 dark:border-red-700 hover:border-red-400 dark:hover:border-red-500 hover:shadow-md hover:shadow-red-200/50 dark:hover:shadow-red-900/30'
  },
  {
    selected: 'bg-gradient-to-br from-yellow-500 via-yellow-600 to-orange-500 hover:from-yellow-600 hover:via-yellow-700 hover:to-orange-600 text-white shadow-lg shadow-yellow-500/40 border-yellow-400',
    unselected: 'bg-white/80 dark:bg-transparent hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-gray-700 dark:text-gray-300 border-2 border-yellow-200 dark:border-yellow-700 hover:border-yellow-400 dark:hover:border-yellow-500 hover:shadow-md hover:shadow-yellow-200/50 dark:hover:shadow-yellow-900/30'
  },
  {
    selected: 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 hover:from-indigo-600 hover:via-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/40 border-indigo-400',
    unselected: 'bg-white/80 dark:bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-700 dark:text-gray-300 border-2 border-indigo-200 dark:border-indigo-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/30'
  },
  {
    selected: 'bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 hover:from-teal-600 hover:via-teal-700 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/40 border-teal-400',
    unselected: 'bg-white/80 dark:bg-transparent hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-700 dark:text-gray-300 border-2 border-teal-200 dark:border-teal-700 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md hover:shadow-teal-200/50 dark:hover:shadow-teal-900/30'
  },
  {
    selected: 'bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-500 hover:from-cyan-600 hover:via-cyan-700 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/40 border-cyan-400',
    unselected: 'bg-white/80 dark:bg-transparent hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-gray-700 dark:text-gray-300 border-2 border-cyan-200 dark:border-cyan-700 hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-md hover:shadow-cyan-200/50 dark:hover:shadow-cyan-900/30'
  },
  {
    selected: 'bg-gradient-to-br from-lime-500 via-lime-600 to-green-600 hover:from-lime-600 hover:via-lime-700 hover:to-green-700 text-white shadow-lg shadow-lime-500/40 border-lime-400',
    unselected: 'bg-white/80 dark:bg-transparent hover:bg-lime-50 dark:hover:bg-lime-900/20 text-gray-700 dark:text-gray-300 border-2 border-lime-200 dark:border-lime-700 hover:border-lime-400 dark:hover:border-lime-500 hover:shadow-md hover:shadow-lime-200/50 dark:hover:shadow-lime-900/30'
  }
];

export function MiRutina() {
  useDocumentTitle('Mi Rutina - FitLife');
  
  // Verificar autenticación
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Hook de notificaciones
  const notifications = useAppNotifications();
  
  // Hook de recordatorios de ejercicio
  const reminder = useExerciseReminder();
  
  // Estado del modal de recordatorio
  const [showReminderModal, setShowReminderModal] = useState(false);
  
  // Listener para el evento de recordatorio
  useEffect(() => {
    const handleExerciseReminder = () => {
      console.log('🔔 Evento de recordatorio recibido - abriendo modal');
      setShowReminderModal(true);
      notifications.showSuccess('⏰ ¡Es hora de entrenar!', 'Tu recordatorio de ejercicio está listo');
      
      // Asegurar que el modal se muestre con un pequeño delay
      setTimeout(() => {
        setShowReminderModal(true);
      }, 100);
    };

    // Agregar listener para el evento personalizado
    window.addEventListener('exerciseReminder', handleExerciseReminder);
    
    console.log('👂 Listener de recordatorio de ejercicio configurado');
    
    return () => {
      window.removeEventListener('exerciseReminder', handleExerciseReminder);
      console.log('🚫 Listener de recordatorio removido');
    };
  }, [notifications]);
  
  // API Hook
  const { 
    plans, 
    isLoading, 
    error, 
    createPlan, 
    addExerciseToPlan,
    refreshPlans
  } = useExercisePlans();

  const [currentView, setCurrentView] = useState<'calendar' | 'exercises' | 'schedule'>('calendar');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [selectedDaysForExercises, setSelectedDaysForExercises] = useState<string[]>([]);
  const [dayExercises, setDayExercises] = useState<DayExercises>(() => {
    // Intentar cargar desde localStorage al inicializar
    try {
      const saved = localStorage.getItem('fitlife-dayExercises');
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Filtrar ejercicios inválidos del localStorage
        const cleanedExercises: DayExercises = {};
        Object.keys(parsed).forEach(dayKey => {
          if (Array.isArray(parsed[dayKey])) {
            const validExercises = parsed[dayKey].filter((exercise: Exercise) => 
              exercise && 
              exercise.name && 
              typeof exercise.name === 'string' &&
              exercise.name.trim().length >= 3 && 
              !exercise.name.includes('sin nombre') && 
              !exercise.name.includes('Compl') &&
              !exercise.name.includes('Ejercicio sin nombre')
            );
            if (validExercises.length > 0) {
              cleanedExercises[dayKey] = validExercises;
            }
          }
        });
        
        return cleanedExercises;
      }
    } catch (error) {
      // Error silencioso - no afecta funcionalidad
    }
    return {};
  });
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'upper' | 'lower' | 'full'>('all');
  const [isCreatingPlan, setIsCreatingPlan] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [createError, setCreateError] = useState<string>('');
  const [creationProgress, setCreationProgress] = useState<string>('');

  // Cargar ejercicios desde la API al inicializar
  useEffect(() => {
    // Validar que plans existe y es un array
    if (!plans || !Array.isArray(plans)) {
      return;
    }
    
    if (plans.length > 0) {
      const newDayExercises: DayExercises = {};
      
      plans.forEach((plan) => {
        // Validar que el plan tenga los datos básicos
        if (!plan) {
          return;
        }

        // Validar que trainingDay exista
        if (!plan.trainingDay) {
          return;
        }

        // Obtener el día de la semana del plan
        const planDate = new Date(plan.trainingDay);
        const dayOfWeek = planDate.getDay();
        
        // Convertir el índice del día a la clave del día
        const dayKeys = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const dayKey = dayKeys[dayOfWeek];
        
        if (plan.exercises && Array.isArray(plan.exercises) && plan.exercises.length > 0) {
          
          // Convertir ejercicios de la API al formato local, filtrando ejercicios inválidos
          const apiExercises = plan.exercises
            .filter(apiExercise => {
              // Filtrar ejercicios sin datos válidos
              if (!apiExercise || !apiExercise.name || typeof apiExercise.name !== 'string') {
                return false;
              }
              
              // Filtrar nombres muy cortos, truncados o problemáticos
              const name = apiExercise.name.trim();
              if (name.length < 3 || name.includes('sin nombre') || name.includes('Compl')) {
                return false;
              }
              
              return true;
            })
            .map(apiExercise => {
              // Buscar el ejercicio correspondiente en nuestra lista local
              const localExercise = exercises.find(e => 
                e.name && e.name.toLowerCase() === apiExercise.name.toLowerCase()
              );
              
              // Solo usar ejercicios conocidos de nuestra lista local
              if (localExercise) {
                return localExercise;
              } else {
                return null;
              }
            })
            .filter(exercise => exercise !== null); // Eliminar ejercicios null
          
          // Agregar solo ejercicios válidos evitando duplicados
          if (apiExercises.length > 0) {
            if (!newDayExercises[dayKey]) {
              newDayExercises[dayKey] = [];
            }
            
            apiExercises.forEach(exercise => {
              const exists = newDayExercises[dayKey].some(e => e.id === exercise.id || e.name === exercise.name);
              if (!exists) {
                newDayExercises[dayKey].push(exercise);
              }
            });
          }
        } else {
          // Plan sin ejercicios
        }
      });
      
      
      // Combinar con los ejercicios que ya están en el estado local
      setDayExercises(prevDayExercises => {
        const combinedExercises: DayExercises = { ...prevDayExercises };
        
        // Para cada día de los nuevos ejercicios de la API
        Object.keys(newDayExercises).forEach(dayKey => {
          if (combinedExercises[dayKey]) {
            // Si ya hay ejercicios para este día, combinar evitando duplicados
            const existingExercises = combinedExercises[dayKey];
            const newExercisesForDay = newDayExercises[dayKey];
            
            newExercisesForDay.forEach(newExercise => {
              // Validar que el ejercicio es válido antes de agregarlo
              if (newExercise && newExercise.name && newExercise.name.trim().length >= 3 && 
                  !newExercise.name.includes('sin nombre') && !newExercise.name.includes('Compl')) {
                const exists = existingExercises.some(existing => existing.name === newExercise.name);
                if (!exists) {
                  existingExercises.push(newExercise);
                }
              }
            });
          } else {
            // Si no hay ejercicios para este día, usar solo los ejercicios válidos de la API
            const validExercises = newDayExercises[dayKey].filter(exercise => 
              exercise && exercise.name && exercise.name.trim().length >= 3 && 
              !exercise.name.includes('sin nombre') && !exercise.name.includes('Compl')
            );
            if (validExercises.length > 0) {
              combinedExercises[dayKey] = validExercises;
            }
          }
        });
        
        return combinedExercises;
      });
    }
  }, [plans]);

  // Guardar ejercicios en localStorage cuando cambien, filtrando ejercicios inválidos
  useEffect(() => {
    try {
      // Filtrar ejercicios válidos antes de guardar
      const validDayExercises: DayExercises = {};
      Object.keys(dayExercises).forEach(dayKey => {
        if (Array.isArray(dayExercises[dayKey])) {
          const validExercises = dayExercises[dayKey].filter(exercise => 
            exercise && 
            exercise.name && 
            typeof exercise.name === 'string' &&
            exercise.name.trim().length >= 3 && 
            !exercise.name.includes('sin nombre') && 
            !exercise.name.includes('Compl') &&
            !exercise.name.includes('Ejercicio sin nombre')
          );
          if (validExercises.length > 0) {
            validDayExercises[dayKey] = validExercises;
          }
        }
      });
      
      localStorage.setItem('fitlife-dayExercises', JSON.stringify(validDayExercises));
    } catch (error) {
      // Error silencioso - no afecta funcionalidad
    }
  }, [dayExercises]);

  // Limpiar localStorage si cambia el usuario o se cierra sesión
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('fitlife-dayExercises');
    }
  }, [isAuthenticated]);

  const handleDayClick = useCallback((day: string) => {
    setSelectedDay(day);
    setCurrentView('exercises');
    setSelectedExercises([]);
    setSelectedCategory('all');
  }, []);

  const handleExerciseToggle = useCallback((exercise: Exercise) => {
    setSelectedExercises(prev => {
      const exists = prev.find(e => e.id === exercise.id);
      if (exists) {
        return prev.filter(e => e.id !== exercise.id);
      } else {
        return [...prev, exercise];
      }
    });
  }, []);

  const handleContinueToSchedule = () => {
    if (selectedExercises.length > 0) {
      setCurrentView('schedule');
      setSelectedDaysForExercises([selectedDay]);
    }
  };

  const handleDayScheduleToggle = (day: string) => {
    setSelectedDaysForExercises(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleFinishSchedule = async () => {
    // Verificar autenticación antes de proceder
    if (!isAuthenticated) {
      setCreateError('Debes estar autenticado para crear rutinas');
      setTimeout(() => setCreateError(''), 5000);
      return;
    }

    // Debug: Verificar estado de autenticación
    console.log('🔍 Creando rutina para usuario autenticado');

    try {
      setIsCreatingPlan(true);
      const createdPlans: Array<{
        planId: string;
        dayName: string;
        exercises: Exercise[];
        trainingDay: string;
      }> = [];
      
      // Crear planes para cada día seleccionado
      for (const day of selectedDaysForExercises) {
        const dayName = daysOfWeek.find(d => d.key === day)?.name || day;
        
        // Formatear la fecha para el día (próximo día de la semana)
        const today = new Date();
        const dayIndex = daysOfWeek.findIndex(d => d.key === day);
        const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Ajustar para lunes = 0
        let daysUntilTarget = dayIndex - currentDayIndex;
        if (daysUntilTarget <= 0) daysUntilTarget += 7; // Si es hoy o pasó, programar para la próxima semana
        
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysUntilTarget);
        
        // Crear identificador único para el plan (con delay para evitar duplicados)
        const planTimestamp = Date.now() + Math.random() * 1000;
        const planId = `plan-${day}-${Math.floor(planTimestamp)}`;
        
        // Crear el plan de ejercicio
        const planData = {
          name: `Rutina de ${dayName}`,
          description: `ID:${planId} - Rutina programada para ${dayName} - Ejercicios: ${selectedExercises.map(e => e.name).join(', ')}`,
          trainingDay: targetDate.toISOString().split('T')[0] // Formato YYYY-MM-DD
        };
        
        // Crear el plan en la API
        await createPlan(planData);
        
        createdPlans.push({
          planId,
          dayName,
          exercises: [...selectedExercises],
          trainingDay: planData.trainingDay
        });
      }
      
      // Actualizar el estado local para mostrar en el calendario (FUERA del bucle)
      const newDayExercises = { ...dayExercises };
      selectedDaysForExercises.forEach(day => {
        newDayExercises[day] = [...(newDayExercises[day] || []), ...selectedExercises];
      });
      setDayExercises(newDayExercises);
      
      // Ahora agregar ejercicios a cada plan creado
      setCreationProgress('Buscando planes creados...');
      
      // Refrescar planes para obtener los IDs reales
      await refreshPlans();
      
      let totalExercises = 0;
      let addedExercises = 0;
      
      // Calcular total de ejercicios a agregar
      createdPlans.forEach(plan => {
        totalExercises += plan.exercises.length;
      });
      
      // Para cada plan creado, agregar sus ejercicios
      for (const createdPlan of createdPlans) {
        setCreationProgress(`Procesando plan de ${createdPlan.dayName}...`);
        
        // Buscar el plan en la lista actualizada
        const actualPlan = plans.find(p => 
          p.description.includes(createdPlan.planId) || 
          (p.name.includes(createdPlan.dayName) && p.trainingDay === createdPlan.trainingDay)
        );
        
        if (actualPlan) {
          
          // Agregar cada ejercicio al plan
          for (const exercise of createdPlan.exercises) {
            try {
              setCreationProgress(`Agregando ${exercise.name} (${addedExercises + 1}/${totalExercises})...`);
              
              await addExerciseToPlan(actualPlan.id, {
                name: exercise.name,
                description: `Ejercicio de ${exercise.category} - ${exercise.name}`,
                startTime: new Date().toISOString()
              });
              
              addedExercises++;
            } catch (exerciseError) {
              // Error silencioso - el hook maneja planes locales automáticamente
            }
          }
        }
      }
      
      setCreationProgress('Finalizando...');
      
      setCreationProgress('');
      
      // Limpiar selecciones
      setCurrentView('calendar');
      setSelectedExercises([]);
      setSelectedDaysForExercises([]);
      setSelectedDay('');
      
      // Mostrar mensaje de éxito
      setSuccessMessage(`¡Rutina creada exitosamente para ${selectedDaysForExercises.length} día${selectedDaysForExercises.length > 1 ? 's' : ''}! Los ejercicios se están agregando...`);
      setTimeout(() => setSuccessMessage(''), 10000); // Ocultar después de 10 segundos
      
      // Notificación de éxito
      notifications.notifyPlanCreated(`Rutina para ${selectedDaysForExercises.length} día${selectedDaysForExercises.length > 1 ? 's' : ''}`);
      
    } catch (err) {
      setCreateError('Error al crear la rutina. Por favor intenta de nuevo.');
      setTimeout(() => setCreateError(''), 5000);
      
      // Notificación de error
      notifications.notifyError('Error al crear rutina', 'No se pudo crear la rutina. Por favor intenta de nuevo.');
    } finally {
      setIsCreatingPlan(false);
    }
  };

  const handleRemoveExercise = useCallback((dayKey: string, exerciseIndex: number) => {
    const newDayExercises = { ...dayExercises };
    let removedExerciseName = '';
    
    if (newDayExercises[dayKey]) {
      // Obtener el nombre del ejercicio antes de eliminarlo
      removedExerciseName = newDayExercises[dayKey][exerciseIndex]?.name || 'ejercicio';
      
      newDayExercises[dayKey] = newDayExercises[dayKey].filter((_, index) => index !== exerciseIndex);
      if (newDayExercises[dayKey].length === 0) {
        delete newDayExercises[dayKey];
      }
      
      // Notificación de eliminación
      notifications.notifyExerciseRemoved(removedExerciseName);
    }
    setDayExercises(newDayExercises);
  }, [dayExercises, notifications]);

  const filteredExercises = useMemo(() => 
    selectedCategory === 'all' 
      ? exercises 
      : exercises.filter(exercise => exercise.category === selectedCategory),
    [selectedCategory]
  );

  const getTotalExercisesCount = useCallback(() => {
    return Object.values(dayExercises).reduce((total, exercises) => total + exercises.length, 0);
  }, [dayExercises]);

  // Función para programar recordatorio
  const handleScheduleReminder = useCallback(() => {
    const currentTime = new Date();
    const defaultTime = new Date(currentTime.getTime() + 5 * 60000); // 5 minutos desde ahora
    const timeString = defaultTime.toTimeString().slice(0, 5); // HH:MM format
    
    const userTime = prompt(
      `🕐 ¿A qué hora quieres que te recordemos hacer ejercicio?\n\nFormato: HH:MM (ejemplo: 14:30)\n\nSugerencia: ${timeString}\n\n💡 Tip: Usa "test" para probar inmediatamente`,
      timeString
    );
    
    if (userTime) {
      // Función especial para probar inmediatamente
      if (userTime.toLowerCase() === 'test') {
        setTimeout(() => {
          setShowReminderModal(true);
          notifications.showSuccess('⏰ ¡Modal de prueba!', 'Este es el modal que aparecerá a la hora programada');
        }, 1000);
        return;
      }
      
      // Validar formato de hora
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (timeRegex.test(userTime)) {
        reminder.setScheduledTime(userTime);
        reminder.scheduleNotification();
        notifications.showSuccess(
          '⏰ Recordatorio programado', 
          `Te notificaremos a las ${userTime} para hacer ejercicio`
        );
      } else {
        notifications.showError(
          'Formato de hora inválido', 
          'Por favor usa el formato HH:MM (ejemplo: 14:30)'
        );
      }
    }
  }, [reminder, notifications, setShowReminderModal]);

  // Función para manejar snooze (posponer 10 minutos)
  const handleSnooze = useCallback(() => {
    const now = new Date();
    const snoozeTime = new Date(now.getTime() + 10 * 60000); // 10 minutos
    const timeString = snoozeTime.toTimeString().slice(0, 5);
    
    reminder.setScheduledTime(timeString);
    reminder.scheduleNotification();
    setShowReminderModal(false);
    
    notifications.showInfo('⏰ Recordatorio pospuesto', 'Te recordaremos en 10 minutos');
  }, [reminder, notifications]);

  // Función para cerrar modal y cancelar recordatorio
  const handleCloseModal = useCallback(() => {
    setShowReminderModal(false);
    notifications.showSuccess('�️ ¡Excelente!', '¡A entrenar se ha dicho!');
  }, [notifications]);

  const renderCalendarView = () => (
    <div className="space-y-8">
      {/* Header mejorado */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mi Rutina Semanal
          </h1>
        </div>
        
        {/* Estadísticas */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 font-medium">
              {Object.keys(dayExercises).length} días activos
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">
              {getTotalExercisesCount()} ejercicios totales
            </span>
          </div>
        </div>
        
        {/* Botones de notificaciones y recordatorios */}
        <div className="flex justify-center gap-3 mt-4 flex-wrap">
          <Button
            onClick={handleScheduleReminder}
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-none shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <AlarmClock className="w-4 h-4 mr-2" />
            Notificarme
          </Button>
          
          <Button
            onClick={() => setShowReminderModal(true)}
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Probar Modal
          </Button>
          
          {reminder.isScheduled && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-sm">
              <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300 font-medium">
                En {reminder.timeUntilNotification}
              </span>
              <Button
                onClick={reminder.cancelNotification}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-green-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
          
         
        </div>
      </div>

      {/* Estado de la API */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-3 px-6 py-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-blue-700 dark:text-blue-300 font-medium">Cargando planes...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center py-4">
          <div className="px-6 py-3 bg-red-100 dark:bg-red-900/30 rounded-full border border-red-200 dark:border-red-800">
            <span className="text-red-700 dark:text-red-300 font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {createError && (
        <div className="flex justify-center items-center py-4">
          <div className="px-6 py-3 bg-red-100 dark:bg-red-900/30 rounded-full border border-red-200 dark:border-red-800">
            <span className="text-red-700 dark:text-red-300 font-medium">{createError}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="flex justify-center items-center py-4">
          <div className="px-6 py-3 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800">
            <span className="text-green-700 dark:text-green-300 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="flex justify-center items-center py-4">
          <div className="px-6 py-3 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800">
            <span className="text-green-700 dark:text-green-300 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Mensaje amigable para cuenta nueva sin planes */}
      {!isLoading && !error && plans.length === 0 && (
        <div className="flex justify-center items-center py-6">
          <div className="px-8 py-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700 max-w-md text-center">
            <div className="flex items-center justify-center mb-3">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              ¡Bienvenido a FitLife!
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-300 mb-4">
              Parece que es tu primera vez aquí. Comienza creando tu primera rutina de ejercicios seleccionando un día y agregando ejercicios.
            </p>
            <div className="text-xs text-blue-500 dark:text-blue-400">
              💡 Tip: Haz clic en cualquier día del calendario para empezar
            </div>
          </div>
        </div>
      )}

      {/* Mensaje informativo para modo local */}
      {plans.some(plan => plan.id.startsWith('local-')) && (
        <div className="flex justify-center items-center py-4">
          <div className="px-6 py-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700 max-w-2xl text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-700 dark:text-yellow-300 font-medium text-sm">
                Funcionando en modo local - Tus rutinas se guardan en tu dispositivo
              </span>
            </div>
          </div>
        </div>
      )}

      {creationProgress && (
        <div className="flex justify-center items-center py-4">
          <div className="px-6 py-3 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">{creationProgress}</span>
            </div>
          </div>
        </div>
      )}

      {/* Calendario mejorado */}
      <div className="max-w-7xl mx-auto">
        <SpotlightCard className="p-6 lg:p-8" spotlightColor="rgba(59, 130, 246, 0.15)">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 lg:gap-4">
            {daysOfWeek.map((day) => {
              const hasExercises = dayExercises[day.key]?.length > 0;
              return (
                <div
                  key={day.key}
                  onClick={() => handleDayClick(day.key)}
                  className={`group relative bg-white/70 dark:bg-transparent rounded-2xl p-4 lg:p-6 min-h-[240px] lg:min-h-[280px] max-h-[320px] w-full cursor-pointer transition-all duration-300 hover:scale-[1.02] border-2 ${
                    hasExercises 
                      ? 'border-blue-200 dark:border-blue-700 shadow-lg shadow-blue-100 dark:shadow-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  } hover:shadow-xl flex flex-col`}
                >
                  {/* Header del día */}
                  <div className="text-center mb-3 lg:mb-4 flex-shrink-0">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {day.short}
                    </div>
                    <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white mt-1">
                      {day.name}
                    </h3>
                  </div>

                  {/* Ejercicios */}
                  <div className="space-y-1.5 lg:space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    {dayExercises[day.key]?.slice(0, 5).map((exercise, index) => {
                      return (
                        <div
                          key={`${exercise.id}-${index}`}
                          className="group/exercise relative flex items-center gap-2 text-xs px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-lg lg:rounded-xl text-white font-medium shadow-sm transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 min-h-[32px] lg:min-h-[36px]"
                        >
                          {exercise.icon && (
                            <div className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 bg-white/20 rounded-md lg:rounded-lg backdrop-blur-sm flex-shrink-0">
                              <span className="text-xs lg:text-sm">{exercise.icon}</span>
                            </div>
                          )}
                          <div className="flex-1 flex flex-col min-w-0">
                            <span className="font-bold text-xs truncate">{exercise.name}</span>
                            <span className="text-xs opacity-80 capitalize leading-tight">
                              {exercise.category === 'upper' ? 'Superior' : 
                               exercise.category === 'lower' ? 'Inferior' : 
                               'Completo'}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveExercise(day.key, index);
                            }}
                            className="opacity-0 group-hover/exercise:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded-md backdrop-blur-sm flex-shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                    
                    {dayExercises[day.key]?.length > 5 && (
                      <div className="text-xs text-center text-gray-500 dark:text-gray-400 py-1">
                        +{dayExercises[day.key].length - 5} más
                      </div>
                    )}
                    
                    {(!dayExercises[day.key] || dayExercises[day.key].length === 0) && (
                      <div className="flex items-center justify-center h-full min-h-[120px] text-gray-400 dark:text-gray-500">
                        <div className="text-center">
                          <div className="text-xs">Sin ejercicios</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botón agregar */}
                  <div className="mt-3 lg:mt-4 flex justify-center flex-shrink-0">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs lg:text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                      <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span>{hasExercises ? 'Más' : 'Agregar'}</span>
                    </div>
                  </div>

                  {/* Indicador de estado */}
                  {hasExercises && (
                    <div className="absolute top-2 lg:top-3 right-2 lg:right-3 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-green-500 rounded-full shadow-sm"></div>
                  )}
                </div>
              );
            })}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );

  const renderExercisesView = () => (
    <div className="space-y-8">
      {/* Header mejorado */}
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentView('calendar')}
          className="p-3 hover:bg-gray-100 dark:hover:bg-transparent rounded-xl transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Elige qué entrenarás!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Selecciona los grupos musculares para el {daysOfWeek.find(d => d.key === selectedDay)?.name}
          </p>
        </div>
        {selectedExercises.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 font-medium">
              {selectedExercises.length} seleccionados
            </span>
          </div>
        )}
      </div>

      {/* Filtros por categoría */}
      <div className="flex flex-wrap gap-3 justify-center">
        {[
          { key: 'all', name: 'Todos', icon: '' },
          { key: 'upper', name: 'Tren Superior', icon: '' },
          { key: 'lower', name: 'Tren Inferior', icon: '' },
          { key: 'full', name: 'Cuerpo Completo', icon: '' }
        ].map((category) => (
          <Button
            key={category.key}
            onClick={() => setSelectedCategory(category.key as any)}
            variant={selectedCategory === category.key ? "default" : "ghost"}
            style={selectedCategory !== category.key ? {
              backgroundColor: '#ffffff !important',
              color: '#1f2937 !important',
              borderColor: '#d1d5db !important',
            } : {}}
            className={`px-6 py-3 rounded-full transition-all duration-300 ${
              selectedCategory === category.key
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                : '!bg-white dark:!bg-white !text-gray-800 dark:!text-gray-800 !border-2 !border-gray-300 dark:!border-gray-400 hover:!bg-gray-50 dark:hover:!bg-gray-50 hover:!border-gray-400 dark:hover:!border-gray-500 !shadow-md hover:!shadow-lg hover:scale-105'
            }`}
          >
            {category.icon && <span className="mr-2">{category.icon}</span>}
            {category.name}
          </Button>
        ))}
      </div>

      {/* Grid de ejercicios mejorado */}
      <div className="max-w-6xl mx-auto">
        <SpotlightCard className="p-6 lg:p-8" spotlightColor="rgba(139, 92, 246, 0.15)">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
            {filteredExercises.map((exercise) => {
              const isSelected = selectedExercises.find(e => e.id === exercise.id);
              const colorIndex = parseInt(exercise.id) - 1;
              const colorScheme = exerciseColors[colorIndex];
              
              // Estilo personalizado blanco para todos los ejercicios no seleccionados
              let buttonClass;
              let inlineStyle = {};
              if (!isSelected) {
                buttonClass = '!bg-white dark:!bg-white !text-gray-800 dark:!text-gray-800 !border-2 !border-gray-300 dark:!border-gray-400 hover:!bg-gray-50 dark:hover:!bg-gray-50 hover:!border-gray-400 dark:hover:!border-gray-500 !shadow-md hover:!shadow-lg';
                inlineStyle = {
                  backgroundColor: '#ffffff !important',
                  color: '#1f2937 !important',
                  borderColor: '#d1d5db !important',
                };
              } else {
                buttonClass = colorScheme.selected;
              }
              
              return (
                <Button
                  key={exercise.id}
                  onClick={() => handleExerciseToggle(exercise)}
                  variant={!isSelected ? "ghost" : "default"}
                  style={inlineStyle}
                  className={`relative aspect-square min-h-[80px] max-h-[120px] w-full text-xs lg:text-sm font-semibold transition-all duration-300 transform hover:scale-[1.02] lg:hover:scale-105 rounded-xl lg:rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center p-3 lg:p-4 ${buttonClass}`}
                >
                  <div className="flex flex-col items-center gap-1 lg:gap-2 text-center">
                    {exercise.icon && <span className="text-lg lg:text-2xl">{exercise.icon}</span>}
                    <span className="relative z-10 font-bold text-xs lg:text-sm leading-tight line-clamp-2">
                      {exercise.name}
                    </span>
                  </div>
                  
                  {isSelected && (
                    <>
                      <div className="absolute inset-0 bg-white/10 rounded-xl lg:rounded-2xl"></div>
                      <div className="absolute top-1 lg:top-2 right-1 lg:right-2 w-5 h-5 lg:w-6 lg:h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                      </div>
                    </>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Botón continuar mejorado */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedExercises.length > 0 
                ? `${selectedExercises.length} ejercicio${selectedExercises.length > 1 ? 's' : ''} seleccionado${selectedExercises.length > 1 ? 's' : ''}`
                : 'Selecciona al menos un ejercicio'
              }
            </div>
            <Button
              onClick={handleContinueToSchedule}
              disabled={selectedExercises.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              size="lg"
            >
              <span className="mr-2">Continuar</span>
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </Button>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );

  const renderScheduleView = () => (
    <div className="space-y-8">
      {/* Header mejorado */}
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          onClick={() => setCurrentView('exercises')}
          className="p-3 hover:bg-gray-100 dark:hover:bg-transparent rounded-xl transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Elige qué días entrenarás!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Selecciona los días de la semana para tus ejercicios
          </p>
        </div>
      </div>

      {/* Resumen de ejercicios seleccionados */}
      <div className="max-w-5xl mx-auto">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
          <CardHeader className="pb-3 lg:pb-4">
            <CardTitle className="text-center text-base lg:text-lg text-blue-800 dark:text-blue-200">
              Ejercicios seleccionados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 lg:gap-3">
              {selectedExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center gap-2 px-2.5 lg:px-3 py-1.5 lg:py-2 bg-white/70 dark:bg-transparent rounded-full shadow-sm border border-blue-200 dark:border-blue-700 min-h-[32px] lg:min-h-[36px] min-w-0"
                >
                  {exercise.icon && <span className="flex-shrink-0 text-sm">{exercise.icon}</span>}
                  <span className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {exercise.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selector de días mejorado */}
      <div className="max-w-4xl mx-auto">
        <SpotlightCard className="p-6 lg:p-8" spotlightColor="rgba(34, 197, 94, 0.15)">
          <div className="space-y-3 lg:space-y-4">
            {daysOfWeek.map((day) => {
              const isSelected = selectedDaysForExercises.includes(day.key);
              return (
                <div
                  key={day.key}
                  className={`flex items-center justify-between p-4 lg:p-6 rounded-xl lg:rounded-2xl border-2 transition-all duration-300 cursor-pointer min-h-[64px] lg:min-h-[72px] ${
                    isSelected
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-600 shadow-lg shadow-green-100 dark:shadow-green-900/20'
                      : 'bg-white/70 dark:bg-transparent border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md'
                  }`}
                  onClick={() => handleDayScheduleToggle(day.key)}
                >
                  <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center font-bold text-xs lg:text-sm flex-shrink-0 ${
                      isSelected
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {day.short}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-base lg:text-lg text-gray-900 dark:text-white truncate">
                        {day.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Clock className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                        <span>Horario recomendado: 13:00 PM</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                    isSelected
                      ? 'bg-green-500 border-green-500 scale-110'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 lg:w-5 lg:h-5 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botón finalizar mejorado */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedDaysForExercises.length > 0 
                ? `${selectedDaysForExercises.length} día${selectedDaysForExercises.length > 1 ? 's' : ''} seleccionado${selectedDaysForExercises.length > 1 ? 's' : ''}`
                : 'Selecciona al menos un día'
              }
            </div>
            <Button
              onClick={handleFinishSchedule}
              disabled={selectedDaysForExercises.length === 0 || isCreatingPlan}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              size="lg"
            >
              {isCreatingPlan ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando Rutina...
                </>
              ) : (
                <>
                  <span className="mr-2">Finalizar Rutina</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );

  // Verificar autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 flex items-center justify-center">
        <div className="flex items-center gap-3 px-6 py-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">Verificando autenticación...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acceso Restringido</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Necesitas iniciar sesión para acceder a tu rutina personalizada.
          </p>
          <Button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl"
          >
            Ir al Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 relative">
      {/* Contenido principal */}
      <div className="relative">
        <Header />
        <Breadcrumb />
        
        <main className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 lg:py-8 max-w-7xl">
          {currentView === 'calendar' && renderCalendarView()}
          {currentView === 'exercises' && renderExercisesView()}
          {currentView === 'schedule' && renderScheduleView()}
        </main>
      </div>
      
      {/* Modal de recordatorio de ejercicio */}
      <ExerciseReminderModal
        isOpen={showReminderModal}
        onClose={handleCloseModal}
        onSnooze={handleSnooze}
      />
    </div>
  );
}