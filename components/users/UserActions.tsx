"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
}

export function UserActions({ user }: { user: User }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar el usuario "${user.email}"?`)) return;
    setDeleting(true);
    const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("No se pudo eliminar el usuario");
      setDeleting(false);
    }
  };

  return (
    <div className="flex justify-end gap-1">
      <Link href={`/dashboard/users/${user.id}`}>
        <Button variant="ghost" size="sm">
          Ver
        </Button>
      </Link>
      <Link href={`/dashboard/users/${user.id}/edit`}>
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

export default UserActions;