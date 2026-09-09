"use client";

import { createContext, useCallback, useContext, useState } from "react";

type Toast = { id: number; message: string; type: "success" | "error" };
type ToastContextValue = { showToast: (message: string, type?: Toast["type"]) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} role="status" className={`pointer-events-auto max-w-sm rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${toast.type === "error" ? "bg-red-600 text-white" : "bg-[#03543F] text-white"}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
