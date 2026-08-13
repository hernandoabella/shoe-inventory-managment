import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const stores = await prisma.store.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Tiendas" }]} />
      <h2 className="text-xl font-semibold">Tiendas</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((s) => (
          <Link key={s.id} href={`/dashboard/stores/${s.id}`}>
            <div className="border rounded-lg p-4 hover:bg-gray-50">
              <h3 className="font-medium">{s.name}</h3>
              <p className="text-sm text-gray-500">{s.city}, {s.country}</p>
              <p className="text-xs text-gray-400 mt-1">Código: {s.code}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
