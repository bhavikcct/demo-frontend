import { getSingleProduct } from "@/actions/product.action";
import { ProductForm } from "../../_components/product-form";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
    const product = await getSingleProduct(params.id);

  return (
    <div className="container mx-auto py-10">
    <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
    <ProductForm product={product} /> 
  </div>
  );
}
