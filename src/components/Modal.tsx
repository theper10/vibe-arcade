import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="glass-panel max-h-[min(42rem,88vh)] w-full max-w-2xl overflow-y-auto rounded-2xl p-5 shadow-panel">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="modal-title" className="text-xl font-black">
            {title}
          </h2>
          <button
            type="button"
            className="arcade-button secondary h-10 w-10 rounded-xl p-0"
            onClick={onClose}
            aria-label="Close help"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

