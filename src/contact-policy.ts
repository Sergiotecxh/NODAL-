export function contactRisk(text: string): string | null {
  const normalized = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, "")
    .toLowerCase();
  const compact = normalized.replace(/[\s._\-()[\]{}]/g, "");
  if (
    /(?:wh?ats?app|wasap|guasap|wa\.me|t\.me|telegram|instagram|instagram\.com|mailto:|https?:\/\/|www\.)/i.test(
      normalized,
    ) ||
    /whatsapp|pasametunumero|tepasominumero|contactameporfuera|pagarporfuera|sincomision|fueradenodal|hagamoslotodoporfuera/.test(
      compact,
    )
  )
    return "Mantén el contacto y los acuerdos dentro de NODAL. No se envió el mensaje.";
  if (
    /[\w.+-]+\s*@\s*[\w.-]+\.[a-z]{2,}/i.test(normalized) ||
    /\+?\d(?:[\s().-]*\d){7,}/.test(normalized)
  )
    return "Parece incluir un teléfono o un contacto externo. Revisa el mensaje antes de enviarlo.";
  if (
    /(?:pasame|dame|mandame|te paso|mi|tu)\s+(?:el\s+)?(?:numero|celular|telefono|whats|contacto)/.test(
      normalized,
    )
  )
    return "Evita intercambiar números o contactos externos por este medio.";
  const spelled = normalized.match(
    /\b(cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)\b/g,
  );
  if (spelled && spelled.length >= 7)
    return "La secuencia parece un número de contacto. No se envió.";
  return null;
}
