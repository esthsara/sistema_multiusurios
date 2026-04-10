// src/shared/utils/sanitize.ts

interface SanitizeInputOptions {
  trim?: boolean;
  maxLength?: number;
  stripTags?: boolean;
}

const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]/g;
const TAGS_REGEX = /<[^>]*>/g;

/**
 * sanitizeInput — Normaliza texto de entrada para evitar payloads obvios.
 * No intenta ser un parser HTML completo.
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

/**
 * safeText — Garantiza texto seguro para render (React ya escapa HTML,
 * pero limpiamos caracteres de control y vacíos).
 */
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

/**
 * safeImageUrl — Bloquea esquemas peligrosos en URLs dinámicas.
 */
export const safeImageUrl = (value: unknown): string | undefined => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  const raw = value.trim();

  // Rutas relativas del backend/CDN.
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
