"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2 } from "lucide-react";

type InventorySettings = {
  lowStockThreshold: number;
  receiveAutoConfirm: boolean;
  transferAutoConfirm: boolean;
};

export function InventorySettingsForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<InventorySettings>({
    lowStockThreshold: 5,
    receiveAutoConfirm: false,
    transferAutoConfirm: false,
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) =>
        setForm({
          lowStockThreshold: s.lowStockThreshold ?? 5,
          receiveAutoConfirm: !!s.receiveAutoConfirm,
          transferAutoConfirm: !!s.transferAutoConfirm,
        })
      )
      .catch(() => {});
  }, []);

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
      setSaved("Configuración de inventario guardada.");
      router.refresh();
    } else {
      const j = await res.json();
      setError(j.error || "Error al guardar");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {saved && <p className="text-sm text-green-600">{saved}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="max-w-sm">
        <Input
          label="Umbral de stock bajo (por defecto)"
          type="number"
          min={0}
          value={form.lowStockThreshold}
          onChange={(e) =>
            setForm((f) => ({ ...f, lowStockThreshold: parseInt(e.target.value) || 0 }))
          }
        />
        <p className="mt-1 text-xs text-gray-500">
          Las variantes con stock igual o inferior a este valor se marcan como &quot;bajo stock&quot;.
        </p>
      </div>

      <div className="max-w-lg space-y-3 rounded-md border p-4">
        <label className="flex items-center justify-between gap-4 py-2">
          <span className="text-sm">
            <span className="font-medium">Confirmar recepciones automáticamente</span>
            <span className="block text-xs text-gray-500">Marcar como recibida al crear la recepción.</span>
          </span>
          <input
            type="checkbox"
            checked={form.receiveAutoConfirm}
            onChange={(e) => setForm((f) => ({ ...f, receiveAutoConfirm: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300"
          />
        </label>
        <label className="flex items-center justify-between gap-4 py-2 border-t">
          <span className="text-sm">
            <span className="font-medium">Confirmar transferencias automáticamente</span>
            <span className="block text-xs text-gray-500">Marcar como en tránsito al crear la transferencia.</span>
          </span>
          <input
            type="checkbox"
            checked={form.transferAutoConfirm}
            onChange={(e) => setForm((f) => ({ ...f, transferAutoConfirm: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300"
          />
        </label>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Guardar Inventario
      </Button>
    </form>
  );
}

export default InventorySettingsForm;