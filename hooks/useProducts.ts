"use client";

import { useState, useEffect } from "react";
import { Product, ProductFilters } from "@/types/product";

export function useProducts(filters: ProductFilters = { search: "", category: "", brand: "", status: "active", lowStock: false }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append("search", filters.search);
        if (filters.category) queryParams.append("category", filters.category);
        if (filters.brand) queryParams.append("brand", filters.brand);
        if (filters.status !== "active") queryParams.append("status", filters.status);
        if (filters.lowStock) queryParams.append("lowStock", "true");

        const response = await fetch(`/api/products?${queryParams}`);
        if (!response.ok) throw new Error("Error al cargar productos");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, isLoading, error };
}