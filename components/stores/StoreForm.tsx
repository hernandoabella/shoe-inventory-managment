"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function StoreForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Lógica de envío
    setIsSubmitting(false);
  };

  return (
    <form className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre</label>
          <input
            type="text"
            className="w-full border rounded-md p-2"
            placeholder="Nombre de la tienda"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Código</label>
          <input
            type="text"
            className="w-full border rounded-md p-2"
            placeholder="Código"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Dirección</label>
        <input
          type="text"
          className="w-full border rounded-md p-2"
          placeholder="Dirección completa"
        />
      </div>
      <Button onClick={handleSubmit} disabled={isSubmitting}>
        Guardar Tienda
      </Button>
    </form>
  );
}

export default StoreForm;