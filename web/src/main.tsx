// Punto de entrada del frontend: busca el <div id="root"> de index.html y renderiza <App /> dentro.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No se encontró el elemento #root en index.html');
}

// StrictMode solo actúa en desarrollo: ejecuta algunas cosas dos veces para destapar errores.
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
