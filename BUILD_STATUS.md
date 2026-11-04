# BUILD_STATUS — Mediterranean visual proposal

Fecha: 3 de noviembre de 2026. Esta entrega responde al rediseño visual solicitado: azul profundo, gris mineral, verde salvia y aqua, sin fotografías en esta etapa.

Los estados se refieren exclusivamente a este checkout de propuesta visual; no acreditan un marketplace de producción.

| Área | Estado | Alcance |
|---|---|---|
| Dirección visual, tipografía y arte original | Working | Diseño luminoso, formas CSS/SVG, fuentes locales y movimiento ambiental reducido por preferencias. |
| Cinco pantallas principales | Working | Inicio, Bookings, Discover, Servicios y Perfil; escritorio y móvil. |
| Navegación, filtros y guardados | Working | Comportamiento del prototipo; guardados sólo en el navegador. |
| Perfil editable y preferencias | Working | Datos locales; no crea cuentas ni comparte perfiles. |
| Detalles y solicitud | Mocked | Oportunidades ficticias y Quick Apply explícitamente simulado; no se envía una solicitud real. |
| Artistas, venues, honorarios y fechas | Mocked | Ejemplos editoriales claramente identificados, sin actividad profesional afirmada como real. |
| Mensajes, notificaciones y Services | Partial | Tratamiento visual e información de alcance, sin envío ni contratación. |
| Fotografía y escenas de IA | Not built | Diferidas a petición del usuario. No se generaron fotos. |
| Apps nativas iOS/Android | Not built | Siguen siendo requisito del producto final; este prototipo web no las sustituye. |
| Backend, identidad y booking real | Not built | No están implementados en esta propuesta visual. |
| Prompt para Figma | Working | Documento disponible; no se editó un archivo de Figma conectado ni se accedió a Casa Vista. |
| Compilación estática | Working | Vite/React; dist preparado como propuesta visual para Netlify Drop. |

## Verificación

- Instalación congelada con `npm ci` repetida correctamente.
- TypeScript y compilación completados.
- Suite final sobre la compilación estática: **9/9 pruebas**, sin omisiones. Navegación, combinación de filtros, guardados, detalle/foco, simulación sin POST, perfil local, preferencias y recuperación de una búsqueda sin resultados.
- **17 auditorías axe** sin infracciones detectadas en las reglas seleccionadas: cinco pantallas a 1440, 390 y 320 px, más dos diálogos. No equivale a una auditoría WCAG completa ni a pruebas de dispositivos nativos.
- Capturas revisadas en escritorio y móvil; corregidos textos demasiado pequeños, contenido comprimido, contraste y pérdida de foco.
- Scripts de instalación y arranque actualizados en el borrador del entorno para este prototipo. Guardar el borrador no publica ni valida restauración en una tarea nueva.

## Entrega

- `NODAL_DESIGN_NETLIFY_DROP.zip`: compilación visual, con index.html en la raíz. Descomprimir y arrastrar la carpeta resultante a Netlify Drop.
- `NODAL_DESIGN_SOURCE.zip`: código, documentación y pruebas, sin dependencias instaladas, credenciales ni configuración privada.

Publicar el ZIP visual no activa autenticación, base de datos, ofertas, reservas, pagos o notificaciones. Las imágenes se trabajarán aparte, como se solicitó.
