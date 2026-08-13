import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const dynamic = "force-dynamic";

const typeLabel: Record<string, string> = {
  inbound: "Entrada",
  outbound: "Salida",
  adjustment: "Ajuste",
};

export default async function MovementsPage() {
  const movements = await prisma.movement.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Inventario" }, { label: "Movimientos" }]} />
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Fecha</th>
              <th className="text-left p-3">Tipo</th>
              <th className="text-left p-3">Producto</th>
              <th className="text-left p-3">Cantidad</th>
              <th className="text-left p-3">Razón</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-3">{new Date(m.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{typeLabel[m.type] || m.type}</td>
                <td className="p-3">{m.productId}</td>
                <td
                  className={`p-3 ${
                    m.type === "inbound"
                      ? "text-green-600"
                      : m.type === "outbound"
                      ? "text-red-600"
                      : ""
                  }`}
                >
                  {m.type === "inbound" ? "+" : ""}
                  {m.quantity}
                </td>
                <td className="p-3">{m.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
