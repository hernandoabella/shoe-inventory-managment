"use client";

import { Badge } from "@/components/ui/Badge";

interface TransferStatusProps {
  status: "pending" | "in_transit" | "delivered" | "cancelled";
}

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  in_transit: "En Tránsito",
  delivered: "Entregada",
  cancelled: "Cancelada",
};

const getStatusVariant = (status: string) => {
  if (status === "delivered") return "default";
  if (status === "cancelled") return "destructive";
  return "secondary";
};

export function TransferStatus({ status }: TransferStatusProps) {
  return (
    <Badge variant={getStatusVariant(status)}>
      {statusLabels[status] || status}
    </Badge>
  );
}

export default TransferStatus;