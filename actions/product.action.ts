// app/actions/product.ts
"use server";

import { Product } from "@/types/product";
import { productSchema } from "@/lib/validation/product";
import { z } from "zod";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const apiConfig = {
  baseUrl: process.env.NEXT_APP_API_URL,
  defaultHeaders: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
};

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

  try {
    const response = await fetch(`${apiConfig.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...apiConfig.defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result: ApiResponse<T> = await response.json();

    if (!response.ok || !result.success) {
      throw new ApiError(
        response.status,
        result.message || `API request failed: ${response.statusText}`,
        result
      );
    }

    return result;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(408, "Request timeout");
    }

    throw error instanceof ApiError
      ? error
      : new ApiError(500, "Internal server error", error);
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await apiFetch<Product[]>("/products", {
      method: "GET",
      cache: "no-store",
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(`Failed to fetch products: ${error.message}`, {
        cause: error,
      });
    }
    throw new Error("Unexpected error while fetching products", {
      cause: error,
    });
  }
}

export async function getSingleProduct(id: string): Promise<Product> {
  try {
    if (!id) throw new ApiError(400, "Product ID is required");

    const response = await apiFetch<Product>(`/products/${id}`, {
      method: "GET",
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(`Failed to fetch product ${id}: ${error.message}`, {
        cause: error,
      });
    }
    throw new Error(`Unexpected error while fetching product ${id}`, {
      cause: error,
    });
  }
}

export async function createProduct(data: FormData): Promise<Product> {
  try {
    const validatedData = productSchema.parse({
      name: data.get("name"),
      description: data.get("description"),
      stock: Number(data.get("stock")),
      price: Number(data.get("price")),
    });

    const response = await apiFetch<Product>("/products", {
      method: "POST",
      body: JSON.stringify(validatedData),
    });
    return response.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, "Validation failed", error.errors);
    }
    if (error instanceof ApiError) {
      throw new Error(`Failed to create product: ${error.message}`, {
        cause: error,
      });
    }
    throw new Error("Unexpected error while creating product", {
      cause: error,
    });
  }
}

export async function updateProduct(id: string, data: FormData): Promise<Product> {
  try {
    if (!id) throw new ApiError(400, "Product ID is required");

    const validatedData = productSchema.parse({
      name: data.get("name"),
      description: data.get("description"),
      stock: Number(data.get("stock")),
      price: Number(data.get("price")),
    });

    const response = await apiFetch<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(validatedData),
    });
    return response.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, "Validation failed", error.errors);
    }
    if (error instanceof ApiError) {
      throw new Error(`Failed to update product ${id}: ${error.message}`, {
        cause: error,
      });
    }
    throw new Error(`Unexpected error while updating product ${id}`, {
      cause: error,
    });
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    if (!id) throw new ApiError(400, "Product ID is required");

    await apiFetch<null>(`/products/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(`Failed to delete product ${id}: ${error.message}`, {
        cause: error,
      });
    }
    throw new Error(`Unexpected error while deleting product ${id}`, {
      cause: error,
    });
  }
}

export interface ErrorResponse {
  status: number;
  message: string;
  details?: unknown;
}