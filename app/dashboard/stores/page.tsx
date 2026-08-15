import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StoreCard } from "@/components/stores/StoreCard";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const stores = await prisma.store.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Tiendas" }]} />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tiendas</h2>
        <Link href="/dashboard/stores/new">
          <Button>+ Nueva Tienda</Button>
        </Link>
      </div>
      {stores.length === 0 ? (
        <p className="text-gray-500">No hay tiendas todavía.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((s) => (
            <Link key={s.id} href={`/dashboard/stores/${s.id}`}>
              <StoreCard store={s} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}