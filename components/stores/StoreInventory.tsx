"use client";

export function StoreInventory() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Inventario por Producto</h3>
          <p className="text-sm text-muted-foreground">
            Lista de productos con su stock actual.
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Movimientos Recientes</h3>
          <p className="text-sm text-muted-foreground">
            Últimas transferencias y ajustes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StoreInventory;