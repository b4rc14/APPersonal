# APPersonal

> App multiplataforma de organización personal para gestionar tareas y entregas, con subtareas creadas por IA, progreso visual, notificaciones e integración con Claude mediante un servidor MCP.

**Estado:** 🟡 En desarrollo (v1) · **Inicio:** noviembre 2026 · **Plataformas:** 🌐 Web → 🖥️ Escritorio (Windows / macOS / Linux) → 📱 Móvil

---

## 📌 Qué es y por qué

APPersonal centraliza todo lo que tengo que hacer, accesible desde cualquier dispositivo con los mismos datos:

- **Fechas de entrega** de cada tarea, bien visibles.
- **Enlaces directos** a la página donde se entrega cada cosa (p. ej. el Campus Virtual).
- **Subtareas** de cada tarea, para saber qué hay que hacer y qué falta.
- **Barra de progreso** por tarea, calculada a partir de las subtareas.
- **Notificaciones** de entregas próximas.
- **Conexión con Claude**: gestionar las tareas hablando con la IA ("¿qué tengo esta semana?", "divídeme la práctica de DAW en partes", "he terminado el CSS de la práctica").

Es el primero de los 4 proyectos personales de portfolio previstos hasta junio de 2028. Tiene un doble objetivo: usarlo de verdad en el día a día y demostrar capacidades técnicas reales (full-stack, app multiplataforma, backend desplegado e integración con IA).

---

## ✨ Funcionalidades

### Núcleo

- Crear, editar y eliminar tareas: título, descripción, proyecto (opcional), fecha límite y enlace de entrega.
- Proyectos creados por el usuario con el nombre y color que quiera (asignaturas, trabajos, partes de una app...), para que la app no se limite a estudiantes.
- Cada tarea se divide en **subtareas** (una checklist). **Las crea la IA** a través del MCP; desde la app, el usuario puede marcarlas como hechas, renombrarlas, borrarlas o añadir alguna (si la IA se equivoca o no hay una IA conectada).
- El progreso, de 0 a 100 %, **lo calcula la app** a partir de las subtareas completadas (opcionalmente, con un peso por subtarea) y se muestra con una barra visual. El usuario no introduce porcentajes.
- El estado (pendiente / en curso / completada) se deduce del progreso.
- Vista general ordenada por fecha de entrega, con las entregas próximas resaltadas.
- Vista de detalle de cada tarea, con su checklist de subtareas y el progreso.
- Diseño pensado para pantalla grande (lista de tareas a un lado y detalle al otro), adaptable a pantallas pequeñas.

### Integración con Claude (MCP)

Un servidor **MCP (Model Context Protocol)** expone herramientas que Claude puede invocar desde el chat:

| Herramienta                          | Descripción                                                  |
| ------------------------------------ | ------------------------------------------------------------ |
| `listar_tareas`                      | Lista las tareas, con filtros por fecha, estado o proyecto   |
| `crear_tarea`                        | Crea una tarea con fecha, enlace, etc.                       |
| `crear_subtareas`                    | Divide una tarea en subtareas (Claude propone el desglose)   |
| `completar_subtarea`                 | Marca una subtarea como hecha ("he terminado el CSS")        |
| `ver_tarea`                          | Devuelve el detalle de una tarea, con subtareas y progreso   |
| `completar_tarea` / `eliminar_tarea` | Gestión básica                                               |

La IA no calcula el progreso: crea y marca subtareas a partir de lo que le cuento, y el cálculo lo hace la app (exacto y sin coste). MCP es un estándar abierto, así que el mismo servidor sirve para otros clientes de IA compatibles. Eso sí, el soporte depende de cada app de IA (ver "Decisiones tomadas").

---

## 🏗️ Arquitectura

```
┌───────────────────────────┐
│  Frontend (React + Vite)  │
│  ├─ Web (navegador)       │      ┌──────────────────────┐      ┌─────────────┐
│  ├─ Escritorio (Tauri)    │ ───▶ │   Backend (API REST) │ ───▶ │  Base de    │
│  └─ Móvil (futuro)        │      │   fuente de verdad   │      │   datos     │
└───────────────────────────┘      └──────────────────────┘      └─────────────┘
                                              ▲
                                              │ llama a la misma API
                                   ┌──────────────────────┐
                                   │   Servidor MCP       │ ◀── Claude (chat)
                                   └──────────────────────┘
```

