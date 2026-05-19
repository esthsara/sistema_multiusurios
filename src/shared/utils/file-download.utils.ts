import type { AxiosResponse } from "axios";

const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
};

type HeaderBag = Record<string, unknown> | undefined;

const getHeaderValue = (headers: HeaderBag, headerName: string): string => {
  if (!headers) return "";

  const normalizedTarget = headerName.toLowerCase();

  const fromDirect = headers[headerName] ?? headers[normalizedTarget];
  if (typeof fromDirect === "string") {
    return fromDirect;
  }

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === normalizedTarget && typeof value === "string") {
      return value;
    }
  }

  return "";
};

export const getFileExtension = (
  ...candidates: Array<string | null | undefined>
) => {
  for (const candidate of candidates) {
    if (!candidate) continue;

    const cleanValue = candidate.split("?")[0];
    const extension = cleanValue.split(".").pop()?.toLowerCase() ?? "";

    if (extension) {
      return extension;
    }
  }

  return "";
};

export const resolveMimeType = (rawMimeType: string, extension: string) => {
  const normalizedMime = rawMimeType.toLowerCase();

  if (
    normalizedMime &&
    normalizedMime !== "application/octet-stream" &&
    normalizedMime !== "text/html"
  ) {
    return rawMimeType;
  }

  return (
    MIME_BY_EXTENSION[extension.toLowerCase()] ?? "application/octet-stream"
  );
};

export const resolveFileName = ({
  contentDisposition,
  fallbackName,
  extension,
}: {
  contentDisposition: string;
  fallbackName: string;
  extension: string;
}) => {
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]).trim();
    } catch {
      return utf8Match[1].trim();
    }
  }

  const asciiMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  const baseName = (asciiMatch?.[1] ?? fallbackName).trim() || "archivo";

  if (!baseName.includes(".") && extension) {
    return `${baseName}.${extension}`;
  }

  return baseName;
};

export const toBlobUrlFromResponse = (
  response: AxiosResponse<Blob>,
  extension: string,
) => {
  const contentType = getHeaderValue(
    response.headers as HeaderBag,
    "content-type",
  );
  const mimeType = resolveMimeType(contentType, extension);

  const sourceBlob = response.data;
  const blob =
    sourceBlob instanceof Blob && sourceBlob.type === mimeType
      ? sourceBlob
      : new Blob([sourceBlob], { type: mimeType });

  return {
    url: window.URL.createObjectURL(blob),
    mimeType,
  };
};

export const revokeBlobUrlLater = (url: string, delay = 60_000) => {
  window.setTimeout(() => window.URL.revokeObjectURL(url), delay);
};

export const downloadBlobUrl = ({
  blobUrl,
  fileName,
}: {
  blobUrl: string;
  fileName: string;
}) => {
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

export const tryOpenBlobInNewTab = (blobUrl: string) => {
  const popup = window.open("", "_blank", "noopener,noreferrer");
  if (!popup) {
    return false;
  }

  popup.location.href = blobUrl;
  return true;
};

export const getResponseContentDisposition = (response: AxiosResponse<Blob>) =>
  getHeaderValue(response.headers as HeaderBag, "content-disposition");
