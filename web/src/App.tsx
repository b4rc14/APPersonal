// Componente raíz de la app. Ahora es solo un "hola mundo" que comprueba que la API responde.
import { useEffect, useState } from 'react';
import { APP_NAME } from '@appersonal/shared';

type ApiStatus = 'comprobando' | 'ok' | 'sin conexión';

export function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('comprobando');

  // Al montar el componente, pregunta a la API por /health (pasa por el proxy de Vite).
  useEffect(() => {
    fetch('/health')
      .then((response) => setApiStatus(response.ok ? 'ok' : 'sin conexión'))
      .catch(() => setApiStatus('sin conexión'));
  }, []);

  return (
    <main>
      <h1>{APP_NAME}</h1>
      <p>Estado de la API: {apiStatus}</p>

      {/* TODO: sustituir este contenido por el diseño real (lista de tareas a un lado y detalle al otro). */}
      {/* TODO: organizar las pantallas y componentes en carpetas propias dentro de src/. */}
      {/* TODO: las funciones específicas de plataforma (notificaciones, v2) irán aisladas en su propio módulo. */}
    </main>
  );
}
