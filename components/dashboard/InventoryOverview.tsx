import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, Pencil } from "lucide-react";

interface MovementItem {
  id: string;
  type: string;
  quantity: number;
  reason: string;
  createdAt: Date;
  productId: string;
}

const typeStyle: Record<string, { icon: React.ReactNode; color: string; sign: string }> = {
  inbound: { icon: <ArrowDownLeft className="h-3.5 w-3.5" />, color: "text-emerald-600 bg-emerald-50", sign: "+" },
  outbound: { icon: <ArrowUpRight className="h-3.5 w-3.5" />, color: "text-red-600 bg-red-50", sign: "-" },
  adjustment: { icon: <Pencil className="h-3.5 w-3.5" />, color: "text-amber-600 bg-amber-50", sign: "" },
};

export function InventoryOverview({ movements }: { movements: MovementItem[] }) {
  if (!movements.length) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        Sin movimientos recientes.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-gray-100">
      {movements.map((m) => {
        const s = typeStyle[m.type] || typeStyle.adjustment;
        return (
          <li key={m.id} className="flex items-center gap-3 py-3">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full ${s.color}`}>
              {s.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-800">
                {m.reason || m.productId}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(m.createdAt).toLocaleString("es", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span className={`text-sm font-semibold ${m.type === "outbound" ? "text-red-600" : m.type === "inbound" ? "text-emerald-600" : "text-amber-600"}`}>
              {s.sign}
              {m.quantity}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default InventoryOverview;
