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

  const refreshPlans = useCallback(async () => {
    if (!userId) {
      setError('Usuario no autenticado');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const fetchedPlans = await exercisePlanService.getExercisePlans(userId);
      setPlans(fetchedPlans);
    } catch (err: any) {
      console.error('Error fetching exercise plans:', err);
      
      // Si es un error 400, podría ser que simplemente no hay planes para este usuario
      // En lugar de mostrar error, simplemente dejamos la lista vacía
      if (err.status === 400) {
        console.log('No se encontraron planes para este usuario (400), iniciando con lista vacía');
        setPlans([]);
        setError(null);
      } else {
        setError(err.message || 'Error al cargar los planes de ejercicio');
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

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
      setPlans(prev => [...prev, newPlan]);
    } catch (err: any) {
      console.error('Error creating exercise plan:', err);
      setError(err.message || 'Error al crear el plan de ejercicio');
      throw err;
    }
  }, [userId]);

  const updatePlan = useCallback(async (id: string, planData: Partial<CreateExercisePlanRequest>) => {
    try {
      setError(null);
      const updatedPlan = await exercisePlanService.updateExercisePlan(id, planData);
      setPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan));
    } catch (err: any) {
      console.error('Error updating exercise plan:', err);
      setError(err.message || 'Error al actualizar el plan de ejercicio');
      throw err;
    }
  }, []);

  const deletePlan = useCallback(async (id: string) => {
    try {
      setError(null);
      await exercisePlanService.deleteExercisePlan(id);
      setPlans(prev => prev.filter(plan => plan.id !== id));
    } catch (err: any) {
      console.error('Error deleting exercise plan:', err);
      setError(err.message || 'Error al eliminar el plan de ejercicio');
      throw err;
    }
  }, []);

  const addExerciseToPlan = useCallback(async (planId: string, exerciseData: Omit<CreateExerciseRequest, 'exercisePlanId'>) => {
    try {
      setError(null);
      const newExercise = await exerciseService.createExercise({
        ...exerciseData,
        exercisePlanId: planId
      });

      // Actualizar el plan local con el nuevo ejercicio
      setPlans(prev => prev.map(plan => 
        plan.id === planId 
          ? { ...plan, exercises: [...plan.exercises, newExercise] }
          : plan
      ));
    } catch (err: any) {
      console.error('Error adding exercise to plan:', err);
      setError(err.message || 'Error al agregar ejercicio al plan');
      throw err;
    }
  }, []);

  const removeExerciseFromPlan = useCallback(async (exerciseId: string, planId: string) => {
    try {
      setError(null);
      await exerciseService.deleteExercise(exerciseId);

      // Remover el ejercicio del plan local
      setPlans(prev => prev.map(plan => 
        plan.id === planId 
          ? { ...plan, exercises: plan.exercises.filter(ex => ex.id !== exerciseId) }
          : plan
      ));
    } catch (err: any) {
      console.error('Error removing exercise from plan:', err);
      setError(err.message || 'Error al eliminar ejercicio del plan');
      throw err;
    }
  }, []);

  useEffect(() => {
    if (userId) {
      refreshPlans();
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