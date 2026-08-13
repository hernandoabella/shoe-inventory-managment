"use client";

import { LogOut, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold">
          A
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium text-white">Admin</p>
          <p className="truncate text-[11px] text-slate-400">admin@shoe.com</p>
        </div>
        <ChevronUp
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "" : "rotate-180"}`}
        />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-lg border border-white/10 bg-slate-800 shadow-xl">
          <button
            onClick={() => router.push("/dashboard/settings")}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5"
          >
            Mi perfil
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 border-t border-white/10 px-3 py-2.5 text-sm text-red-400 hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
