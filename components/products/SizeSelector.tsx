"use client";

export function SizeSelector() {
  const sizes = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];

  return (
    <select className="border rounded-md p-2">
      <option value="">Seleccionar talla</option>
      {sizes.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  );
}

export default SizeSelector;