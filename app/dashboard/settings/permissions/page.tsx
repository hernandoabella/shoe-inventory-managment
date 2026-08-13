import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Configuración" }, { label: "Permisos" }]} />
      <h2 className="text-xl font-semibold">Permisos</h2>
      <p className="text-gray-500">Sección en construcción.</p>
    </div>
  );
}
