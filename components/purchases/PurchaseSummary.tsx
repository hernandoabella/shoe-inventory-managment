"use client";

export function PurchaseSummary() {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Resumen de Compra</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Subtotal</p>
          <p className="text-xl font-bold">$0.00</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Impuestos</p>
          <p className="text-xl font-bold">$0.00</p>
        </div>
        <div className="border-t pt-2">
          <p className="text-lg font-semibold">Total</p>
          <p className="text-2xl font-bold text-primary">$0.00</p>
        </div>
      </div>
    </div>
  );
}

export default PurchaseSummary;