"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StoreToggleProps {
  store: { id: string; isActive: boolean };
}

export function StoreToggle({ store }: StoreToggleProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    const res = await fetch(`/api/stores/${store.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !store.isActive }),
    });
    if (res.ok) router.refresh();
    else alert("No se pudo actualizar la tienda");
    setBusy(false);
  };

  return (
    <input
      type="checkbox"
      checked={store.isActive}
      disabled={busy}
      onChange={toggle}
      className="h-4 w-4 rounded border-gray-300"
    />
  );
}

export default StoreToggle;