# NODAL — Mediterranean edition

Propuesta visual navegable para explorar una nueva identidad de NODAL: azul profundo, gris mineral, verde salvia y aqua. La dirección de esta entrega prioriza una interfaz moderna, tranquila y expresiva. No incluye fotografías: la atmósfera se construye con tipografía, color, profundidad y formas originales.

**Esta entrega es una propuesta de diseño.** No es una aplicación nativa publicada ni una plataforma de bookings conectada a producción. Los perfiles, oportunidades, fechas y honorarios son ejemplos y se identifican como tales en la interfaz. Guardados y preferencias que puedan conservarse en el navegador son locales; no acreditan cuentas ni operaciones reales.

## Abrir y desarrollar

Requiere Node.js 24 y npm.

```sh
cd /workspace/NODAL-
npm ci --cache /tmp/nodal-npm-cache
npm run dev
```

El servidor de desarrollo permite revisar la propuesta desde este entorno. La interfaz de onboarding no proporciona una vista previa pública de localhost.

```sh
npm run typecheck
npm run build
npm run test:e2e
```

La compilación crea `dist/`. Para revisarla localmente puede usarse `npm run preview`. Las comprobaciones E2E usan Chromium instalado en `/usr/bin/chromium` y el puerto 4173. Para probar los archivos compilados con la misma suite:

```sh
npm run build
NODAL_STATIC_TEST=1 npm run test:e2e
```

## Publicación de esta propuesta visual

Se entregan dos archivos con usos distintos:

- `NODAL_DESIGN_NETLIFY_DROP.zip`: versión visual compilada. Descomprímelo y arrastra la carpeta resultante a Netlify Drop; su `index.html` debe quedar directamente en la raíz.
- `NODAL_DESIGN_SOURCE.zip`: código editable, documentación y pruebas. Requiere instalar dependencias y compilar.

La compilación está en `dist/`. Un ZIP del código fuente no sustituye esa carpeta compilada.

Publicar esta propuesta permite recorrer el diseño. No activa cuentas, reservas, pagos, almacenamiento compartido ni notificaciones reales. Para la aplicación completa de NODAL siguen siendo necesarios los clientes nativos iOS/Android, un backend compartido, persistencia segura, proveedores de identidad y los demás controles de producción.

## Diseño y referencias

- [Dirección visual](DESIGN_DIRECTION.md)
- [Prompt para reproducir la dirección en Figma](FIGMA_PROMPT.md)

Casa Vista se menciona como referencia de gusto del usuario; sus archivos e imágenes no están disponibles en este entorno. No se han copiado layouts o recursos de ese proyecto. La propuesta toma la descripción proporcionada y crea una identidad propia para NODAL.

## Comprobaciones realizadas

La suite final ejecutada contra la compilación estática pasó **9/9 pruebas de navegador**. Incluye cinco destinos, filtros combinados, escritura continua, guardados persistentes, simulación de Quick Apply sin solicitudes de red, edición local del perfil, preferencias, foco de teclado y recuperación de búsquedas sin resultados en Discover. El movimiento reducido detiene la animación ambiental.

Las **17 auditorías automáticas de axe** no encontraron infracciones en las reglas A/AA seleccionadas: cinco destinos a 1440, 390 y 320 px, más los diálogos de oportunidad y perfil. Los destinos revisados no desbordan horizontalmente. Estas comprobaciones corresponden a la propuesta web en Chromium; no equivalen a una certificación integral de accesibilidad ni a pruebas de una app nativa o un backend.

Comandos comprobados: `npm ci`, `npm run typecheck`, `npm run build` y `NODAL_STATIC_TEST=1 npm run test:e2e`. La variable de prueba sirve para verificar el resultado compilado; sin ella la suite inicia el servidor de desarrollo.

Capturas: [escritorio](artifacts/home-desktop.png), [móvil](artifacts/home-mobile.png), [Bookings](artifacts/bookings-desktop.png) y [perfil](artifacts/profile-mobile.png). El diagnóstico de la última ejecución se guarda en `artifacts/accessibility.jsonl`.
