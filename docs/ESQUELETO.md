# Esqueleto del proyecto

Este documento explica la base que se ha creado para **APPersonal** (solo lo necesario para la fase **v1**: `web` + `api` + `shared`). No hay ninguna funcionalidad implementada: solo la estructura, la configuración y un "hola mundo" en cada parte.

## Requisitos

- **Node.js 24** o superior (incluye npm 11).
- Instalar dependencias una vez desde la raíz: `npm install`.

---

## 📁 Estructura

```
APPersonal/
├── .github/workflows/ci.yml   # CI de GitHub Actions
├── docs/ESQUELETO.md          # este documento
├── shared/                    # lógica y tipos comunes (TS puro)
│   └── src/
│       ├── index.ts           # punto de entrada del paquete
│       └── index.test.ts      # test de ejemplo
├── api/                       # backend REST (Express)
│   ├── .env.example           # plantilla de variables de entorno
│   └── src/
│       ├── app.ts             # construye la app Express (rutas, middlewares)
│       ├── index.ts           # arranca el servidor en un puerto
│       └── app.test.ts        # test de ejemplo de GET /health
├── web/                       # frontend React + Vite
│   ├── index.html             # HTML base donde se monta React
│   ├── vite.config.ts         # configuración de Vite (proxy hacia la API)
│   └── src/
│       ├── main.tsx           # monta <App /> en el DOM
│       ├── App.tsx            # componente raíz ("hola mundo" + estado de la API)
│       └── App.test.tsx       # test de ejemplo
├── mcp/README.md              # reservado para v3 (vacío a propósito)
├── package.json               # raíz del monorepo: workspaces y scripts globales
├── tsconfig.base.json         # configuración TS común
├── eslint.config.js           # linter para todo el repo
├── .prettierrc / .prettierignore
├── .editorconfig / .gitattributes / .gitignore
└── package-lock.json          # versiones exactas instaladas (se sube a git)
```

### Qué es cada carpeta

