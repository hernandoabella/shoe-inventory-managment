"use client";

import { Transfer } from "@/types/transfer";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

interface TransferListProps {
  transfers: Transfer[];
}

export function TransferList({ transfers }: TransferListProps) {
  const getStatusVariant = (status: string) => {
    if (status === "delivered") return "default";
    if (status === "cancelled") return "destructive";
    return "secondary";
  };

  return (
    <div className="space-y-4">
      {transfers.map((transfer) => (
        <Card key={transfer.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{transfer.reference}</h3>
                <p className="text-sm text-gray-500">
                  Producto: {transfer.productId}
                </p>
                <p className="text-sm text-gray-500">
                  Cantidad: {transfer.quantity}
                </p>
              </div>
              <Badge variant={getStatusVariant(transfer.status)}>
                {transfer.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default TransferList;