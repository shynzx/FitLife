import { config } from '../config';

// Configuración base de la API
const API_BASE_URL = config.API_BASE_URL;

// Tipos para las peticiones de autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  expires?: string;
  success?: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
  requiresOTP?: boolean;
}

export interface OTPRequest {
  email: string;
  otpCode: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

// Tipos para Exercise API
export interface Exercise {
  id: string;
  name: string;
  description: string;
  startTime: string;
  createdAt: string;
  updatedAt: string;
  exercisePlanId: string;
}

export interface CreateExerciseRequest {
  name: string;
  description: string;
  startTime: string;
  exercisePlanId: string;
}

export interface UpdateExerciseRequest {
  name?: string;
  description?: string;
  startTime?: string;
}

// Tipos para ExercisePlan API
export interface ExercisePlan {
  id: string;
  name: string;
  description: string;
  trainingDay: string;
  exercises: Exercise[];
}

export interface CreateExercisePlanRequest {
  name: string;
  description: string;
  trainingDay: string;
  userId: string;
}

// Tipos para User API
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string | null;
  email: string;
  password: string;
  weight: number | null;
  height: number | null;
  age: number | null;
  createdAt: string;
  updatedAt: string;
  exercisePlans: ExercisePlan[] | null;
}

// Clase para manejar errores de la API
export class APIError extends Error {
  public status: number;
  public data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'APIError';
  }
}

// Función helper para manejar respuestas
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJSON = contentType && contentType.includes('application/json');
  
  let data;
  try {
    data = isJSON ? await response.json() : await response.text();
  } catch (error) {
    throw new APIError('Error al procesar la respuesta', response.status);
  }

  if (!response.ok) {
    console.log('❌ Error response details:', {
      status: response.status,
      statusText: response.statusText,
      data,
      isJSON
    });
    
    let message = 'Error en la petición';
    
    // Intentar extraer mensaje de error más específico
    if (isJSON && data) {
      if (data.message) {
        message = data.message;
      } else if (data.error) {
        message = data.error;
      } else if (data.title) {
        message = data.title;
      }
    } else if (typeof data === 'string') {
      message = data;
    }
    
    throw new APIError(message, response.status, data);
  }

  return data;
}

// Función para realizar peticiones HTTP
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const requestConfig: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Agregar token de autenticación si existe
  const token = localStorage.getItem(config.AUTH.TOKEN_KEY);
  if (token) {
    requestConfig.headers = {
      ...requestConfig.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, requestConfig);
    
    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Manejar errores de red
    throw new APIError(
      'Error de conexión. Verifica tu conexión a internet.',
      0
    );
  }
}

