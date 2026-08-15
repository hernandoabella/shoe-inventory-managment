"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

interface Movement {
  id: string;
}

export function MovementActions({ movement }: { movement: Movement }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este movimiento? El stock de la variante se revertirá.")) return;
    setDeleting(true);
    const res = await fetch(`/api/movements/${movement.id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("No se pudo eliminar");
      setDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-600 hover:bg-red-50"
      disabled={deleting}
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

export default MovementActions;