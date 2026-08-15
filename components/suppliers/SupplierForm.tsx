"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2 } from "lucide-react";

interface SupplierInput {
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxId: string | null;
}

interface SupplierState {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
}

type SupplierFormProps = {
  id?: string;
  supplier?: SupplierInput;
};

export function SupplierForm({ id, supplier }: SupplierFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<SupplierState>({
    name: supplier?.name || "",
    contactName: supplier?.contactName || "",
    email: supplier?.email || "",
    phone: supplier?.phone || "",
    address: supplier?.address || "",
    taxId: supplier?.taxId || "",
  });

  const set = (key: keyof SupplierState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const res = await fetch(id ? `/api/suppliers/${id}` : "/api/suppliers", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/dashboard/suppliers");
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
        <Input label="Contacto" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <Input label="Teléfono" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <Input label="Dirección" value={form.address} onChange={(e) => set("address", e.target.value)} />
        <Input label="NIF / ID fiscal" value={form.taxId} onChange={(e) => set("taxId", e.target.value)} />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Guardar Proveedor
      </Button>
    </form>
  );
}

export default SupplierForm;