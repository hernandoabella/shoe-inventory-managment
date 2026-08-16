"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

export function DashboardShell({
  children,
  appName,
  companyName,
  logoUrl,
}: {
  children: React.ReactNode;
  appName: string;
  companyName: string;
  logoUrl: string | null;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        appName={appName}
        companyName={companyName}
        logoUrl={logoUrl}
      />
      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        appName={appName}
        companyName={companyName}
        logoUrl={logoUrl}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardShell;
