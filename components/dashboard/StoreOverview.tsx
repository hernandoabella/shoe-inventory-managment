"use client";

import { Store } from "@/types/store";

interface StoreWithQuantity extends Omit<Store, "address" | "phone" | "email" | "logoUrl"> {
  quantity: number;
}

export function StoreOverview() {
  const stores: StoreWithQuantity[] = [
    { id: "1", name: "Tienda Centro", code: "TC", city: "Bogotá", state: "Cundinamarca", country: "Colombia", timezone: "America/Bogota", currency: "COP", isActive: true, createdAt: "", updatedAt: "", quantity: 450 },
    { id: "2", name: "Tienda Norte", code: "TN", city: "Medellín", state: "Antioquia", country: "Colombia", timezone: "America/Bogota", currency: "COP", isActive: true, createdAt: "", updatedAt: "", quantity: 380 },
    { id: "3", name: "Tienda Sur", code: "TS", city: "Cali", state: "Valle del Cauca", country: "Colombia", timezone: "America/Bogota", currency: "COP", isActive: true, createdAt: "", updatedAt: "", quantity: 320 },
  ];

  return (
    <div className="space-y-4">
      {stores.map((store) => (
        <div key={store.id} className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{store.name}</h3>
            <p className="text-sm text-gray-500">{store.city}</p>
          </div>
          <p className="text-sm font-medium">{store.quantity}</p>
        </div>
      ))}
    </div>
  );
}

export default StoreOverview;