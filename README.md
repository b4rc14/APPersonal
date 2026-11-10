# APPersonal

> App móvil de organización personal para gestionar tareas y entregas, con progreso visual, estimación del tiempo restante, notificaciones e integración con Claude mediante un servidor MCP.

**Estado:** 🟡 En planificación · **Inicio:** noviembre 2026 · **Plataforma:** 📱 Móvil (Android / iOS)

---

## 📌 Qué es y por qué

APPersonal centraliza en el móvil todo lo que tengo que hacer:

- **Fechas de entrega** de cada tarea, bien visibles.
- **Enlaces directos** a la página donde se entrega cada cosa (p. ej. el Campus Virtual).
- **Barra de progreso** por tarea.
- **Tiempo estimado restante** al entrar en el detalle de cada tarea.
- **Notificaciones** de entregas próximas y de tareas que van en riesgo.
- **Conexión con Claude**: consultar y gestionar las tareas hablando con la IA ("¿qué tengo esta semana?", "marca la práctica de DAW al 60 %").

Es el primero de los 4 proyectos personales de portfolio previstos hasta junio de 2028. Tiene un doble objetivo: usarlo de verdad en el día a día y demostrar capacidades técnicas reales (móvil, backend desplegado e integración con IA).

---

## ✨ Funcionalidades

### Núcleo
- Crear, editar y eliminar tareas: título, descripción, asignatura o categoría, fecha límite y enlace de entrega.
- Progreso por tarea, de 0 a 100 %, con barra visual.
- Vista general ordenada por urgencia, con las entregas próximas resaltadas.
- Vista de detalle de cada tarea, con el progreso y el tiempo estimado restante.

### Estimación del tiempo restante
Se calcula **sin IA** a partir de la velocidad de avance real:

1. Se registra un historial de actualizaciones de progreso de cada tarea (fecha y porcentaje).
2. Se calcula la velocidad media, es decir, el % de avance por día o por hora de trabajo.
3. Tiempo restante ≈ (100 − progreso actual) / velocidad.
4. Si aún no hay datos suficientes, se usa una estimación inicial introducida al crear la tarea.

Comparar lo que queda con el tiempo disponible hasta la fecha límite permite avisar de las tareas que van en riesgo.

### Integración con Claude (MCP)
Un servidor **MCP (Model Context Protocol)** expone herramientas que Claude puede invocar desde el chat:

| Herramienta | Descripción |
|---|---|
| `listar_tareas` | Lista las tareas, con filtros por fecha, estado o asignatura |
| `crear_tarea` | Crea una tarea con fecha, enlace, etc. |
| `actualizar_progreso` | Actualiza el % de avance de una tarea |
| `ver_tarea` | Devuelve el detalle de una tarea, con el tiempo estimado |
| `completar_tarea` / `eliminar_tarea` | Gestión básica |

MCP es un estándar abierto, así que el mismo servidor sirve para otros clientes de IA compatibles. La ampliación a otros modelos sale prácticamente gratis.

---

## 🏗️ Arquitectura

```
┌──────────────┐      ┌──────────────────────┐      ┌─────────────┐
│  App móvil   │ ───▶ │   Backend (API REST) │ ───▶ │  Base de    │
│ (Expo / RN)  │      │   desplegado, fuente │      │   datos     │
└──────────────┘      │   de verdad          │      └─────────────┘
                      └──────────────────────┘
                                 ▲
                                 │ llama a la misma API
                      ┌──────────────────────┐
                      │   Servidor MCP       │ ◀── Claude (chat)
                      └──────────────────────┘
```

- **Backend**: API REST y base de datos. Es la única fuente de verdad.
- **App móvil**: la parte visual (lista por urgencia, barras de progreso, tiempo restante, enlaces, notificaciones).
- **Servidor MCP**: una capa fina que traduce las llamadas de Claude a peticiones a la API. No tiene lógica de negocio propia.
- **`shared/`**: lógica común (cálculo del tiempo estimado, validaciones, tipos), escrita una vez y reutilizable si más adelante se añade una versión web.

