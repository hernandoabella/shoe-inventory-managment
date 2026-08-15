import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import {
  Settings2,
  Boxes,
  Store,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

export default function SettingsPage() {
  const sections = [
    {
      href: "/dashboard/settings/general",
      title: "General",
      description: "Nombre de la aplicación, empresa, moneda y zona horaria.",
      icon: Settings2,
    },
    {
      href: "/dashboard/settings/inventory",
      title: "Inventario",
      description: "Umbral de stock bajo y confirmaciones automáticas.",
      icon: Boxes,
    },
    {
      href: "/dashboard/settings/stores",
      title: "Tiendas",
      description: "Resumen de las tiendas configuradas en el sistema.",
      icon: Store,
    },
    {
      href: "/dashboard/settings/permissions",
      title: "Permisos",
      description: "Roles y acceso de los usuarios del sistema.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Configuración" }]} />
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="h-6 w-6 text-gray-500" />
        <div>
          <h2 className="text-xl font-semibold">Configuración</h2>
          <p className="text-sm text-gray-500">
            Ajustes generales del sistema de inventario.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.href} href={s.href}>
              <Card className="h-full transition hover:border-blue-400 hover:shadow-md">
                <CardHeader className="flex-row items-center gap-4 space-y-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{s.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}