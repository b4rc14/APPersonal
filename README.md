# APPersonal

> Aplicación de organización personal para gestionar tareas y entregas, con progreso visual, estimación del tiempo restante e integración con Claude mediante un servidor MCP.

**Estado:** 🟡 En planificación · **Inicio:** noviembre 2026

---

## 📌 Qué es y por qué

APPersonal centraliza todo lo que tengo que hacer en un único sitio:

- **Fechas de entrega** de cada tarea, bien visibles.
- **Enlaces directos** a la página donde se entrega cada cosa (p. ej. el Campus Virtual).
- **Barra de progreso** por tarea.
- **Tiempo estimado restante** al entrar en el detalle de cada tarea.
- **Conexión con Claude**: consultar y gestionar las tareas hablando con la IA ("¿qué tengo esta semana?", "marca la práctica de DAW al 60 %").

Es el primero de los 4 proyectos personales de portfolio previstos hasta junio de 2028. Tiene un doble objetivo: usarlo de verdad en el día a día y demostrar capacidades técnicas reales (full-stack, despliegue e integración con IA).

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
│   Web app    │ ───▶ │   Backend (API REST) │ ───▶ │  Base de    │
│  (frontend)  │      │   fuente de verdad   │      │   datos     │
└──────────────┘      └──────────────────────┘      └─────────────┘
                                 ▲
                                 │ llama a la misma API
                      ┌──────────────────────┐
                      │   Servidor MCP       │ ◀── Claude (chat)
                      └──────────────────────┘
```

- **Backend**: API REST y base de datos. Es la única fuente de verdad.
- **Frontend web**: la parte visual (calendario o lista, barras de progreso, tiempo restante, enlaces).
- **Servidor MCP**: una capa fina que traduce las llamadas de Claude a peticiones a la API. No tiene lógica de negocio propia.

### Decisiones tomadas
- **MCP en lugar de una skill.** Una skill son solo instrucciones: no guarda datos ni tiene interfaz. MCP permite que Claude actúe sobre datos reales.
- **Primero en local, después en remoto.**
  - *Local*: el servidor corre en mi ordenador y lo usan Claude Desktop o Claude Code. Es gratis y rápido para iterar.
  - *Remoto*: se añade en claude.ai → Ajustes → Conectores, y funciona en web, escritorio y móvil. Requisitos: que el servidor sea **accesible públicamente** (Claude se conecta desde la nube de Anthropic) y que tenga **autenticación OAuth**, para que nadie más acceda a mis tareas. Para alojarlo bastan los planes gratuitos de Cloudflare Workers, Render, Fly.io o similares.
- **Sin coste extra en IA.** Usar el conector MCP desde Claude entra en la suscripción y gasta de los límites de uso normales. Que la app llame a Claude por su cuenta (API de Anthropic) se paga por token aparte, así que **las primeras versiones no usan la API**: toda la inteligencia ocurre en el chat.
- Transporte MCP: **Streamable HTTP**. SSE puede quedar obsoleto.

---

## 🗺️ Hoja de ruta

| Fase | Contenido | Estado |
|---|---|---|
| **v1** | Backend + base de datos + web: tareas con fecha, enlace, progreso y tiempo estimado | ⬜ Pendiente |
| **v2** | Servidor MCP local para usarlo con Claude | ⬜ Pendiente |
| **v3** | Despliegue remoto con OAuth + importación automática de entregas desde el Campus Virtual de la USC (Moodle exporta el calendario en **iCal**) | ⬜ Pendiente |
| **v4** | Interfaz visual dentro del chat (extensión de UI para MCP) y soporte probado con otros modelos | ⬜ Pendiente |

> ⚠️ Evitar que el alcance crezca sin control: cerrar cada fase del todo antes de empezar la siguiente. Un proyecto está "terminado" cuando se usa a diario y tiene README, demo y tests.

---

## 🧰 Stack tecnológico

*Pendiente de decidir.* Puntos de partida:
- **Frontend**: React (ya lo he usado con Vite en la hackathon).
- **Backend**: aprovechar lo que se vea en DAW este curso.
- **MCP**: SDK oficial en TypeScript o Python.
- **Base de datos**: por decidir (SQLite para empezar en local / PostgreSQL al desplegar).

---

## ✅ Buenas prácticas del repo (de cara al portfolio)

- Commits pequeños con mensajes claros, ramas y Pull Requests aunque trabaje solo.
- Tests y un workflow de **GitHub Actions** (CI), además de un linter y un formateador.
- Una demo desplegada con enlace en este README, y capturas o GIF.
- Repo fijado (*pinned*) en el perfil de GitHub y enlazado desde el README del perfil.

---

## 🚀 Próximos pasos

1. Decidir el stack (backend y base de datos).
2. Diseñar el modelo de datos: `Tarea`, `ActualizaciónDeProgreso`, `Asignatura/Categoría`.
3. Crear el repositorio en GitHub con este README, `.gitignore` y la licencia.
4. Empezar la v1.

---

## 📝 Registro de decisiones

- **2026-11-01** — Definida la idea, la arquitectura (backend + web + MCP), las fases v1 a v4 y la estrategia de costes (sin API de pago al principio).
