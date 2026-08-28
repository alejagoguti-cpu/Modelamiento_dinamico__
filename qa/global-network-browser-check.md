# QA inicial de Red completa

- La página local carga correctamente y muestra el botón `VER RED COMPLETA 39 nodos` en el bloque CTA del inicio.
- Al abrir el modal, se renderizan los 39 nodos originales identificables por sus nombres e íconos.
- El modal muestra `39 categorías · 45 conexiones · datos POT dinámicos desde Supabase`.
- El zoom inicial se establece en 120% y el lienzo permite explorar el área mediante desplazamiento.
- Las relaciones internas de las cuatro estructuras y las seis relaciones interestructurales aparecen en el DOM.
- El estado de Supabase reporta 4 estructuras, 78 conceptos, 816 elementos POT y 12 hojas.
- La captura del navegador muestra que el grafo es intencionalmente más grande que el viewport y requiere scroll; el título y los controles permanecen visibles en el modal.

## Pendiente de esta ronda

- Verificar los controles +/−/↺ y que la escala cambie sin perder el centro.
- Verificar que un nodo global abra el popup de datos y que una relación abra el sustento.
- Validar que el cambio no rompa el modal de estructura existente.

## Pruebas adicionales

- Al pulsar el botón `+`, el indicador cambió de 120% a 130%, por lo que el zoom manual está conectado.
- El primer clic automatizado sobre Humedales no abrió visualmente el popup de categoría; se realizará una verificación DOM para distinguir si fue un problema del objetivo fuera de viewport o del listener.

## Popup dinámico confirmado

La inspección DOM y la vista del navegador confirmaron que el nodo `Humedales` sí dispara `#items-modal-overlay`, que queda visible por encima del modal global. El popup muestra `17 elementos` y conserva las dos vistas, red y tabla, sincronizadas con Supabase. El primer clic visual no había desplazado automáticamente el objetivo; el listener sí funciona al activar el nodo en el DOM.

## Sustento de relaciones confirmado

Después de cerrar el popup de categoría, la primera relación global (`Humedales → Ríos`) abrió correctamente el panel de sustento con tipo `Soporte`, cita y página `p. 22 del POT`. La interacción de las conexiones se conserva en la vista general.

## Ajuste de legibilidad

Tras recargar el sitio, el modal sigue abriendo con zoom automático al 120%. El DOM vuelve a reportar 39 nodos originales, 45 relaciones y cuatro zonas estructurales. Se ajustó la base de las etiquetas para mantener icono y texto dentro de cada círculo, evitando que el texto se apile sobre el ícono.

## Validación DOM cuantitativa

El DOM reporta `nodeCount: 39`, `edgeCount: 45`, `nodesWithText: 39`, `nodesWithIcon: 39`, `zoom: 120%` y un lienzo de `2640 × 1800 px`. Esto confirma que ningún nodo global se renderiza sin nombre o ícono.

## Regresión de vistas existentes

La apertura del nodo del hero mediante teclado sigue funcionando: el modal de `Estructura Ecológica Principal` se abre con sus 14 nodos, 11 relaciones y los controles originales de capas y convenciones. La prueba inicial con un clic sintético simple no era representativa porque ese componente distingue pointerdown/pointerup y teclado.

## Verificación de despliegue

El commit `47583eb` fue enviado correctamente a `origin/main`. La URL pública comprobada inmediatamente después todavía muestra la versión anterior: no aparece el botón `VER RED COMPLETA`. También se intentó la URL con `?v=47583eb`, con el mismo resultado, por lo que se debe revisar si GitHub Pages está desplegando otra rama o si aún está procesando la publicación.

## Producción corregida

Después de publicar el workflow explícito de GitHub Actions, los runs `33136916567` (workflow del sitio) y `33136913951` (Pages) terminaron con `success`. La URL pública con el cachebuster `?v=1b50a73` ya muestra el botón `VER RED COMPLETA 39 nodos`; al activarlo, el modal público carga 39 nodos, 45 conexiones, controles de zoom y el texto de Supabase.

## Incidencia reportada y corrección final

La causa fue doble: el build legacy de GitHub Pages del commit anterior permanecía en cola y la URL normal podía conservar los assets con la versión `20260826-mapfix`. Se añadió un workflow explícito de despliegue por GitHub Actions y se actualizaron los cachebusters a `20260828-global-network`.

Los runs del workflow y de Pages para el commit `b88c8cd` terminaron en `success`. La comprobación de la URL pública normal, sin parámetros, mostró el botón `VER RED COMPLETA 39 nodos`; al abrirlo se visualizaron 39 nodos, 45 conexiones y los controles de zoom.
