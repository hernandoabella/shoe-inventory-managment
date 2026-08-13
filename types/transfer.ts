export interface Transfer {
  id: string;
  fromStoreId: string;
  toStoreId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  reference: string;
  notes: string | null;
  createdBy: string;
  deliveredBy: string | null;
  createdAt: string;
  updatedAt: string;
  deliveredAt: string | null;
}

export interface Receiving {
  id: string;
  supplierId: string;
  supplierRef: string;
  storeId: string;
  status: 'draft' | 'received' | 'cancelled';
  items: ReceivingItem[];
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  receivedAt: string | null;
}

export interface ReceivingItem {
  id: string;
  receivingId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  cost: number;
  notes: string | null;
  receivedQuantity: number | null;
}