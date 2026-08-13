"use client";

export function MovementReport() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Reporte de Movimientos</h3>
      <div className="grid gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Movimientos de entrada</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Movimientos de salida</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}

export default MovementReport;