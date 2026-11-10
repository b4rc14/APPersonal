// Test de ejemplo del frontend: renderiza <App /> a HTML (sin navegador)
// y comprueba que aparece el título. Usa react-dom/server, que ya viene con React.
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('muestra el nombre de la app', () => {
    const html = renderToString(<App />);

    expect(html).toContain('APPersonal');
  });
});

// TODO: para tests de componentes con interacción (clics, formularios) más adelante
//       valorarás añadir un entorno DOM (jsdom) y Testing Library. Ahora no hace falta.
