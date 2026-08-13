"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "@/hooks/useDebounce";

export function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  return (
    <div className="w-full md:w-64">
      <Input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default ProductSearch;