"use client";

export function ColorSelector() {
  const colors = [
    { name: "Negro", value: "#000000" },
    { name: "Blanco", value: "#FFFFFF" },
    { name: "Azul", value: "#3B82F6" },
    { name: "Rojo", value: "#EF4444" },
    { name: "Verde", value: "#22C55E" },
    { name: "Amarillo", value: "#FACC15" },
    { name: "Marrón", value: "#8B4513" },
    { name: "Gris", value: "#6B7280" },
  ];

  return (
    <select className="border rounded-md p-2">
      <option value="">Seleccionar color</option>
      {colors.map((color) => (
        <option key={color.value} value={color.value}>
          {color.name}
        </option>
      ))}
    </select>
  );
}

export default ColorSelector;