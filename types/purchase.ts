export interface Purchase {
  id: string;
  supplierId: string;
  purchaseRef: string;
  storeId: string;
  status: 'draft' | 'ordered' | 'received' | 'cancelled';
  items: PurchaseItem[];
  total: number;
  notes: string | null;
  createdBy: string;
  supplierNote: string | null;
  createdAt: string;
  updatedAt: string;
  orderedAt: string | null;
  receivedAt: string | null;
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  total: number;
  notes: string | null;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}