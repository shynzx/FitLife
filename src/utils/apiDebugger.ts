// Utilidad para debuggear las peticiones HTTP
export class APIDebugger {
  static logRequest(url: string, options: RequestInit, data?: any) {
    console.group('🔍 API Request Debug');
    console.log('📡 URL:', url);
    console.log('⚙️ Method:', options.method || 'GET');
    console.log('📋 Headers:', options.headers);
    
    if (data) {
      console.log('📄 Data being sent:');
      console.log('  - Type:', typeof data);
      console.log('  - Content:', data);
      
      // Si es un string JSON, parsearlo para mostrarlo mejor
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          console.log('  - Parsed JSON:', parsed);
          
          // Debug específico para login
          if (parsed.email && parsed.password) {
            console.log('🔐 Login Debug:');
            console.log('  - Email type:', typeof parsed.email, '→', parsed.email);
            console.log('  - Password type:', typeof parsed.password, '→', parsed.password);
            console.log('  - Password length:', parsed.password?.length);
            
            // Verificar si la contraseña contiene caracteres extraños
            const isPlainText = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(parsed.password);
            console.log('  - Password is plain text:', isPlainText);
          }
        } catch (e) {
          console.warn('  - Could not parse as JSON');
        }
      }
    }
    console.groupEnd();
  }

  static logResponse(url: string, response: Response, data?: any) {
    console.group('📨 API Response Debug');
    console.log('📡 URL:', url);
    console.log('📊 Status:', response.status, response.statusText);
    console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
    
    if (data) {
      console.log('📄 Response data:', data);
    }
    console.groupEnd();
  }
}

export default APIDebugger;