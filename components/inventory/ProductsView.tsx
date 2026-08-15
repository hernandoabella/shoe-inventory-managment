"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Save, Trash2, Plus, Filter, Search, Eraser, Barcode, Shuffle } from "lucide-react";

interface Variant {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  lowStock: number;
  brand: string | null;
}
interface Product {
  id: string;
  sku: string;
  name: string;
  category: string | null;
  brand: string | null;
  variants: Variant[];
}

interface Props {
  products: Product[];
  categories: string[];
  suppliers: string[];
  total: number;
  page: number;
  totalPages: number;
  filters: { nombre: string; categoria: string; proveedor: string; stockBajo: boolean };
}

export function ProductsView({
  products,
  categories,
  suppliers,
  total,
  page,
  totalPages,
  filters,
}: Props) {
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const buildUrl = (next: Partial<Props["filters"]> & { pagina?: number } = {}) => {
    const p = new URLSearchParams();
    const f = { ...filters, ...next };
    if (f.nombre) p.set("nombre", f.nombre);
    if (f.categoria) p.set("categoria", f.categoria);
    if (f.proveedor) p.set("proveedor", f.proveedor);
    if (f.stockBajo) p.set("stock_bajo", "1");
    if (next.pagina && next.pagina > 1) p.set("pagina", String(next.pagina));
    const s = p.toString();
    return `/dashboard/inventory/products${s ? "?" + s : ""}`;
  };

  // ---- Edición inline ----
  const saveRow = async (p: Product) => {
    const v = p.variants[0];
    const res = await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sku: (document.getElementById(`sku-${p.id}`) as HTMLInputElement)?.value ?? p.sku,
        name: (document.getElementById(`name-${p.id}`) as HTMLInputElement)?.value ?? p.name,
        category: (document.getElementById(`cat-${p.id}`) as HTMLSelectElement)?.value ?? p.category,
        brand: (document.getElementById(`prov-${p.id}`) as HTMLSelectElement)?.value ?? p.brand,
        price: (document.getElementById(`price-${p.id}`) as HTMLInputElement)?.value ?? v?.price,
        quantity: (document.getElementById(`qty-${p.id}`) as HTMLInputElement)?.value ?? v?.quantity,
        lowStock: (document.getElementById(`min-${p.id}`) as HTMLInputElement)?.value ?? v?.lowStock,
      }),
    });
    if (res.ok) router.refresh();
    else alert("Error al guardar");
  };

  const deleteRow = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Error al eliminar");
  };

  // ---- Modal nuevo ----
  const [form, setForm] = useState({
    codigo_barras: "",
    nombre: "",
    categoria: "",
    proveedor: "",
    precio: "",
    stock: "0",
    stock_minimo: "5",
    descripcion: "",
  });

  const generarCodigo = () => {
    const ts = Date.now().toString().slice(-8);
    let r = "";
    for (let i = 0; i < 4; i++) r += Math.floor(Math.random() * 10);
    setForm((f) => ({ ...f, codigo_barras: "750" + ts + r }));
  };

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sku: form.codigo_barras || form.nombre.slice(0, 6).toUpperCase(),
        name: form.nombre,
        category: form.categoria || null,
        brand: form.proveedor || null,
        description: form.descripcion || null,
        variants: [
          {
            sku: form.codigo_barras || form.nombre.slice(0, 6).toUpperCase(),
            name: form.nombre,
            price: parseFloat(form.precio) || 0,
            quantity: parseInt(form.stock) || 0,
            lowStock: parseInt(form.stock_minimo) || 5,
          },
        ],
      }),
    });
    if (res.ok) {
      setModalOpen(false);
      setForm({ codigo_barras: "", nombre: "", categoria: "", proveedor: "", precio: "", stock: "0", stock_minimo: "5", descripcion: "" });
      router.refresh();
    } else {
      const j = await res.json();
      alert(j.error || "Error al crear");
    }
  };

  const rango = 2;
  const inicio = Math.max(1, page - rango);
  const fin = Math.min(totalPages, page + rango);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="flex items-center text-2xl font-bold text-gray-800">
            <span className="mr-2 text-blue-600">▦</span> Productos
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Total: {total.toLocaleString()})
            </span>
          </h2>
          <p className="mt-1 text-xs text-gray-400">Gestiona tu inventario de productos</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700"
        >
          <Plus className="mr-2" /> Nuevo Producto
        </button>
      </div>

      {/* Panel de filtros */}
      <div className="mb-6 rounded-xl bg-white p-5 shadow-md">
        <h3 className="mb-3 flex items-center text-md font-semibold text-gray-700">
          <Filter className="mr-2 text-blue-500" /> Filtros de búsqueda
        </h3>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(
              buildUrl({
                nombre: (e.currentTarget.elements.namedItem("nombre") as HTMLInputElement).value,
                categoria: (e.currentTarget.elements.namedItem("categoria") as HTMLSelectElement).value,
                proveedor: (e.currentTarget.elements.namedItem("proveedor") as HTMLSelectElement).value,
                stockBajo: (e.currentTarget.elements.namedItem("stock_bajo") as HTMLInputElement).checked,
              })
            );
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-500">
                <Search className="mr-1 inline" /> Nombre
              </label>
              <Input name="nombre" defaultValue={filters.nombre} placeholder="Buscar por nombre..." />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-500">
                <span className="mr-1">▣</span> Categoría
              </label>
              <select
                name="categoria"
                defaultValue={filters.categoria}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-500">
                <span className="mr-1">▤</span> Proveedor
              </label>
              <select
                name="proveedor"
                defaultValue={filters.proveedor}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los proveedores</option>
                {suppliers.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="stock_bajo"
                  defaultChecked={filters.stockBajo}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  <span className="mr-1 text-red-500">▲</span> Stock bajo
                </span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
              <Search className="mr-1" /> Buscar
            </Button>
            <Link
              href="/dashboard/inventory/products"
              className="rounded-lg bg-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-400"
            >
              <Eraser className="mr-1 inline" /> Limpiar filtros
            </Link>
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Código Barras</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-right">Precio</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Stock Mín.</th>
                <th className="px-4 py-3 text-left">Proveedor</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500">
                    No hay productos registrados con estos filtros
                  </td>
                </tr>
              )}
              {products.map((p, i) => {
                const v = p.variants[0];
                const stockBajo = v ? v.quantity <= v.lowStock : false;
                return (
                  <tr key={p.id} className="transition hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{(page - 1) * 10 + i + 1}</td>
                    <td className="px-4 py-3">
                      <input
                        id={`sku-${p.id}`}
                        defaultValue={p.sku}
                        className="w-full rounded-lg border p-1.5 font-mono text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        id={`name-${p.id}`}
                        defaultValue={p.name}
                        required
                        className="w-full rounded-lg border p-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        id={`cat-${p.id}`}
                        defaultValue={p.category || ""}
                        className="w-full rounded-lg border p-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">—</option>
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        id={`price-${p.id}`}
                        type="number"
                        step="0.01"
                        defaultValue={v?.price ?? 0}
                        className="w-full rounded-lg border p-1.5 text-right text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        id={`qty-${p.id}`}
                        type="number"
                        defaultValue={v?.quantity ?? 0}
                        className={`w-24 rounded-lg border p-1.5 text-center text-sm focus:ring-2 focus:ring-blue-500 ${stockBajo ? "font-bold text-red-600" : ""}`}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        id={`min-${p.id}`}
                        type="number"
                        defaultValue={v?.lowStock ?? 5}
                        className="w-20 rounded-lg border p-1.5 text-center text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        id={`prov-${p.id}`}
                        defaultValue={p.brand || ""}
                        className="w-full rounded-lg border p-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">—</option>
                        {suppliers.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => saveRow(p)}
                          className="rounded-lg bg-yellow-500 px-2 py-1.5 text-white transition hover:bg-yellow-600"
                          title="Guardar"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteRow(p.id)}
                          className="rounded-lg bg-red-500 px-2 py-1.5 text-white transition hover:bg-red-600"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center space-x-2">
          {page > 1 && (
            <Link href={buildUrl({ pagina: page - 1 })} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
              ← Anterior
            </Link>
          )}
          {inicio > 1 && (
            <>
              <Link href={buildUrl({ pagina: 1 })} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">1</Link>
              {inicio > 2 && <span className="px-3 py-2 text-gray-500">...</span>}
            </>
          )}
          {Array.from({ length: fin - inicio + 1 }, (_, k) => inicio + k).map((n) => (
            <Link
              key={n}
              href={buildUrl({ pagina: n })}
              className={`rounded-lg px-3 py-2 text-sm transition ${n === page ? "bg-blue-600 text-white shadow-md" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              {n}
            </Link>
          ))}
          {fin < totalPages && (
            <>
              {fin < totalPages - 1 && <span className="px-3 py-2 text-gray-500">...</span>}
              <Link href={buildUrl({ pagina: totalPages })} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">{totalPages}</Link>
            </>
          )}
          {page < totalPages && (
            <Link href={buildUrl({ pagina: page + 1 })} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
              Siguiente →
            </Link>
          )}
        </div>
      )}

      {/* Resumen filtros activos */}
      {(filters.nombre || filters.categoria || filters.proveedor || filters.stockBajo) && (
        <div className="mt-4 text-center text-xs text-gray-500">
          <Filter className="mr-1 inline" /> Filtros aplicados:
          {filters.nombre && <span className="mx-1 rounded bg-gray-200 px-2 py-1">Nombre: {filters.nombre}</span>}
          {filters.categoria && <span className="mx-1 rounded bg-gray-200 px-2 py-1">Categoría filtrada</span>}
          {filters.proveedor && <span className="mx-1 rounded bg-gray-200 px-2 py-1">Proveedor: {filters.proveedor}</span>}
          {filters.stockBajo && <span className="mx-1 rounded bg-red-100 px-2 py-1 text-red-600">⚠️ Solo stock bajo</span>}
        </div>
      )}

      {/* Modal Nuevo Producto */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center text-xl font-semibold">
                <Barcode className="mr-2 text-blue-600" /> Nuevo Producto
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form onSubmit={crear} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Código de Barras</label>
                <div className="flex gap-2">
                  <Input
                    value={form.codigo_barras}
                    onChange={(e) => setForm((f) => ({ ...f, codigo_barras: e.target.value }))}
                    placeholder="Escanea o escribe el código..."
                    className="flex-1 font-mono text-sm"
                  />
                  <button type="button" onClick={generarCodigo} className="rounded-lg bg-gray-500 px-4 py-2 text-sm text-white transition hover:bg-gray-600">
                    <Shuffle className="mr-1 inline" /> Generar
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Código único. Puedes escanearlo o generarlo automáticamente.</p>
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Nombre del producto *</label>
                <Input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} placeholder="Ej. Zapato deportivo Nike" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Categoría</label>
                <select value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar...</option>
                  {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Proveedor</label>
                <select value={form.proveedor} onChange={(e) => setForm((f) => ({ ...f, proveedor: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar...</option>
                  {suppliers.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Precio Unitario *</label>
                <Input type="number" step="0.01" value={form.precio} onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))} placeholder="Ej. 120000" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Stock Inicial</label>
                <Input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} placeholder="Ej. 50" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Stock Mínimo</label>
                <Input type="number" value={form.stock_minimo} onChange={(e) => setForm((f) => ({ ...f, stock_minimo: e.target.value }))} placeholder="Ej. 5" />
                <p className="mt-1 text-xs text-gray-500">Alerta cuando el stock baje de este número</p>
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
                <textarea rows={3} value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} placeholder="Detalles del producto..." className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="col-span-2 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600">
                  Cancelar
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                  <Save className="mr-1 inline" /> Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsView;
