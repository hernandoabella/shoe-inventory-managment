import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Configuración" }, { label: "Tiendas" }]} />
      <h2 className="text-xl font-semibold">Tiendas</h2>
      <p className="text-gray-500">Sección en construcción.</p>
    </div>
  );
}
