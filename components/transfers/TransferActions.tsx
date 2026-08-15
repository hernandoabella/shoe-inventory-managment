"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

interface Transfer {
  id: string;
  status: string;
}

const STATUS_FLOW: Record<string, string[]> = {
  pending: ["in_transit", "cancelled"],
  in_transit: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  in_transit: "En tránsito",
  delivered: "Entregada",
  cancelled: "Cancelada",
};

export function TransferActions({ transfer }: { transfer: Transfer }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const transitions = STATUS_FLOW[transfer.status] || [];

  const changeStatus = async (status: string) => {
    setBusy(true);
    const res = await fetch(`/api/transfers/${transfer.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) router.refresh();
    else alert("No se pudo actualizar el estado");
    setBusy(false);
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta transferencia?")) return;
    setBusy(true);
    const res = await fetch(`/api/transfers/${transfer.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/transfers");
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

export default TransferActions;