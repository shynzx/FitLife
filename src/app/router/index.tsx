import { createBrowserRouter } from 'react-router-dom';
import { InicioSesion } from '../pages/inicioSesion';
import { Registro } from '../pages/registro';
import { Home } from '../pages/home';
import { Meditacion } from '../pages/meditacion';
import { Mapa } from '../pages/mapa';
import { NotFound } from '../pages/notFound';

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
      {
        path: "meditacion",
        element: <Meditacion />,
      },
      {
        path: "mapa",
        element: <Mapa />,
      },
      {
        path: "*", // Catch-all route para páginas no encontradas
        element: <NotFound />,
      },
    ],
  },
]);