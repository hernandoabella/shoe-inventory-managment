"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
}

export function SupplierActions({ supplier }: { supplier: Supplier }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar el proveedor "${supplier.name}"?`)) return;
    setDeleting(true);
    const res = await fetch(`/api/suppliers/${supplier.id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("No se pudo eliminar el proveedor");
      setDeleting(false);
    }
  };

  return (
    <div className="flex justify-end gap-1">
      <Link href={`/dashboard/suppliers/${supplier.id}/edit`}>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-600 hover:bg-red-50"
        disabled={deleting}
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default SupplierActions;