export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  brand: string;
  category: string;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  images: string[];
  size: string;
  color: string;
  price: number;
  cost: number;
  quantity: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search: string;
  category: string;
  brand: string;
  status: 'active' | 'inactive' | 'discontinued';
  lowStock: boolean;
}