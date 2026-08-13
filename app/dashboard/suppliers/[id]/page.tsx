import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Proveedores" }, { label: "Proveedor" }]} />
      <h2 className="text-xl font-semibold">Proveedor</h2>
      <p className="text-gray-500">Sección en construcción.</p>
    </div>
  );
}
