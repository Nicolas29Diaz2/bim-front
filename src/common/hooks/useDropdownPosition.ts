import type { RefObject } from "react";

import { useState, useEffect, useCallback, useLayoutEffect } from "react";

const SAFETY_MARGIN = 48;
const HORIZONTAL_MARGIN = 8;
const DEFAULT_MAX_PANEL_HEIGHT = 240;
const DEFAULT_MIN_DESIRED_HEIGHT = 240;

export function useDropdownPosition(
  triggerRef: RefObject<Element | null>,
  isOpen: boolean,
  options?: {
    align?: "start" | "end";
    maxPanelHeight?: number;
    minDesiredHeight?: number;
    panelMinWidth?: number;
  },
) {
  const MAX_PANEL_HEIGHT = options?.maxPanelHeight ?? DEFAULT_MAX_PANEL_HEIGHT;
  const MIN_DESIRED_HEIGHT =
    options?.minDesiredHeight ?? DEFAULT_MIN_DESIRED_HEIGHT;
  const PANEL_MIN_WIDTH = options?.panelMinWidth ?? 0;
  const align = options?.align ?? "start";
  const [position, setPosition] = useState<{
    direction: "up" | "down";
    maxHeight: number;
    coordinates: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
      width: number;
    };
  }>({
    direction: "down",
    maxHeight: MAX_PANEL_HEIGHT,
    coordinates: { left: 0, width: 0 },
  });

  const calculatePosition = useCallback(() => {
    const triggerElement = triggerRef.current;
    if (!triggerElement) return;

    const triggerRect = triggerElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;

    let direction: "up" | "down";
    let maxHeight: number;

    if (spaceBelow >= MIN_DESIRED_HEIGHT) {
      direction = "down";
      maxHeight = Math.min(MAX_PANEL_HEIGHT, spaceBelow - SAFETY_MARGIN);
    } else if (spaceAbove >= MIN_DESIRED_HEIGHT) {
      direction = "up";
      maxHeight = Math.min(MAX_PANEL_HEIGHT, spaceAbove - SAFETY_MARGIN);
    } else {
      direction = spaceAbove > spaceBelow ? "up" : "down";
      maxHeight = Math.min(
        MAX_PANEL_HEIGHT,
        Math.max(spaceAbove, spaceBelow) - SAFETY_MARGIN,
      );
    }

    maxHeight = Math.max(0, maxHeight);

    const viewportWidth = window.innerWidth;
    const desiredPanelWidth = Math.max(triggerRect.width, PANEL_MIN_WIDTH);
    const maxLeft = Math.max(
      HORIZONTAL_MARGIN,
      viewportWidth - desiredPanelWidth - HORIZONTAL_MARGIN,
    );

    const idealLeft =
      align === "end"
        ? triggerRect.right - desiredPanelWidth
        : triggerRect.left;

    const clampedLeft = Math.min(
      Math.max(idealLeft, HORIZONTAL_MARGIN),
      maxLeft,
    );

    const coordinates = {
      left: clampedLeft,
      width: triggerRect.width,
      ...(direction === "down"
        ? { top: triggerRect.bottom + 2 }
        : { bottom: viewportHeight - triggerRect.top + 2 }),
    };

    setPosition({ direction, maxHeight, coordinates });
  }, [
    align,
    triggerRef,
    MAX_PANEL_HEIGHT,
    MIN_DESIRED_HEIGHT,
    PANEL_MIN_WIDTH,
  ]);

  useLayoutEffect(() => {
    if (isOpen) {
      calculatePosition();
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener("scroll", calculatePosition, true);
    window.addEventListener("resize", calculatePosition);

    return () => {
      window.removeEventListener("scroll", calculatePosition, true);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [isOpen, calculatePosition]);

  return position;
}
