import { routing } from "@/i18n/routing";

export const normalizePath = (path: string) => {
  const locales = routing.locales;
  const pathSegments = path.split("/").filter(Boolean);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (locales.includes(pathSegments[0] as any)) {
    return "/" + pathSegments.slice(1).join("/");
  }
  return path;
};
