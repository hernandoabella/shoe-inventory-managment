"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2 } from "lucide-react";

export type AppSettings = {
  appName: string;
  companyName: string;
  defaultCurrency: string;
  defaultTimezone: string;
  lowStockThreshold: number;
  receiveAutoConfirm: boolean;
  transferAutoConfirm: boolean;
};

const defaultSettings: AppSettings = {
  appName: "Shoe Inventory",
  companyName: "Luxury Store",
  defaultCurrency: "EUR",
  defaultTimezone: "Europe/Madrid",
  lowStockThreshold: 5,
  receiveAutoConfirm: false,
  transferAutoConfirm: false,
};

export function SettingsForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => setForm({ ...defaultSettings, ...s }))
      .catch(() => {});
  }, []);

  const set = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

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