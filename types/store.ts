export interface Store {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
  currency: string;
  phone: string | null;
  email: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreInventory {
  storeId: string;
  productId: string;
  quantity: number;
  reserved: number;
  available: number;
  lastUpdated: string;
}