### Decisiones tomadas
- **Móvil primero.** Las tareas y las fechas se consultan sobre todo desde el móvil, y las notificaciones aportan mucho. La versión web queda para más adelante.
- **Backend desplegado desde la v1.** El móvil necesita llegar a la API desde cualquier sitio, y el servidor MCP también la usa. Para uso personal bastan los planes gratuitos de Render, Railway, Fly.io o similares.
- **MCP en lugar de una skill.** Una skill son solo instrucciones: no guarda datos ni tiene interfaz. MCP permite que Claude actúe sobre datos reales.
- **MCP primero en local, después en remoto.**
  - *Local*: el servidor corre en mi ordenador y lo usan Claude Desktop o Claude Code. Es gratis y rápido para iterar.
  - *Remoto*: se añade en claude.ai → Ajustes → Conectores, y funciona en web, escritorio y móvil. Requisitos: que el servidor sea **accesible públicamente** (Claude se conecta desde la nube de Anthropic) y que tenga **autenticación OAuth**, para que nadie más acceda a mis tareas.
- **Sin coste extra en IA.** Usar el conector MCP desde Claude entra en la suscripción y gasta de los límites de uso normales. Que la app llame a Claude por su cuenta (API de Anthropic) se paga por token aparte, así que **las primeras versiones no usan la API**: toda la inteligencia ocurre en el chat.
- Transporte MCP: **Streamable HTTP**. SSE puede quedar obsoleto.

---

## 🗺️ Hoja de ruta

| Fase | Contenido | Estado |
|---|---|---|
| **v1** | API desplegada + app móvil: tareas con fecha, enlace, progreso y tiempo estimado | ⬜ Pendiente |
| **v2** | Notificaciones de entregas próximas y tareas en riesgo | ⬜ Pendiente |
| **v3** | Servidor MCP para usarla con Claude: primero en local, después en remoto con OAuth | ⬜ Pendiente |
| **v4** | Importación automática de entregas desde el Campus Virtual de la USC (Moodle exporta el calendario en **iCal**) | ⬜ Pendiente |
| **Futuro** | Versión web, interfaz visual dentro del chat (extensión de UI para MCP) y soporte probado con otros modelos | ⬜ Pendiente |

> ⚠️ Evitar que el alcance crezca sin control: cerrar cada fase del todo antes de empezar la siguiente. Un proyecto está "terminado" cuando se usa a diario y tiene README, demo y tests.
>
> Expo es nuevo para mí, así que la v1 irá algo más lenta. Si se alarga a febrero por los exámenes de enero, no pasa nada.

---

## 🧰 Stack tecnológico

**TypeScript en todo**, el mismo stack que el proyecto [Rumbo](../Rumbo) para reutilizar lo aprendido:

- **App móvil**: React Native con **Expo** (Android e iOS desde el mismo código).
- **Backend**: Node (Express o Fastify). Se puede adaptar a lo que se vea en DAW.
- **MCP**: SDK oficial en TypeScript.
- **Base de datos**: PostgreSQL (o SQLite durante el desarrollo).

### Estructura del repo (monorepo)
```
APPersonal/
├── mobile/   # App Expo
├── api/      # Backend REST
├── mcp/      # Servidor MCP
└── shared/   # Lógica y tipos comunes
```

---

## ✅ Buenas prácticas del repo (de cara al portfolio)

- Commits pequeños con mensajes claros, ramas y Pull Requests aunque trabaje solo.
- Tests y un workflow de **GitHub Actions** (CI), además de un linter y un formateador.
- Una demo (APK, enlace de Expo o vídeo) con enlace en este README, y capturas o GIF.
- Repo fijado (*pinned*) en el perfil de GitHub y enlazado desde el README del perfil.

---

## 🚀 Próximos pasos

1. Diseñar el modelo de datos: `Tarea`, `ActualizaciónDeProgreso`, `Asignatura/Categoría`.
2. Crear el repositorio en GitHub con este README, `.gitignore` y la licencia, y montar la estructura del monorepo.
3. Primer "hola mundo" con Expo en el móvil y la API desplegada.
4. Empezar la v1.

---

## 📝 Registro de decisiones

- **2026-11-01** — Definida la idea, la arquitectura (backend + cliente + MCP), las fases y la estrategia de costes (sin API de pago al principio).
- **2026-11-01** — Plataforma: **app móvil** (Expo / React Native). Stack TypeScript compartido con Rumbo. Backend desplegado desde la v1. Hoja de ruta reordenada (notificaciones en v2, MCP en v3, Moodle en v4).
