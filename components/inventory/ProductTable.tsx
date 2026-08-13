import Link from "next/link";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

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
                <Badge>
                  {product.variants.reduce((s, v) => s + v.quantity, 0)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/dashboard/inventory/products/${product.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Ver
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ProductTable;
