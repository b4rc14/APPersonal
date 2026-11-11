# APPersonal

> App multiplataforma de organización personal para gestionar tareas y entregas, con progreso visual, estimación del tiempo restante, notificaciones e integración con Claude mediante un servidor MCP.

**Estado:** 🟡 En planificación · **Inicio:** noviembre 2026 · **Plataformas:** 🌐 Web → 🖥️ Escritorio (Windows / macOS / Linux) → 📱 Móvil

---

## 📌 Qué es y por qué

APPersonal centraliza todo lo que tengo que hacer, accesible desde cualquier dispositivo con los mismos datos:

- **Fechas de entrega** de cada tarea, bien visibles.
- **Enlaces directos** a la página donde se entrega cada cosa (p. ej. el Campus Virtual).
- **Barra de progreso** por tarea.
- **Tiempo estimado restante** al entrar en el detalle de cada tarea.
- **Notificaciones** de entregas próximas y de tareas que van en riesgo.
- **Conexión con Claude**: consultar y gestionar las tareas hablando con la IA ("¿qué tengo esta semana?", "divídeme la práctica de DAW en partes", "he terminado el CSS de la práctica").

---

## ✨ Funcionalidades

### Núcleo
- Crear, editar y eliminar tareas: título, descripción, proyecto (opcional), fecha límite, enlace de entrega y estimación inicial.
- Proyectos creados por el usuario con el nombre y color que quiera (asignaturas, trabajos, partes de una app...), para que la app no se limite a estudiantes.
- Cada tarea se divide en **subtareas** (una checklist). El progreso, de 0 a 100 %, **lo calcula la app** a partir de las subtareas completadas (opcionalmente, con un peso por subtarea) y se muestra con una barra visual. El usuario no introduce porcentajes.
- El estado (pendiente / en curso / completada) se deduce del progreso; "en riesgo" se calcula, no se guarda.
- Vista general ordenada por urgencia, con las entregas próximas resaltadas.
- Vista de detalle de cada tarea, con el progreso y el tiempo estimado restante.
- Diseño pensado para pantalla grande (lista de tareas a un lado y detalle al otro), adaptable a pantallas pequeñas.

### Estimación del tiempo restante
Se calcula **sin IA** a partir de la velocidad de avance real:

1. El historial de avance sale de las subtareas: se guarda la fecha en que se completa cada una (y la fecha de creación de la tarea como punto de partida).
2. Se calcula la velocidad media, es decir, el % de avance por unidad de tiempo.
3. Tiempo restante ≈ (100 − progreso actual) / velocidad.
4. Si aún no hay datos suficientes, se usa una estimación inicial introducida al crear la tarea.

Comparar lo que queda con el tiempo disponible hasta la fecha límite permite avisar de las tareas que van en riesgo.

### Integración con Claude (MCP)
Un servidor **MCP (Model Context Protocol)** expone herramientas que Claude puede invocar desde el chat:

| Herramienta | Descripción |
|---|---|
| `listar_tareas` | Lista las tareas, con filtros por fecha, estado o proyecto |
| `crear_tarea` | Crea una tarea con fecha, enlace, etc. |
| `crear_subtareas` | Divide una tarea en subtareas (Claude propone el desglose) |
| `completar_subtarea` | Marca una subtarea como hecha ("he terminado el CSS") |
| `ver_tarea` | Devuelve el detalle de una tarea, con el tiempo estimado |
| `completar_tarea` / `eliminar_tarea` | Gestión básica |

MCP es un estándar abierto, así que el mismo servidor sirve para otros clientes de IA compatibles. La ampliación a otros modelos sale prácticamente gratis.

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
- **`shared/`**: lógica común (cálculo del tiempo estimado, validaciones, tipos), escrita una vez y reutilizada en todas las plataformas.

