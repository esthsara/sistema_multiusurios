// src/shared/utils/sanitize.ts
// Este módulo contiene funciones para sanitizar y normalizar datos de entrada, especialmente texto y URLs
interface SanitizeInputOptions {
  trim?: boolean;
  maxLength?: number;
  stripTags?: boolean;
}
// Control chars: U+0000 to U+001F and U+007F y etiquetas HTML simples: <...>
const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]/g;
const TAGS_REGEX = /<[^>]*>/g;

/**
 * Normaliza texto de entrada 
 */
export const sanitizeInput = (
  value: unknown,
  options: SanitizeInputOptions = {},
): string => {
  const { trim = true, maxLength = 500, stripTags = false } = options;

  if (typeof value !== "string") return "";

  let next = value.normalize("NFKC").replace(CONTROL_CHARS_REGEX, "");

  if (stripTags) {
    next = next.replace(TAGS_REGEX, "");
  }

  if (trim) {
    next = next.trim();
  }

  if (next.length > maxLength) {
    next = next.slice(0, maxLength);
  }

  return next;
};

/**texto seguro*/
export const safeText = (
  value: unknown,
  fallback = "",
  maxLength = 240,
): string => {
  const normalized = sanitizeInput(value, {
    trim: true,
    maxLength,
    stripTags: true,
  });

  return normalized || fallback;
};

/**Bloquea esquemas peligrosos en URLs dinámicas.*/
export const safeImageUrl = (value: unknown): string | undefined => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  const raw = value.trim();
  if (raw.startsWith("/")) {
    return raw;
  }

  try {
    const parsed = new URL(raw, window.location.origin);
    const allowedProtocols = new Set(["http:", "https:"]);
    if (!allowedProtocols.has(parsed.protocol)) {
      return undefined;
    }
    return parsed.toString();
  } catch {
    return undefined;
  }
};
