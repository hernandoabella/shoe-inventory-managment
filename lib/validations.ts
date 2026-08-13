import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  sku: z.string().min(1, "El SKU es obligatorio"),
  brand: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});

export const productVariantSchema = z.object({
  sku: z.string().min(1, "El SKU es obligatorio"),
  name: z.string().min(1, "El nombre es obligatorio"),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.number().min(0, "El precio debe ser positivo"),
  cost: z.number().min(0, "El costo debe ser positivo"),
  quantity: z.number().min(0, "El stock debe ser positivo"),
  lowStockThreshold: z.number().min(0, "El umbral de stock bajo debe ser positivo"),
});

export const storeSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  code: z.string().min(1, "El código es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  state: z.string().optional(),
  country: z.string().min(1, "El país es obligatorio"),
  timezone: z.string().min(1, "La zona horaria es obligatoria"),
  currency: z.string().min(3, "La moneda es obligatoria"),
});

export const transferSchema = z.object({
  toStoreId: z.string().min(1, "El almacén destino es obligatorio"),
  productId: z.string().min(1, "El producto es obligatorio"),
  quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
  notes: z.string().optional(),
});