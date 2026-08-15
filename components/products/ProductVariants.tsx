"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Trash2, Save } from "lucide-react";

interface Variant {
  id: string;
  sku: string;
  name: string;
  size: string | null;
  color: string | null;
  price: number;
  cost: number;
  quantity: number;
  lowStock: number;
}

export function ProductVariants({ variants }: { variants: Variant[] }) {
  const router = useRouter();
  const [items, setItems] = useState(variants);
  const [savingId, setSavingId] = useState<string | null>(null);

  const update = (id: string, field: keyof Variant, value: any) => {
    setItems((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSave = async (id: string) => {
    const v = items.find((x) => x.id === id);
    if (!v) return;
    setSavingId(id);
    const res = await fetch(`/api/variants/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: v.name,
        sku: v.sku,
        size: v.size,
        color: v.color,
        price: v.price,
        cost: v.cost,
        quantity: v.quantity,
        lowStock: v.lowStock,
      }),
    });
    setSavingId(null);
    if (res.ok) router.refresh();
    else alert("No se pudo guardar");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta variante?")) return;
    const res = await fetch(`/api/variants/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("No se pudo eliminar");
  };

  if (!items.length) return <p className="text-gray-500">Sin variantes.</p>;

  return (
    <div className="space-y-3">
      {items.map((v) => (
        <div
          key={v.id}
          className="grid gap-2 rounded-md border p-3 sm:grid-cols-3 md:grid-cols-6 items-end"
        >
          <Input
            label="SKU"
            value={v.sku}
            onChange={(e) => update(v.id, "sku", e.target.value)}
          />
          <Input
            label="Talla"
            value={v.size || ""}
            onChange={(e) => update(v.id, "size", e.target.value)}
          />
          <Input
            label="Color"
            value={v.color || ""}
            onChange={(e) => update(v.id, "color", e.target.value)}
          />
          <Input
            label="Precio"
            type="number"
            value={v.price}
            onChange={(e) => update(v.id, "price", parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Stock"
            type="number"
            value={v.quantity}
            onChange={(e) => update(v.id, "quantity", parseInt(e.target.value) || 0)}
          />
          <div className="flex gap-1">
            <Button size="sm" onClick={() => handleSave(v.id)} disabled={savingId === v.id}>
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              onClick={() => handleDelete(v.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductVariants;
