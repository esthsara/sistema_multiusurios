export const getResolvedFileUrl = (rawUrl: string) => {
  if (!rawUrl) return "";
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;

  const apiBase = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
  if (!apiBase) return rawUrl;

  const normalizedApi = apiBase.replace(/\/$/, "");
  const origin = normalizedApi.replace(/\/api(\/v\d+)?$/i, "");
  return `${origin}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
};
