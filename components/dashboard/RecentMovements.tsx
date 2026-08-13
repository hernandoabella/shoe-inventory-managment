"use client";

export function RecentMovements() {
  const movements = [
    { id: 1, type: "Entrada", product: "Zapatilla Deportiva", qty: 50, date: "2024-01-15" },
    { id: 2, type: "Salida", product: "Zapatilla Casual", qty: -25, date: "2024-01-15" },
    { id: 3, type: "Ajuste", product: "Zapatilla Formal", qty: 10, date: "2024-01-14" },
    { id: 4, type: "Transferencia", product: "Zapatilla Running", qty: -30, date: "2024-01-14" },
  ];

  return (
    <div className="space-y-2">
      {movements.map((movement) => (
        <div key={movement.id} className="text-sm">
          <span className="font-medium">{movement.type}:</span>{" "}
          <span className="text-muted-foreground">{movement.product}</span>
          <span className="float-right">{movement.qty > 0 ? "+" : ""}{movement.qty}</span>
        </div>
      ))}
    </div>
  );
}

export default RecentMovements;