"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute left-0 top-0 h-full w-64 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-4 z-10 rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
        </button>
        <Sidebar forceShow />
      </div>
    </div>
  );
}

export default MobileNav;
