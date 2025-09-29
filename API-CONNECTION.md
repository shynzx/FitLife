# Conexión con API Backend

## 🚀 Configuración Rápida

Tu frontend de FitLife está configurado para conectarse con tu API en `http://localhost:5188/`. Aquí tienes todo lo que necesitas saber:

### 📋 Endpoints Esperados

Tu API debe implementar estos endpoints:

#### Autenticación
```
POST /api/User/login
POST /api/User/register  
POST /api/User/verify-otp
POST /api/User/refresh
```

#### Endpoints Opcionales (para testing)
```
GET  /health              # Health check del servidor
GET  /api/health         # Health check de la API
GET  /                   # No necesario - puede devolver 404
```

### 📨 Formato de Peticiones

#### Login
```json
POST /api/User/login
Content-Type: application/json

{
  "email": "herreraloezae@gmail.com",
  "password": "12345678"
}
```
✅ **Confirmado:** Tu API acepta contraseñas en **texto plano** como se esperaba.

#### Registro
```json
POST /api/User/register  
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Nombre Usuario"
}
```

#### Verificación OTP
```json
POST /api/User/verify-otp
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "otpCode": "123456"
}
```

### 📤 Formato de Respuestas Esperadas

### 📤 Formato de Respuestas Esperadas

#### Respuesta de Login Exitoso (Formato Real de tu API)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNGNlMGRhOS1jYTU5LTQyZGQtYmMxNy1kNzViNmJmNTI0YjgiLCJlbWFpbCI6ImhlcnJlcmFsb2V6YWVAZ21haWwuY29tIiwianRpIjoiZmNiMzU3ODktMDdjMC00ZWVkLTlkZjMtZjVlZjNiMDViZmY0IiwiZXhwIjoxNzU5NzEzNTUxLCJpc3MiOiJBcHBGaXRMaWZlLkFQSSIsImF1ZCI6IkFwcEZpdExpZmUuQ2xpZW50In0.WL4CInlY-QJT-mv_BbaTUtnoJEtP71p-_C3Yjw_0FpE",
  "expires": "2025-10-06T01:19:11.4417863Z"
}
```
✅ **El frontend ahora está configurado para manejar exactamente este formato.**

#### Respuesta de Error (esperada)
```json
{
  "message": "Credenciales incorrectas"
}
```
O un código de estado HTTP 400/401 para errores.

#### Respuesta de Login que Requiere OTP
```json
{
  "success": true,
  "requiresOTP": true,
  "message": "Se ha enviado un código OTP a tu correo"
}
```

#### Respuesta de Error
```json
{
  "success": false,
  "message": "Credenciales incorrectas"
}
```

### 🔧 Configuración CORS ⚠️ **IMPORTANTE**

**Error actual:** `Access to fetch at 'http://localhost:5188/' from origin 'http://localhost:5173' has been blocked by CORS policy`

Tu API **DEBE** configurar CORS para permitir peticiones desde tu frontend:

#### Para ASP.NET Core (.NET)
```csharp
// En Program.cs o Startup.cs
app.UseCors(builder => builder
    .WithOrigins("http://localhost:5173", "http://localhost:3000")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());
```

#### Para Express.js (Node.js)
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### Para FastAPI (Python)
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Verificación CORS
✅ **Después de configurar CORS en tu API:**
1. Reinicia tu servidor API
2. Ve a `http://localhost:5173/api-test`
3. Prueba la conexión con el botón "Conexión"

### 🔍 **Estado Actual - ¡Funcionando!**

Tu API está funcionando perfectamente:
```
📡 URL: http://localhost:5188/api/User/login ✅
⚙️ Method: POST ✅
📋 Headers: {Content-Type: 'application/json'} ✅
📄 Data: {"email":"herreraloezae@gmail.com","password":"12345678"} ✅
📨 Response: 200 OK ✅
🔐 Token recibido: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ✅
⏰ Expires: 2025-10-06T01:19:11.4417863Z ✅
```

**El frontend ahora maneja correctamente el formato de respuesta de tu API.**

### 🧪 Probar la Conexión

