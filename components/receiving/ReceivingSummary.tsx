"use client";

export function ReceivingSummary() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Resumen de Recepción</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Items</p>
          <p className="text-xl font-bold">0</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Recibido</p>
          <p className="text-xl font-bold">0</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pendiente</p>
          <p className="text-xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}

export default ReceivingSummary;