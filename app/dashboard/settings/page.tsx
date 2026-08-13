import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Configuración" }, { label: "Configuración" }]} />
      <h2 className="text-xl font-semibold">Configuración</h2>
      <p className="text-gray-500">Sección en construcción.</p>
    </div>
  );
}
