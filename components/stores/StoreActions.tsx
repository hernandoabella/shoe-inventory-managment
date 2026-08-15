"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

interface Store {
  id: string;
  name: string;
}

export function StoreActions({ store }: { store: Store }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar la tienda "${store.name}"?`)) return;
    setDeleting(true);
    const res = await fetch(`/api/stores/${store.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/stores");
      router.refresh();
    } else {
      alert("No se pudo eliminar la tienda");
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Link href={`/dashboard/stores/${store.id}/edit`}>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-1" /> Editar
        </Button>
      </Link>
      <Button
        variant="destructive"
        size="sm"
        disabled={deleting}
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4 mr-1" /> Eliminar
      </Button>
    </div>
  );
}

export default StoreActions;