import { prisma } from "@/lib/db";
import { ProductsView } from "@/components/inventory/ProductsView";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const dynamic = "force-dynamic";

const PER_PAGE = 10;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;
  const nombre = (sp.nombre || "").trim();
  const categoria = (sp.categoria || "").trim();
  const proveedor = (sp.proveedor || "").trim();
  const stockBajo = sp.stock_bajo === "1";
  const page = Math.max(1, parseInt(sp.pagina || "1") || 1);
  const offset = (page - 1) * PER_PAGE;

  // Filtros a nivel de producto (categoría/proveedor) y variants (stock)
  const where: any = {};
  if (nombre) where.name = { contains: nombre };
  if (categoria) where.category = categoria;
  if (proveedor) where.brand = proveedor;

  const [allProducts, total, suppliers, catsAgg] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { variants: { take: 1 } },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: PER_PAGE,
    }),
    prisma.product.count({ where }),
    prisma.supplier.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      select: { category: true },
      where: { category: { not: null } },
    }),
  ]);

  // Aplicar filtro de stock bajo en memoria (sobre primera variante)
  let products = allProducts;
  if (stockBajo) {
    products = allProducts.filter((p) => {
      const v = p.variants[0];
      return v ? v.quantity <= v.lowStock : false;
    });
  }

  const categories = Array.from(
    new Set(catsAgg.map((c) => c.category).filter(Boolean) as string[])
  );
  const supplierNames = suppliers.map((s) => s.name);
  // También incluir marcas existentes como proveedores si no están en suppliers
  const brands = Array.from(
    new Set(allProducts.map((p) => p.brand).filter(Boolean) as string[])
  );
  const allSuppliers = Array.from(new Set([...supplierNames, ...brands]));

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Inventario" }, { label: "Productos" }]} />
      <ProductsView
        products={products}
        categories={categories}
        suppliers={allSuppliers}
        total={total}
        page={page}
        totalPages={Math.max(1, Math.ceil(total / PER_PAGE))}
        filters={{ nombre, categoria, proveedor, stockBajo }}
      />
    </div>
  );
}
