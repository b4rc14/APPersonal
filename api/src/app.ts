// Aquí se CONSTRUYE la aplicación Express (rutas y middlewares), pero no se arranca.
// Separarlo de index.ts permite que los tests creen la app sin ocupar un puerto fijo.
import express from 'express';
import { APP_NAME } from '@appersonal/shared';

export function createApp() {
  const app = express();

  // Middleware que convierte el cuerpo JSON de las peticiones en req.body.
  app.use(express.json());

  // Endpoint de salud: solo sirve para comprobar que la API está viva.
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', app: APP_NAME });
  });

  // TODO: registrar aquí las rutas de la API REST (cada recurso en su propio archivo/router).

  // TODO: middleware de manejo de errores (respuestas de error con un formato común).

  return app;
}
