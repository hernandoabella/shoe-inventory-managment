"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

export function MobileNav({
  open,
  onClose,
  appName,
  companyName,
  logoUrl,
}: {
  open: boolean;
  onClose: () => void;
  appName: string;
  companyName: string;
  logoUrl: string | null;
}) {
  // Cerrar con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (open && e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Bloquear el scroll del fondo mientras el menú está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      aria-hidden={!open}
    >
      {/* Fondo oscurecido */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden
      />

      {/* Cajón deslizante */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-64 max-w-[85vw] shadow-xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar
          forceShow
          onClose={onClose}
          appName={appName}
          companyName={companyName}
          logoUrl={logoUrl}
        />
      </div>
    </div>
  );
}

export default MobileNav;
