"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2 } from "lucide-react";

interface StoreInput {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string | null;
  country: string;
  timezone: string;
  currency: string;
  phone: string | null;
  email: string | null;
}

interface StoreState {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
  currency: string;
  phone: string;
  email: string;
}

type StoreFormProps = {
  id?: string;
  store?: StoreInput;
};

export function StoreForm({ id, store }: StoreFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<StoreState>({
    name: store?.name || "",
    code: store?.code || "",
    address: store?.address || "",
    city: store?.city || "",
    state: store?.state || "",
    country: store?.country || "",
    timezone: store?.timezone || "UTC",
    currency: store?.currency || "EUR",
    phone: store?.phone || "",
    email: store?.email || "",
  });

  const set = (key: keyof StoreState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const res = await fetch(id ? `/api/stores/${id}` : "/api/stores", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/dashboard/stores");
      router.refresh();
    } else {
      const j = await res.json();
      setError(j.error || "Error al guardar");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nombre" required value={form.name} onChange={(e) => set("name", e.target.value)} />
        <Input label="Código" required value={form.code} onChange={(e) => set("code", e.target.value)} />
        <Input label="Dirección" required value={form.address} onChange={(e) => set("address", e.target.value)} />
        <Input label="Ciudad" required value={form.city} onChange={(e) => set("city", e.target.value)} />
        <Input label="Estado / Provincia" value={form.state} onChange={(e) => set("state", e.target.value)} />
        <Input label="País" required value={form.country} onChange={(e) => set("country", e.target.value)} />
        <Input label="Zona horaria" value={form.timezone} onChange={(e) => set("timezone", e.target.value)} />
        <Input label="Moneda" value={form.currency} onChange={(e) => set("currency", e.target.value)} />
        <Input label="Teléfono" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Guardar Tienda
      </Button>
    </form>
  );
}

export default StoreForm;