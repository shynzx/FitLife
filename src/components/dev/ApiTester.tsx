import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { authService, apiService } from '../../services/api';
import { config } from '../../config';
import { PasswordHasher } from '../../utils/passwordHasher';

export function ApiTester() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');

  const addResult = (message: string) => {
    setTestResults(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    addResult('🔄 Iniciando prueba de conexión...');

    try {
      // Hacer una petición a /health o /api/health que es más común
      let response;
      try {
        response = await fetch(`${config.API_BASE_URL}/health`);
      } catch (error) {
        // Si /health no existe, intentar con la raíz pero manejar el 404
        response = await fetch(config.API_BASE_URL);
      }
      
      if (response.ok) {
        addResult('✅ Conexión exitosa con la API');
        try {
          const data = await response.text();
          if (data) {
            addResult(`📄 Respuesta: ${data.substring(0, 100)}${data.length > 100 ? '...' : ''}`);
          }
        } catch (e) {
          // No problem if can't read response
        }
      } else if (response.status === 404) {
        addResult('⚠️ API conectada pero endpoint raíz no configurado (404) - Esto es normal');
        addResult('✅ La conexión con tu API funciona correctamente');
      } else {
        addResult(`⚠️ API responde pero con estado: ${response.status}`);
      }
    } catch (error) {
      addResult(`❌ Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }

    setIsLoading(false);
  };

  const testHealthCheck = async () => {
    setIsLoading(true);
    addResult('🔄 Probando health check...');

    try {
      const response = await apiService.get('/health');
      addResult(`✅ Health check exitoso: ${JSON.stringify(response)}`);
    } catch (error: any) {
      addResult(`❌ Error en health check: ${error.message}`);
    }

    setIsLoading(false);
  };

  const testLogin = async () => {
    setIsLoading(true);
    addResult('🔄 Probando login...');

    try {
      const response = await authService.login({
        email: testEmail,
        password: testPassword
      });
      addResult(`✅ Login response: ${JSON.stringify(response, null, 2)}`);
    } catch (error: any) {
      addResult(`❌ Error en login: ${error.message}`);
    }

    setIsLoading(false);
  };

  const testRegister = async () => {
    setIsLoading(true);
    addResult('🔄 Probando registro...');

    try {
      const response = await authService.register({
        email: testEmail,
        password: testPassword,
        name: 'Usuario de Prueba'
      });
      addResult(`✅ Register response: ${JSON.stringify(response, null, 2)}`);
    } catch (error: any) {
      addResult(`❌ Error en registro: ${error.message}`);
    }

    setIsLoading(false);
  };

  const testHashMethods = async () => {
    setIsLoading(true);
    addResult('🔄 Probando diferentes métodos de hash...');

    const examples = PasswordHasher.getHashExamples(testPassword);
    
    addResult('🔐 Ejemplos de hash para tu contraseña:');
    addResult(`  SHA256 (hex): ${examples.sha256_hex}`);
    addResult(`  SHA256 (base64): ${examples.sha256_base64}`);
    addResult(`  SHA512 (hex): ${examples.sha512_hex}`);
    addResult(`  MD5 (hex): ${examples.md5_hex}`);
    addResult(`  Bytes array: [${examples.bytes_array.slice(0, 5).join(', ')}...]`);

    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Probador de API</CardTitle>
        <p className="text-sm text-gray-600">
          Herramienta para probar la conexión con tu API en {config.API_BASE_URL}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuración de prueba */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email de prueba</label>
            <Input
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contraseña de prueba</label>
            <Input
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="password123"
            />
          </div>
        </div>

        {/* Botones de prueba */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <Button
            onClick={testConnection}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Conexión
          </Button>
          <Button
            onClick={testHealthCheck}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Health Check
          </Button>
          <Button
            onClick={testLogin}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Login
          </Button>
          <Button
            onClick={testRegister}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Registro
          </Button>
          <Button
            onClick={testHashMethods}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Hash Methods
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Resultados de Prueba</h3>
          <Button
            onClick={clearResults}
            variant="ghost"
            size="sm"
            className="text-gray-500"
          >
            Limpiar
          </Button>
        </div>

        {/* Resultados */}
        <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500 italic">No hay resultados aún. Ejecuta una prueba.</p>
          ) : (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`text-sm font-mono ${
                    result.includes('✅') 
                      ? 'text-green-600' 
                      : result.includes('❌') 
                      ? 'text-red-600' 
                      : result.includes('⚠️')
                      ? 'text-yellow-600'
                      : 'text-gray-700'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Información:</h4>
          <ul className="text-blue-700 space-y-1">
            <li>• La API debe estar ejecutándose en {config.API_BASE_URL}</li>
            <li>• Asegúrate de que CORS esté configurado para permitir {window.location.origin}</li>
            <li>• Los endpoints esperados son: /api/auth/login, /api/auth/register, /health</li>
            <li>• La respuesta debe incluir {`{ "success": true, "token": "...", "user": {...} }`}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}