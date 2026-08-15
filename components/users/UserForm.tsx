"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2 } from "lucide-react";

interface UserInput {
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
}

interface UserState {
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

type UserFormProps = {
  id?: string;
  user?: UserInput;
};

export function UserForm({ id, user }: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<UserState>({
    email: user?.email || "",
    name: user?.name || "",
    role: user?.role || "staff",
    isActive: user?.isActive ?? true,
  });
  const [password, setPassword] = useState("");

  const set = <K extends keyof UserState>(key: K, value: UserState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const body: UserState & { password?: string } = { ...form };
    if (password) body.password = password;
    const res = await fetch(id ? `/api/users/${id}` : "/api/users", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      router.push("/dashboard/users");
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
        <Input label="Email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
        <Input label="Nombre" value={form.name} onChange={(e) => set("name", e.target.value)} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Rol</label>
          <select
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm"
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <div>
          <label className="flex h-full items-center gap-2 text-sm font-medium text-gray-600">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Activo
          </label>
        </div>
      </div>
      <Input
        label={id ? "Nueva contraseña (opcional)" : "Contraseña"}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required={!id}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Guardar Usuario
      </Button>
    </form>
  );
}

export default UserForm;