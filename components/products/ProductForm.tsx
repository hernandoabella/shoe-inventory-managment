"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

export function ProductForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [vSku, setVSku] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [qty, setQty] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        sku,
        brand,
        category,
        variants: [
          {
            sku: vSku || sku + "-001",
            name: `${color || ""} / ${size || ""}`.trim() || name,
            size,
            color,
            price: parseFloat(price) || 0,
            cost: parseFloat(cost) || 0,
            quantity: parseInt(qty) || 0,
          },
        ],
      }),
    });
    if (res.ok) {
      router.push("/dashboard/inventory/products");
      router.refresh();
    } else {
      const j = await res.json();
      setError(j.error || "Error al guardar");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
        <Input placeholder="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <Input placeholder="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <h4 className="font-medium">Variante</h4>
      <div className="grid md:grid-cols-3 gap-4">
        <Input placeholder="SKU variante" value={vSku} onChange={(e) => setVSku(e.target.value)} />
        <Input placeholder="Talla" value={size} onChange={(e) => setSize(e.target.value)} />
        <Input placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
        <Input placeholder="Precio" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Input placeholder="Costo" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
        <Input placeholder="Stock" type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Guardar Producto
      </Button>
    </form>
  );
}

export default ProductForm;
