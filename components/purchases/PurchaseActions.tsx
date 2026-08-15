"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

interface Purchase {
  id: string;
  status: string;
}

const STATUS_FLOW: Record<string, string[]> = {
  draft: ["ordered", "cancelled"],
  ordered: ["received", "cancelled"],
  received: [],
  cancelled: [],
};

const STATUS_LABEL: Record<string, string> = {
  draft: "Borrador",
  ordered: "Marcar como pedido",
  received: "Marcar como recibido",
  cancelled: "Cancelar compra",
};

export function PurchaseActions({ purchase }: { purchase: Purchase }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const transitions = STATUS_FLOW[purchase.status] || [];

  const changeStatus = async (status: string) => {
    setBusy(true);
    const res = await fetch(`/api/purchases/${purchase.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) router.refresh();
    else alert("No se pudo actualizar el estado");
    setBusy(false);
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta compra?")) return;
    setBusy(true);
    const res = await fetch(`/api/purchases/${purchase.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/purchases");
      router.refresh();
    } else {
      alert("No se pudo eliminar");
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {transitions.map((s) => (
        <Button key={s} size="sm" variant={s === "cancelled" ? "destructive" : "default"} disabled={busy} onClick={() => changeStatus(s)}>
          {STATUS_LABEL[s] || s}
        </Button>
      ))}
      <Button size="sm" variant="destructive" disabled={busy} onClick={handleDelete}>
        <Trash2 className="h-4 w-4 mr-1" /> Eliminar
      </Button>
    </div>
  );
}

export default PurchaseActions;