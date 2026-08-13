"use client";

import { Store } from "@/types/store";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";

interface StockByStoreProps {
  stores: Store[];
}

export function StockByStore() {
  const stores: Partial<Store>[] = [
    { id: "1", name: "Tienda Centro", city: "Madrid" },
    { id: "2", name: "Tienda Norte", city: "Barcelona" },
    { id: "3", name: "Tienda Sur", city: "Valencia" },
  ];

  return (
    <div className="space-y-4">
      {stores.map((store) => (
        <div key={store.id} className="border rounded-lg p-4">
          <h3 className="font-medium">{store.name}</h3>
          <p className="text-sm text-muted-foreground">{store.city}</p>
          <div className="mt-2">
            <p className="text-sm">Total en stock: 0</p>
            <p className="text-xs text-muted-foreground">
              Productos: 0 | Variante: 0
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StockByStore;