1. Asegúrate de que tu API esté ejecutándose en `http://localhost:5188/`
2. Visita `http://localhost:5173/api-test` en tu frontend
3. Usa el probador de API para verificar la conexión

### 📁 Estructura del Proyecto

```
src/
├── services/
│   └── api.ts          # Servicios para comunicación con la API
├── hooks/
│   └── useAuth.ts      # Hook para manejo de autenticación
├── config/
│   └── index.ts        # Configuración de la aplicación
└── components/
    └── dev/
        └── ApiTester.tsx # Componente para probar la API
```

### 🔐 Autenticación

El sistema maneja automáticamente:
- Almacenamiento de tokens JWT en localStorage
- Inclusión de tokens en headers de peticiones
- Redirección automática después del login
- Manejo de estados de carga y errores

### ⚙️ Personalizar la URL de la API

Para cambiar la URL de la API, edita el archivo `src/config/index.ts`:

```typescript
export const config = {
  API_BASE_URL: 'http://tu-api-personalizada:puerto',
  // ...resto de configuración
};
```

### 🐛 Solución de Problemas

#### ✅ Error 404 en Ruta Raíz (Normal)
```
GET http://localhost:5188/ net::ERR_ABORTED 404 (Not Found)
```
**Esto es normal!** Tu API no necesita responder en la ruta raíz `/`. El error 404 significa que la conexión funciona correctamente, solo que no hay contenido en esa ruta.

#### ❌ Error CORS 
```
Access to fetch at 'http://localhost:5188/' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```
**Solución:** Configurar CORS en tu API (ver sección anterior) y reiniciar el servidor.

#### Error de Conexión Real
- **ERR_NETWORK_CHANGED**: Problema de red o la API no está ejecutándose
- **ERR_CONNECTION_REFUSED**: La API no está corriendo en el puerto 5188
- Verifica que tu API esté ejecutándose en `http://localhost:5188/`

#### ⚠️ Contraseña aparece como bytea/binary
```
Password: [binary data] o bytea en lugar de texto
Frontend envía: "password": "12345678" ← CORRECTO
API recibe como: bytea/binary ← INCORRECTO
```
**El frontend está enviando los datos correctamente.** El problema está en tu backend.

**Soluciones en tu API Backend:**

1. **Verificar el modelo de datos:**
```csharp
// ✅ Correcto
public class LoginRequest 
{
    public string Email { get; set; }
    public string Password { get; set; }  // <- string, NO byte[]
}

// ❌ Incorrecto
public class LoginRequest 
{
    public string Email { get; set; }
    public byte[] Password { get; set; }  // <- NO hacer esto
}
```

2. **Verificar el atributo [FromBody]:**
```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    // request.Password debe ser string "12345678"
    Console.WriteLine($"Password received: {request.Password}");
    Console.WriteLine($"Password type: {request.Password?.GetType()}");
}
```

3. **Verificar configuración JSON:**
```csharp
// En Program.cs o Startup.cs
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
```

#### Error 404 en Endpoints de API
- Verifica que los endpoints estén implementados: `/api/User/login`, `/api/User/register`
- Comprueba las rutas en tu API

#### Token no Válido
- Verifica la implementación de JWT en tu backend
- Comprueba que el token se esté enviando correctamente

### 📖 Uso en Componentes

```typescript
import { useAuth } from '../hooks/useAuth';

function MiComponente() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: 'test@example.com',
      password: 'password123'
    });
    
    if (result.success) {
      // Login exitoso
    }
  };

  return (
    // Tu JSX aquí
  );
}
```

### 🔄 Estados de la Aplicación

El hook `useAuth` proporciona:
- `isAuthenticated`: boolean - Si el usuario está autenticado
- `user`: object - Datos del usuario actual
- `isLoading`: boolean - Si hay una petición en curso
- `error`: string - Mensaje de error actual
- `login()`: function - Función para iniciar sesión
- `logout()`: function - Función para cerrar sesión
- `clearError()`: function - Limpiar errores

¡Tu frontend está listo para conectarse con cualquier backend que implemente estos endpoints! 🎉