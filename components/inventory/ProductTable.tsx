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
        <TableHeader className="hidden md:table-header-group">
          <tr>
            <TableHead>SKU</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </tr>
        </TableHeader>
        <TableBody className="space-y-3 md:space-y-0 md:divide-y md:divide-gray-200">
          {products.map((product) => {
            const lbl =
              "before:mb-1 before:block before:text-[11px] before:font-semibold before:uppercase before:tracking-wide before:text-gray-400 before:content-[attr(data-label)] md:before:content-none";
            return (
              <TableRow
                key={product.id}
                className="block rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50 md:table-row md:rounded-none md:border-0 md:p-0"
              >
                <TableCell
                  data-label="SKU"
                  className={`block py-1.5 font-medium md:table-cell md:px-4 md:py-3 ${lbl}`}
                >
                  {product.sku}
                </TableCell>
                <TableCell
                  data-label="Nombre"
                  className={`block py-1.5 md:table-cell md:px-4 md:py-3 ${lbl}`}
                >
                  {product.name}
                </TableCell>
                <TableCell
                  data-label="Marca"
                  className={`block py-1.5 md:table-cell md:px-4 md:py-3 ${lbl}`}
                >
                  {product.brand || "—"}
                </TableCell>
                <TableCell
                  data-label="Stock"
                  className={`block py-1.5 md:table-cell md:px-4 md:py-3 ${lbl}`}
                >
                  <Badge>{product.variants.reduce((s, v) => s + v.quantity, 0)}</Badge>
                </TableCell>
                <TableCell
                  data-label="Acciones"
                  className={`block py-1.5 md:table-cell md:px-4 md:py-3 md:text-right ${lbl}`}
                >
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/dashboard/inventory/products/${product.id}`}
                      className="flex-1 md:flex-none"
                    >
                      <Button variant="ghost" size="sm" className="w-full">
                        Ver
                      </Button>
                    </Link>
                    <Link
                      href={`/dashboard/inventory/products/${product.id}/edit`}
                      className="flex-1 md:flex-none"
                    >
                      <Button variant="ghost" size="sm" className="w-full">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-red-600 hover:bg-red-50 md:flex-none"
                      disabled={deletingId === product.id}
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProductTable;
