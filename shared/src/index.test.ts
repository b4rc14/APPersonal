// Test de ejemplo de Vitest: solo demuestra cómo se escribe y ejecuta un test.
// Vitest encuentra automáticamente los archivos *.test.ts.
import { describe, expect, it } from 'vitest';
import { APP_NAME } from './index';

describe('shared', () => {
  it('exporta el nombre de la app', () => {
    expect(APP_NAME).toBe('APPersonal');
  });
});

// TODO: cuando implementes la estimación del tiempo restante, añade aquí (o en su propio
//       archivo .test.ts) casos como: sin historial, progreso al 100 %, avance muy lento...
