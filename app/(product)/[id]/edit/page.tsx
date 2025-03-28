import { ProductForm } from "../../_components/product-form";
import { getSingleProduct } from "@/actions/product.action";

interface EditProductPageProps {
  params: Promise<{id:string}>; 
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const product = await getSingleProduct(id);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}