
# Trabajos Prácticos - Diseño UX-UI (2026)

Repositorio con la resolución de los ejercicios prácticos de la materia (Licenciatura en Sistemas de Información - FCyT UADER).

## Estructura del proyecto
El repositorio contiene carpetas individuales para cada ejercicio, maquetados de forma modular utilizando HTML5 semántico y CSS3 puro (`index.html` y `styles.css`), sin frameworks ni librerías externas.

## Aspectos destacados
* **Diseño Responsivo:** Uso de Mobile First, Flexbox, CSS Grid y media queries para adaptar las interfaces a diferentes tamaños de pantalla.
* **Interactividad con CSS:** Implementación de menús desplegables, formularios multi-step y navegación por solapas utilizando selectores avanzados y pseudo-clases nativas (`:target`, `:checked`, `:valid`, `:invalid`).
* **Proyecto Integrador (Ejercicio 20):** Landing page completa de una sola página que integra scroll suave, animaciones, carrusel con `scroll-snap` y buenas prácticas de accesibilidad y organización de código.


# Trabajo Numero 5 - Diseño UX-UI (2026)

## Requisitos y Ejecución

No requiere compilación ni instalación de dependencias de Node.js.

1. Clonar o descargar el repositorio.
2. Abrir la carpeta raíz en VS Code.
3. Iniciar con la extensión **Live Server** abriendo el archivo `index.html`.

---

##  Stack Tecnológico

* **HTML5** (Semántico, `data-paso` y atributo `hidden` para el flujo SPA)
* **Tailwind CSS v4** (Utilidades de maquetación y responsive)
* **Basecoat UI** (Estilos y variantes CSS de componentes)
* **JavaScript Vanilla (ES Modules)** (Sin frameworks)

---

##  Decisiones de Diseño y Arquitectura

* **Estado Centralizado (`js/estado.js`):** Objeto único `solicitud` que almacena el avance del flujo, datos del equipo, plan seleccionado, datos personales y pago.
* **Separación de Responsabilidades:**
  * `app.js`: Manejo de eventos del DOM y navegación entre pasos.
  * `render.js`: Pinta interfaces y actualiza el stepper/resumen a partir del estado.
  * `cotizador.js`: Lógica pura de validaciones y cálculo dinámico de cuotas.
  * `pago.js`: Promesa asíncrona de 1,5 segundos para simular el procesamiento de pago y generación de número de póliza (`POL-AAAA-NNNNNN`).
* **Diseño Responsive:** Layout móvil de una columna adaptado mediante `lg:` a layout de dos columnas en desktop.

---

## Casos de Prueba Oficiales

Se verificó la fórmula de cálculo `Math.round(valor * tasaAnual / 12 * factorAntiguedad)`:

1. **$600.000 (< 1 año):** Básico $2.000 | Plus $3.000 | Premium $4.500
2. **$600.000 (1 a 2 años):** Básico $2.200 | Plus $3.300 | Premium $4.950
3. **$1.200.000 (> 2 años):** Básico $5.000 | Plus $7.500 | Premium $11.250

---

## 💳 Simulación de Pago

* **Aprobado:** Cualquier número válido (ej. `4111 1111 1111 1111`). Dirige a la pantalla de éxito con póliza generada.
* **Rechazado:** Número `4000 0000 0000 0002`. Dirige a la pantalla de error permitiendo reintentar conservando los datos cargados.
