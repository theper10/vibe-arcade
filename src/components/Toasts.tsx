import { CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useArcadeStore } from "../store/useArcadeStore";
import type { ToastMessage } from "../types/game";

function ToastItem({ toast }: { toast: ToastMessage }) {
  const dismissToast = useArcadeStore((state) => state.dismissToast);

  useEffect(() => {
    const timeout = window.setTimeout(() => dismissToast(toast.id), 3600);
    return () => window.clearTimeout(timeout);
  }, [dismissToast, toast.id]);

  const Icon =
    toast.tone === "success"
      ? CheckCircle2
      : toast.tone === "warning"
        ? TriangleAlert
        : toast.tone === "danger"
          ? XCircle
          : Info;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/[0.12] bg-slate-950/[0.92] p-3 text-sm shadow-panel backdrop-blur-xl animate-toastIn">
      <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[var(--game-accent)]" />
      <p className="font-semibold text-[var(--game-text)]">{toast.title}</p>
    </div>
  );
}

export function Toasts() {
  const toasts = useArcadeStore((state) => state.toasts);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 grid w-[min(24rem,calc(100vw-2rem))] gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
