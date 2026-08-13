"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/layout/UserMenu";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ArrowLeftRight,
  ShoppingCart,
  FileText,
  Building2,
  BarChart3,
  Users,
  Settings,
  ChevronRight,
  Store,
  Warehouse,
} from "lucide-react";

type Item = {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: { title: string; href: string; icon?: React.ElementType }[];
};

const items: Item[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    title: "Inventario",
    icon: Package,
    children: [
      { title: "Productos", href: "/dashboard/inventory/products", icon: Boxes },
      { title: "Stock", href: "/dashboard/inventory/stock", icon: Warehouse },
      { title: "Movimientos", href: "/dashboard/inventory/movements", icon: ArrowLeftRight },
      { title: "Conteos", href: "/dashboard/inventory/counts", icon: Package },
      { title: "Ajustes", href: "/dashboard/inventory/adjustments", icon: Settings },
    ],
  },
  { title: "Transferencias", href: "/dashboard/transfers", icon: ArrowLeftRight },
  { title: "Recepción", href: "/dashboard/receiving", icon: ShoppingCart },
  { title: "Compras", href: "/dashboard/purchases", icon: FileText },
  { title: "Proveedores", href: "/dashboard/suppliers", icon: Building2 },
  { title: "Tiendas", href: "/dashboard/stores", icon: Store },
  {
    title: "Reportes",
    icon: BarChart3,
    children: [
      { title: "Inventario", href: "/dashboard/reports/inventory", icon: BarChart3 },
      { title: "Ventas", href: "/dashboard/reports/sales", icon: BarChart3 },
      { title: "Movimientos", href: "/dashboard/reports/movements", icon: BarChart3 },
      { title: "Tiendas", href: "/dashboard/reports/stores", icon: BarChart3 },
    ],
  },
  { title: "Usuarios", href: "/dashboard/users", icon: Users },
  {
    title: "Configuración",
    icon: Settings,
    children: [
      { title: "General", href: "/dashboard/settings/general", icon: Settings },
      { title: "Inventario", href: "/dashboard/settings/inventory", icon: Settings },
      { title: "Tiendas", href: "/dashboard/settings/stores", icon: Settings },
      { title: "Permisos", href: "/dashboard/settings/permissions", icon: Settings },
    ],
  },
];

function isActive(pathname: string, href?: string, children?: Item["children"]) {
  if (href && (pathname === href || pathname.startsWith(href + "/"))) return true;
  if (children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/")))
    return true;
  return false;
}

function NavItem({ item, pathname }: { item: Item; pathname: string }) {
  const active = isActive(pathname, item.href, item.children);
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  if (item.children) {
    const expanded = open || active;
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            active
              ? "bg-white/10 text-white"
              : "text-slate-300 hover:bg-white/5 hover:text-white"
          )}
          aria-expanded={expanded}
        >
          <span className="flex items-center gap-3">
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">{item.title}</span>
          </span>
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              expanded && "rotate-90"
            )}
          />
        </button>
        <div
          className={cn(
            "grid transition-all duration-200",
            expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="mt-1 space-y-0.5">
              {item.children.map((child) => {
                const ChildIcon = child.icon;
                const childActive =
                  pathname === child.href || pathname.startsWith(child.href + "/");
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md py-2 pl-11 pr-3 text-sm transition-colors",
                      childActive
                        ? "bg-indigo-500/20 font-medium text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {ChildIcon && <ChildIcon className="h-4 w-4 shrink-0" />}
                    <span className="truncate">{child.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-white/10 text-white"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span className="truncate">{item.title}</span>
    </Link>
  );
}

export function Sidebar({ forceShow = false }: { forceShow?: boolean }) {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        "w-64 shrink-0 flex-col bg-slate-900 text-white",
        forceShow ? "flex" : "hidden md:flex"
      )}
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-lg font-bold shadow-lg">
          S
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold">Shoe Inventory</p>
          <p className="truncate text-[11px] text-slate-400">Gestión de calzado</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {items.map((item) => (
          <NavItem key={item.title} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <UserMenu />
      </div>
    </aside>
  );
}

export default Sidebar;
