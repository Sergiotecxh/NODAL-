# Estado — NODAL Studio v3

Entrega revisada en noviembre de 2026. Alcance: prototipo web, no app nativa publicada.

| Área | Estado real |
|---|---|
| Seis destinos y diseño adaptable | Implementado: Inicio, Mensajes, Bookings, Discover, Servicios y Perfil. |
| Presskit | Editable y persistido localmente; no hay perfil público compartido. |
| Pasaporte | Portada, páginas y referencias cromáticas MX/US/Europa; sellos conceptuales. Documento profesional ficticio, sin validez oficial. |
| Selfie | Cámara del navegador con consentimiento o archivo; recorte y eliminación de metadatos al generar imagen; sólo en memoria. Sin verificación biométrica. |
| Mensajes y ubicación | Conversaciones de muestra locales. Geolocalización opcional y confirmación previa; sin envío a destinatarios. |
| Moderación | Patrones para contactos y desvío de negocios; no IA ni protección completa. Falta moderación en servidor y apelación. |
| Bookings | Filtros, búsqueda, guardados y creación local de eventos con Pro de muestra. Sin reservas ni publicación real. |
| Discover | Enlaces a fuentes reales y agenda ficticia identificada. Sin servicio editorial automatizado. |
| Servicios | Seis categorías y solicitud de muestra; no contratación real. |
| Membresía | Demostración sin cobros. Autorización de producción pendiente. |
| PDF | Siete páginas, presupuesto y competencia con límites de evidencia; escenarios, no promesas. |
| iOS/Android, backend y pagos | Pendientes. No se han generado binarios ni publicado en tiendas. |

Verificación ejecutada: TypeScript, compilación y **9/9 pruebas de navegador** contra la compilación estática. **19 auditorías axe**, sin infracciones en las reglas seleccionadas; seis destinos a 1440/390/320 px y pasaporte móvil. Incluye captura de cámara emulada, consentimiento, filtro de mensajes y ubicación, persistencia local, preferencias corruptas, enlace PDF y ausencia de POST en chat de muestra. No acredita seguridad de producción, dispositivos físicos ni cumplimiento WCAG completo.

La configuración Netlify compila hacia `dist`. El despliegue y URL pública deben confirmarse en la cuenta de Netlify; GitHub actualizado no acredita publicación exitosa.
