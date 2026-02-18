import { useEffect, useRef } from "react";

type ObserverCallback = (visible: boolean) => void;

export function useObservedSection(onVisibilityChange: ObserverCallback) {
  const ref = useRef<HTMLElement | null>(null);

  // BUG: options object is recreated every render — this causes the
  // effect to re-run on every render, creating an infinite loop.
  const options = { threshold: 0.5 };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      onVisibilityChange(entries[0].isIntersecting);
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisibilityChange, options]);

  return ref;
}
