"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import { Check, MinusCircle, X } from "lucide-react";

type Kind = "added" | "removed" | "error" | "info";

export interface BottomActionToastProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kind?: Kind;
  title?: string;
  description?: string;
  duration?: number;
}

export default function BottomActionToast({
  open,
  onOpenChange,
  kind = "info",
  title,
  description,
  duration = 2500,
}: BottomActionToastProps) {
  const [mounted, setMounted] = React.useState(false);
  const closeRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setMounted(true);
    return () => {
      if (closeRef.current) window.clearTimeout(closeRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (!open) return;
    if (closeRef.current) window.clearTimeout(closeRef.current);
    closeRef.current = window.setTimeout(() => onOpenChange(false), duration);
  }, [open, duration, onOpenChange]);

  if (!mounted) return null;

  const palette = {
    added: "bg-emerald-600 text-white",
    removed: "bg-rose-600 text-white",
    error: "bg-amber-600 text-white",
    info: "bg-gray-800 text-white",
  }[kind];

  const Icon = {
    added: Check,
    removed: MinusCircle,
    error: MinusCircle,
    info: Check,
  }[kind];

  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="true"
      className={[
        "pointer-events-none fixed inset-x-0 bottom-4 flex justify-center px-4 sm:px-6",
      ].join(" ")}
    >
      <div
        role="status"
        className={[
          "pointer-events-auto w-full max-w-md rounded-2xl shadow-lg",
          "transition-all duration-400",
          open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          palette,
        ].join(" ")}
      >
        <div className="flex items-start gap-3 p-4 bg-pink rounded-2xl">
          <div className="mt-0.5 shrink-0">
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            {title && (
              <p className="text-sm font-semibold leading-5">{title}</p>
            )}
            {description && (
              <p className="text-sm/5 opacity-90">{description}</p>
            )}
          </div>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close toast"
            className="ml-auto rounded-md p-1 opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
