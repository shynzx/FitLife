import { useLocation, Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb() {
  const location = useLocation();
  
  // Mapeo de rutas a nombres legibles
  const routeNames: Record<string, string> = {
    '/': 'Inicio',
    '/home': 'Inicio',
    '/login': 'Iniciar Sesión',
    '/registro': 'Registro',
    '/entrenamientos': 'Entrenamientos',
    '/nutricion': 'Nutrición',
    '/progreso': 'Progreso',
    '/meditacion': 'Meditación',
    '/comunidad': 'Comunidad',
    '/desafios': 'Desafíos'
  };

  // Generar breadcrumbs basado en la ruta actual
  const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    // No mostrar breadcrumbs en ciertas páginas
    if (pathname === '/' || pathname === '/home' || pathname === '/login' || pathname === '/registro') {
      return [];
    }

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/home' }
    ];

    const currentRoute = routeNames[pathname];
    if (currentRoute) {
      breadcrumbs.push({ label: currentRoute });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs(location.pathname);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-100 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <svg 
                  className="w-4 h-4 mx-2 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              
              {item.href ? (
                <Link 
                  to={item.href}
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
