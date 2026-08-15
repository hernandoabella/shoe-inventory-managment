"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

interface Variant {
  id: string;
  quantity: number;
}
interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string | null;
  variants: Variant[];
}

export function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto y sus variantes?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("No se pudo eliminar");
      setDeletingId(null);
    }
  };

  if (!products.length) {
    return <p className="text-gray-500">No hay productos todavía.</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <tr>
            <TableHead>SKU</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.sku}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.brand || "—"}</TableCell>
              <TableCell>
                <Badge>{product.variants.reduce((s, v) => s + v.quantity, 0)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Link href={`/dashboard/inventory/products/${product.id}`}>
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </Link>
                  <Link href={`/dashboard/inventory/products/${product.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    disabled={deletingId === product.id}
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProductTable;
