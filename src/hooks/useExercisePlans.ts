import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  exercisePlanService, 
  exerciseService, 
  authService
} from '../services/api';
import type { 
  ExercisePlan, 
  CreateExercisePlanRequest,
  CreateExerciseRequest 
} from '../services/api';

export interface UseExercisePlansReturn {
  plans: ExercisePlan[];
  isLoading: boolean;
  error: string | null;
  createPlan: (plan: Omit<CreateExercisePlanRequest, 'userId'>) => Promise<void>;
  updatePlan: (id: string, plan: Partial<CreateExercisePlanRequest>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  addExerciseToPlan: (planId: string, exercise: Omit<CreateExerciseRequest, 'exercisePlanId'>) => Promise<void>;
  removeExerciseFromPlan: (exerciseId: string, planId: string) => Promise<void>;
  refreshPlans: () => Promise<void>;
}

export const useExercisePlans = (): UseExercisePlansReturn => {
  const [plans, setPlans] = useState<ExercisePlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser = authService.getCurrentUser();
  const userId = currentUser?.id;

  // Función para obtener la clave de localStorage específica del usuario
  const getUserPlansKey = (userId: string) => `fitlife-plans-${userId}`;

  // Función para limpiar datos de otros usuarios
  const cleanOtherUsersData = useCallback((currentUserId: string) => {
    const allKeys = Object.keys(localStorage);
    const planKeys = allKeys.filter(key => key.startsWith('fitlife-plans-'));
    
    planKeys.forEach(key => {
      if (key !== getUserPlansKey(currentUserId)) {
        console.log(`🧹 Limpiando datos de otro usuario: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // También limpiar el localStorage global anterior si existe
    const oldGlobalPlans = localStorage.getItem('fitlife-localPlans');
    if (oldGlobalPlans) {
      console.log('🧹 Limpiando planes globales antiguos');
      localStorage.removeItem('fitlife-localPlans');
    }
  }, []);

  const refreshPlans = useCallback(async () => {
    if (!userId) {
      setError('Usuario no autenticado');
      setPlans([]);
      setIsLoading(false);
      return;
    }

    // Limpiar datos de otros usuarios
    cleanOtherUsersData(userId);

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Intentando cargar planes desde el servidor...');
      const fetchedPlans = await exercisePlanService.getExercisePlans(userId);
      setPlans(fetchedPlans);
      
      // IMPORTANTE: Guardar en localStorage específico del usuario para persistencia
      localStorage.setItem(getUserPlansKey(userId), JSON.stringify(fetchedPlans));
      console.log('✅ Planes del servidor guardados en localStorage para persistencia');
    } catch (err: any) {
      console.log('⚠️ Error cargando desde servidor, intentando localStorage...');
      
      // Para nuevas cuentas o errores del servidor, cargar desde localStorage
      if (err.status === 400 || err.status === 403 || err.status === 404 || err.status === 500) {
        // Intentar cargar planes locales específicos del usuario
        const userPlansKey = getUserPlansKey(userId);
        const userLocalPlans = JSON.parse(localStorage.getItem(userPlansKey) || '[]');
        
        if (userLocalPlans.length > 0) {
          console.log('📂 Cargando planes locales del usuario específico');
          console.log('📂 Planes encontrados:', userLocalPlans.length);
          setPlans(userLocalPlans);
        } else {
          console.log('📂 No hay planes guardados para este usuario - iniciando lista vacía');
          setPlans([]);
        }
        
        setError(null);
      } else {
        // Solo mostrar error para otros tipos de errores (problemas de red críticos, etc.)
        console.error('❌ Error crítico cargando planes:', err);
        setError(err.message || 'Error al cargar los planes de ejercicio');
        setPlans([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, cleanOtherUsersData]);

  const createPlan = useCallback(async (planData: Omit<CreateExercisePlanRequest, 'userId'>) => {
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    try {
      setError(null);
      
      const newPlan = await exercisePlanService.createExercisePlan({
        ...planData,
        userId
      });
      
      const updatedPlans = [...plans, newPlan];
      setPlans(updatedPlans);
      
      // IMPORTANTE: Guardar SIEMPRE en localStorage específico del usuario
      // tanto para planes del servidor como locales
      localStorage.setItem(getUserPlansKey(userId), JSON.stringify(updatedPlans));
      console.log('✅ Plan del servidor guardado en localStorage para persistencia');
    } catch (err: any) {
      console.error('Error creating exercise plan:', err);
      console.error('Error details:', {
        status: err.status,
        message: err.message,
        data: err.data
      });
      
      // Si es error 403, crear un plan local como fallback
      if (err.status === 403) {
        console.log('🔄 Servidor no disponible - Creando plan localmente');
        
        // Crear un plan "simulado" localmente
        const localPlan = {
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: planData.name,
          description: planData.description,
          trainingDay: planData.trainingDay,
          userId: userId,
          exercises: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const updatedPlans = [...plans, localPlan];
        setPlans(updatedPlans);
        
        // Guardar en localStorage específico del usuario
        localStorage.setItem(getUserPlansKey(userId), JSON.stringify(updatedPlans));
        
        console.log('✅ Plan creado localmente para usuario:', userId);
        return; // No lanzar error, plan creado exitosamente en modo local
      }
      
      let errorMessage = 'Error al crear el plan de ejercicio';
      
      if (err.status === 401) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      } else if (err.status === 405) {
        errorMessage = 'El servidor no permite esta operación. Verifica la configuración del servidor.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    }
  }, [userId, plans, getUserPlansKey]);

  const updatePlan = useCallback(async (id: string, planData: Partial<CreateExercisePlanRequest>) => {
    if (!userId) return;
    
    try {
      setError(null);
      const updatedPlan = await exercisePlanService.updateExercisePlan(id, planData);
      
      const updatedPlans = plans.map(plan => plan.id === id ? updatedPlan : plan);
      setPlans(updatedPlans);
      
      // Actualizar localStorage
      localStorage.setItem(getUserPlansKey(userId), JSON.stringify(updatedPlans));
    } catch (err: any) {
      console.error('Error updating exercise plan:', err);
      setError(err.message || 'Error al actualizar el plan de ejercicio');
      throw err;
    }
  }, [userId, plans, getUserPlansKey]);

  const deletePlan = useCallback(async (id: string) => {
    if (!userId) return;
    
    try {
      setError(null);
      await exercisePlanService.deleteExercisePlan(id);
      
      const updatedPlans = plans.filter(plan => plan.id !== id);
      setPlans(updatedPlans);
      
      // Actualizar localStorage
      localStorage.setItem(getUserPlansKey(userId), JSON.stringify(updatedPlans));
    } catch (err: any) {
      console.error('Error deleting exercise plan:', err);
      setError(err.message || 'Error al eliminar el plan de ejercicio');
      throw err;
    }
  }, [userId, plans, getUserPlansKey]);

  const addExerciseToPlan = useCallback(async (planId: string, exerciseData: Omit<CreateExerciseRequest, 'exercisePlanId'>) => {
    try {
      setError(null);
      
      // Si es un plan local, manejar localmente
      if (planId.startsWith('local-')) {
        const localExercise = {
          id: `local-exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...exerciseData,
          exercisePlanId: planId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Actualizar localStorage específico del usuario
        if (userId) {
          const userPlansKey = getUserPlansKey(userId);
          const userPlans = JSON.parse(localStorage.getItem(userPlansKey) || '[]');
          const planIndex = userPlans.findIndex((plan: any) => plan.id === planId);
          if (planIndex !== -1) {
            if (!userPlans[planIndex].exercises) {
              userPlans[planIndex].exercises = [];
            }
            userPlans[planIndex].exercises.push(localExercise);
            localStorage.setItem(userPlansKey, JSON.stringify(userPlans));
          }
        }

        // Actualizar el estado local
        const updatedPlans = plans.map(plan => 
          plan.id === planId 
            ? { ...plan, exercises: [...(plan.exercises || []), localExercise] }
            : plan
        );
        setPlans(updatedPlans);
        
        return;
      }
      
      // Para planes del servidor, usar la API
      const newExercise = await exerciseService.createExercise({
        ...exerciseData,
        exercisePlanId: planId
      });

      // Actualizar el plan local con el nuevo ejercicio
      const updatedPlans = plans.map(plan => 
        plan.id === planId 
          ? { ...plan, exercises: [...plan.exercises, newExercise] }
          : plan
      );
      setPlans(updatedPlans);
      
      // Actualizar localStorage
      if (userId) {
        localStorage.setItem(getUserPlansKey(userId), JSON.stringify(updatedPlans));
      }
    } catch (err: any) {
      console.error('Error adding exercise to plan:', err);
      setError(err.message || 'Error al agregar ejercicio al plan');
      throw err;
    }
  }, [userId, plans, getUserPlansKey]);

  const removeExerciseFromPlan = useCallback(async (exerciseId: string, planId: string) => {
    try {
      setError(null);
      
      // Si es un plan local, manejar localmente
      if (planId.startsWith('local-') || exerciseId.startsWith('local-exercise-')) {
        // Actualizar localStorage específico del usuario
        if (userId) {
          const userPlansKey = getUserPlansKey(userId);
          const userPlans = JSON.parse(localStorage.getItem(userPlansKey) || '[]');
          const planIndex = userPlans.findIndex((plan: any) => plan.id === planId);
          if (planIndex !== -1 && userPlans[planIndex].exercises) {
            userPlans[planIndex].exercises = userPlans[planIndex].exercises.filter(
              (exercise: any) => exercise.id !== exerciseId
            );
            localStorage.setItem(userPlansKey, JSON.stringify(userPlans));
          }
        }

        // Actualizar el estado local
        const updatedPlans = plans.map(plan => 
          plan.id === planId 
            ? { ...plan, exercises: plan.exercises.filter(ex => ex.id !== exerciseId) }
            : plan
        );
        setPlans(updatedPlans);
        
        return;
      }
      
      // Para ejercicios del servidor, usar la API
      await exerciseService.deleteExercise(exerciseId);

      // Remover el ejercicio del plan local
      const updatedPlans = plans.map(plan => 
        plan.id === planId 
          ? { ...plan, exercises: plan.exercises.filter(ex => ex.id !== exerciseId) }
          : plan
      );
      setPlans(updatedPlans);
      
      // Actualizar localStorage
      if (userId) {
        localStorage.setItem(getUserPlansKey(userId), JSON.stringify(updatedPlans));
      }
    } catch (err: any) {
      console.error('Error removing exercise from plan:', err);
      setError(err.message || 'Error al eliminar ejercicio del plan');
      throw err;
    }
  }, [userId, plans, getUserPlansKey]);

  useEffect(() => {
    console.log('🔍 useExercisePlans - Usuario cambió:', userId);
    if (userId) {
      refreshPlans();
    } else {
      // Si no hay usuario, limpiar datos
      console.log('🔍 useExercisePlans - No hay usuario, limpiando datos');
      setPlans([]);
      setError(null);
      setIsLoading(false);
    }
  }, [userId, refreshPlans]);

  return useMemo(() => ({
    plans,
    isLoading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    addExerciseToPlan,
    removeExerciseFromPlan,
    refreshPlans
  }), [
    plans,
    isLoading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    addExerciseToPlan,
    removeExerciseFromPlan,
    refreshPlans
  ]);
};