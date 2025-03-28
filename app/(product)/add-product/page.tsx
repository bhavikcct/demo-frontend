import { ProductForm } from "../_components/product-form";

export default function AddProductPage() {

  return (
    <div className="container mx-auto py-10">
    <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
    <ProductForm /> 
  </div>
  );
}