- **Backend**: API REST y base de datos. Es la única fuente de verdad, así que todas las plataformas ven los mismos datos.
- **Frontend**: una única app web en React. Tauri la empaqueta como app de escritorio sin reescribirla.
- **Servidor MCP**: una capa fina que traduce las llamadas de Claude a peticiones a la API. No tiene lógica de negocio propia.
- **`shared/`**: lógica común (tipos, cálculo del progreso, validaciones), escrita una vez y reutilizada en todas las plataformas.

### Decisiones tomadas

- **Web primero, después MCP, después escritorio y móvil.** El MCP va en la v2 porque las subtareas las crea la IA. La misma app web se usa en el navegador y, envuelta con **Tauri** (v3), como app de escritorio con instalador, icono y notificaciones del sistema.
- **React + Vite en lugar de Expo.** Al empezar por web/escritorio, React + Vite es más sencillo, da mejor experiencia en pantalla grande y es el mismo stack que [Rumbo](../Rumbo).
- **Móvil más adelante**, con Tauri 2 (que también genera apps de Android e iOS) o, si se queda corto, con Expo reutilizando `shared/` y la API y rehaciendo solo las pantallas.
- **Código preparado para varias plataformas desde el principio**: la lógica va en `shared/`, no dentro de los componentes, y las funciones específicas de una plataforma (notificaciones, etc.) van aisladas en su propio módulo.
- **MCP en lugar de una skill.** Una skill son solo instrucciones: no guarda datos ni tiene interfaz. MCP permite que Claude actúe sobre datos reales.
- **MCP primero en local, después en remoto.**
  - _Local_: el servidor corre en mi ordenador y lo usan Claude Desktop o Claude Code. Es gratis y rápido para iterar.
  - _Remoto_: se añade en claude.ai → Ajustes → Conectores, y funciona en web, escritorio y móvil. Requisitos: que el servidor sea **accesible públicamente** (Claude se conecta desde la nube de Anthropic) y que tenga **autenticación OAuth**, para que nadie más acceda a mis tareas.
- **MCP con otras IAs**: el servidor es el mismo para cualquier cliente compatible, pero el soporte depende de cada app de IA (Claude: conectores propios; ChatGPT: solo MCP remoto, en Developer Mode y con OAuth 2.1 + Dynamic Client Registration; la app de consumo de Gemini no admite conectores propios).
- **Alojamiento del backend**: en local durante el desarrollo. Para tener los mismos datos en varios dispositivos se despliega en el servidor de casa (expuesto de forma segura con Cloudflare Tunnel o Tailscale, sin abrir puertos) o en un plan gratuito de **Render** (backend; se duerme tras ~15 min sin tráfico) + **Neon** (PostgreSQL gratuito). Railway y Fly.io ya no tienen plan gratuito real para cuentas nuevas (revisado en noviembre de 2026).
- **Modelo de datos preparado para varios usuarios desde v1**: cada tarea y cada proyecto tienen un usuario dueño, aunque al principio solo exista yo. Así, abrirla a otras personas más adelante (cuentas + OAuth + MCP remoto) no obliga a migrar la base de datos.
- **Uso por otras personas**: primero mediante _self-hosting_ (cada uno ejecuta su copia con sus datos; repo público con licencia MIT, todo lo configurable en `.env`, instrucciones de instalación). Más adelante, si tiene sentido, versión multiusuario en la nube.
- **Sin coste extra en IA.** Usar el conector MCP desde Claude entra en la suscripción y gasta de los límites de uso normales. Que la app llame a Claude por su cuenta (API de Anthropic) se paga por token aparte, así que **las primeras versiones no usan la API**: toda la inteligencia ocurre en el chat.
- Transporte MCP: **Streamable HTTP**. SSE puede quedar obsoleto.

---

## 🗺️ Hoja de ruta

