"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

export function PurchaseForm() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [supplierId, setSupplier] = useState("");
  const [storeId, setStore] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/suppliers").then(r=>r.json()).then(setSuppliers);
    fetch("/api/stores").then(r=>r.json()).then(setStores);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg("");
    const res = await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId, storeId, reference: "PUR-" + Date.now().toString().slice(-6) }),
    });
    if (res.ok) { router.push("/dashboard/purchases"); router.refresh(); }
    else { const j = await res.json(); setMsg(j.error || "Error"); setLoading(false); }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader><CardTitle>Nueva Compra</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {msg && <p className="text-sm text-red-600">{msg}</p>}
          <select className="w-full border rounded-md p-2" value={supplierId} onChange={e=>setSupplier(e.target.value)}>
            <option value="">Proveedor</option>
            {suppliers.map((s:any)=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select className="w-full border rounded-md p-2" value={storeId} onChange={e=>setStore(e.target.value)}>
            <option value="">Tienda destino</option>
            {stores.map((s:any)=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <Button type="submit" disabled={loading}><Loader2 className={loading?"mr-2 h-4 w-4 animate-spin":""}/>Crear</Button>
        </form>
      </CardContent>
    </Card>
  );
}
export default PurchaseForm;
