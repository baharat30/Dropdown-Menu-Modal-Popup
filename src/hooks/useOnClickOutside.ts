import { useEffect, useRef } from "react";

type AnyRef<T extends HTMLElement> =
  | React.RefObject<T>
  | React.MutableRefObject<T | null>;

export function useOnClickOutside<T extends HTMLElement>(
  ref: AnyRef<T>,
  handler: (evt: PointerEvent) => void,
  enabled: boolean = true
) {
  const latest = useRef(handler);
  useEffect(() => { latest.current = handler; }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = (ref as { current: T | null }).current;
      if (!el || el.contains(e.target as Node)) return;
      latest.current(e);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [ref, enabled]);
}
