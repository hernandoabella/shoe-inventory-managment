"use client";

export function ReceivingForm() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Proveedor</label>
          <select className="w-full border rounded-md p-2">
            <option value="">Seleccionar proveedor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Almacén</label>
          <select className="w-full border rounded-md p-2">
            <option value="">Seleccionar almacén</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ReceivingForm;