import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;

const subscribe = (callback: () => void) => {
  if (typeof globalThis === "undefined") return () => {};

  const mql = globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  mql.addEventListener("change", callback);

  return () => mql.removeEventListener("change", callback);
};

const useIsMobile = (): boolean => {
  return useSyncExternalStore(
    subscribe,
    () => globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches,
    () => false,
  );
};

export default useIsMobile;