| Fase       | Contenido                                                                                                                                    | Estado       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **v1**     | API + base de datos + app web: tareas, proyectos, subtareas (checklist) y progreso calculado                                                 | 🟡 En curso  |
| **v2**     | Servidor MCP para usarla con Claude (crear tareas, desglosarlas en subtareas y marcarlas): primero en local, después en remoto con OAuth      | ⬜ Pendiente |
| **v3**     | App de escritorio con **Tauri** + notificaciones del sistema de entregas próximas                                                             | ⬜ Pendiente |
| **v4**     | Importación automática de entregas desde el Campus Virtual de la USC (Moodle exporta el calendario en **iCal**)                              | ⬜ Pendiente |
| **v5**     | App móvil (Tauri 2 o Expo) con los mismos datos                                                                                              | ⬜ Pendiente |
| **Futuro** | Estimación del tiempo restante y aviso de tareas en riesgo, interfaz visual dentro del chat (extensión de UI para MCP), soporte probado con otros modelos y versión multiusuario en la nube | ⬜ Pendiente |

> ⚠️ Evitar que el alcance crezca sin control: cerrar cada fase del todo antes de empezar la siguiente. Un proyecto está "terminado" cuando se usa a diario y tiene README, demo y tests.

### Plan de la v1

1. ✅ Arrancar y entender el esqueleto.
2. ✅ Modelo de datos en `shared/` (`Task`, `Subtask`, `Project`, con usuario dueño).
3. Cálculo del progreso en `shared/`, con tests.
4. Rutas REST de la API con datos en memoria.
5. Base de datos (SQLite) con una capa de repositorio (tipo DAO).
6. Web: maqueta en HTML + CSS + JS puro y después React conectado a la API.
7. Cierre: tests, CI en verde, demo y README de instalación.

---

## 🧰 Stack tecnológico

**TypeScript en todo**, el mismo stack que [Rumbo](../Rumbo) para reutilizar lo aprendido:

- **Frontend**: React + Vite.
- **Escritorio**: Tauri 2 (a partir de la v3 de la app).
- **Backend**: Node + Express.
- **MCP**: SDK oficial en TypeScript.
- **Base de datos**: PostgreSQL (o SQLite durante el desarrollo).
- **Tests**: Vitest.

### Estructura del repo (monorepo)

```
APPersonal/
├── web/      # Frontend React + Vite (y configuración de Tauri a partir de v3)
├── api/      # Backend REST
├── mcp/      # Servidor MCP (a partir de v2)
└── shared/   # Lógica y tipos comunes
```

---

## ✅ Buenas prácticas del repo (de cara al portfolio)

- Commits pequeños con mensajes claros, ramas y Pull Requests aunque trabaje solo.
- Tests y un workflow de **GitHub Actions** (CI), además de un linter y un formateador.
- Una demo (web desplegada y/o instalador de escritorio) con enlace en este README, y capturas o GIF.
- Repo fijado (_pinned_) en el perfil de GitHub y enlazado desde el README del perfil.

---

## 📝 Registro de decisiones

- **2026-11-01** — Definida la idea, la arquitectura (backend + cliente + MCP), las fases y la estrategia de costes (sin API de pago al principio).
- **2026-11-01** — Plataforma: app móvil (Expo / React Native). Stack TypeScript compartido con Rumbo.
- **2026-11-10** — **Cambio de enfoque: web y escritorio primero, móvil después.** Frontend en React + Vite empaquetado como app de escritorio con Tauri (v2). Se descarta Expo para el inicio.
- **2026-11-10** — Esqueleto del monorepo creado (`web/`, `api/`, `shared/`) con ESLint, Prettier, Vitest y CI. Backend en Express.
- **2026-11-10** — El backend se queda en Node/TypeScript (no Java) aunque DAW use servlets/JDBC: se transfieren los conceptos. Modelo de datos con usuario dueño desde v1. Uso por terceros vía self-hosting primero. Alojamiento gratuito: Render + Neon o servidor de casa.
- **2026-11-11** — Modelo de datos: "Asignatura" pasa a ser **Proyecto**, creado por el usuario, para no limitar la app a estudiantes; una tarea puede no tener proyecto. El estado se deduce del progreso. Fechas como `string` ISO 8601.
- **2026-11-11** — **El progreso lo calcula la app a partir de subtareas** (checklist), en lugar de un porcentaje introducido a mano. La IA no calcula el progreso (no ve el trabajo).
- **2026-11-11** — **Las subtareas las crea la IA** (vía MCP); el usuario puede marcarlas, editarlas, borrarlas y añadir alguna desde la app. Por eso **el MCP se adelanta a la v2** y el escritorio con Tauri pasa a la v3. **La estimación del tiempo restante y el aviso de riesgo salen de la v1** y quedan para "Futuro", cuando la base esté hecha.