### Decisiones tomadas
- **Web y escritorio primero, móvil después.** La misma app web se usa en el navegador y, envuelta con **Tauri**, como app de escritorio con instalador, icono y notificaciones del sistema.
- **React + Vite en lugar de Expo.** Al empezar por escritorio, React + Vite es más sencillo, da mejor experiencia en pantalla grande y es el mismo stack que [Rumbo](../Rumbo).
- **Móvil más adelante**, con Tauri 2 (que también genera apps de Android e iOS) o, si se queda corto, con Expo reutilizando `shared/` y la API y rehaciendo solo las pantallas.
- **Código preparado para varias plataformas desde el principio**: la lógica va en `shared/`, no dentro de los componentes, y las funciones específicas de una plataforma (notificaciones, etc.) van aisladas en su propio módulo.
- **MCP en lugar de una skill.** Una skill son solo instrucciones: no guarda datos ni tiene interfaz. MCP permite que Claude actúe sobre datos reales.
- **MCP primero en local, después en remoto.**
  - *Local*: el servidor corre en mi ordenador y lo usan Claude Desktop o Claude Code. Es gratis y rápido para iterar.
  - *Remoto*: se añade en claude.ai → Ajustes → Conectores, y funciona en web, escritorio y móvil. Requisitos: que el servidor sea **accesible públicamente** (Claude se conecta desde la nube de Anthropic) y que tenga **autenticación OAuth**, para que nadie más acceda a mis tareas.
- **Alojamiento del backend**: en local durante el desarrollo. Para tener los mismos datos en varios dispositivos se despliega en el servidor de casa (expuesto de forma segura con Cloudflare Tunnel o Tailscale, sin abrir puertos) o en un plan gratuito de **Render** (backend; se duerme tras ~15 min sin tráfico) + **Neon** (PostgreSQL gratuito). Railway y Fly.io ya no tienen plan gratuito real para cuentas nuevas (revisado en noviembre de 2026).
- **Modelo de datos preparado para varios usuarios desde v1**: cada tarea tiene un usuario dueño, aunque al principio solo exista yo. Así, abrirla a otras personas más adelante (cuentas + OAuth + MCP remoto) no obliga a migrar la base de datos.
- **Uso por otras personas**: primero mediante *self-hosting* (cada uno ejecuta su copia con sus datos; repo público con licencia MIT, todo lo configurable en `.env`, instrucciones de instalación). Más adelante, si tiene sentido, versión multiusuario en la nube.
- **MCP con otras IAs**: el servidor es el mismo para cualquier cliente compatible, pero el soporte depende de cada app de IA (Claude: conectores propios; ChatGPT: solo MCP remoto, en Developer Mode y con OAuth 2.1 + Dynamic Client Registration; la app de consumo de Gemini no admite conectores propios).
- **Sin coste extra en IA.** Usar el conector MCP desde Claude entra en la suscripción y gasta de los límites de uso normales. Que la app llame a Claude por su cuenta (API de Anthropic) se paga por token aparte, así que **las primeras versiones no usan la API**: toda la inteligencia ocurre en el chat.
- Transporte MCP: **Streamable HTTP**. SSE puede quedar obsoleto.

---

## 🗺️ Hoja de ruta

| Fase | Contenido | Estado |
|---|---|---|
| **v1** | API + base de datos + app web: tareas con fecha, enlace, progreso y tiempo estimado | ⬜ Pendiente |
| **v2** | App de escritorio con **Tauri** + notificaciones del sistema de entregas próximas y tareas en riesgo | ⬜ Pendiente |
| **v3** | Servidor MCP para usarla con Claude: primero en local, después en remoto con OAuth | ⬜ Pendiente |
| **v4** | Importación automática de entregas desde el Campus Virtual de la USC (Moodle exporta el calendario en **iCal**) | ⬜ Pendiente |
| **v5** | App móvil (Tauri 2 o Expo) con los mismos datos | ⬜ Pendiente |
| **Futuro** | Interfaz visual dentro del chat (extensión de UI para MCP) y soporte probado con otros modelos | ⬜ Pendiente |

---

## 🧰 Stack tecnológico

**TypeScript en todo**, el mismo stack que [Rumbo](../Rumbo) para reutilizar lo aprendido:

- **Frontend**: React + Vite.
- **Escritorio**: Tauri (v2).
- **Backend**: Node (Express o Fastify). Se puede adaptar a lo que se vea en DAW.
- **MCP**: SDK oficial en TypeScript.
- **Base de datos**: PostgreSQL (o SQLite durante el desarrollo).
- **Tests**: Vitest.

### Estructura del repo (monorepo)
```
APPersonal/
├── web/      # Frontend React + Vite (y configuración de Tauri a partir de v2)
├── api/      # Backend REST
├── mcp/      # Servidor MCP (a partir de v3)
└── shared/   # Lógica y tipos comunes
```

---
