"use client";

export function BrandSelector() {
  const brands = [
    "Nike",
    "Adidas",
    "Puma",
    "Converse",
    "Vans",
    "New Balance",
    "Reebok",
    "Under Armour",
    "Asics",
    "Skechers",
  ];

  return (
    <select className="border rounded-md p-2 w-full">
      <option value="">Seleccionar marca</option>
      {brands.map((brand) => (
        <option key={brand} value={brand}>
          {brand}
        </option>
      ))}
    </select>
  );
}

export default BrandSelector;