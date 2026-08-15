"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserRoleSelectProps {
  user: { id: string; role: string };
}

export function UserRoleSelect({ user }: UserRoleSelectProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const changeRole = async (role: string) => {
    setBusy(true);
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) router.refresh();
    else alert("No se pudo actualizar el rol");
    setBusy(false);
  };

  return (
    <select
      value={user.role}
      disabled={busy}
      onChange={(e) => changeRole(e.target.value)}
      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm"
    >
      <option value="admin">Admin</option>
      <option value="manager">Manager</option>
      <option value="staff">Staff</option>
    </select>
  );
}

export default UserRoleSelect;