export interface InventoryMovement {
  id: string;
  productId: string;
  variantId: string | null;
  type: 'inbound' | 'outbound' | 'adjustment';
  quantity: number;
  reason: string;
  reference: string | null;
  storeId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  variantId: string | null;
  oldQuantity: number;
  newQuantity: number;
  reason: string;
  storeId: string;
  createdBy: string;
  createdAt: string;
}