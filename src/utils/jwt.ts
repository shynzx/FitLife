// Función para decodificar JWT sin verificar la firma (solo para leer el payload)
export function decodeJWT(token: string): any {
  try {
    // JWT está en formato: header.payload.signature
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      throw new Error('Token JWT inválido');
    }
    
    // Convertir base64url a base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decodificar base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Función para extraer el userId del token JWT
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  return payload?.sub || null;
}

// Función para verificar si el token ha expirado
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}