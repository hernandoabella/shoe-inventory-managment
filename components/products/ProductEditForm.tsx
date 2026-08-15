"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string | null;
  category: string | null;
  description: string | null;
}

export function ProductEditForm({ product }: { product: Product }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku);
  const [brand, setBrand] = useState(product.brand || "");
  const [category, setCategory] = useState(product.category || "");
  const [description, setDescription] = useState(product.description || "");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sku, brand, category, description }),
    });
    if (res.ok) {
      router.push("/dashboard/inventory/products");
      router.refresh();
    } else {
      const j = await res.json();
      setError(j.error || "Error al actualizar");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
        <Input placeholder="Marca" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <Input placeholder="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <Input
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar Cambios
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/inventory/products")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export default ProductEditForm;
