interface Variant {
  id: string;
  sku: string;
  name: string;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
}

export function ProductVariants({ variants }: { variants: Variant[] }) {
  if (!variants.length) return <p className="text-gray-500">Sin variantes.</p>;
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-3">SKU</th>
            <th className="text-left p-3">Nombre</th>
            <th className="text-left p-3">Talla</th>
            <th className="text-left p-3">Color</th>
            <th className="text-left p-3">Precio</th>
            <th className="text-left p-3">Stock</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v) => (
            <tr key={v.id} className="border-t">
              <td className="p-3">{v.sku}</td>
              <td className="p-3">{v.name}</td>
              <td className="p-3">{v.size || "—"}</td>
              <td className="p-3">{v.color || "—"}</td>
              <td className="p-3">${v.price.toFixed(2)}</td>
              <td className="p-3">{v.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductVariants;
