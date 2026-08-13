"use client";

import { Transfer } from "@/types/transfer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface TransferDetailsProps {
  transfer: Transfer;
}

const getStatusVariant = (status: string) => {
  if (status === "delivered") return "default";
  if (status === "cancelled") return "destructive";
  return "secondary";
};

export function TransferDetails({ transfer }: TransferDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transferencia {transfer.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <Badge variant={getStatusVariant(transfer.status)}>
              {transfer.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Referencia</p>
            <p>{transfer.reference}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Almacén Destino</p>
            <p>{transfer.toStoreId}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TransferDetails;