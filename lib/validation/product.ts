// lib/validation/product.ts
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock must be positive"),
  price: z.number().min(0, "Price must be positive"),
});

export type ProductFormData = z.infer<typeof productSchema>;