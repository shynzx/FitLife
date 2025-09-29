import { Header } from '../../components/Header';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ApiTester } from '../../components/dev/ApiTester';

export function ApiTest() {
  // Cambiar el título de la página
  useDocumentTitle('Prueba de API - FitLife');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumb />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Prueba de API
          </h1>
          <p className="text-xl text-gray-600">
            Herramienta para probar la conexión con tu API backend
          </p>
        </div>

        <ApiTester />
      </main>
    </div>
  );
}