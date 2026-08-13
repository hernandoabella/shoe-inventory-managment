import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: "Usuarios" },
        { label: `Usuario ${params.id}` }
      ]} />
      <div className="space-y-4">
        <h2>Usuario #{params.id}</h2>
        <p>Detalles del usuario...</p>
      </div>
    </div>
  );
}