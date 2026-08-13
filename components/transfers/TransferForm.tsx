"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

export function TransferForm() {
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [fromStoreId, setFrom] = useState("");
  const [toStoreId, setTo] = useState("");
  const [productId, setProduct] = useState("");
  const [qty, setQty] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/stores").then(r=>r.json()).then(setStores);
    fetch("/api/products").then(r=>r.json()).then(setProducts);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg("");
    const res = await fetch("/api/transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromStoreId, toStoreId, productId, quantity: parseInt(qty), reference: "TRF-" + Date.now().toString().slice(-6) }),
    });
    if (res.ok) { router.push("/dashboard/transfers"); router.refresh(); }
    else { const j = await res.json(); setMsg(j.error || "Error"); setLoading(false); }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader><CardTitle>Nueva Transferencia</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {msg && <p className="text-sm text-red-600">{msg}</p>}
          <select className="w-full border rounded-md p-2" value={fromStoreId} onChange={e=>setFrom(e.target.value)}>
            <option value="">Almacén origen</option>
            {stores.map((s:any)=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select className="w-full border rounded-md p-2" value={toStoreId} onChange={e=>setTo(e.target.value)}>
            <option value="">Almacén destino</option>
            {stores.map((s:any)=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select className="w-full border rounded-md p-2" value={productId} onChange={e=>setProduct(e.target.value)}>
            <option value="">Producto</option>
            {products.map((p:any)=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <Input type="number" placeholder="Cantidad" value={qty} onChange={e=>setQty(e.target.value)} />
          <Button type="submit" disabled={loading}><Loader2 className={loading?"mr-2 h-4 w-4 animate-spin":""}/>Crear</Button>
        </form>
      </CardContent>
    </Card>
  );
}
export default TransferForm;
