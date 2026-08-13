"use client";

export function StoreCard() {
  const stores = [
    { id: "1", name: "Tienda Centro", city: "Madrid", active: true },
    { id: "2", name: "Tienda Norte", city: "Barcelona", active: true },
    { id: "3", name: "Tienda Sur", city: "Valencia", active: false },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stores.map((store) => (
        <div key={store.id} className="border rounded-lg p-4">
          <h3 className="font-medium">{store.name}</h3>
          <p className="text-sm text-muted-foreground">{store.city}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Estado: {store.active ? "Activa" : "Inactiva"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default StoreCard;