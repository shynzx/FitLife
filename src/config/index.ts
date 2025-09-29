// Configuración de la aplicación
export const config = {
  // URL base de la API
  API_BASE_URL: import.meta.env.PROD 
    ? 'https://api.fitlife.com' // URL de producción
    : 'http://localhost:5188',   // URL de desarrollo
  
  // Configuración de autenticación
  AUTH: {
    TOKEN_KEY: 'authToken',
    USER_KEY: 'user',
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas en millisegundos
  },

  // Endpoints de la API
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/User/login',
      REGISTER: '/api/User/register',
      LOGOUT: '/api/User/logout',
      VERIFY_OTP: '/api/User/verify-otp',
      REFRESH: '/api/User/refresh',
      FORGOT_PASSWORD: '/api/User/forgot-password',
      RESET_PASSWORD: '/api/User/reset-password',
    },
    USER: {
      PROFILE: '/api/user/profile',
      UPDATE_PROFILE: '/api/user/profile',
      CHANGE_PASSWORD: '/api/user/change-password',
    },
    FITNESS: {
      WORKOUTS: '/api/fitness/workouts',
      EXERCISES: '/api/fitness/exercises',
      PROGRESS: '/api/fitness/progress',
    },
  },

  // Configuración de la UI
  UI: {
    ANIMATION_DURATION: 300,
    DEBOUNCE_TIME: 500,
  },
};

export default config;