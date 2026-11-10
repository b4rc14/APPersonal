# CLAUDE.md — Instrucciones para Claude Code

> Plantilla genérica para todos mis proyectos personales. Se copia en la raíz de cada repositorio.

## 🎯 Contexto: modo aprendizaje

Soy estudiante de Ingeniería Informática y estos proyectos son para **aprender** y para mi portfolio. Si escribes tú el código, yo no aprendo. Por eso tu papel en este repositorio está **muy limitado**:

**Tu única tarea es crear el esqueleto base del proyecto.** El desarrollo real lo haré yo después, entendiendo cada paso.

Antes de hacer nada, **lee el `README.md`** de este repositorio. Ahí están el stack, la arquitectura, la estructura de carpetas y la hoja de ruta.

---

## ✅ Lo que SÍ puedes hacer

Crear solo la base necesaria para que el proyecto arranque y yo pueda empezar a programar encima:

- **Estructura de carpetas** tal como aparece en el README (monorepo si lo indica).
- **Configuración**: `package.json` (o equivalente), TypeScript, linter, formateador, `.gitignore`, `.editorconfig` y variables de entorno de ejemplo (`.env.example`, nunca con secretos reales).
- **Tests**: configurar el test runner con **un único test de ejemplo** que pase.
- **CI**: un workflow básico de GitHub Actions que ejecute linter y tests.
- **"Hola mundo" mínimo** en cada parte (p. ej. una pantalla vacía en la app y un endpoint `/health` en la API), solo para comprobar que todo arranca.
- **Scripts** para arrancar, testear y lintar cada parte.

## ⛔ Lo que NO puedes hacer

- **No implementes ninguna funcionalidad del README**: nada de modelos de datos, endpoints reales, pantallas reales, lógica de negocio, autenticación ni base de datos con tablas.
- **No hagas commits, push ni crees ramas o repositorios.** El control de versiones lo llevo yo.
- **No avances a la siguiente fase** aunque te parezca fácil o rápido.
- Si te pido algo fuera de este alcance, **recuérdame esta regla y pregúntame** antes de hacerlo.

---

## 🧭 Cómo trabajar

1. **Antes de empezar**, enséñame un plan corto: qué carpetas y archivos vas a crear y qué dependencias vas a instalar. **Espera a que lo apruebe.**
2. Usa **versiones estables** de las dependencias y el mínimo número de ellas. No metas librerías que el esqueleto no necesite.
3. **Comenta el código y la configuración en español**, explicando *para qué sirve* cada cosa, no solo qué hace.
4. Donde vaya a ir código mío, deja un comentario `// TODO:` que diga qué tendré que implementar ahí, **sin implementarlo**.
5. Comprueba que todo arranca y que el linter y los tests pasan.

## 📘 Al terminar

1. Crea **`docs/ESQUELETO.md`** explicando:
   - qué es cada carpeta y cada archivo de configuración, y por qué está ahí;
   - qué hace cada dependencia instalada;
   - los comandos para arrancar, testear y lintar cada parte;
   - por dónde empezaría yo a programar, sin dar la solución.
2. Resúmeme en el chat lo que has hecho y **para**. No propongas seguir implementando.

---

## 📐 Convenciones del repo

- Idioma del código (variables, funciones): **inglés**. Comentarios y documentación: **español**.
- Mensajes de commit en formato [Conventional Commits](https://www.conventionalcommits.org/es/) (`feat:`, `fix:`, `docs:`, `chore:`…), aunque los hago yo.
- Trabajo con ramas y Pull Requests, y commits pequeños.
