// Configuración de ESLint (formato "flat config", el estándar desde ESLint 9).
// Un único archivo para todo el monorepo: así las reglas son iguales en web, api y shared.
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default defineConfig(
  // Carpetas que ESLint no debe revisar (código generado o de terceros).
  { ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**'] },

  // Reglas recomendadas de JavaScript (errores típicos: variables sin usar, código inalcanzable...).
  js.configs.recommended,

  // Reglas recomendadas para TypeScript.
  tseslint.configs.recommended,

  // Solo para el frontend: reglas de los hooks de React (p. ej. no llamar hooks dentro de un if).
  {
    files: ['web/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
  },
);
