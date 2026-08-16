"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

export type AppSettings = {
  appName: string;
  companyName: string;
  defaultCurrency: string;
  defaultTimezone: string;
  lowStockThreshold: number;
  receiveAutoConfirm: boolean;
  transferAutoConfirm: boolean;
  logoUrl: string | null;
};

const defaultSettings: AppSettings = {
  appName: "Shoe Inventory",
  companyName: "Luxury Store",
  defaultCurrency: "COP",
  defaultTimezone: "America/Bogota",
  lowStockThreshold: 5,
  receiveAutoConfirm: false,
  transferAutoConfirm: false,
  logoUrl: null,
};

export function SettingsForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<AppSettings>(defaultSettings);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => setForm({ ...defaultSettings, ...s }))
      .catch(() => {});
  }, []);

  const set = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const uploadLogo = async (file: File) => {
    if (file.type !== "image/png") {
      setLogoError("El logo debe ser una imagen PNG.");
      return;
    }
    setIsLogoUploading(true);
    setLogoError("");
    setError("");
    setSaved("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/settings/logo", {
        method: "POST",
        body: fd,
      });
      const j = await res.json();
      if (res.ok) {
        setForm((f) => ({ ...f, logoUrl: j.logoUrl }));
        setSaved("Logo actualizado correctamente.");
        router.refresh();
      } else {
        setLogoError(j.error || "Error al subir el logo");
      }
    } catch {
      setLogoError("Error al subir el logo");
    } finally {
      setIsLogoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeLogo = async () => {
    setIsLogoUploading(true);
    setLogoError("");
    setError("");
    setSaved("");
    try {
      const res = await fetch("/api/settings/logo", { method: "DELETE" });
      const j = await res.json();
      if (res.ok) {
        setForm((f) => ({ ...f, logoUrl: j.logoUrl }));
        setSaved("Logo eliminado correctamente.");
        router.refresh();
      } else {
        setLogoError(j.error || "Error al eliminar el logo");
      }
    } catch {
      setLogoError("Error al eliminar el logo");
    } finally {
      setIsLogoUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSaved("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setIsLoading(false);
    if (res.ok) {
      setSaved("Configuración guardada correctamente.");
      router.refresh();
    } else {
      const j = await res.json();
      setError(j.error || "Error al guardar");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {saved && <p className="text-sm text-green-600">{saved}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Logo de la aplicación */}
      <div>
        <span className="mb-1 block text-xs font-medium text-gray-600">
          Logo de la aplicación (PNG)
        </span>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            {form.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.logoUrl}
                alt="Logo de la aplicación"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-lg font-bold text-gray-400">
                {(form.appName || "S").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadLogo(f);
              }}
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLogoUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {isLogoUploading ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="mr-1 h-4 w-4" />
                )}
                {isLogoUploading ? "Subiendo..." : "Subir logo"}
              </Button>
              {form.logoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isLogoUploading}
                  onClick={removeLogo}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Quitar
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-400">
              El logo se mostrará en la barra lateral.
            </p>
          </div>
        </div>
        {logoError && <p className="mt-1 text-sm text-red-600">{logoError}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nombre de la aplicación" value={form.appName} onChange={(e) => set("appName", e.target.value)} />
        <Input label="Nombre de la empresa" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
        <Input label="Moneda por defecto" value={form.defaultCurrency} onChange={(e) => set("defaultCurrency", e.target.value)} />
        <Input label="Zona horaria por defecto" value={form.defaultTimezone} onChange={(e) => set("defaultTimezone", e.target.value)} />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Guardar Configuración
      </Button>
    </form>
  );
}

export default SettingsForm;
