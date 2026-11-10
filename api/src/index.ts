// Punto de entrada de la API: crea la app y la pone a escuchar en un puerto.
import { createApp } from './app';

// El puerto viene de la variable de entorno PORT (archivo .env); si no existe, 3000.
const port = Number(process.env.PORT ?? 3000);

// TODO: conectar con la base de datos antes de empezar a aceptar peticiones.

const app = createApp();

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
