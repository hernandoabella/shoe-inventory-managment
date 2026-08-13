import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ReportsClient } from "@/components/reports/ReportsClient";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Reportes" }]} />
      <h2 className="text-xl font-semibold">Reportes</h2>
      <ReportsClient />
    </div>
  );
}
