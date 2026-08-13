import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function CountDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: "Inventario" },
        { label: "Conteos" },
        { label: `Conteo ${params.id}` }
      ]} />
      <div className="space-y-4">
        <h2>Detalles del Conteo #{params.id}</h2>
        <p>Detalles del conteo físico...</p>
      </div>
    </div>
  );
}