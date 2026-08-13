"use client";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { InventoryMovement } from "@/types/inventory";
import { Badge } from "@/components/ui/Badge";

interface StockTableProps {
  movements: InventoryMovement[];
}

export function StockTable({ movements }: StockTableProps) {
  const getVariant = (type: string) => {
    if (type === "inbound") return "default";
    if (type === "outbound") return "destructive";
    return "secondary";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <tr>
            <TableHead>ID</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Razón</TableHead>
            <TableHead>Fecha</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell className="font-mono">
                {movement.id.slice(0, 8)}
              </TableCell>
              <TableCell>
                <Badge variant={getVariant(movement.type)}>
                  {movement.type}
                </Badge>
              </TableCell>
              <TableCell>{movement.quantity}</TableCell>
              <TableCell>{movement.reason}</TableCell>
              <TableCell>{new Date(movement.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default StockTable;