// Servicios de autenticación
export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Tu API acepta contraseñas en texto plano
    return apiRequest<LoginResponse>(config.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async verifyOTP(otpData: OTPRequest): Promise<LoginResponse> {
    return apiRequest<LoginResponse>(config.ENDPOINTS.AUTH.VERIFY_OTP, {
      method: 'POST',
      body: JSON.stringify(otpData),
    });
  },

  async register(userData: RegisterRequest): Promise<User> {
    return apiRequest<User>(config.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async logout(): Promise<void> {
    console.log('🔍 logout - Iniciando limpieza...');
    
    // Obtener el usuario actual antes de limpiar
    const currentUser = this.getCurrentUser();
    const currentUserId = currentUser?.id;
    
    console.log('🔍 logout - Usuario actual:', currentUserId);
    console.log('🔍 logout - localStorage antes:', { 
      token: localStorage.getItem(config.AUTH.TOKEN_KEY), 
      user: localStorage.getItem(config.AUTH.USER_KEY) 
    });
    
    // Limpiar tokens y datos de usuario
    localStorage.removeItem(config.AUTH.TOKEN_KEY);
    localStorage.removeItem(config.AUTH.USER_KEY);
    
    // NO eliminar planes del usuario - queremos que persistan
    // Solo limpiar datos de sesión temporales
    console.log('🔍 logout - Manteniendo planes del usuario para persistencia');
    
    // Limpiar datos específicos de la app que son temporales
    localStorage.removeItem('fitlife-dayExercises');
    localStorage.removeItem('fitlife-localPlans'); // Datos globales antiguos
    
    // Limpiar cualquier otro dato de sesión temporal
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Solo limpiar datos temporales, NO los planes de usuario
      if (key && key.startsWith('fitlife-') && !key.match(/^fitlife-plans-/)) {
        keysToRemove.push(key);
      }
      // Limpiar datos de auth temporales
      if (key && key.startsWith('auth') && key !== config.AUTH.TOKEN_KEY && key !== config.AUTH.USER_KEY) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('🔍 logout - localStorage después:', { 
      token: localStorage.getItem(config.AUTH.TOKEN_KEY), 
      user: localStorage.getItem(config.AUTH.USER_KEY),
      keysRemoved: keysToRemove,
      planesMantenidos: 'Los planes del usuario se mantienen para persistencia'
    });
  },

  async refreshToken(): Promise<LoginResponse> {
    return apiRequest<LoginResponse>(config.ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
    });
  },

  // Guardar datos de usuario en localStorage
  saveUserSession(token: string, user: any): void {
    console.log('🔍 saveUserSession - Guardando:', { token: token.substring(0, 20) + '...', user });
    localStorage.setItem(config.AUTH.TOKEN_KEY, token);
    if (user) {
      localStorage.setItem(config.AUTH.USER_KEY, JSON.stringify(user));
      console.log('🔍 saveUserSession - Usuario guardado en localStorage');
    } else {
      console.log('🔍 saveUserSession - Sin datos de usuario para guardar');
    }
  },

  // Obtener usuario actual
  getCurrentUser(): any {
    const userStr = localStorage.getItem(config.AUTH.USER_KEY);
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('🔍 getCurrentUser - Datos desde localStorage:', { userStr, user });
    return user;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem(config.AUTH.TOKEN_KEY);
    return !!token;
  }
};

// Servicios generales de la API
export const apiService = {
  // Función genérica para GET
  async get<T>(endpoint: string): Promise<T> {
    return apiRequest<T>(endpoint, { method: 'GET' });
  },

  // Función genérica para POST
  async post<T>(endpoint: string, data: any): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Función genérica para PUT
  async put<T>(endpoint: string, data: any): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Función genérica para DELETE
  async delete<T>(endpoint: string): Promise<T> {
    return apiRequest<T>(endpoint, { method: 'DELETE' });
  },
};

// Servicios para Exercise API
export const exerciseService = {
  // GET /api/Exercise?planId={planId}
  async getExercisesByPlan(planId: string): Promise<Exercise[]> {
    return apiRequest<Exercise[]>(`/api/Exercise?planId=${planId}`, {
      method: 'GET'
    });
  },

  // POST /api/Exercise
  async createExercise(exercise: CreateExerciseRequest): Promise<Exercise> {
    return apiRequest<Exercise>('/api/Exercise', {
      method: 'POST',
      body: JSON.stringify(exercise),
    });
  },

  // PUT /api/Exercise/{id}
  async updateExercise(id: string, exercise: UpdateExerciseRequest): Promise<Exercise> {
    return apiRequest<Exercise>(`/api/Exercise/${id}`, {
      method: 'PUT',
      body: JSON.stringify(exercise),
    });
  },

  // DELETE /api/Exercise/{id}
  async deleteExercise(id: string): Promise<void> {
    return apiRequest<void>(`/api/Exercise/${id}`, {
      method: 'DELETE'
    });
  },
};

// Servicios para ExercisePlan API
export const exercisePlanService = {
  // GET /api/ExercisePlan?userId={userId}
  async getExercisePlans(userId: string): Promise<ExercisePlan[]> {
    return apiRequest<ExercisePlan[]>(`/api/ExercisePlan?userId=${userId}`, {
      method: 'GET'
    });
  },

  // POST /api/ExercisePlan
  async createExercisePlan(plan: CreateExercisePlanRequest): Promise<ExercisePlan> {
    return apiRequest<ExercisePlan>('/api/ExercisePlan', {
      method: 'POST',
      body: JSON.stringify(plan),
    });
  },

  // PUT /api/ExercisePlan/{id}
  async updateExercisePlan(id: string, plan: Partial<CreateExercisePlanRequest>): Promise<ExercisePlan> {
    return apiRequest<ExercisePlan>(`/api/ExercisePlan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plan),
    });
  },

  // DELETE /api/ExercisePlan/{id}
  async deleteExercisePlan(id: string): Promise<void> {
    return apiRequest<void>(`/api/ExercisePlan/${id}`, {
      method: 'DELETE'
    });
  },
};

// Servicios para User API
export const userService = {
  // GET /api/User - Obtiene información del usuario autenticado
  async getCurrentUser(): Promise<User> {
    const response = await apiRequest<User[]>('/api/User', {
      method: 'GET'
    });
    // La API devuelve un array, tomamos el primer elemento (usuario actual)
    if (response && response.length > 0) {
      return response[0];
    }
    throw new Error('No se pudo obtener información del usuario');
  },
};

export default { authService, apiService, exerciseService, exercisePlanService, userService };