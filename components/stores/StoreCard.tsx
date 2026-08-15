"use client";

import { Badge } from "@/components/ui/Badge";

interface Store {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  isActive: boolean;
}

export function StoreCard({ store }: { store: Store }) {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 h-full">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium">{store.name}</h3>
        <Badge variant={store.isActive ? "default" : "secondary"}>
          {store.isActive ? "Activa" : "Inactiva"}
        </Badge>
      </div>
      <p className="text-sm text-gray-500">
        {store.city}, {store.country}
      </p>
      <p className="text-xs text-gray-400 mt-1">Código: {store.code}</p>
    </div>
  );
}

export default StoreCard;