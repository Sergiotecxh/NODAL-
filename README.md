# NODAL — Studio v3

Prototipo navegable con identidad azul, gris mineral, salvia y aqua. El producto final solicitado es una app nativa para iOS y Android; este repositorio todavía entrega una propuesta web para revisar los flujos.

## Cambios disponibles

- **Inicio:** presskit editable, nombre, foto, enlace a set, pasaporte y notificaciones de muestra.
- **Mensajes:** conversaciones locales, respondidos/pendientes, ubicación revisable y filtro de contactos externos.
- **Bookings:** buscador, ciudad, establecimientos, eventos y guardados. Crear un evento requiere activar Pro de muestra; no hay cobro ni publicación real.
- **Discover:** fuentes de industria, recomendaciones y agenda de ejemplo por ciudad.
- **Servicios:** catering, iluminación, cámara, audio, equipo DJ y otros productos.
- **Perfil:** edición local, membresía de muestra y acceso al PDF de negocio.

El pasaporte profesional tiene referencias de México, Estados Unidos y Europa, reflejos, portada animada y páginas. No es un documento oficial. La cámara requiere consentimiento; la selfie sólo vive durante la sesión y puede eliminarse. No verifica identidad ni reconoce rostros. Cámara y geolocalización requieren HTTPS o localhost y permiso del navegador.

**Alcance:** los chats, notificaciones, proveedores y oportunidades son ejemplos. Guardados, perfil y eventos se conservan sólo en este navegador; selfie, ubicación y chat no se guardan en localStorage. El filtro de mensajes usa patrones deterministas: no es IA y no impide todas las evasiones. La autorización Pro es de demostración en el cliente. Faltan cuentas, backend, controles de acceso reales, pagos, notificaciones y clientes nativos.

## Plan de negocio y costos

[PDF de siete páginas](public/reports/NODAL_PLAN_24_MESES.pdf), disponible también en **Perfil → Plan y costos · PDF**. Incluye presupuesto a 24 meses, membresía propuesta, punto de equilibrio, competencia, trámites en México y escenarios de valuación/socios. Distingue fuentes verificadas, referencias pendientes y supuestos. Los costos son un modelo de planeación, no cotizaciones; las valuaciones no son un avalúo.

[Versión en texto](public/reports/PLAN_RESUMEN.md) · [Modelo numérico](public/reports/modelo_financiero.json). Regeneración opcional: Python con ReportLab y fuentes DejaVu, `python scripts/make-plan.py`.

## Desarrollo y verificación

Node.js 24 y npm:

```sh
npm ci --cache /tmp/nodal-npm-cache
npm run dev
npm run typecheck
npm run build
NODAL_STATIC_TEST=1 npm run test:e2e
```

Las pruebas usan Chromium en `/usr/bin/chromium`, puerto 4173 y cámara emulada. Última ejecución: **9/9 pruebas**, con 19 auditorías axe sin infracciones en las reglas seleccionadas. Cubren seis destinos a 1440, 390 y 320 px y el diálogo de pasaporte; no equivalen a certificación de accesibilidad ni a pruebas nativas. Capturas: [escritorio](artifacts/studio-desktop.png), [móvil](artifacts/studio-mobile.png), [pasaporte](artifacts/passport-mobile.png).

## Publicación

Netlify conectado a este repositorio debe usar rama `main`, comando `npm run build` y directorio `dist`, según `netlify.toml`. El enlace público lo asigna Netlify después de un despliegue exitoso. Subir código a GitHub no confirma ese despliegue. El PDF queda incluido en el sitio compilado.

Se prioriza entrega por GitHub porque los enlaces de artefactos ZIP fallaron en la sesión del usuario. No se necesita descargar un ZIP para el despliegue conectado al repositorio.

[Estado](BUILD_STATUS.md) · [Dirección visual](DESIGN_DIRECTION.md) · [Prompt Figma](FIGMA_PROMPT.md). Los componentes anteriores permanecen como referencia; la entrada activa es `src/StudioApp.tsx`. Las pruebas de la versión anterior están archivadas como texto en `tests/legacy/` y fueron sustituidas por la suite actual.
