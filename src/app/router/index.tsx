import { createBrowserRouter } from 'react-router-dom';
import { InicioSesion } from '../pages/inicioSesion';
import { Registro } from '../pages/registro';
import { Home } from '../pages/home';

// Configuración de rutas
export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true, // Ruta por defecto
        element: <Home />,
      },
      {
        path: "login",
        element: <InicioSesion />,
      },
      {
        path: "registro",
        element: <Registro />,
      },
      {
        path: "home",
        element: <Home />,
      },
    ],
  },
]);