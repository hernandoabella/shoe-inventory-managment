"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PackageCheck, Trash2 } from "lucide-react";

interface Purchase {
  id: string;
  status: string;
}

export function ReceivingActions({ purchase }: { purchase: Purchase }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const isReceived = purchase.status === "received";

  const receive = async () => {
    setBusy(true);
    const res = await fetch(`/api/receiving/${purchase.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.ok) router.refresh();
    else alert("No se pudo marcar como recibida");
    setBusy(false);
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta recepción?")) return;
    setBusy(true);
    const res = await fetch(`/api/receiving/${purchase.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/receiving");
      router.refresh();
    } else {
      alert("No se pudo eliminar");
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {!isReceived && (
        <Button size="sm" disabled={busy} onClick={receive}>
          <PackageCheck className="h-4 w-4 mr-1" /> Marcar como recibida
        </Button>
      )}
      <Button size="sm" variant="destructive" disabled={busy} onClick={handleDelete}>
        <Trash2 className="h-4 w-4 mr-1" /> Eliminar
      </Button>
    </div>
  );
}

export default ReceivingActions;