| Carpeta              | Para qué está                                                                                                                                                                                                                                                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/`            | Código que no depende de ninguna plataforma. Lo importan `web` y `api` como `@appersonal/shared`. Aquí va lo que el README pide escribir **una sola vez** (tipos, cálculo del tiempo estimado, validaciones). Su `tsconfig` no incluye tipos de Node ni del navegador a propósito: si usas `window` o `process` aquí, TypeScript te avisará. |
| `api/`               | El backend: la **única fuente de verdad**. `app.ts` y `index.ts` están separados para que los tests puedan crear la app sin ocupar el puerto 3000.                                                                                                                                                                                           |
| `web/`               | El frontend. En v2 Tauri envolverá esta misma carpeta, por eso no hay una carpeta `desktop/`.                                                                                                                                                                                                                                                |
| `mcp/`               | Reservada para v3. No es un workspace todavía.                                                                                                                                                                                                                                                                                               |
| `.github/workflows/` | La CI: en cada push o PR a `main` ejecuta lint, formato, tipos y tests.                                                                                                                                                                                                                                                                      |
| `docs/`              | Documentación del proyecto.                                                                                                                                                                                                                                                                                                                  |

### Cómo funciona el monorepo (npm workspaces)

El `package.json` raíz declara `"workspaces": ["shared", "api", "web"]`. Con eso, `npm install` hace dos cosas:

1. Instala las dependencias de todos los paquetes en un único `node_modules/` en la raíz.
2. Crea un enlace `node_modules/@appersonal/shared` → `shared/`. Por eso `web` y `api` pueden escribir `import ... from '@appersonal/shared'` como si fuera una librería publicada, y los cambios en `shared` se ven al momento.

`shared/package.json` exporta directamente `./src/index.ts` (sin compilar), porque Vite (web) y tsx (api) entienden TypeScript sin problemas.

---

## ⚙️ Archivos de configuración

| Archivo                    | Para qué sirve                                                                                                                                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json` (raíz)      | Define los workspaces, los scripts globales y las herramientas comunes (TS, ESLint, Prettier, Vitest). `"type": "module"` hace que todo use `import/export`. `"private": true` evita publicarlo en npm por error. `engines` documenta que hace falta Node 24. |
| `*/package.json`           | Las dependencias y los scripts de cada paquete. El nombre `@appersonal/...` es un "scope" para que no choque con paquetes reales de npm.                                                                                                                      |
| `tsconfig.base.json`       | Opciones de TypeScript comunes (modo estricto, ESM, etc.), comentadas una a una. TS solo **comprueba tipos** (`noEmit`): quien ejecuta el código es Vite o tsx.                                                                                               |
| `*/tsconfig.json`          | Heredan de la base y añaden solo lo de su entorno: `web` añade el DOM y JSX, `api` añade los tipos de Node y `shared` no añade nada.                                                                                                                          |
| `eslint.config.js`         | Reglas de calidad de código (errores típicos, buenas prácticas de TS y, solo en `web`, las reglas de los hooks de React).                                                                                                                                     |
| `.prettierrc`              | Estilo de formato: comillas simples, punto y coma, comas finales y líneas de 100 columnas. Prettier formatea y ESLint detecta errores; no se pisan.                                                                                                           |
| `.prettierignore`          | Lo que Prettier no toca: código generado y tus `README.md`/`CLAUDE.md`, para respetar el formato con el que los escribes.                                                                                                                                     |
| `.editorconfig`            | Formato básico (UTF-8, 2 espacios, saltos de línea LF) que respeta cualquier editor.                                                                                                                                                                          |
| `.gitattributes`           | Obliga a que git guarde los archivos con saltos de línea LF aunque trabajes en Windows. Así evitas diffs "fantasma" y fallos de Prettier en la CI.                                                                                                            |
| `.gitignore`               | Lo que no se sube: `node_modules`, `dist`, `.env`...                                                                                                                                                                                                          |
| `api/.env.example`         | Plantilla de variables de entorno. Cópiala como `api/.env`: los scripts de la API la cargan con `--env-file-if-exists`, una opción de Node que funciona sin librerías extra. Si no existe, la API usa el puerto 3000.                                         |
| `web/vite.config.ts`       | Activa el plugin de React y un **proxy**: cuando la web pide `/health`, Vite lo reenvía a `localhost:3000`. Así no hace falta configurar CORS en desarrollo.                                                                                                  |
| `.github/workflows/ci.yml` | Instala con `npm ci` y ejecuta `lint`, `format:check`, `typecheck` y `test`.                                                                                                                                                                                  |

> Nota: los `package.json` no admiten comentarios (JSON puro). Por eso se explican aquí.

---

## 📦 Dependencias instaladas

### Raíz (herramientas de desarrollo comunes)

