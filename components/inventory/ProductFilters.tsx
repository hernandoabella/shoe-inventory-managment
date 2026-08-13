"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";

export function ProductFilters() {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Categoría"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-32"
      />
      <Input
        type="text"
        placeholder="Marca"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="w-32"
      />
    </div>
  );
}

export default ProductFilters;