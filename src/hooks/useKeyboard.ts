import { useEffect, useState } from "react";

export function useKeyboard(enabled = true): Set<string> {
  const [pressed, setPressed] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!enabled) {
      setPressed(new Set());
      return undefined;
    }

    const handleDown = (event: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(
          event.key
        )
      ) {
        event.preventDefault();
      }
      setPressed((current) => {
        const next = new Set(current);
        next.add(event.key.toLowerCase());
        return next;
      });
    };

    const handleUp = (event: KeyboardEvent) => {
      setPressed((current) => {
        const next = new Set(current);
        next.delete(event.key.toLowerCase());
        return next;
      });
    };

    const handleBlur = () => setPressed(new Set());

    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [enabled]);

  return pressed;
}