| Paquete                     | Qué hace                                                                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typescript` (~6.0.3)       | El compilador/comprobador de tipos (`tsc`). Se usa la 6.0 y no la 7 porque `typescript-eslint` aún no es compatible con TS 7. El `~` solo permite parches 6.0.x. |
| `eslint`                    | El linter.                                                                                                                                                       |
| `@eslint/js`                | Las reglas recomendadas de JavaScript para ESLint.                                                                                                               |
| `typescript-eslint`         | Permite a ESLint entender TypeScript y añade reglas específicas de TS.                                                                                           |
| `eslint-plugin-react-hooks` | Reglas de los hooks de React. Está en la raíz porque `eslint.config.js` vive en la raíz.                                                                         |
| `prettier`                  | El formateador automático.                                                                                                                                       |
| `vitest`                    | El test runner. Usa la configuración de Vite, así que entiende TS y JSX sin configuración extra.                                                                 |

### `api/`

| Paquete          | Tipo | Qué hace                                                                                        |
| ---------------- | ---- | ----------------------------------------------------------------------------------------------- |
| `express`        | prod | El framework HTTP (rutas, middlewares).                                                         |
| `@types/express` | dev  | Los tipos de TypeScript de Express.                                                             |
| `@types/node`    | dev  | Los tipos de las APIs de Node (`process`, `http`...), en versión 24 para coincidir con tu Node. |
| `tsx`            | dev  | Ejecuta TypeScript directamente en Node; con `watch`, reinicia la API al guardar.               |

### `web/`

| Paquete                            | Tipo | Qué hace                                         |
| ---------------------------------- | ---- | ------------------------------------------------ |
| `react`, `react-dom`               | prod | La librería de UI y su renderizador para el DOM. |
| `vite`                             | dev  | Servidor de desarrollo y empaquetador.           |
| `@vitejs/plugin-react`             | dev  | Soporte de JSX y recarga en caliente en Vite.    |
| `@types/react`, `@types/react-dom` | dev  | Los tipos de TypeScript de React.                |

`@appersonal/shared` aparece como dependencia de `web` y `api`, pero no se descarga de internet: es el enlace local del workspace.

**Lo que no se ha instalado a propósito:** base de datos u ORM, CORS, Testing Library/jsdom, Tauri y el SDK de MCP. Cada uno llegará cuando lo necesites.

> `npm audit` muestra 10 avisos moderados. Vienen de `minimatch`, que solo usan las herramientas de lint (en desarrollo, no llega a la app). El arreglo que propone es bajar a ESLint 9, así que se ha dejado así hasta que publiquen la versión corregida.

---

## ▶️ Comandos

Todos se ejecutan desde la **raíz** del repo.

| Comando                | Qué hace                                                          |
| ---------------------- | ----------------------------------------------------------------- |
| `npm install`          | Instala todo (la primera vez y cuando cambien dependencias).      |
| `npm run dev:api`      | Arranca la API en `http://localhost:3000` con recarga automática. |
| `npm run dev:web`      | Arranca la web en `http://localhost:5173`.                        |
| `npm test`             | Ejecuta los tests de los tres paquetes (una vez).                 |
| `npm run lint`         | Pasa ESLint a todo el repo.                                       |
| `npm run format`       | Formatea todo con Prettier.                                       |
| `npm run format:check` | Comprueba el formato sin cambiar nada (lo que hace la CI).        |
| `npm run typecheck`    | Comprueba los tipos de los tres paquetes.                         |

Para levantar todo usa **dos terminales**: una con `dev:api` y otra con `dev:web`. Al abrir la web debe poner "Estado de la API: ok". Si la API está apagada, pondrá "sin conexión".

Comandos de un solo paquete: `npm run <script> --workspace <paquete>`. Por ejemplo, `npm run test:watch --workspace shared` deja los tests de `shared` en modo vigilancia y los repite al guardar. `npm run build --workspace web` genera la web de producción en `web/dist/`.

Instalar una dependencia en un paquete concreto: `npm install <paquete> --workspace api` (o `-w api`).

---

## 🧭 Por dónde empezar

Los `TODO:` del código marcan dónde irá cada cosa. Búscalos todos con la búsqueda global del editor. Un orden razonable para v1:

1. **`shared/`**: empieza por modelar el dominio. ¿Qué datos tiene una tarea según el README? ¿Y una actualización de progreso? Después, la estimación del tiempo restante. Es una función pura, así que es el sitio perfecto para practicar **TDD**: escribe primero los casos en un `.test.ts` (sin historial, al 100 %, avance muy lento...) y luego la implementación.
2. **`api/`**: decide cómo vas a guardar los datos (README: SQLite en desarrollo, PostgreSQL después) y diseña los endpoints REST de las tareas. Fíjate en cómo `app.test.ts` prueba `/health`: el mismo patrón te sirve para probar tus endpoints.
3. **`web/`**: cuando la API responda, construye las vistas (lista + detalle). Acuérdate de añadir el prefijo de tus rutas al proxy de `vite.config.ts`.

Preguntas que conviene que te hagas antes de programar:

- ¿Qué parte de la lógica es "de negocio" (va a `shared`) y qué parte es solo de la API o de la UI?
- ¿Cómo organizarás las rutas de Express cuando haya más de un recurso (`express.Router`)?
- ¿Qué pasa en la web mientras la API carga o si falla?
