"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2 } from "lucide-react";

interface Variant {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  product: { name: string };
}

export function InventoryAdjustmentForm() {
  const router = useRouter();
  const [variants, setVariants] = useState<Variant[]>([]);
  const [variantId, setVariantId] = useState("");
  const [newQty, setNewQty] = useState("");
  const [reason, setReason] = useState("");
  const [storeId, setStoreId] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((products: any[]) => {
        const vs: Variant[] = [];
        products.forEach((p) =>
          p.variants.forEach((v: any) =>
            vs.push({ ...v, product: { name: p.name } })
          )
        );
        setVariants(vs);
      });
    fetch("/api/stores")
      .then((r) => r.json())
      .then((stores: any[]) => {
        if (stores[0]) setStoreId(stores[0].id);
      });
  }, []);

  const current = variants.find((v) => v.id === variantId);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;
    setLoading(true);
    setMsg("");
    const diff = parseInt(newQty) - current.quantity;
    const res = await fetch("/api/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: current.product.name,
        variantId: current.id,
        type: "adjustment",
        quantity: Math.abs(diff),
        reason: reason || "Ajuste manual",
        storeId,
      }),
    });
    if (res.ok) {
      setMsg("Ajuste registrado.");
      router.refresh();
    } else {
      setMsg("Error al ajustar.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md">
      {msg && <p className="text-sm text-green-600">{msg}</p>}
      <select
        className="w-full border rounded-md p-2"
        value={variantId}
        onChange={(e) => setVariantId(e.target.value)}
      >
        <option value="">Seleccionar variante</option>
        {variants.map((v) => (
          <option key={v.id} value={v.id}>
            {v.product.name} — {v.name} ({v.quantity})
          </option>
        ))}
      </select>
      <Input
        type="number"
        placeholder="Nuevo stock"
        value={newQty}
        onChange={(e) => setNewQty(e.target.value)}
      />
      <Input
        placeholder="Razón"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <Button type="submit" disabled={loading || !variantId}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Ajustar Stock
      </Button>
    </form>
  );
}

export default InventoryAdjustmentForm;
