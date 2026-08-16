import { DashboardShell } from "@/components/layout/DashboardShell";
import { readSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = readSettings();
  return (
    <DashboardShell
      appName={settings.appName}
      companyName={settings.companyName}
      logoUrl={settings.logoUrl}
    >
      {children}
    </DashboardShell>
  );
}
