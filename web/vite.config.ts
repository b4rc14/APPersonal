// Configuración de Vite: el servidor de desarrollo y empaquetador del frontend.
// Vitest también lee este archivo, así que los tests entienden JSX igual que la app.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Plugin oficial de React: JSX y recarga en caliente (los cambios se ven sin recargar la página).
  plugins: [react()],

  server: {
    port: 5173,
    // Proxy: las peticiones de la web a /health se reenvían a la API (puerto 3000).
    // Así web y API parecen el mismo origen y no hay que configurar CORS en desarrollo.
    proxy: {
      '/health': 'http://localhost:3000',
      // TODO: cuando crees las rutas de la API, añade aquí su prefijo para que también pasen por el proxy.
    },
  },

  // TODO (v2): Tauri necesitará ajustes aquí (puerto fijo, no limpiar la pantalla...). No antes de v2.
});
