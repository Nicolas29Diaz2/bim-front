import { useEffect, useRef, type RefObject } from "react";

export function useClickOutside(
  refs: Array<RefObject<HTMLElement | null>>,
  handler: () => void,
  enabled: boolean = true,
): void {
  const handlerRef = useRef(handler);
  const refsArrRef = useRef<Array<RefObject<HTMLElement | null>>>(refs);

  useEffect(() => {
    handlerRef.current = handler;
    refsArrRef.current = refs;
  });

  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const isInside = refsArrRef.current.some((ref) =>
        ref.current?.contains(target),
      );
      if (!isInside) handlerRef.current();
    };

    document.addEventListener("pointerdown", onPointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [enabled]);
}
